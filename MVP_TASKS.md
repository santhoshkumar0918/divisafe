# MVP Task Breakdown - Anonymous Support Platform

## Phase 1: Core Infrastructure (Days 1-2)

### Task 1.1: Project Setup & Dependencies
**Priority:** Critical
**Estimate:** 4 hours

```bash
# Initialize Next.js with TypeScript
npx create-next-app@latest anonymous-support --typescript --tailwind --app

# Core dependencies
npm install @self-id/sdk @self-id/web ethers wagmi viem
npm install @matrix-org/matrix-js-sdk libp2p
npm install @ceramic-network/http-client @ceramic-network/stream-tile
npm install crypto-js tweetnacl tweetnacl-util
```

**Deliverable:** Working Next.js app with all dependencies installed

### Task 1.2: Self SDK Integration - QR Code Widget
**Priority:** Critical  
**Estimate:** 6 hours

```typescript
// lib/self-integration.ts
import { SelfSDK } from '@self-id/sdk'
import { ethers } from 'ethers'

export class SelfVerification {
  private sdk: SelfSDK
  
  constructor() {
    this.sdk = new SelfSDK({
      network: 'celo-testnet',
      apiKey: process.env.NEXT_PUBLIC_SELF_API_KEY
    })
  }

  // Generate QR code for verification
  async generateVerificationQR(attributes: string[]) {
    const session = await this.sdk.createVerificationSession({
      attributes: attributes, // ['human', 'age_range', 'jurisdiction']
      callback_url: `${window.location.origin}/verify/callback`
    })
    
    return {
      qrCode: session.qr_code,
      sessionId: session.id
    }
  }

  // Verify proof and mint SBT
  async verifyAndMintSBT(proofToken: string, userWallet: string) {
    const verification = await this.sdk.verifyProof(proofToken)
    
    if (verification.valid) {
      // Mint SBT to user's pseudonymous wallet
      const sbtTx = await this.mintVerificationSBT(
        userWallet, 
        verification.attributes
      )
      return { success: true, sbtAddress: sbtTx.address }
    }
    
    throw new Error('Verification failed')
  }
}
```

**Deliverable:** Working Self QR code generation and verification flow

### Task 1.3: Pseudonymous Wallet Generation
**Priority:** Critical
**Estimate:** 3 hours

```typescript
// lib/wallet-manager.ts
import { ethers } from 'ethers'
import { encrypt, decrypt } from 'crypto-js/aes'

export class PseudonymousWallet {
  static generate(): { wallet: ethers.Wallet, encryptedKey: string } {
    const wallet = ethers.Wallet.createRandom()
    
    // Store encrypted private key in localStorage
    const encryptedKey = encrypt(
      wallet.privateKey, 
      'user-session-' + Date.now()
    ).toString()
    
    localStorage.setItem('anon_wallet', encryptedKey)
    
    return { wallet, encryptedKey }
  }

  static restore(): ethers.Wallet | null {
    const encrypted = localStorage.getItem('anon_wallet')
    if (!encrypted) return null
    
    try {
      const decrypted = decrypt(encrypted, 'user-session-key').toString()
      return new ethers.Wallet(decrypted)
    } catch {
      return null
    }
  }
}
```

**Deliverable:** Client-side pseudonymous wallet creation and management

## Phase 2: SBT Smart Contracts (Day 2)

### Task 2.1: Deploy SBT Contract on Celo Testnet
**Priority:** Critical
**Estimate:** 4 hours

```solidity
// contracts/src/VerificationSBT.sol
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VerificationSBT is ERC721, Ownable {
    struct VerificationBadge {
        string badgeType; // "adult", "parent", "jurisdiction_IN"
        uint256 issuedAt;
        bool revoked;
    }
    
    mapping(uint256 => VerificationBadge) public badges;
    mapping(address => uint256[]) public userBadges;
    uint256 private _tokenIdCounter;
    
    constructor() ERC721("AnonSupportSBT", "ASSBT") {}
    
    function mintVerificationBadge(
        address to, 
        string memory badgeType
    ) external onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter++;
        _mint(to, tokenId);
        
        badges[tokenId] = VerificationBadge({
            badgeType: badgeType,
            issuedAt: block.timestamp,
            revoked: false
        });
        
        userBadges[to].push(tokenId);
        return tokenId;
    }
    
    // Non-transferable
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        require(from == address(0), "SBT: non-transferable");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
}
```

