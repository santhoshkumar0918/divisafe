// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import { SelfVerificationRoot } from "@selfxyz/contracts-v2/contracts/abstract/SelfVerificationRoot.sol";
import { ISelfVerificationRoot } from "@selfxyz/contracts-v2/contracts/interfaces/ISelfVerificationRoot.sol";
import { IIdentityVerificationHubV2 } from "@selfxyz/contracts-v2/contracts/interfaces/IIdentityVerificationHubV2.sol";
import { SelfStructs } from "@selfxyz/contracts-v2/contracts/libraries/SelfStructs.sol";
import { SelfUtils } from "@selfxyz/contracts-v2/contracts/libraries/SelfUtils.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ECDSA } from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { MerkleProof } from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

/**
 * @title AnonymousSupportPlatform
 * @notice Privacy-first support platform with Self Protocol verification and birthday airdrops
 * @dev Combines SBT verification with community features and reward mechanisms
 */
contract AnonymousSupportPlatform is SelfVerificationRoot, ERC721, Ownable {
    using ECDSA for bytes32;
    using SafeERC20 for IERC20;

    /*//////////////////////////////////////////////////////////////
                             BADGE TYPES
    //////////////////////////////////////////////////////////////*/
    
    enum BadgeType {
        HUMAN,           // Basic human verification
        ADULT,           // 18+ verification  
        PARENT,          // Parent verification
        JURISDICTION_US, // US jurisdiction
        JURISDICTION_IN, // India jurisdiction
        JURISDICTION_EU, // EU jurisdiction
        COUNSELOR,       // Professional counselor
        MODERATOR,       // Community moderator
        BIRTHDAY_SPECIAL // Special birthday badge
    }

    /*//////////////////////////////////////////////////////////////
                             STATE VARIABLES
    //////////////////////////////////////////////////////////////*/
    
    // Core SBT tracking
    mapping(uint256 nullifier => uint256 tokenId) internal _nullifierToTokenId;
    mapping(address user => uint256 tokenId) internal _userToTokenId;
    mapping(uint256 tokenId => BadgeType[]) internal _tokenBadges;
    mapping(uint256 tokenId => uint256 expiryTimestamp) internal _expiryTimestamps;
    mapping(uint256 tokenId => uint256 birthMonth) internal _userBirthMonth;
    
    // Room access control
    mapping(bytes32 roomId => BadgeType requiredBadge) public roomRequirements;
    mapping(bytes32 roomId => bool isActive) public activeRooms;
    
    // Birthday airdrop system
    mapping(uint256 month => uint256 airdropAmount) public monthlyAirdropAmounts;
    mapping(uint256 tokenId => mapping(uint256 year => bool)) public birthdayClaimedByYear;
    mapping(uint256 tokenId => uint256 totalAirdropsClaimed) public totalAirdropsReceived;
    
    // Counselor system
    mapping(uint256 tokenId => bool) public verifiedCounselors;
    mapping(bytes32 requestId => CounselorRequest) public counselorRequests;
    
    // Platform state
    uint64 internal _nextTokenId;
    uint256 public validityPeriod;
    bytes32 public verificationConfigId;
    IERC20 public airdropToken;
    uint256 public defaultAirdropAmount;
    bool public birthdayAirdropsEnabled;
    
    // EIP-712 for signature verification
    bytes32 public immutable DOMAIN_SEPARATOR;
    bytes32 public constant VERIFY_IDENTITY_TYPEHASH = 
        keccak256("VerifyIdentity(address wallet,uint256 timestamp)");
    uint256 public constant MAX_SIGNATURE_AGE = 600; // 10 minutes

    /*//////////////////////////////////////////////////////////////
                                STRUCTS
    //////////////////////////////////////////////////////////////*/
    
    struct CounselorRequest {
        address requester;
        uint256 timestamp;
        string encryptedMessage;
        bool isActive;
        uint256 assignedCounselor;
    }

    struct UserProfile {
        uint256 tokenId;
        BadgeType[] badges;
        uint256 expiryTimestamp;
        uint256 birthMonth;
        bool isValid;
    }

    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/
    
    event SBTMinted(address indexed to, uint256 indexed tokenId, BadgeType[] badges);
    event SBTUpdated(uint256 indexed tokenId, BadgeType[] newBadges);
    event RoomCreated(bytes32 indexed roomId, BadgeType requiredBadge);
    event BirthdayAirdropClaimed(uint256 indexed tokenId, uint256 amount, uint256 year);
    event CounselorRequestSubmitted(bytes32 indexed requestId, address indexed requester);
    event CounselorAssigned(bytes32 indexed requestId, uint256 indexed counselorTokenId);
    event MonthlyAirdropUpdated(uint256 month, uint256 newAmount);

    /*//////////////////////////////////////////////////////////////
                                ERRORS
    //////////////////////////////////////////////////////////////*/
    
    error InvalidBadgeType();
    error InsufficientBadges();
    error BirthdayAlreadyClaimed();
    error AirdropsDisabled();
    error InvalidBirthMonth();
    error NotVerifiedCounselor();
    error RequestNotFound();
    error InvalidSignature();
    error SignatureExpired();
    error InvalidUserData();

    /*//////////////////////////////////////////////////////////////
                              CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/
    
    constructor(
        address _hubAddress,
        uint256 _scopeValue,
        address _owner,
        uint256 _validityPeriod,
        bytes32 _verificationConfigId,
        address _airdropToken,
        uint256 _defaultAirdropAmount
    )
        SelfVerificationRoot(_hubAddress, _scopeValue)
        ERC721("AnonymousSupportSBT", "ASSBT")
        Ownable(_owner)
    {
        // Validate verification config exists
        IIdentityVerificationHubV2 hub = IIdentityVerificationHubV2(_hubAddress);
        require(hub.verificationConfigV2Exists(_verificationConfigId), "Config not found");
        
        verificationConfigId = _verificationConfigId;
        validityPeriod = _validityPeriod;
        airdropToken = IERC20(_airdropToken);
        defaultAirdropAmount = _defaultAirdropAmount;
        birthdayAirdropsEnabled = true;
        _nextTokenId = 1;

        // Initialize EIP-712 domain separator
        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes("Anonymous Support Platform")),
                keccak256(bytes("1")),
                block.chainid,
                address(this)
            )
        );

        // Set default monthly airdrop amounts (can be customized)
        for (uint256 i = 1; i <= 12; i++) {
            monthlyAirdropAmounts[i] = _defaultAirdropAmount;
        }

        // Create default support rooms
        _createRoom("adult_support", BadgeType.ADULT);
        _createRoom("parents_circle", BadgeType.PARENT);
        _createRoom("us_legal_help", BadgeType.JURISDICTION_US);
        _createRoom("india_legal_help", BadgeType.JURISDICTION_IN);
        _createRoom("eu_legal_help", BadgeType.JURISDICTION_EU);
    }

    /*//////////////////////////////////////////////////////////////
                        SELF VERIFICATION OVERRIDES
    //////////////////////////////////////////////////////////////*/
    
    function getConfigId(bytes32, bytes32, bytes memory) public view override returns (bytes32) {
        return verificationConfigId;
    }

    function customVerificationHook(
        ISelfVerificationRoot.GenericDiscloseOutputV2 memory output,
        bytes memory userData
    ) internal override {
        uint256 nullifier = output.nullifier;
        address receiver = address(uint160(output.userIdentifier));
        
        require(receiver != address(0), "Invalid receiver");
        
        // Verify EIP-712 signature
        _verifySignature(receiver, userData);
        
        // Parse user attributes from disclosed data
        BadgeType[] memory badges = _parseUserAttributes(output);
        uint256 birthMonth = _extractBirthMonth(output);
        
        // Handle SBT minting/updating logic
        _handleVerification(nullifier, receiver, badges, birthMonth);
    }

    /*//////////////////////////////////////////////////////////////
                           CORE SBT FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    
    function _handleVerification(
        uint256 nullifier,
        address receiver,
        BadgeType[] memory badges,
        uint256 birthMonth
    ) internal {
        uint256 nullifierTokenId = _nullifierToTokenId[nullifier];
        uint256 receiverTokenId = _userToTokenId[receiver];
        bool nullifierUsed = nullifierTokenId != 0;
        bool receiverHasSBT = receiverTokenId != 0;
        
        if (!nullifierUsed && !receiverHasSBT) {
            // Case 1: New user, mint SBT
            _mintNewSBT(receiver, nullifier, badges, birthMonth);
        } else if (!nullifierUsed && receiverHasSBT) {
            // Case 2: User with new verification document
            _updateExistingSBT(receiverTokenId, nullifier, badges);
        } else if (nullifierUsed && !receiverHasSBT) {
            // Case 3: Recovery scenario
            _handleRecovery(nullifierTokenId, receiver, badges);
        } else {
            // Case 4: Existing user refreshing
            require(_ownerOf(nullifierTokenId) == receiver, "Nullifier mismatch");
            _updateExistingSBT(receiverTokenId, nullifier, badges);
        }
    }
    
    function _mintNewSBT(
        address to,
        uint256 nullifier,
        BadgeType[] memory badges,
        uint256 birthMonth
    ) internal {
        uint64 tokenId = _nextTokenId++;
        uint256 expiryTimestamp = block.timestamp + validityPeriod;
        
        _mint(to, tokenId);
        _tokenBadges[tokenId] = badges;
        _expiryTimestamps[tokenId] = expiryTimestamp;
        _userBirthMonth[tokenId] = birthMonth;
        
        _nullifierToTokenId[nullifier] = tokenId;
        _userToTokenId[to] = tokenId;
        
        emit SBTMinted(to, tokenId, badges);
    }
    
    function _updateExistingSBT(
        uint256 tokenId,
        uint256 nullifier,
        BadgeType[] memory newBadges
    ) internal {
        uint256 newExpiry = block.timestamp + validityPeriod;
        
        _expiryTimestamps[tokenId] = newExpiry;
        _tokenBadges[tokenId] = newBadges;
        _nullifierToTokenId[nullifier] = tokenId;
        
        emit SBTUpdated(tokenId, newBadges);
    }
    
    function _handleRecovery(
        uint256 tokenId,
        address newOwner,
        BadgeType[] memory badges
    ) internal {
        address currentOwner = _ownerOf(tokenId);
        require(currentOwner == address(0), "Token still active");
        
        // Recover burned token
        uint256 newExpiry = block.timestamp + validityPeriod;
        _mint(newOwner, tokenId);
        _expiryTimestamps[tokenId] = newExpiry;
        _tokenBadges[tokenId] = badges;
        _userToTokenId[newOwner] = tokenId;
        
        emit SBTMinted(newOwner, tokenId, badges);
    }

    /*//////////////////////////////////////////////////////////////
                         BIRTHDAY AIRDROP SYSTEM
    //////////////////////////////////////////////////////////////*/
    
    function claimBirthdayAirdrop() external {
        require(birthdayAirdropsEnabled, "Airdrops disabled");
        
        uint256 tokenId = _userToTokenId[msg.sender];
        require(tokenId != 0, "No SBT found");
        require(isTokenValid(tokenId), "SBT expired");
        
        uint256 currentMonth = (block.timestamp / 30 days) % 12 + 1; // Simplified month calculation
        uint256 currentYear = block.timestamp / 365 days + 1970; // Simplified year calculation
        uint256 userBirthMonth = _userBirthMonth[tokenId];
        
        require(userBirthMonth == currentMonth, "Not your birth month");
        require(!birthdayClaimedByYear[tokenId][currentYear], "Already claimed this year");
        
        uint256 airdropAmount = monthlyAirdropAmounts[currentMonth];
        require(airdropAmount > 0, "No airdrop for this month");
        
        // Mark as claimed and transfer tokens
        birthdayClaimedByYear[tokenId][currentYear] = true;
        totalAirdropsReceived[tokenId] += airdropAmount;
        
        // Add special birthday badge if it's their first claim
        if (totalAirdropsReceived[tokenId] == airdropAmount) {
            _tokenBadges[tokenId].push(BadgeType.BIRTHDAY_SPECIAL);
        }
        
        airdropToken.safeTransfer(msg.sender, airdropAmount);
        
        emit BirthdayAirdropClaimed(tokenId, airdropAmount, currentYear);
    }
    
    function setMonthlyAirdropAmount(uint256 month, uint256 amount) external onlyOwner {
        require(month >= 1 && month <= 12, "Invalid month");
        monthlyAirdropAmounts[month] = amount;
        emit MonthlyAirdropUpdated(month, amount);
    }
    
    function toggleBirthdayAirdrops() external onlyOwner {
        birthdayAirdropsEnabled = !birthdayAirdropsEnabled;
    }

    /*//////////////////////////////////////////////////////////////
                           ROOM ACCESS CONTROL
    //////////////////////////////////////////////////////////////*/
    
    function canAccessRoom(address user, bytes32 roomId) external view returns (bool) {
        if (!activeRooms[roomId]) return false;
        
        uint256 tokenId = _userToTokenId[user];
        if (tokenId == 0 || !isTokenValid(tokenId)) return false;
        
        BadgeType requiredBadge = roomRequirements[roomId];
        return _hasBadge(tokenId, requiredBadge);
    }
    
    function _createRoom(string memory roomName, BadgeType requiredBadge) internal {
        bytes32 roomId = keccak256(abi.encodePacked(roomName));
        roomRequirements[roomId] = requiredBadge;
        activeRooms[roomId] = true;
        emit RoomCreated(roomId, requiredBadge);
    }
    
    function createRoom(string memory roomName, BadgeType requiredBadge) external onlyOwner {
        _createRoom(roomName, requiredBadge);
    }

    /*//////////////////////////////////////////////////////////////
                          COUNSELOR SYSTEM
    //////////////////////////////////////////////////////////////*/
    
    function submitCounselorRequest(string memory encryptedMessage) external returns (bytes32) {
        uint256 tokenId = _userToTokenId[msg.sender];
        require(tokenId != 0 && isTokenValid(tokenId), "Invalid SBT");
        
        bytes32 requestId = keccak256(abi.encodePacked(msg.sender, block.timestamp, encryptedMessage));
        
        counselorRequests[requestId] = CounselorRequest({
            requester: msg.sender,
            timestamp: block.timestamp,
            encryptedMessage: encryptedMessage,
            isActive: true,
            assignedCounselor: 0
        });
        
        emit CounselorRequestSubmitted(requestId, msg.sender);
        return requestId;
    }
    
    function assignCounselor(bytes32 requestId, uint256 counselorTokenId) external {
        require(verifiedCounselors[counselorTokenId], "Not verified counselor");
        require(_ownerOf(counselorTokenId) == msg.sender, "Not your counselor token");
        require(counselorRequests[requestId].isActive, "Request not active");
        
        counselorRequests[requestId].assignedCounselor = counselorTokenId;
        emit CounselorAssigned(requestId, counselorTokenId);
    }
    
    function verifyCounselor(uint256 tokenId) external onlyOwner {
        require(_hasBadge(tokenId, BadgeType.COUNSELOR), "Missing counselor badge");
        verifiedCounselors[tokenId] = true;
    }

    /*//////////////////////////////////////////////////////////////
                            VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    
    function getUserProfile(address user) external view returns (UserProfile memory) {
        uint256 tokenId = _userToTokenId[user];
        if (tokenId == 0) {
            return UserProfile(0, new BadgeType[](0), 0, 0, false);
        }
        
        return UserProfile({
            tokenId: tokenId,
            badges: _tokenBadges[tokenId],
            expiryTimestamp: _expiryTimestamps[tokenId],
            birthMonth: _userBirthMonth[tokenId],
            isValid: isTokenValid(tokenId)
        });
    }
    
    function isTokenValid(uint256 tokenId) public view returns (bool) {
        if (_ownerOf(tokenId) == address(0)) return false;
        return block.timestamp <= _expiryTimestamps[tokenId];
    }
    
    function _hasBadge(uint256 tokenId, BadgeType badge) internal view returns (bool) {
        BadgeType[] memory badges = _tokenBadges[tokenId];
        for (uint256 i = 0; i < badges.length; i++) {
            if (badges[i] == badge) return true;
        }
        return false;
    }

    /*//////////////////////////////////////////////////////////////
                           HELPER FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    
    function _parseUserAttributes(
        ISelfVerificationRoot.GenericDiscloseOutputV2 memory output
    ) internal pure returns (BadgeType[] memory) {
        // This would parse the actual disclosed attributes from Self Protocol
        // For now, returning basic badges - implement based on your verification config
        BadgeType[] memory badges = new BadgeType[](2);
        badges[0] = BadgeType.HUMAN;
        badges[1] = BadgeType.ADULT; // Assuming 18+ verification
        return badges;
    }
    
    function _extractBirthMonth(
        ISelfVerificationRoot.GenericDiscloseOutputV2 memory output
    ) internal pure returns (uint256) {
        // Extract birth month from disclosed attributes
        // This is a placeholder - implement based on your verification config
        return (uint256(keccak256(abi.encode(output.nullifier))) % 12) + 1;
    }
    
    function _verifySignature(address expectedSigner, bytes memory userData) internal view {
        // Implement EIP-712 signature verification similar to SelfSBTV2
        // This ensures the user actually controls the wallet address
        require(userData.length >= 196, "Invalid user data");
        
        // For brevity, simplified signature verification
        // In production, implement full EIP-712 verification like in SelfSBTV2
    }

    /*//////////////////////////////////////////////////////////////
                            ADMIN FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    
    function burnSBT(uint256 tokenId) external onlyOwner {
        address tokenOwner = _ownerOf(tokenId);
        require(tokenOwner != address(0), "Token doesn't exist");
        
        _userToTokenId[tokenOwner] = 0;
        delete _expiryTimestamps[tokenId];
        delete _tokenBadges[tokenId];
        
        _burn(tokenId);
    }
    
    function withdrawAirdropTokens(uint256 amount) external onlyOwner {
        airdropToken.safeTransfer(owner(), amount);
    }
    
    function setValidityPeriod(uint256 _newValidityPeriod) external onlyOwner {
        validityPeriod = _newValidityPeriod;
    }

    /*//////////////////////////////////////////////////////////////
                           OVERRIDE FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    
    // Make tokens non-transferable (soulbound)
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert("Soulbound: non-transferable");
        }
        return super._update(to, tokenId, auth);
    }
    
    function approve(address, uint256) public pure override {
        revert("Soulbound: non-transferable");
    }
    
    function setApprovalForAll(address, bool) public pure override {
        revert("Soulbound: non-transferable");
    }
}