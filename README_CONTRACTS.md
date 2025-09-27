# Anonymous Support Platform - Smart Contracts

Privacy-first support platform with Self Protocol verification, birthday airdrops, and soulbound tokens.

## 🚀 Quick Start

```bash
# Install dependencies
forge install
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your configuration

# Build contracts
forge build

# Run tests
forge test -vv

# Deploy to Celo Testnet
npm run deploy:testnet
```

## 📋 Features

### Core Platform Features
- **Self Protocol Integration**: ZK-proof identity verification with SBTs
- **Privacy-First Design**: Anonymous verification with pseudonymous wallets
- **Room Access Control**: Badge-gated support rooms (18+, Parents, Jurisdiction-specific)
- **Counselor System**: Anonymous encrypted counselor requests with verified professionals
- **Soulbound Tokens**: Non-transferable identity badges

### Birthday Airdrop System 🎂
- **Monthly Birthday Rewards**: Users get airdrop tokens on their birth month
- **Customizable Amounts**: Different airdrop amounts per month (holidays get more!)
- **Special Birthday Badge**: First-time claimers get a special badge
- **Anti-Gaming Protection**: One claim per year, requires valid SBT

### Badge Types
- `HUMAN` - Basic human verification
- `ADULT` - 18+ age verification
- `PARENT` - Parent status verification
- `JURISDICTION_US/IN/EU` - Location-based verification
- `COUNSELOR` - Professional counselor verification
- `MODERATOR` - Community moderator status
- `BIRTHDAY_SPECIAL` - Special birthday badge

## 🏗️ Architecture

### Contract Structure
```
AnonymousSupportPlatform.sol     # Main platform contract
├── SelfVerificationRoot         # Self Protocol integration
├── ERC721                       # NFT functionality for SBTs
├── Ownable                      # Access control
└── Birthday Airdrop System      # Token rewards

MockERC20.sol                    # Test token for airdrops
DeployAnonymousSupport.s.sol     # Deployment script
```

### Key Components

#### 1. Self Protocol Integration
```solidity
function customVerificationHook(
    ISelfVerificationRoot.GenericDiscloseOutputV2 memory output,
    bytes memory userData
) internal override {
    // Handles 4 verification cases:
    // 1. New user → mint SBT
    // 2. User with new document → update badges  
    // 3. Recovery scenario → restore burned token
    // 4. Existing user refresh → update expiry
}
```

#### 2. Birthday Airdrop System
```solidity
function claimBirthdayAirdrop() external {
    // Verify user has valid SBT
    // Check it's their birth month
    // Ensure not already claimed this year
    // Transfer tokens + add special badge
}
```

#### 3. Room Access Control
```solidity
function canAccessRoom(address user, bytes32 roomId) external view returns (bool) {
    // Check user has valid SBT
    // Verify required badge for room
    // Return access permission
}
```

## 🔧 Configuration

### Verification Config
The platform uses Self Protocol's verification system with these requirements:
- **Minimum Age**: 18 years old
- **Forbidden Countries**: None (configurable)
- **OFAC Screening**: Disabled for privacy
- **Disclosed Attributes**: Age range, jurisdiction, parent status

### Default Rooms
- `adult_support` - Requires ADULT badge
- `parents_circle` - Requires PARENT badge  
- `us_legal_help` - Requires JURISDICTION_US badge
- `india_legal_help` - Requires JURISDICTION_IN badge
- `eu_legal_help` - Requires JURISDICTION_EU badge

### Birthday Airdrop Amounts
```solidity
// Default: 100 tokens per month
// Special months get bonuses:
January: 150 tokens   // New Year bonus
July: 200 tokens      // Summer bonus  
December: 250 tokens  // Holiday bonus
```

## 🚀 Deployment

### Prerequisites
1. **Celo Wallet**: Funded with CELO for gas
2. **Self API Key**: From Self Protocol dashboard
3. **Verification Config**: Created via Self Protocol

### Deploy to Celo Testnet
```bash
# Set environment variables
export PRIVATE_KEY="your_private_key"
export CELO_TESTNET_RPC="https://alfajores-forno.celo-testnet.org"

# Deploy
forge script contracts/deploy/DeployAnonymousSupport.s.sol:DeployAnonymousSupport \
  --rpc-url $CELO_TESTNET_RPC \
  --broadcast \
  --verify
```

### Deploy to Celo Mainnet
```bash
# Use mainnet RPC
export CELO_MAINNET_RPC="https://forno.celo.org"

forge script contracts/deploy/DeployAnonymousSupport.s.sol:DeployAnonymousSupport \
  --rpc-url $CELO_MAINNET_RPC \
  --broadcast \
  --verify
```