**Deliverable:** Deployed SBT contract on Celo testnet with minting functionality

### Task 2.2: SBT Integration with Frontend
**Priority:** High
**Estimate:** 3 hours

```typescript
// lib/sbt-manager.ts
import { ethers } from 'ethers'

const SBT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_SBT_CONTRACT
const SBT_ABI = [...] // Contract ABI

export class SBTManager {
  private contract: ethers.Contract
  
  constructor(signer: ethers.Signer) {
    this.contract = new ethers.Contract(SBT_CONTRACT_ADDRESS, SBT_ABI, signer)
  }
  
  async getUserBadges(address: string): Promise<string[]> {
    const tokenIds = await this.contract.userBadges(address)
    const badges = []
    
    for (const tokenId of tokenIds) {
      const badge = await this.contract.badges(tokenId)
      if (!badge.revoked) {
        badges.push(badge.badgeType)
      }
    }
    
    return badges
  }
  
  async hasRequiredBadge(address: string, required: string): Promise<boolean> {
    const badges = await this.getUserBadges(address)
    return badges.includes(required)
  }
}
```

**Deliverable:** Frontend can read user's SBT badges and gate access

## Phase 3: P2P Messaging Foundation (Days 3-4)

### Task 3.1: Matrix Client Setup
**Priority:** High
**Estimate:** 6 hours

```typescript
// lib/matrix-client.ts
import { createClient, MatrixClient } from 'matrix-js-sdk'

export class AnonymousMatrixClient {
  private client: MatrixClient
  private userId: string
  
  async initialize(pseudonymousId: string) {
    this.userId = `@anon_${pseudonymousId}:matrix.org`
    
    this.client = createClient({
      baseUrl: "https://matrix.org",
      userId: this.userId,
      deviceId: `anon_device_${Date.now()}`
    })
    
    // Register anonymous user
    await this.client.register('guest', '', '', {
      type: 'm.login.dummy'
    })
    
    await this.client.startClient()
  }
  
  async joinGatedRoom(roomId: string, sbtProof: string) {
    // Verify SBT proof before joining
    const verified = await this.verifySBTAccess(sbtProof)
    if (!verified) throw new Error('Access denied')
    
    await this.client.joinRoom(roomId)
  }
  
  async sendEncryptedMessage(roomId: string, message: string) {
    await this.client.sendTextMessage(roomId, message)
  }
}
```

**Deliverable:** Anonymous Matrix client with room joining and messaging

### Task 3.2: Room Gating Logic
**Priority:** High
**Estimate:** 4 hours

```typescript
// lib/room-gating.ts
export interface GatedRoom {
  id: string
  name: string
  description: string
  requiredBadge: string
  memberCount: number
}

export const GATED_ROOMS: GatedRoom[] = [
  {
    id: '!adult_support:matrix.org',
    name: '18+ Emotional Support',
    description: 'Safe space for adult emotional support',
    requiredBadge: 'adult',
    memberCount: 0
  },
  {
    id: '!parents_circle:matrix.org', 
    name: 'Parents Circle',
    description: 'Support for verified parents',
    requiredBadge: 'parent',
    memberCount: 0
  }
]

export class RoomGatekeeper {
  async canUserJoinRoom(userAddress: string, roomId: string): Promise<boolean> {
    const room = GATED_ROOMS.find(r => r.id === roomId)
    if (!room) return false
    
    const sbtManager = new SBTManager(/* signer */)
    return await sbtManager.hasRequiredBadge(userAddress, room.requiredBadge)
  }
}
```

**Deliverable:** Room access control based on SBT badges

## Phase 4: Core UI Components (Day 4-5)

### Task 4.1: Landing Page with Self Integration
**Priority:** High
**Estimate:** 4 hours

