import { ethers } from "hardhat";
import { Contract, ContractFactory } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import * as fs from "fs";
import * as path from "path";

interface DeploymentConfig {
  // Self Protocol configuration
  hubAddress: string;
  scopeValue: string;
  verificationConfigId: string;
  validityPeriod: number; // in seconds
  
  // Token configuration
  airdropTokenAddress: string;
  defaultAirdropAmount: bigint; // Changed from string to bigint
  
  // Owner configuration
  ownerAddress: string;
  
  // Network-specific settings
  gasPrice?: string;
  gasLimit?: number;
}

interface NetworkConfigs {
  [networkName: string]: DeploymentConfig;
}

// Network-specific configurations
const NETWORK_CONFIGS: NetworkConfigs = {
  mainnet: {
    hubAddress: "0x0000000000000000000000000000000000000000", // Replace with actual Self Protocol Hub address
    scopeValue: "anonymous_support_platform_mainnet",
    verificationConfigId: "0x0000000000000000000000000000000000000000000000000000000000000000", // Replace with actual config ID
    validityPeriod: 365 * 24 * 60 * 60, // 1 year
    airdropTokenAddress: "0xA0b86991c31cC4a5E4B573890d4A0e5277dEdb5b7", // USDC mainnet
    defaultAirdropAmount: ethers.parseUnits("10", 6), // 10 USDC (6 decimals)
    ownerAddress: "0x0000000000000000000000000000000000000000", // Replace with actual owner
    gasPrice: "30000000000", // 30 gwei
    gasLimit: 5000000
  },
  sepolia: {
    hubAddress: "0x0000000000000000000000000000000000000000", // Replace with testnet hub
    scopeValue: "anonymous_support_platform_sepolia",
    verificationConfigId: "0x0000000000000000000000000000000000000000000000000000000000000000",
    validityPeriod: 30 * 24 * 60 * 60, // 30 days for testing
    airdropTokenAddress: "0x0000000000000000000000000000000000000000", // Deploy mock token or use testnet USDC
    defaultAirdropAmount: ethers.parseUnits("100", 18), // 100 tokens (assuming 18 decimals)
    ownerAddress: "0x0000000000000000000000000000000000000000", // Replace with testnet owner
    gasPrice: "10000000000", // 10 gwei
    gasLimit: 5000000
  },
  localhost: {
    hubAddress: "0x0000000000000000000000000000000000000000", // Mock address for local testing
    scopeValue: "anonymous_support_platform_local",
    verificationConfigId: "0x1234567890123456789012345678901234567890123456789012345678901234",
    validityPeriod: 7 * 24 * 60 * 60, // 7 days for local testing
    airdropTokenAddress: "0x0000000000000000000000000000000000000000", // Will deploy mock token
    defaultAirdropAmount: ethers.parseUnits("50", 18),
    ownerAddress: "0x0000000000000000000000000000000000000000", // Will use first signer
    gasLimit: 8000000
  },
  celo_sepolia: {
    hubAddress: "0x1234567890123456789012345678901234567890", // Placeholder hub address
    scopeValue: "anonymous_support_platform_celo_sepolia",
    verificationConfigId: "0x1234567890123456789012345678901234567890123456789012345678901234",
    validityPeriod: 30 * 24 * 60 * 60, // 30 days for testing
    airdropTokenAddress: "0x0000000000000000000000000000000000000000", // Will deploy mock token
    defaultAirdropAmount: ethers.parseUnits("100", 18), // 100 tokens (assuming 18 decimals)
    ownerAddress: "0x0000000000000000000000000000000000000000", // Will use deployer address
    gasPrice: "1000000000", // 1 gwei (Celo has low gas prices)
    gasLimit: 5000000
  }
};

interface DeploymentResult {
  contractAddress: string;
  transactionHash: string;
  blockNumber: number;
  gasUsed: string;
  deploymentArgs: any[];
}

class DeploymentManager {
  private hre: HardhatRuntimeEnvironment;
  private config: DeploymentConfig;
  private networkName: string;

  constructor(hre: HardhatRuntimeEnvironment) {
    this.hre = hre;
    this.networkName = hre.network.name;
    this.config = NETWORK_CONFIGS[this.networkName];
    
    if (!this.config) {
      throw new Error(`No configuration found for network: ${this.networkName}`);
    }
  }

