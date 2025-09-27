export const CONTRACT_ADDRESSES = {
  ANONYMOUS_SUPPORT_PLATFORM: '0xdF2Ec2947DEb4eF137aAA20eE1aDFd6EE3a1Eb39',
  SUPPORT_TOKEN: '0x20D29a533Cf07F1b9f60e29C5AedD0640326b16A',
} as const

export const ANONYMOUS_SUPPORT_PLATFORM_ABI = [
  // View functions
  'function getUserProfile(address user) external view returns (tuple(uint256 tokenId, uint8[] badges, uint256 expiryTimestamp, uint256 birthMonth, bool isValid))',
  'function roomRequirements(bytes32 roomId) external view returns (uint8)',
  'function activeRooms(bytes32 roomId) external view returns (bool)',
  'function verifiedCounselors(uint256 tokenId) external view returns (bool)',
  'function totalAirdropsReceived(uint256 tokenId) external view returns (uint256)',
  'function birthdayClaimedByYear(uint256 tokenId, uint256 year) external view returns (bool)',
  'function defaultAirdropAmount() external view returns (uint256)',
  'function birthdayAirdropsEnabled() external view returns (bool)',
  
  // Write functions
  'function mintSBT(address to, uint8[] calldata badges, uint256 birthMonth) external returns (uint256)',
  'function claimBirthdayAirdrop() external returns (uint256)',
  
  // Events
  'event SBTMinted(address indexed to, uint256 indexed tokenId, uint8[] badges)',
  'event BirthdayAirdropClaimed(uint256 indexed tokenId, uint256 amount, uint256 year)',
] as const

export const SUPPORT_TOKEN_ABI = [
  'function balanceOf(address owner) external view returns (uint256)',
  'function transfer(address to, uint256 amount) external returns (bool)',
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function decimals() external view returns (uint8)',
  'function symbol() external view returns (string)',
  'function name() external view returns (string)',
] as const

export enum BadgeType {
  HUMAN = 0,
  ADULT = 1,
  PARENT = 2,
  JURISDICTION_US = 3,
  JURISDICTION_IN = 4,
  JURISDICTION_EU = 5,
  COUNSELOR = 6,
  MODERATOR = 7,
  BIRTHDAY_SPECIAL = 8,
}

export const BADGE_NAMES = {
  [BadgeType.HUMAN]: 'Human Verified',
  [BadgeType.ADULT]: 'Adult (18+)',
  [BadgeType.PARENT]: 'Parent',
  [BadgeType.JURISDICTION_US]: 'US Jurisdiction',
  [BadgeType.JURISDICTION_IN]: 'India Jurisdiction',
  [BadgeType.JURISDICTION_EU]: 'EU Jurisdiction',
  [BadgeType.COUNSELOR]: 'Verified Counselor',
  [BadgeType.MODERATOR]: 'Community Moderator',
  [BadgeType.BIRTHDAY_SPECIAL]: 'Birthday Special',
} as const