```typescript
// app/page.tsx
'use client'
import { useState } from 'react'
import { SelfVerification } from '@/lib/self-integration'

export default function LandingPage() {
  const [qrCode, setQrCode] = useState<string>('')
  const [verifying, setVerifying] = useState(false)
  
  const startVerification = async () => {
    setVerifying(true)
    const selfSDK = new SelfVerification()
    
    const { qrCode } = await selfSDK.generateVerificationQR([
      'human', 'age_range', 'jurisdiction'
    ])
    
    setQrCode(qrCode)
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Anonymous Support, Verified Safety
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Get verified support without compromising your privacy
          </p>
          
          <button 
            onClick={startVerification}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700"
          >
            Get Verified with Self
          </button>
        </div>
        
        {qrCode && (
          <div className="text-center">
            <img src={qrCode} alt="Verification QR Code" className="mx-auto" />
            <p className="mt-4 text-gray-600">Scan with Self mobile app</p>
          </div>
        )}
      </div>
    </div>
  )
}
```

**Deliverable:** Landing page with Self QR verification flow

### Task 4.2: Anonymous Dashboard
**Priority:** High
**Estimate:** 5 hours

```typescript
// app/dashboard/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { SBTManager } from '@/lib/sbt-manager'
import { GATED_ROOMS } from '@/lib/room-gating'

export default function Dashboard() {
  const [userBadges, setUserBadges] = useState<string[]>([])
  const [availableRooms, setAvailableRooms] = useState<GatedRoom[]>([])
  
  useEffect(() => {
    loadUserData()
  }, [])
  
  const loadUserData = async () => {
    const wallet = PseudonymousWallet.restore()
    if (!wallet) return
    
    const sbtManager = new SBTManager(wallet)
    const badges = await sbtManager.getUserBadges(wallet.address)
    setUserBadges(badges)
    
    // Filter rooms user can access
    const accessible = GATED_ROOMS.filter(room => 
      badges.includes(room.requiredBadge)
    )
    setAvailableRooms(accessible)
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Your Verification Badges</h2>
          <div className="flex gap-2">
            {userBadges.map(badge => (
              <span key={badge} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                ✓ {badge}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4">Available Support Rooms</h2>
          <div className="grid gap-4">
            {availableRooms.map(room => (
              <div key={room.id} className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">{room.name}</h3>
                <p className="text-gray-600 mb-4">{room.description}</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Join Room
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
```

**Deliverable:** Dashboard showing user badges and accessible rooms

### Task 4.3: Basic Chat Interface
**Priority:** Medium
**Estimate:** 6 hours

```typescript
// app/chat/[roomId]/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { AnonymousMatrixClient } from '@/lib/matrix-client'

export default function ChatRoom({ params }: { params: { roomId: string } }) {
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [client, setClient] = useState<AnonymousMatrixClient>()
  
  useEffect(() => {
    initializeChat()
  }, [])
  
  const initializeChat = async () => {
    const wallet = PseudonymousWallet.restore()
    const matrixClient = new AnonymousMatrixClient()
    
    await matrixClient.initialize(wallet.address.slice(2, 10))
    await matrixClient.joinGatedRoom(params.roomId, 'sbt-proof-here')
    
    setClient(matrixClient)
  }
  
  const sendMessage = async () => {
    if (!client || !newMessage.trim()) return
    
    await client.sendEncryptedMessage(params.roomId, newMessage)
    setNewMessage('')
  }
  
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className="bg-white p-3 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">
              Anonymous User • {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
            <div>{msg.content}</div>
          </div>
        ))}
      </div>
      
      <div className="border-t p-4">
        <div className="flex gap-2">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border rounded-lg px-3 py-2"
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button 
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
```

**Deliverable:** Basic encrypted chat interface for gated rooms

## Phase 5: Legal Resources & Professional Portal (Day 5-6)

### Task 5.1: Jurisdiction-Gated Legal Resources
**Priority:** Medium
**Estimate:** 4 hours