  async deployMockERC20Token(): Promise<string> {
    console.log("📄 Deploying Mock ERC20 Token for testing...");
    
    const MockERC20Factory = await ethers.getContractFactory("MockERC20");
    const mockToken = await MockERC20Factory.deploy(
      "Mock Support Token",
      "MST",
      18,
      ethers.parseUnits("1000000", 18) // 1M tokens
    );
    
    await mockToken.waitForDeployment();
    const tokenAddress = await mockToken.getAddress();
    
    console.log(`✅ Mock ERC20 deployed at: ${tokenAddress}`);
    return tokenAddress;
  }

  async validateConfiguration(): Promise<void> {
    console.log("🔍 Validating deployment configuration...");
    
    // Validate addresses
    if (!ethers.isAddress(this.config.hubAddress)) {
      throw new Error("Invalid hub address");
    }
    
    if (!ethers.isAddress(this.config.airdropTokenAddress) && this.networkName !== "localhost") {
      throw new Error("Invalid airdrop token address");
    }
    
    // Set owner to first signer if not specified
    if (!ethers.isAddress(this.config.ownerAddress)) {
      const [deployer] = await ethers.getSigners();
      this.config.ownerAddress = deployer.address;
      console.log(`📝 Using deployer as owner: ${this.config.ownerAddress}`);
    }
    
    // Deploy mock token for localhost
    if (this.networkName === "localhost" && !ethers.isAddress(this.config.airdropTokenAddress)) {
      this.config.airdropTokenAddress = await this.deployMockERC20Token();
    }
    
    console.log("✅ Configuration validated");
  }

  async estimateGas(contractFactory: ContractFactory, args: any[]): Promise<bigint> {
    const deployTx = await contractFactory.getDeployTransaction(...(args as [any, ...any[]]));
    const gasEstimate = await this.hre.ethers.provider.estimateGas(deployTx);
    
    // Add 20% buffer
    return gasEstimate * BigInt(120) / BigInt(100);
  }

  async deployContract(): Promise<DeploymentResult> {
    console.log("🚀 Starting Anonymous Support Platform deployment...");
    console.log(`📡 Network: ${this.networkName}`);
    console.log(`📋 Configuration:`, {
      hubAddress: this.config.hubAddress,
      scopeValue: this.config.scopeValue,
      validityPeriod: `${this.config.validityPeriod} seconds`,
      airdropToken: this.config.airdropTokenAddress,
      defaultAirdropAmount: this.config.defaultAirdropAmount.toString(),
      owner: this.config.ownerAddress
    });

    // Get contract factory
    const AnonymousSupportPlatformFactory = await ethers.getContractFactory("AnonymousSupportPlatform");
    
    // Prepare deployment arguments
    const deploymentArgs: [string, string, string, number, string, bigint, string] = [
      this.config.hubAddress,
      this.config.scopeValue,
      this.config.verificationConfigId,
      this.config.validityPeriod,
      this.config.airdropTokenAddress,
      this.config.defaultAirdropAmount,
      this.config.ownerAddress
    ];

    // Estimate gas
    const estimatedGas = await this.estimateGas(AnonymousSupportPlatformFactory, deploymentArgs);
    console.log(`⛽ Estimated gas: ${estimatedGas.toString()}`);

    // Prepare deployment options
    const deployOptions: any = {
      gasLimit: this.config.gasLimit || estimatedGas
    };

    if (this.config.gasPrice) {
      deployOptions.gasPrice = this.config.gasPrice;
    }

    // Deploy contract
    console.log("⏳ Deploying contract...");
    const contract = await AnonymousSupportPlatformFactory.deploy(
      ...deploymentArgs,
      deployOptions
    );

    console.log(`📝 Transaction hash: ${contract.deploymentTransaction()?.hash}`);
    
    // Wait for deployment confirmation
    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();
    
    // Get deployment receipt
    const receipt = await contract.deploymentTransaction()?.wait();
    
    console.log("✅ Contract deployed successfully!");
    
    return {
      contractAddress,
      transactionHash: contract.deploymentTransaction()?.hash || "",
      blockNumber: receipt?.blockNumber || 0,
      gasUsed: receipt?.gasUsed.toString() || "0",
      deploymentArgs
    };
  }

  async verifyContract(deploymentResult: DeploymentResult): Promise<void> {
    if (this.networkName === "localhost") {
      console.log("⚠️  Skipping verification on localhost");
      return;
    }

    console.log("🔍 Verifying contract on block explorer...");
    
    try {
      await this.hre.run("verify:verify", {
        address: deploymentResult.contractAddress,
        constructorArguments: deploymentResult.deploymentArgs,
      });
      console.log("✅ Contract verified successfully!");
    } catch (error) {
      console.error("❌ Contract verification failed:", error);
    }
  }