## 🧪 Testing

### Run All Tests
```bash
forge test -vv
```

### Test Coverage
```bash
forge coverage
```

### Gas Report
```bash
forge test --gas-report
```

### Test Specific Functions
```bash
# Test birthday airdrop system
forge test --match-test "testBirthday" -vv

# Test room access control  
forge test --match-test "testRoom" -vv

# Test Self Protocol integration
forge test --match-test "testVerification" -vv
```

## 📊 Contract Interactions

### For Users
```solidity
// Check user profile and badges
UserProfile memory profile = platform.getUserProfile(userAddress);

// Check room access
bool canAccess = platform.canAccessRoom(userAddress, roomId);

// Claim birthday airdrop (if eligible)
platform.claimBirthdayAirdrop();

// Submit counselor request
bytes32 requestId = platform.submitCounselorRequest("encrypted_message");
```

### For Counselors
```solidity
// Assign to counselor request
platform.assignCounselor(requestId, counselorTokenId);
```

### For Admins
```solidity
// Create new room
platform.createRoom("crisis_support", BadgeType.ADULT);

// Set monthly airdrop amounts
platform.setMonthlyAirdropAmount(6, 150 * 10**18);

// Verify counselor
platform.verifyCounselor(tokenId);

// Emergency burn SBT
platform.burnSBT(tokenId);
```

## 🔐 Security Features

### Soulbound Tokens
- **Non-transferable**: Tokens cannot be moved between addresses
- **Burn & Recovery**: Admin can burn tokens for recovery scenarios
- **Nullifier Protection**: Prevents replay attacks and cross-user theft

### Privacy Protection
- **Pseudonymous Wallets**: No KYC required, only ZK proofs
- **Encrypted Counselor Requests**: Messages encrypted client-side
- **Minimal Metadata**: Only essential verification attributes stored

### Access Control
- **Owner Functions**: Protected by Ownable pattern
- **Badge Verification**: All room access gated by verified badges
- **Signature Verification**: EIP-712 signatures prevent impersonation

## 🎯 Integration with Frontend

### Contract Addresses (after deployment)
```javascript
const PLATFORM_ADDRESS = "0x..."; // From deployment output
const AIRDROP_TOKEN_ADDRESS = "0x..."; // From deployment output
const VERIFICATION_CONFIG_ID = "0x..."; // From deployment output
```

### Key Functions for Frontend
```javascript
// Check if user can claim birthday airdrop
const currentMonth = new Date().getMonth() + 1;
const profile = await contract.getUserProfile(userAddress);
const canClaim = profile.birthMonth === currentMonth && 
                !await contract.birthdayClaimedByYear(profile.tokenId, currentYear);

// Check room access before joining
const canJoinRoom = await contract.canAccessRoom(userAddress, roomId);

// Get user's verification badges
const profile = await contract.getUserProfile(userAddress);
console.log("User badges:", profile.badges);
```

## 📈 Monitoring & Analytics

### Events to Track
- `SBTMinted` - New user verifications
- `BirthdayAirdropClaimed` - Airdrop usage
- `CounselorRequestSubmitted` - Support requests
- `RoomCreated` - Platform growth

### Key Metrics
- Total verified users
- Monthly airdrop claims
- Room activity levels
- Counselor response times

## 🛠️ Troubleshooting

### Common Issues

**"Chain not supported"**
- Update Foundry: `foundryup --install 0.3.0`
- Verify RPC URL is correct

**"Verification config not found"**
- Ensure config is created via Self Protocol first
- Check config ID matches deployment script

**"Insufficient gas"**
- Increase gas limit in deployment
- Check wallet has enough CELO

### Debug Commands
```bash
# Check contract deployment
cast call $CONTRACT_ADDRESS "owner()" --rpc-url $RPC_URL

# Verify verification config
cast call $CONTRACT_ADDRESS "verificationConfigId()" --rpc-url $RPC_URL

# Check airdrop token balance
cast call $AIRDROP_TOKEN "balanceOf(address)" $CONTRACT_ADDRESS --rpc-url $RPC_URL
```

## 📚 Resources

- [Self Protocol Docs](https://docs.self.xyz/)
- [Celo Developer Docs](https://docs.celo.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Foundry Book](https://book.getfoundry.sh/)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Run tests: `forge test`
4. Commit changes: `git commit -m 'Add amazing feature'`
5. Push to branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.