```typescript
// app/legal/page.tsx
export default function LegalResources() {
  const [userJurisdiction, setUserJurisdiction] = useState<string>('')
  const [resources, setResources] = useState<any[]>([])
  
  const legalResources = {
    'IN': [
      { title: 'Domestic Violence Protection Act', url: '/resources/dv-india.pdf' },
      { title: 'Consumer Protection Guide', url: '/resources/consumer-india.pdf' }
    ],
    'US': [
      { title: 'Restraining Order Process', url: '/resources/restraining-us.pdf' },
      { title: 'Tenant Rights Guide', url: '/resources/tenant-us.pdf' }
    ]
  }
  
  useEffect(() => {
    loadUserJurisdiction()
  }, [])
  
  const loadUserJurisdiction = async () => {
    const wallet = PseudonymousWallet.restore()
    const sbtManager = new SBTManager(wallet)
    const badges = await sbtManager.getUserBadges(wallet.address)
    
    const jurisdictionBadge = badges.find(b => b.startsWith('jurisdiction_'))
    if (jurisdictionBadge) {
      const jurisdiction = jurisdictionBadge.split('_')[1]
      setUserJurisdiction(jurisdiction)
      setResources(legalResources[jurisdiction] || [])
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Legal Resources</h1>
      
      {userJurisdiction && (
        <div className="mb-4">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            Verified: {userJurisdiction}
          </span>
        </div>
      )}
      
      <div className="grid gap-4">
        {resources.map((resource, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
            <a 
              href={resource.url}
              className="text-blue-600 hover:text-blue-800"
              target="_blank"
            >
              Download PDF →
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
```

**Deliverable:** Jurisdiction-specific legal resources

### Task 5.2: Anonymous Counselor Request
**Priority:** Medium
**Estimate:** 3 hours

```typescript
// app/counselor/page.tsx
export default function CounselorRequest() {
  const [request, setRequest] = useState('')
  const [submitted, setSubmitted] = useState(false)
  
  const submitRequest = async () => {
    const wallet = PseudonymousWallet.restore()
    
    // Encrypt request with counselor's public key
    const encryptedRequest = await encryptForCounselor(request)
    
    // Submit to counselor queue
    await fetch('/api/counselor-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        encryptedRequest,
        userHandle: `anon_${wallet.address.slice(2, 10)}`,
        timestamp: Date.now()
      })
    })
    
    setSubmitted(true)
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Request Counselor Support</h1>
      
      {!submitted ? (
        <div>
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">
              Your request will be encrypted and sent anonymously to verified counselors. 
              No personal information is shared.
            </p>
          </div>
          
          <textarea
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            placeholder="Describe what kind of support you're looking for..."
            className="w-full h-32 border rounded-lg p-3 mb-4"
          />
          
          <button 
            onClick={submitRequest}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Submit Anonymous Request
          </button>
        </div>
      ) : (
        <div className="text-center p-8">
          <div className="text-green-600 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold mb-2">Request Submitted</h2>
          <p className="text-gray-600">
            A verified counselor will respond to your encrypted request soon.
          </p>
        </div>
      )}
    </div>
  )
}
```

**Deliverable:** Anonymous counselor request system

## Phase 6: Testing & Demo Prep (Day 6-7)

### Task 6.1: End-to-End Testing
**Priority:** Critical
**Estimate:** 4 hours

- Test Self QR verification flow
- Test SBT minting and badge verification  
- Test room access gating
- Test encrypted messaging
- Test counselor request flow

### Task 6.2: Demo Script & Data
**Priority:** High
**Estimate:** 2 hours

Create demo accounts with different badge combinations:
- Adult user (can access 18+ rooms)
- Parent user (can access parent rooms + adult rooms)
- India jurisdiction user (can access IN legal resources)

### Task 6.3: Deployment
**Priority:** High
**Estimate:** 3 hours

- Deploy to Vercel
- Configure environment variables
- Test on mobile devices
- Prepare demo walkthrough

## Environment Variables Needed

```bash
# .env.local
NEXT_PUBLIC_SELF_API_KEY=your_self_api_key
NEXT_PUBLIC_SBT_CONTRACT=deployed_sbt_contract_address
NEXT_PUBLIC_CELO_RPC=https://alfajores-forno.celo-testnet.org
MATRIX_HOMESERVER=https://matrix.org
```

## Success Metrics for MVP

1. ✅ User can verify with Self QR and receive SBT
2. ✅ Dashboard shows user's verification badges
3. ✅ Room access properly gated by SBT badges
4. ✅ Basic encrypted messaging works
5. ✅ Legal resources filtered by jurisdiction
6. ✅ Anonymous counselor requests submitted
7. ✅ Full flow works on mobile

## Post-MVP Enhancements

- WebRTC voice/video calls
- IPFS document vault
- ZK-proof moderation system
- Professional counselor portal
- Reputation system with zk-accumulators

This MVP focuses on the core Self SDK integration with practical privacy features that judges can immediately understand and test.