  async configureContract(contractAddress: string): Promise<void> {
    console.log("⚙️  Configuring contract post-deployment...");
    
    const contract = await ethers.getContractAt("AnonymousSupportPlatform", contractAddress);
    
    // Set custom monthly airdrop amounts (example)
    const customAmounts = {
      1: ethers.parseUnits("15", 18), // January - higher amount
      7: ethers.parseUnits("20", 18), // July - summer bonus
      12: ethers.parseUnits("25", 18), // December - holiday bonus
    };

    for (const [month, amount] of Object.entries(customAmounts)) {
      const tx = await contract.setMonthlyAirdropAmount(month, amount);
      await tx.wait();
      console.log(`📅 Set airdrop amount for month ${month}: ${ethers.formatEther(amount)} tokens`);
    }

    console.log("✅ Contract configuration completed");
  }

  async saveDeploymentInfo(deploymentResult: DeploymentResult): Promise<void> {
    const deploymentInfo = {
      network: this.networkName,
      contractAddress: deploymentResult.contractAddress,
      transactionHash: deploymentResult.transactionHash,
      blockNumber: deploymentResult.blockNumber,
      gasUsed: deploymentResult.gasUsed,
      deploymentArgs: deploymentResult.deploymentArgs.map(arg => 
        typeof arg === 'bigint' ? arg.toString() : arg
      ), // Convert bigint to string for JSON serialization
      config: {
        ...this.config,
        defaultAirdropAmount: this.config.defaultAirdropAmount.toString() // Convert bigint to string
      },
      timestamp: new Date().toISOString(),
      chainId: await this.hre.ethers.provider.getNetwork().then(n => n.chainId.toString())
    };

    const deploymentsDir = path.join(__dirname, "../deployments");
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    const filename = path.join(deploymentsDir, `${this.networkName}_deployment.json`);
    fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
    
    console.log(`📄 Deployment info saved to: ${filename}`);
  }

  async transferAirdropTokens(contractAddress: string): Promise<void> {
    if (this.networkName === "localhost") {
      console.log("💰 Funding contract with mock tokens for testing...");
      
      const mockToken = await ethers.getContractAt("MockERC20", this.config.airdropTokenAddress);
      const fundingAmount = ethers.parseUnits("10000", 18); // 10k tokens
      
      const tx = await mockToken.transfer(contractAddress, fundingAmount);
      await tx.wait();
      
      console.log(`✅ Transferred ${ethers.formatEther(fundingAmount)} tokens to contract`);
    } else {
      console.log("⚠️  Remember to manually transfer airdrop tokens to the contract:");
      console.log(`📍 Contract address: ${contractAddress}`);
      console.log(`🪙 Token address: ${this.config.airdropTokenAddress}`);
    }
  }
}

async function main() {
  const hre = require("hardhat");
  const deploymentManager = new DeploymentManager(hre);

  try {
    // Step 1: Validate configuration
    await deploymentManager.validateConfiguration();

    // Step 2: Deploy contract
    const deploymentResult = await deploymentManager.deployContract();
    
    console.log("\n🎉 DEPLOYMENT SUCCESSFUL!");
    console.log("===============================");
    console.log(`📍 Contract Address: ${deploymentResult.contractAddress}`);
    console.log(`🔗 Transaction Hash: ${deploymentResult.transactionHash}`);
    console.log(`📦 Block Number: ${deploymentResult.blockNumber}`);
    console.log(`⛽ Gas Used: ${deploymentResult.gasUsed}`);
    console.log("===============================\n");

    // Step 3: Configure contract
    await deploymentManager.configureContract(deploymentResult.contractAddress);

    // Step 4: Transfer initial airdrop tokens
    await deploymentManager.transferAirdropTokens(deploymentResult.contractAddress);

    // Step 5: Save deployment info
    await deploymentManager.saveDeploymentInfo(deploymentResult);

    // Step 6: Verify contract (skip on localhost)
    await deploymentManager.verifyContract(deploymentResult);

    console.log("\n🏁 DEPLOYMENT PROCESS COMPLETED!");
    console.log("\nNext steps:");
    console.log("1. 📋 Update your frontend configuration with the contract address");
    console.log("2. 🔧 Configure Self Protocol verification settings");
    console.log("3. 💰 Fund the contract with airdrop tokens (if not done automatically)");
    console.log("4. 👥 Set up initial counselors and moderators");
    console.log("5. 🧪 Test the platform functionality");

  } catch (error) {
    console.error("\n❌ DEPLOYMENT FAILED!");
    console.error("Error:", error);
    process.exit(1);
  }
}

// Execute deployment if called directly
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default main;
export { DeploymentManager, NETWORK_CONFIGS };