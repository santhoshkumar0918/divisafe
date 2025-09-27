// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import { Test } from "forge-std/Test.sol";
import { console } from "forge-std/console.sol";
import { AnonymousSupportPlatform } from "../AnonymousSupportPlatform.sol";
import { MockERC20 } from "../mocks/MockERC20.sol";
import { ISelfVerificationRoot } from "@selfxyz/contracts-v2/contracts/interfaces/ISelfVerificationRoot.sol";

contract AnonymousSupportPlatformTest is Test {
    AnonymousSupportPlatform public platform;
    MockERC20 public airdropToken;
    
    address public owner = makeAddr("owner");
    address public user1 = makeAddr("user1");
    address public user2 = makeAddr("user2");
    address public counselor = makeAddr("counselor");
    
    // Mock hub address for testing
    address public mockHub = makeAddr("mockHub");
    
    uint256 public constant SCOPE_VALUE = 12345;
    uint256 public constant VALIDITY_PERIOD = 365 days;
    bytes32 public constant VERIFICATION_CONFIG_ID = bytes32(uint256(1));
    uint256 public constant DEFAULT_AIRDROP_AMOUNT = 100 * 10**18;

    function setUp() public {
        vm.startPrank(owner);
        
        // Deploy mock airdrop token
        airdropToken = new MockERC20("Support Token", "SUPP", 18);
        
        // Mock the hub verification config check
        vm.mockCall(
            mockHub,
            abi.encodeWithSignature("verificationConfigV2Exists(bytes32)", VERIFICATION_CONFIG_ID),
            abi.encode(true)
        );
        
        // Deploy platform contract
        platform = new AnonymousSupportPlatform(
            mockHub,
            SCOPE_VALUE,
            owner,
            VALIDITY_PERIOD,
            VERIFICATION_CONFIG_ID,
            address(airdropToken),
            DEFAULT_AIRDROP_AMOUNT
        );
        
        // Mint tokens to platform for airdrops
        airdropToken.mint(address(platform), 1000000 * 10**18);
        
        vm.stopPrank();
    }

    function testDeployment() public {
        assertEq(platform.owner(), owner);
        assertEq(address(platform.airdropToken()), address(airdropToken));
        assertEq(platform.defaultAirdropAmount(), DEFAULT_AIRDROP_AMOUNT);
        assertEq(platform.validityPeriod(), VALIDITY_PERIOD);
        assertTrue(platform.birthdayAirdropsEnabled());
    }

    function testGetConfigId() public {
        bytes32 configId = platform.getConfigId(bytes32(0), bytes32(0), "");
        assertEq(configId, VERIFICATION_CONFIG_ID);
    }

    function testUserProfileEmpty() public {
        AnonymousSupportPlatform.UserProfile memory profile = platform.getUserProfile(user1);
        assertEq(profile.tokenId, 0);
        assertEq(profile.badges.length, 0);
        assertFalse(profile.isValid);
    }

    function testRoomAccess() public {
        bytes32 adultRoomId = keccak256(abi.encodePacked("adult_support"));
        
        // User without SBT cannot access room
        assertFalse(platform.canAccessRoom(user1, adultRoomId));
    }

    function testCreateRoom() public {
        vm.prank(owner);
        platform.createRoom("test_room", AnonymousSupportPlatform.BadgeType.ADULT);
        
        bytes32 roomId = keccak256(abi.encodePacked("test_room"));
        assertTrue(platform.activeRooms(roomId));
        assertEq(uint256(platform.roomRequirements(roomId)), uint256(AnonymousSupportPlatform.BadgeType.ADULT));
    }

    function testSetMonthlyAirdropAmount() public {
        vm.prank(owner);
        platform.setMonthlyAirdropAmount(6, 200 * 10**18);
        
        assertEq(platform.monthlyAirdropAmounts(6), 200 * 10**18);
    }

    function testSetMonthlyAirdropAmountInvalidMonth() public {
        vm.prank(owner);
        vm.expectRevert("Invalid month");
        platform.setMonthlyAirdropAmount(13, 200 * 10**18);
    }

    function testToggleBirthdayAirdrops() public {
        assertTrue(platform.birthdayAirdropsEnabled());
        
        vm.prank(owner);
        platform.toggleBirthdayAirdrops();
        
        assertFalse(platform.birthdayAirdropsEnabled());
    }

    function testSubmitCounselorRequestWithoutSBT() public {
        vm.prank(user1);
        vm.expectRevert("Invalid SBT");
        platform.submitCounselorRequest("encrypted_message");
    }

    function testVerifyCounselorWithoutBadge() public {
        vm.prank(owner);
        vm.expectRevert("Missing counselor badge");
        platform.verifyCounselor(1);
    }

    function testBurnSBTNonExistent() public {
        vm.prank(owner);
        vm.expectRevert("Token doesn't exist");
        platform.burnSBT(999);
    }

    function testSetValidityPeriod() public {
        uint256 newPeriod = 180 days;
        
        vm.prank(owner);
        platform.setValidityPeriod(newPeriod);
        
        assertEq(platform.validityPeriod(), newPeriod);
    }

    function testWithdrawAirdropTokens() public {
        uint256 withdrawAmount = 1000 * 10**18;
        uint256 ownerBalanceBefore = airdropToken.balanceOf(owner);
        
        vm.prank(owner);
        platform.withdrawAirdropTokens(withdrawAmount);
        
        assertEq(airdropToken.balanceOf(owner), ownerBalanceBefore + withdrawAmount);
    }

    function testNonTransferable() public {
        // This would test the soulbound nature, but requires actual SBT minting
        // which needs proper Self Protocol integration
    }

    // Helper function to simulate Self Protocol verification
    function _simulateVerification(address user, uint256 nullifier) internal {
        // This would simulate the Self Protocol verification flow
        // In a real test, you'd mock the hub calls and verification process
        
        ISelfVerificationRoot.GenericDiscloseOutputV2 memory output = ISelfVerificationRoot.GenericDiscloseOutputV2({
            nullifier: nullifier,
            userIdentifier: uint256(uint160(user))
        });
        
        // Mock userData with signature
        bytes memory userData = abi.encodePacked("0x", "mock_signature_data");
        
        // This would trigger the customVerificationHook
        // vm.prank(mockHub);
        // platform.customVerificationHook(output, userData);
    }

    function testClaimBirthdayAirdropWithoutSBT() public {
        vm.prank(user1);
        vm.expectRevert("No SBT found");
        platform.claimBirthdayAirdrop();
    }

    function testClaimBirthdayAirdropDisabled() public {
        vm.prank(owner);
        platform.toggleBirthdayAirdrops();
        
        vm.prank(user1);
        vm.expectRevert("Airdrops disabled");
        platform.claimBirthdayAirdrop();
    }

    // Test events
    function testMonthlyAirdropUpdatedEvent() public {
        vm.prank(owner);
        vm.expectEmit(true, true, true, true);
        emit AnonymousSupportPlatform.MonthlyAirdropUpdated(6, 200 * 10**18);
        platform.setMonthlyAirdropAmount(6, 200 * 10**18);
    }

    function testRoomCreatedEvent() public {
        vm.prank(owner);
        bytes32 roomId = keccak256(abi.encodePacked("new_room"));
        vm.expectEmit(true, true, true, true);
        emit AnonymousSupportPlatform.RoomCreated(roomId, AnonymousSupportPlatform.BadgeType.PARENT);
        platform.createRoom("new_room", AnonymousSupportPlatform.BadgeType.PARENT);
    }

    // Test access control
    function testOnlyOwnerFunctions() public {
        vm.prank(user1);
        vm.expectRevert();
        platform.setValidityPeriod(180 days);
        
        vm.prank(user1);
        vm.expectRevert();
        platform.createRoom("unauthorized_room", AnonymousSupportPlatform.BadgeType.ADULT);
        
        vm.prank(user1);
        vm.expectRevert();
        platform.withdrawAirdropTokens(1000);
    }
}