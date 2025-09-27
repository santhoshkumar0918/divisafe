// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {SelfVerificationRoot} from "@selfxyz/contracts/contracts/abstract/SelfVerificationRoot.sol";
import {ISelfVerificationRoot} from "@selfxyz/contracts/contracts/interfaces/ISelfVerificationRoot.sol";
import {IIdentityVerificationHubV2} from "@selfxyz/contracts/contracts/interfaces/IIdentityVerificationHubV2.sol";
import {SelfStructs} from "@selfxyz/contracts/contracts/libraries/SelfStructs.sol";
import {SelfUtils} from "@selfxyz/contracts/contracts/libraries/SelfUtils.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ECDSA } from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { MerkleProof } from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

/**
 * @title AnonymousSupportPlatformTest
 * @notice Test version without hub validation for deployment
 */
contract AnonymousSupportPlatformTest is SelfVerificationRoot, ERC721, Ownable {
    using ECDSA for bytes32;
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
        BIRTHDAY_SPECIAL
    }

    // State variables
    mapping(uint256 nullifier => uint256 tokenId) internal _nullifierToTokenId;
    mapping(address user => uint256 tokenId) internal _userToTokenId;
    mapping(uint256 tokenId => BadgeType[]) internal _tokenBadges;
    mapping(uint256 tokenId => uint256 expiryTimestamp) internal _expiryTimestamps;
    mapping(uint256 tokenId => uint256 birthMonth) internal _userBirthMonth;
    
    mapping(bytes32 roomId => BadgeType requiredBadge) public roomRequirements;
    mapping(bytes32 roomId => bool isActive) public activeRooms;
    
    mapping(uint256 month => uint256 airdropAmount) public monthlyAirdropAmounts;
    mapping(uint256 tokenId => mapping(uint256 year => bool)) public birthdayClaimedByYear;
    mapping(uint256 tokenId => uint256 totalAirdropsClaimed) public totalAirdropsReceived;
    
    mapping(uint256 tokenId => bool) public verifiedCounselors;
    
    uint64 internal _nextTokenId;
    uint256 public validityPeriod;
    bytes32 public verificationConfigId;
    IERC20 public airdropToken;
    uint256 public defaultAirdropAmount;
    bool public birthdayAirdropsEnabled;
    
    bytes32 public immutable DOMAIN_SEPARATOR;
    bytes32 public constant VERIFY_IDENTITY_TYPEHASH = 
        keccak256("VerifyIdentity(address wallet,uint256 timestamp)");
    uint256 public constant MAX_SIGNATURE_AGE = 600;

    struct UserProfile {
        uint256 tokenId;
        BadgeType[] badges;
        uint256 expiryTimestamp;
        uint256 birthMonth;
        bool isValid;
    }

    event SBTMinted(address indexed to, uint256 indexed tokenId, BadgeType[] badges);
    event BirthdayAirdropClaimed(uint256 indexed tokenId, uint256 amount, uint256 year);

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
        ERC721("AnonymousSupportSBT", "ASSBT")
        Ownable(_owner)
    {
        // Skip hub validation for testing
        verificationConfigId = _verificationConfigId;
        validityPeriod = _validityPeriod;
        airdropToken = IERC20(_airdropToken);
        defaultAirdropAmount = _defaultAirdropAmount;
        birthdayAirdropsEnabled = true;
        _nextTokenId = 1;

        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes("Anonymous Support Platform")),
                keccak256(bytes("1")),
                block.chainid,
                address(this)
            )
        );
    }

    function mintSBT(address to, BadgeType[] calldata badges, uint256 birthMonth) external onlyOwner returns (uint256) {
        require(to != address(0), "Invalid address");
        require(badges.length > 0, "No badges provided");
        require(birthMonth >= 1 && birthMonth <= 12, "Invalid birth month");
        
        uint256 tokenId = _nextTokenId++;
        _mint(to, tokenId);
        
        _tokenBadges[tokenId] = badges;
        _userToTokenId[to] = tokenId;
        _expiryTimestamps[tokenId] = block.timestamp + validityPeriod;
        _userBirthMonth[tokenId] = birthMonth;
        
        emit SBTMinted(to, tokenId, badges);
        return tokenId;
    }

    function claimBirthdayAirdrop() external returns (uint256) {
        require(birthdayAirdropsEnabled, "Airdrops disabled");
        
        uint256 tokenId = _userToTokenId[msg.sender];
        require(tokenId != 0, "No SBT found");
        require(_expiryTimestamps[tokenId] > block.timestamp, "SBT expired");
        
        uint256 currentYear = (block.timestamp / 365 days) + 1970;
        require(!birthdayClaimedByYear[tokenId][currentYear], "Already claimed this year");
        
        birthdayClaimedByYear[tokenId][currentYear] = true;
        totalAirdropsReceived[tokenId]++;
        
        uint256 airdropAmount = defaultAirdropAmount;
        airdropToken.safeTransfer(msg.sender, airdropAmount);
        
        emit BirthdayAirdropClaimed(tokenId, airdropAmount, currentYear);
        return airdropAmount;
    }

    function getUserProfile(address user) external view returns (UserProfile memory) {
        uint256 tokenId = _userToTokenId[user];
        if (tokenId == 0) {
            return UserProfile(0, new BadgeType[](0), 0, 0, false);
        }
        
        return UserProfile(
            tokenId,
            _tokenBadges[tokenId],
            _expiryTimestamps[tokenId],
            _userBirthMonth[tokenId],
            _expiryTimestamps[tokenId] > block.timestamp
        );
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return string(abi.encodePacked("https://api.anonymous-support.com/metadata/", tokenId));
    }

    // Prevent transfers (SBT)
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert("SBT: Transfer not allowed");
        }
        return super._update(to, tokenId, auth);
    }
}