import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying to Celo Sepolia...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  
  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "CELO");
  
  if (balance === 0n) {
    throw new Error("❌ Insufficient CELO balance. Please fund your account first.");
  }

  // First deploy a mock ERC20 token for airdrops
  console.log("\n📄 Deploying Mock ERC20 Token...");
  const MockERC20Factory = await ethers.getContractFactory("MockERC20");
  const mockToken = await MockERC20Factory.deploy(
    "Support Token",
    "SPT",
    18 // 18 decimals
  );
  await mockToken.waitForDeployment();
  const tokenAddress = await mockToken.getAddress();
  console.log("✅ Mock Token deployed to:", tokenAddress);
  
  // Mint initial supply
  const initialSupply = ethers.parseUnits("1000000", 18); // 1M tokens
  await mockToken.mint(deployer.address, initialSupply);
  console.log("✅ Minted", ethers.formatUnits(initialSupply, 18), "tokens to deployer");

  // Deploy the main contract with simplified parameters
  console.log("\n🏗️  Deploying AnonymousSupportPlatformTest...");
  
  const AnonymousSupportPlatformFactory = await ethers.getContractFactory("AnonymousSupportPlatformTest");
  
  // Use a mock hub address that won't cause validation issues
  const mockHubAddress = deployer.address; // Use deployer as mock hub
  const scopeValue = "anonymous_support_celo_sepolia";
  const verificationConfigId = "0x1234567890123456789012345678901234567890123456789012345678901234";
  const validityPeriod = 30 * 24 * 60 * 60; // 30 days
  const defaultAirdropAmount = ethers.parseUnits("10", 18); // 10 tokens
  
  try {
    const contract = await AnonymousSupportPlatformFactory.deploy(
      mockHubAddress,
      scopeValue,
      verificationConfigId,
      validityPeriod,
      tokenAddress,
      defaultAirdropAmount,
      deployer.address,
      {
        gasLimit: 5000000
      }
    );
    
    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();
    
    console.log("\n🎉 DEPLOYMENT SUCCESSFUL!");
    console.log("===============================");
    console.log("📍 Contract Address:", contractAddress);
    console.log("🪙 Token Address:", tokenAddress);
    console.log("👤 Owner:", deployer.address);
    console.log("🌐 Network: Celo Sepolia");
    console.log("🔗 Chain ID: 11142220");
    console.log("===============================");
    
    // Transfer some tokens to the contract for airdrops
    console.log("\n💸 Transferring tokens to contract...");
    const transferAmount = ethers.parseUnits("10000", 18); // 10k tokens
    await mockToken.transfer(contractAddress, transferAmount);
    console.log("✅ Transferred", ethers.formatUnits(transferAmount, 18), "tokens to contract");
    
    return {
      contractAddress,
      tokenAddress,
      deployer: deployer.address
    };
    
  } catch (error: any) {
    console.error("❌ Deployment failed:", error.message);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });