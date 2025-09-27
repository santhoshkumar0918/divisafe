// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

/**
 * @title IAnonymousSupportPlatform
 * @notice Interface for the Anonymous Support Platform contract
 */
interface IAnonymousSupportPlatform {
    enum BadgeType {
        HUMAN,
        ADULT,
        PARENT,
        JURISDICTION_US,
        JURISDICTION_IN,
        JURISDICTION_EU,
        COUNSELOR,
        MODERATOR,
        BIRTHDAY_SPECIAL
    }

    struct UserProfile {
        uint256 tokenId;
        BadgeType[] badges;
        uint256 expiryTimestamp;
        uint256 birthMonth;
        bool isValid;
    }

    struct CounselorRequest {
        address requester;
        uint256 timestamp;
        string encryptedMessage;
        bool isActive;
        uint256 assignedCounselor;
    }

    // Events
    event SBTMinted(address indexed to, uint256 indexed tokenId, BadgeType[] badges);
    event SBTUpdated(uint256 indexed tokenId, BadgeType[] newBadges);
    event RoomCreated(bytes32 indexed roomId, BadgeType requiredBadge);
    event BirthdayAirdropClaimed(uint256 indexed tokenId, uint256 amount, uint256 year);
    event CounselorRequestSubmitted(bytes32 indexed requestId, address indexed requester);
    event CounselorAssigned(bytes32 indexed requestId, uint256 indexed counselorTokenId);
    event MonthlyAirdropUpdated(uint256 month, uint256 newAmount);

    // Core functions
    function getUserProfile(address user) external view returns (UserProfile memory);
    function canAccessRoom(address user, bytes32 roomId) external view returns (bool);
    function isTokenValid(uint256 tokenId) external view returns (bool);
    
    // Birthday airdrop functions
    function claimBirthdayAirdrop() external;
    function setMonthlyAirdropAmount(uint256 month, uint256 amount) external;
    function toggleBirthdayAirdrops() external;
    
    // Counselor functions
    function submitCounselorRequest(string memory encryptedMessage) external returns (bytes32);
    function assignCounselor(bytes32 requestId, uint256 counselorTokenId) external;
    function verifyCounselor(uint256 tokenId) external;
    
    // Room management
    function createRoom(string memory roomName, BadgeType requiredBadge) external;
    
    // Admin functions
    function burnSBT(uint256 tokenId) external;
    function withdrawAirdropTokens(uint256 amount) external;
    function setValidityPeriod(uint256 newValidityPeriod) external;
}