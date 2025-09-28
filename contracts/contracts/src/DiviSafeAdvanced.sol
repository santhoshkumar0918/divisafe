// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {SelfVerificationRoot} from "@selfxyz/contracts/contracts/abstract/SelfVerificationRoot.sol";
import {ISelfVerificationRoot} from "@selfxyz/contracts/contracts/interfaces/ISelfVerificationRoot.sol";
import {IIdentityVerificationHubV2} from "@selfxyz/contracts/contracts/interfaces/IIdentityVerificationHubV2.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title DiviSafeAdvanced
 * @notice Advanced divorce support platform with comprehensive room categories and ASI integration
 */
contract DiviSafeAdvanced is SelfVerificationRoot, ERC721, Ownable {
    using SafeERC20 for IERC20;

    enum BadgeType {
        HUMAN,
        ADULT,
        PARENT,
        JURISDICTION_US,
        JURISDICTION_IN,
        JURISDICTION_EU,
        COUNSELOR,
        MODERATOR,
        BIRTHDAY_SPECIAL,
        ENTERTAINMENT_INDUSTRY,
        CORPORATE_EXECUTIVE,
        HEALTHCARE_WORKER,
        ENTREPRENEUR,
        YOUNG_ADULT,
        MILLENNIAL,
        GEN_X,
        SENIOR,
        WOMEN_SUPPORT,
        MEN_SUPPORT,
        LGBTQ_SUPPORT,
        HINDU_SUPPORT,
        MUSLIM_SUPPORT,
        CHRISTIAN_SUPPORT,
        INTERFAITH_SUPPORT
    }

    enum RoomCategory {
        ANONYMOUS_CHAT,
        AGE_SECTOR_CLASSIFICATION,
        AI_EMOTIONAL_SUPPORT,
        PROFESSIONAL_GUIDANCE,
        DEMOGRAPHIC_SPECIFIC,
        CULTURAL_RELIGIOUS,
        SKILL_BUILDING,
        RECOVERY_GROWTH
    }

    enum RoomType {
        // Anonymous Chat Rooms
        GENERAL_SUPPORT,
        PRE_DIVORCE_COUNSELING,
        POST_DIVORCE_RECOVERY,
        CO_PARENTING_SUPPORT,
        FINANCIAL_RECOVERY,
        CRISIS_INTERVENTION,
        SUCCESS_STORIES,
        FAMILY_MEDIATION,
        // Professional Guidance
        LEGAL_CONSULTATION,
        FINANCIAL_PLANNING,
        THERAPY_SESSIONS,
        MEDIATION_SERVICES,
        // Demographic Specific
        WOMEN_SUPPORT_CIRCLE,
        MEN_MENTAL_HEALTH,
        LGBTQ_RELATIONSHIPS,
        SENIOR_CITIZENS,
        // Cultural/Religious
        HINDU_MARRIAGE_SUPPORT,
        MUSLIM_FAMILY_GUIDANCE,
        CHRISTIAN_COUPLES,
        INTERFAITH_RELATIONSHIPS,
        // Skill Building
        COMMUNICATION_WORKSHOP,
        ANGER_MANAGEMENT,
        SELF_CARE_SANCTUARY,
        CO_PARENTING_ACADEMY,
        // Recovery & Growth
        NEW_BEGINNINGS,
        DATING_AFTER_DIVORCE,
        BLENDED_FAMILIES,
        PERSONAL_TRANSFORMATION,
        // AI Emotional Support
        AI_COMPANION_CHAT,
        MOOD_ANALYSIS_ROOM,
        CRISIS_DETECTION_ROOM,
        PERSONALIZED_THERAPY
    }

    struct Room {
        uint256 roomId;
        RoomType roomType;
        RoomCategory category;
        string name;
        string description;
        BadgeType[] requiredBadges;
        string ageGroup;
        string sector;
        uint256 maxParticipants;
        uint256 currentParticipants;
        bool requiresVerification;
        bool isActive;
        bool hasAISupport;
        uint256 accessTokenRequired;
        address moderator;
        uint256 createdAt;
    }

    struct UserProfile {
        uint256 tokenId;
        BadgeType[] badges;
        uint256 expiryTimestamp;
        uint256 birthMonth;
        string ageGroup;
        string sector;
        bool isValid;
        uint256 reputationScore;
        uint256 totalAirdropsReceived;
    }

    struct AIInteraction {
        uint256 sessionId;
        address user;
        uint256 timestamp;
        string emotionalState;
        bool crisisDetected;
        bool escalatedToHuman;
    }

    // State variables
    mapping(uint256 => Room) public rooms;
    mapping(address => UserProfile) public userProfiles;
    mapping(uint256 => uint256) public nullifierToTokenId;
    mapping(address => uint256) public userToTokenId;
    mapping(uint256 => BadgeType[]) public tokenBadges;
    mapping(uint256 => uint256) public expiryTimestamps;
    mapping(uint256 => uint256) public userBirthMonth;
    mapping(uint256 => mapping(uint256 => bool)) public birthdayClaimedByYear;
    mapping(uint256 => uint256) public totalAirdropsReceived;
    mapping(uint256 => bool) public verifiedCounselors;
    mapping(address => uint256[]) public userRoomAccess;
    mapping(uint256 => AIInteraction[]) public roomAIInteractions;

    uint256 public nextRoomId;
    uint64 public nextTokenId;
    uint256 public validityPeriod;
    bytes32 public verificationConfigId;
    IERC20 public airdropToken;
    uint256 public defaultAirdropAmount;
    bool public birthdayAirdropsEnabled;
    bool public aiSupportEnabled;

    // Events
    event SBTMinted(
        address indexed to,
        uint256 indexed tokenId,
        BadgeType[] badges
    );
    event RoomCreated(
        uint256 indexed roomId,
        RoomType roomType,
        address indexed creator
    );
    event RoomJoined(
        uint256 indexed roomId,
        address indexed user,
        uint256 indexed tokenId
    );
    event AIInteractionLogged(
        uint256 indexed sessionId,
        address indexed user,
        string emotionalState
    );
    event CrisisDetected(
        uint256 indexed sessionId,
        address indexed user,
        bool escalated
    );
    event BirthdayAirdropClaimed(
        uint256 indexed tokenId,
        uint256 amount,
        uint256 year
    );

    constructor(
        address _hubAddress,
        string memory _scopeValue,
        bytes32 _verificationConfigId,
        uint256 _validityPeriod,
        address _airdropToken,
        uint256 _defaultAirdropAmount,
        address _owner
    )
        SelfVerificationRoot(_hubAddress, _scopeValue)
        ERC721("DiviSafeSBT", "DSSBT")
        Ownable(_owner)
    {
        verificationConfigId = _verificationConfigId;
        validityPeriod = _validityPeriod;
        airdropToken = IERC20(_airdropToken);
        defaultAirdropAmount = _defaultAirdropAmount;
        birthdayAirdropsEnabled = true;
        aiSupportEnabled = true;
        nextTokenId = 1;
        nextRoomId = 1;

        // Initialize default rooms
        _createDefaultRooms();
    }

    function mintSBT(
        address to,
        BadgeType[] calldata badges,
        uint256 birthMonth,
        string calldata ageGroup,
        string calldata sector
    ) external onlyOwner returns (uint256) {
        require(to != address(0), "Invalid address");
        require(badges.length > 0, "No badges provided");
        require(birthMonth >= 1 && birthMonth <= 12, "Invalid birth month");

        uint256 tokenId = nextTokenId++;
        _mint(to, tokenId);

        tokenBadges[tokenId] = badges;
        userToTokenId[to] = tokenId;
        expiryTimestamps[tokenId] = block.timestamp + validityPeriod;
        userBirthMonth[tokenId] = birthMonth;

        userProfiles[to] = UserProfile({
            tokenId: tokenId,
            badges: badges,
            expiryTimestamp: block.timestamp + validityPeriod,
            birthMonth: birthMonth,
            ageGroup: ageGroup,
            sector: sector,
            isValid: true,
            reputationScore: 0,
            totalAirdropsReceived: 0
        });

        emit SBTMinted(to, tokenId, badges);
        return tokenId;
    }

    function createRoom(
        RoomType roomType,
        RoomCategory category,
        string calldata name,
        string calldata description,
        BadgeType[] calldata requiredBadges,
        string calldata ageGroup,
        string calldata sector,
        uint256 maxParticipants,
        bool hasAISupport,
        uint256 accessTokenRequired
    ) external returns (uint256) {
        require(userProfiles[msg.sender].isValid, "User not verified");

        uint256 roomId = nextRoomId++;

        rooms[roomId] = Room({
            roomId: roomId,
            roomType: roomType,
            category: category,
            name: name,
            description: description,
            requiredBadges: requiredBadges,
            ageGroup: ageGroup,
            sector: sector,
            maxParticipants: maxParticipants,
            currentParticipants: 0,
            requiresVerification: requiredBadges.length > 0,
            isActive: true,
            hasAISupport: hasAISupport,
            accessTokenRequired: accessTokenRequired,
            moderator: msg.sender,
            createdAt: block.timestamp
        });

        emit RoomCreated(roomId, roomType, msg.sender);
        return roomId;
    }

    function joinRoom(uint256 roomId) external {
        Room storage room = rooms[roomId];
        require(room.isActive, "Room not active");
        require(room.currentParticipants < room.maxParticipants, "Room full");

        UserProfile memory profile = userProfiles[msg.sender];
        require(profile.isValid, "User not verified");

        if (room.requiresVerification) {
            require(
                _hasRequiredBadges(profile.badges, room.requiredBadges),
                "Missing required badges"
            );
        }

        userRoomAccess[msg.sender].push(roomId);
        room.currentParticipants++;

        emit RoomJoined(roomId, msg.sender, profile.tokenId);
    }

    function logAIInteraction(
        uint256 roomId,
        string calldata emotionalState,
        bool crisisDetected
    ) external {
        require(rooms[roomId].hasAISupport, "Room doesn't support AI");
        require(userProfiles[msg.sender].isValid, "User not verified");

        uint256 sessionId = uint256(
            keccak256(abi.encodePacked(msg.sender, block.timestamp, roomId))
        );

        AIInteraction memory interaction = AIInteraction({
            sessionId: sessionId,
            user: msg.sender,
            timestamp: block.timestamp,
            emotionalState: emotionalState,
            crisisDetected: crisisDetected,
            escalatedToHuman: false
        });

        roomAIInteractions[roomId].push(interaction);

        emit AIInteractionLogged(sessionId, msg.sender, emotionalState);

        if (crisisDetected) {
            emit CrisisDetected(sessionId, msg.sender, false);
        }
    }

    function claimBirthdayAirdrop() external returns (uint256) {
        require(birthdayAirdropsEnabled, "Airdrops disabled");

        UserProfile storage profile = userProfiles[msg.sender];
        require(profile.isValid, "User not verified");
        require(profile.expiryTimestamp > block.timestamp, "SBT expired");

        uint256 currentYear = (block.timestamp / 365 days) + 1970;
        require(
            !birthdayClaimedByYear[profile.tokenId][currentYear],
            "Already claimed this year"
        );

        birthdayClaimedByYear[profile.tokenId][currentYear] = true;
        profile.totalAirdropsReceived++;
        totalAirdropsReceived[profile.tokenId]++;

        uint256 airdropAmount = defaultAirdropAmount;
        airdropToken.safeTransfer(msg.sender, airdropAmount);

        emit BirthdayAirdropClaimed(
            profile.tokenId,
            airdropAmount,
            currentYear
        );
        return airdropAmount;
    }

    function getUserProfile(
        address user
    ) external view returns (UserProfile memory) {
        return userProfiles[user];
    }

    function getRoom(uint256 roomId) external view returns (Room memory) {
        return rooms[roomId];
    }

    function getUserRooms(
        address user
    ) external view returns (uint256[] memory) {
        return userRoomAccess[user];
    }

    function _createDefaultRooms() internal {
        // Create default anonymous chat rooms
        _createDefaultRoom(
            RoomType.GENERAL_SUPPORT,
            RoomCategory.ANONYMOUS_CHAT,
            "General Support",
            "Open discussions about relationship issues"
        );
        _createDefaultRoom(
            RoomType.PRE_DIVORCE_COUNSELING,
            RoomCategory.ANONYMOUS_CHAT,
            "Pre-divorce Counseling",
            "For couples considering separation"
        );
        _createDefaultRoom(
            RoomType.POST_DIVORCE_RECOVERY,
            RoomCategory.ANONYMOUS_CHAT,
            "Post-divorce Recovery",
            "Support for life after divorce"
        );
        _createDefaultRoom(
            RoomType.CO_PARENTING_SUPPORT,
            RoomCategory.ANONYMOUS_CHAT,
            "Co-parenting Support",
            "Managing relationships for children's sake"
        );
        _createDefaultRoom(
            RoomType.FINANCIAL_RECOVERY,
            RoomCategory.ANONYMOUS_CHAT,
            "Financial Recovery",
            "Dealing with financial implications"
        );
        _createDefaultRoom(
            RoomType.CRISIS_INTERVENTION,
            RoomCategory.ANONYMOUS_CHAT,
            "Crisis Intervention",
            "24/7 support for urgent emotional needs"
        );
        _createDefaultRoom(
            RoomType.SUCCESS_STORIES,
            RoomCategory.ANONYMOUS_CHAT,
            "Success Stories",
            "Anonymous sharing of recovery journeys"
        );
        _createDefaultRoom(
            RoomType.FAMILY_MEDIATION,
            RoomCategory.ANONYMOUS_CHAT,
            "Family Mediation",
            "Discussions involving extended family dynamics"
        );

        // AI Emotional Support Rooms
        _createDefaultRoom(
            RoomType.AI_COMPANION_CHAT,
            RoomCategory.AI_EMOTIONAL_SUPPORT,
            "AI Companion Chat",
            "Chat with AI for emotional support"
        );
        _createDefaultRoom(
            RoomType.MOOD_ANALYSIS_ROOM,
            RoomCategory.AI_EMOTIONAL_SUPPORT,
            "Mood Analysis",
            "AI-powered mood tracking and analysis"
        );
        _createDefaultRoom(
            RoomType.CRISIS_DETECTION_ROOM,
            RoomCategory.AI_EMOTIONAL_SUPPORT,
            "Crisis Detection",
            "AI monitoring for crisis intervention"
        );
    }

    function _createDefaultRoom(
        RoomType roomType,
        RoomCategory category,
        string memory name,
        string memory description
    ) internal {
        uint256 roomId = nextRoomId++;
        BadgeType[] memory emptyBadges;

        rooms[roomId] = Room({
            roomId: roomId,
            roomType: roomType,
            category: category,
            name: name,
            description: description,
            requiredBadges: emptyBadges,
            ageGroup: "",
            sector: "",
            maxParticipants: 100,
            currentParticipants: 0,
            requiresVerification: false,
            isActive: true,
            hasAISupport: category == RoomCategory.AI_EMOTIONAL_SUPPORT,
            accessTokenRequired: 0,
            moderator: owner(),
            createdAt: block.timestamp
        });
    }

    function _hasRequiredBadges(
        BadgeType[] memory userBadges,
        BadgeType[] memory requiredBadges
    ) internal pure returns (bool) {
        for (uint i = 0; i < requiredBadges.length; i++) {
            bool hasRequiredBadge = false;
            for (uint j = 0; j < userBadges.length; j++) {
                if (userBadges[j] == requiredBadges[i]) {
                    hasRequiredBadge = true;
                    break;
                }
            }
            if (!hasRequiredBadge) {
                return false;
            }
        }
        return true;
    }

    // Prevent transfers (SBT)
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert("SBT: Transfer not allowed");
        }
        return super._update(to, tokenId, auth);
    }
}
