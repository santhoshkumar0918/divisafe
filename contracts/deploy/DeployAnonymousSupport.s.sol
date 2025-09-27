// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { AnonymousSupportPlatform } from "../AnonymousSupportPlatform.sol";
import { MockERC20 } from "../mocks/MockERC20.sol";
import { SelfUtils } from "@selfxyz/contracts-v2/contracts/libraries/SelfUtils.sol";
import { IIdentityVerificationHubV2 } from "@selfxyz/contracts-v2/contracts/interfaces/IIdentityVerificationHubV2.sol";

/**
 * @title DeployAnonymousSupport
 * @notice Deployment script for Anonymous Support Platform with Self Protocol integration
 */
contract DeployAnonymousSupport is Script {
    // Celo Testnet Hub Address (from Self docs)
    address constant CELO_TESTNET_HUB = 0x16ECBA51e18a4a7e61fdC417f0d47AFEeDfbed74;
    
    // Celo Mainnet Hub Address (from Self docs)  
    address constant CELO_MAINNET_HUB = 0xe57F4773bd9c9d8b6Cd70431117d353298B9f5BF;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying with account:", deployer);
        console.log("Account balance:", deployer.balance);

        vm.startBroadcast(deployerPrivateKey);

        // Deploy mock airdrop token for testing
        MockERC20 airdropToken = new MockERC20("Support Token", "SUPP", 18);
        console.log("Airdrop Token deployed at:", address(airdropToken));

        // Configuration parameters
        address hubAddress = _getHubAddress();
        uint256 scopeValue = _calculateScopeValue("anonymous-support-v1");
        uint256 validityPeriod = 365 days; // 1 year validity
        uint256 defaultAirdropAmount = 100 * 10**18; // 100 tokens
        
        // Create verification config
        bytes32 verificationConfigId = _createVerificationConfig(hubAddress);
        
        // Deploy main contract
        AnonymousSupportPlatform platform = new AnonymousSupportPlatform(
            hubAddress,
            scopeValue,
            deployer, // owner
            validityPeriod,
            verificationConfigId,
            address(airdropToken),
            defaultAirdropAmount
        );
        
        console.log("Anonymous Support Platform deployed at:", address(platform));
        console.log("Verification Config ID:", vm.toString(verificationConfigId));
        console.log("Scope Value:", scopeValue);

        // Mint initial airdrop tokens to the platform
        uint256 initialSupply = 1000000 * 10**18; // 1M tokens
        airdropToken.mint(address(platform), initialSupply);
        console.log("Minted", initialSupply / 10**18, "tokens to platform");

        // Set up additional monthly airdrop amounts (special months get more)
        platform.setMonthlyAirdropAmount(1, 150 * 10**18);  // January - New Year bonus
        platform.setMonthlyAirdropAmount(7, 200 * 10**18);  // July - Summer bonus  
        platform.setMonthlyAirdropAmount(12, 250 * 10**18); // December - Holiday bonus

        vm.stopBroadcast();

        // Log deployment info
        _logDeploymentInfo(address(platform), address(airdropToken), verificationConfigId);
    }

    function _getHubAddress() internal view returns (address) {
        uint256 chainId = block.chainid;
        
        if (chainId == 44787) { // Celo Testnet (Alfajores)
            return CELO_TESTNET_HUB;
        } else if (chainId == 42220) { // Celo Mainnet
            return CELO_MAINNET_HUB;
        } else {
            revert("Unsupported chain - use Celo Testnet or Mainnet");
        }
    }

    function _calculateScopeValue(string memory scopeSeed) internal view returns (uint256) {
        // Simplified scope calculation - in production use Self's scope calculator
        return uint256(keccak256(abi.encodePacked(scopeSeed, block.chainid)));
    }

    function _createVerificationConfig(address hubAddress) internal returns (bytes32) {
        // Create verification config for 18+ users with basic human verification
        string[] memory forbiddenCountries = new string[](0); // Allow all countries
        
        SelfUtils.UnformattedVerificationConfigV2 memory config = SelfUtils.UnformattedVerificationConfigV2({
            olderThan: 18,
            forbiddenCountries: forbiddenCountries,
            ofacEnabled: false
        });

        // Format and register the config
        IIdentityVerificationHubV2 hub = IIdentityVerificationHubV2(hubAddress);
        SelfStructs.VerificationConfigV2 memory formattedConfig = SelfUtils.formatVerificationConfigV2(config);
        
        return hub.setVerificationConfigV2(formattedConfig);
    }

    function _logDeploymentInfo(
        address platformAddress,
        address tokenAddress, 
        bytes32 configId
    ) internal view {
        console.log("\n=== DEPLOYMENT COMPLETE ===");
        console.log("Network:", _getNetworkName());
        console.log("Platform Contract:", platformAddress);
        console.log("Airdrop Token:", tokenAddress);
        console.log("Verification Config ID:", vm.toString(configId));
        console.log("Hub Address:", _getHubAddress());
        console.log("\n=== NEXT STEPS ===");
        console.log("1. Update frontend config with these addresses");
        console.log("2. Set up Self SDK with the verification config ID");
        console.log("3. Configure Matrix/P2P messaging with room IDs");
        console.log("4. Test the verification flow end-to-end");
    }

    function _getNetworkName() internal view returns (string memory) {
        uint256 chainId = block.chainid;
        if (chainId == 44787) return "Celo Testnet (Alfajores)";
        if (chainId == 42220) return "Celo Mainnet";
        return "Unknown Network";
    }
}