# Basic Integration

{% hint style="danger" %}
**Troubleshooting Celo Sepolia**: If you encounter a `Chain 11142220 not supported` error when deploying to Celo Sepolia, try to update Foundry to version 0.3.0:

```bash
foundryup --install 0.3.0
```

{% endhint %}

## Overview

The `@selfxyz/contracts` SDK provides you with a `SelfVerificationRoot` abstract contract that wires your contract to the Identity Verification Hub V2. Your contract receives a callback with disclosed, verified attributes only after the proof succeeds.

### Key flow

1. Your contract exposes `verifySelfProof(bytes proofPayload, bytes userContextData)` from the abstract contract.
2. It takes a verification config from your contract and forwards a packed input to Hub V2.
3. If the proof is valid, the Hub calls back your contract’s `onVerificationSuccess(bytes output, bytes userData)` .
4. You implement custom logic in `customVerificationHook(...)`.

## SelfVerificationRoot

This is an abstract contract that you must override by providing custom logic for returning a config id along with a hook that is called with the disclosed attributes. Here's what you need to override:

### 1. `getConfigId`

```solidity
function getConfigId(
    bytes32 destinationChainId,
    bytes32 userIdentifier,
    bytes memory userDefinedData
) public view virtual override returns (bytes32) 
```

Return the **verification config ID** that the hub should enforce for this request. In simple cases, you may store a single config ID in storage and return it. In advanced cases, compute a dynamic config id based on the inputs.

**Example (static config):**

```solidity
bytes32 public verificationConfigId;

function getConfigId(
    bytes32, bytes32, bytes memory
) public view override returns (bytes32) {
    return verificationConfigId;
}
```

### 2. `customVerificationHook`

```solidity
function customVerificationHook(
    ISelfVerificationRoot.GenericDiscloseOutputV2 memory output,
    bytes memory userData
) internal virtual override
```

This is called **after** hub verification succeeds. Use it to:

* Mark the user as verified
* Mint/allowlist/gate features
* Emit events or write your own structs

## Constructor & Scope

```solidity
constructor(
    address hubV2, 
    string memory scopeSeed
) SelfVerificationRoot(hubV2, scopeSeed) {}
```

`SelfVerificationRoot` computes a **scope** at deploy time:

* It Poseidon‑hashes the **contract address** (chunked) with your **`scopeSeed`** to produce a unique `uint256` scope.
* The hub enforces that **submitted proofs match this scope**.

Why scope matters:

* Prevents cross‑contract proof replay.
* Allow anonymity between different applications as the nullifier is calculated as a function of the scope.

**Guidelines**

* Keep `scopeSeed` short (≤31 ASCII bytes). Example: `"proof-of-human"`.
* **Changing contract address changes the scope** (by design). Re‑deploys will need a fresh frontend config.
* You can read the current scope on‑chain via `function scope() public view returns (uint256)`.

{% hint style="info" %}
You can get the hub addresses from [deployed-contracts](https://docs.self.xyz/contract-integration/deployed-contracts "mention")
{% endhint %}

## Setting Verification Configs

A verification config is simply what you want to verify your user against. Your contract must reference a **verification config** that the hub recognizes. Typical steps:

1. **Format and register** the config off‑chain or in a setup contract:

```solidity
SelfStructs.VerificationConfigV2 public verificationConfig;
bytes32 public verificationConfigId;

constructor(
    address hubV2, 
    string memory scopeSeed, 
    SelfUtils.UnformattedVerificationConfigV2 memory rawCfg
) SelfVerificationRoot(hubV2, scopeSeed) {
    // 1) Format the human‑readable struct into the on‑chain wire format
    verificationConfig = SelfUtils.formatVerificationConfigV2(rawCfg);

    // 2) Register the config in the Hub. **This call RETURNS the configId.**
    verificationConfigId = IIdentityVerificationHubV2(hubV2).setVerificationConfigV2(verificationConfig);
}
```

2. **Return the config id** from `getConfigId(...)` (static or dynamic):

```solidity
function getConfigId(
    bytes32, 
    bytes32, 
    bytes memory
) public view override returns (bytes32) {
    return verificationConfigId;
}
```

Here's how you would create a raw config:

```solidity
import { SelfUtils } from "@selfxyz/contracts/contracts/libraries/SelfUtils.sol";

//inside your contract
string[] memory forbiddenCountries = new string[](1);
  forbiddenCountries[0] = CountryCodes.UNITED_STATES;
  SelfUtils.UnformattedVerificationConfigV2 memory verificationConfig = SelfUtils.UnformattedVerificationConfigV2({
    olderThan: 18,
    forbiddenCountries: forbiddenCountries,
    ofacEnabled: false
});

```

{% hint style="warning" %}
Only a maximum of 40 countries are allowed!
{% endhint %}

### Frontend ↔ Contract config must match

{% hint style="danger" %}
The **frontend disclosure/verification config** used to produce the proof must **exactly match** the **contract’s verification config** (the `configId` you return). Otherwise the hub will detect a **mismatch** and verification fails.
{% endhint %}

Common pitfalls:

* Frontend uses `minimumAge: 18` but contract config expects `21` .
* Frontend uses different **scope** (e.g., points to a different contract address or uses a different `scopeSeed`).

{% hint style="success" %}
**Best practice:** Generate the config **once**, register it with the hub to get `configId`, and reference that same id in your dApp’s builder payload.
{% endhint %}

## Minimal Example: Proof Of Human

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {SelfVerificationRoot} from "@selfxyz/contracts/contracts/abstract/SelfVerificationRoot.sol";
import {ISelfVerificationRoot} from "@selfxyz/contracts/contracts/interfaces/ISelfVerificationRoot.sol";
import {SelfStructs} from "@selfxyz/contracts/contracts/libraries/SelfStructs.sol";
import {SelfUtils} from "@selfxyz/contracts/contracts/libraries/SelfUtils.sol";
import {IIdentityVerificationHubV2} from "@selfxyz/contracts/contracts/interfaces/IIdentityVerificationHubV2.sol";

/**
 * @title ProofOfHuman
 * @notice Test implementation of SelfVerificationRoot for the docs
 * @dev This contract provides a concrete implementation of the abstract SelfVerificationRoot
 */
contract ProofOfHuman is SelfVerificationRoot {
    // Storage for testing purposes
    SelfStructs.VerificationConfigV2 public verificationConfig;
    bytes32 public verificationConfigId;

    // Events for testing
    event VerificationCompleted(
        ISelfVerificationRoot.GenericDiscloseOutputV2 output,
        bytes userData
    );

    /**
     * @notice Constructor for the test contract
     * @param identityVerificationHubV2Address The address of the Identity Verification Hub V2
     */
    constructor(
        address identityVerificationHubV2Address,
        uint256 scopeSeed,
        SelfUtils.UnformattedVerificationConfigV2 memory _verificationConfig
    ) SelfVerificationRoot(identityVerificationHubV2Address, scopeSeed) {
        verificationConfig = 
            SelfUtils.formatVerificationConfigV2(_verificationConfig);
        verificationConfigId = 
            IIdentityVerificationHubV2(identityVerificationHubV2Address)
            .setVerificationConfigV2(verificationConfig);
    }
    
    /**
     * @notice Implementation of customVerificationHook for testing
     * @dev This function is called by onVerificationSuccess after hub address validation
     * @param output The verification output from the hub
     * @param userData The user data passed through verification
     */
    function customVerificationHook(
        ISelfVerificationRoot.GenericDiscloseOutputV2 memory output,
        bytes memory userData
    ) internal override {
        emit VerificationCompleted(output, userData);
    }

    function getConfigId(
        bytes32 /* destinationChainId */,
        bytes32 /* userIdentifier */,
        bytes memory /* userDefinedData */
    ) public view override returns (bytes32) {
        return verificationConfigId;
    }
}
```

# Basic Integration

{% hint style="danger" %}
**Troubleshooting Celo Sepolia**: If you encounter a `Chain 11142220 not supported` error when deploying to Celo Sepolia, try to update Foundry to version 0.3.0:

```bash
foundryup --install 0.3.0
```

{% endhint %}

## Overview

The `@selfxyz/contracts` SDK provides you with a `SelfVerificationRoot` abstract contract that wires your contract to the Identity Verification Hub V2. Your contract receives a callback with disclosed, verified attributes only after the proof succeeds.

### Key flow

1. Your contract exposes `verifySelfProof(bytes proofPayload, bytes userContextData)` from the abstract contract.
2. It takes a verification config from your contract and forwards a packed input to Hub V2.
3. If the proof is valid, the Hub calls back your contract’s `onVerificationSuccess(bytes output, bytes userData)` .
4. You implement custom logic in `customVerificationHook(...)`.

## SelfVerificationRoot

This is an abstract contract that you must override by providing custom logic for returning a config id along with a hook that is called with the disclosed attributes. Here's what you need to override:

### 1. `getConfigId`

```solidity
function getConfigId(
    bytes32 destinationChainId,
    bytes32 userIdentifier,
    bytes memory userDefinedData
) public view virtual override returns (bytes32) 
```

Return the **verification config ID** that the hub should enforce for this request. In simple cases, you may store a single config ID in storage and return it. In advanced cases, compute a dynamic config id based on the inputs.

**Example (static config):**

```solidity
bytes32 public verificationConfigId;

function getConfigId(
    bytes32, bytes32, bytes memory
) public view override returns (bytes32) {
    return verificationConfigId;
}
```

### 2. `customVerificationHook`

```solidity
function customVerificationHook(
    ISelfVerificationRoot.GenericDiscloseOutputV2 memory output,
    bytes memory userData
) internal virtual override
```

This is called **after** hub verification succeeds. Use it to:

* Mark the user as verified
* Mint/allowlist/gate features
* Emit events or write your own structs

## Constructor & Scope

```solidity
constructor(
    address hubV2, 
    string memory scopeSeed
) SelfVerificationRoot(hubV2, scopeSeed) {}
```

`SelfVerificationRoot` computes a **scope** at deploy time:

* It Poseidon‑hashes the **contract address** (chunked) with your **`scopeSeed`** to produce a unique `uint256` scope.
* The hub enforces that **submitted proofs match this scope**.

Why scope matters:

* Prevents cross‑contract proof replay.
* Allow anonymity between different applications as the nullifier is calculated as a function of the scope.

**Guidelines**

* Keep `scopeSeed` short (≤31 ASCII bytes). Example: `"proof-of-human"`.
* **Changing contract address changes the scope** (by design). Re‑deploys will need a fresh frontend config.
* You can read the current scope on‑chain via `function scope() public view returns (uint256)`.

{% hint style="info" %}
You can get the hub addresses from [deployed-contracts](https://docs.self.xyz/contract-integration/deployed-contracts "mention")
{% endhint %}

## Setting Verification Configs

A verification config is simply what you want to verify your user against. Your contract must reference a **verification config** that the hub recognizes. Typical steps:

1. **Format and register** the config off‑chain or in a setup contract:

```solidity
SelfStructs.VerificationConfigV2 public verificationConfig;
bytes32 public verificationConfigId;

constructor(
    address hubV2, 
    string memory scopeSeed, 
    SelfUtils.UnformattedVerificationConfigV2 memory rawCfg
) SelfVerificationRoot(hubV2, scopeSeed) {
    // 1) Format the human‑readable struct into the on‑chain wire format
    verificationConfig = SelfUtils.formatVerificationConfigV2(rawCfg);

    // 2) Register the config in the Hub. **This call RETURNS the configId.**
    verificationConfigId = IIdentityVerificationHubV2(hubV2).setVerificationConfigV2(verificationConfig);
}
```

2. **Return the config id** from `getConfigId(...)` (static or dynamic):

```solidity
function getConfigId(
    bytes32, 
    bytes32, 
    bytes memory
) public view override returns (bytes32) {
    return verificationConfigId;
}
```

Here's how you would create a raw config:

```solidity
import { SelfUtils } from "@selfxyz/contracts/contracts/libraries/SelfUtils.sol";

//inside your contract
string[] memory forbiddenCountries = new string[](1);
  forbiddenCountries[0] = CountryCodes.UNITED_STATES;
  SelfUtils.UnformattedVerificationConfigV2 memory verificationConfig = SelfUtils.UnformattedVerificationConfigV2({
    olderThan: 18,
    forbiddenCountries: forbiddenCountries,
    ofacEnabled: false
});

```

{% hint style="warning" %}
Only a maximum of 40 countries are allowed!
{% endhint %}

### Frontend ↔ Contract config must match

{% hint style="danger" %}
The **frontend disclosure/verification config** used to produce the proof must **exactly match** the **contract’s verification config** (the `configId` you return). Otherwise the hub will detect a **mismatch** and verification fails.
{% endhint %}

Common pitfalls:

* Frontend uses `minimumAge: 18` but contract config expects `21` .
* Frontend uses different **scope** (e.g., points to a different contract address or uses a different `scopeSeed`).

{% hint style="success" %}
**Best practice:** Generate the config **once**, register it with the hub to get `configId`, and reference that same id in your dApp’s builder payload.
{% endhint %}

## Minimal Example: Proof Of Human

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {SelfVerificationRoot} from "@selfxyz/contracts/contracts/abstract/SelfVerificationRoot.sol";
import {ISelfVerificationRoot} from "@selfxyz/contracts/contracts/interfaces/ISelfVerificationRoot.sol";
import {SelfStructs} from "@selfxyz/contracts/contracts/libraries/SelfStructs.sol";
import {SelfUtils} from "@selfxyz/contracts/contracts/libraries/SelfUtils.sol";
import {IIdentityVerificationHubV2} from "@selfxyz/contracts/contracts/interfaces/IIdentityVerificationHubV2.sol";

/**
 * @title ProofOfHuman
 * @notice Test implementation of SelfVerificationRoot for the docs
 * @dev This contract provides a concrete implementation of the abstract SelfVerificationRoot
 */
contract ProofOfHuman is SelfVerificationRoot {
    // Storage for testing purposes
    SelfStructs.VerificationConfigV2 public verificationConfig;
    bytes32 public verificationConfigId;

    // Events for testing
    event VerificationCompleted(
        ISelfVerificationRoot.GenericDiscloseOutputV2 output,
        bytes userData
    );

    /**
     * @notice Constructor for the test contract
     * @param identityVerificationHubV2Address The address of the Identity Verification Hub V2
     */
    constructor(
        address identityVerificationHubV2Address,
        uint256 scopeSeed,
        SelfUtils.UnformattedVerificationConfigV2 memory _verificationConfig
    ) SelfVerificationRoot(identityVerificationHubV2Address, scopeSeed) {
        verificationConfig = 
            SelfUtils.formatVerificationConfigV2(_verificationConfig);
        verificationConfigId = 
            IIdentityVerificationHubV2(identityVerificationHubV2Address)
            .setVerificationConfigV2(verificationConfig);
    }
    
    /**
     * @notice Implementation of customVerificationHook for testing
     * @dev This function is called by onVerificationSuccess after hub address validation
     * @param output The verification output from the hub
     * @param userData The user data passed through verification
     */
    function customVerificationHook(
        ISelfVerificationRoot.GenericDiscloseOutputV2 memory output,
        bytes memory userData
    ) internal override {
        emit VerificationCompleted(output, userData);
    }

    function getConfigId(
        bytes32 /* destinationChainId */,
        bytes32 /* userIdentifier */,
        bytes memory /* userDefinedData */
    ) public view override returns (bytes32) {
        return verificationConfigId;
    }
}
```
# Basic Integration

{% hint style="danger" %}
**Troubleshooting Celo Sepolia**: If you encounter a `Chain 11142220 not supported` error when deploying to Celo Sepolia, try to update Foundry to version 0.3.0:

```bash
foundryup --install 0.3.0
```

{% endhint %}

## Overview

The `@selfxyz/contracts` SDK provides you with a `SelfVerificationRoot` abstract contract that wires your contract to the Identity Verification Hub V2. Your contract receives a callback with disclosed, verified attributes only after the proof succeeds.

### Key flow

1. Your contract exposes `verifySelfProof(bytes proofPayload, bytes userContextData)` from the abstract contract.
2. It takes a verification config from your contract and forwards a packed input to Hub V2.
3. If the proof is valid, the Hub calls back your contract’s `onVerificationSuccess(bytes output, bytes userData)` .
4. You implement custom logic in `customVerificationHook(...)`.

## SelfVerificationRoot

This is an abstract contract that you must override by providing custom logic for returning a config id along with a hook that is called with the disclosed attributes. Here's what you need to override:

### 1. `getConfigId`

```solidity
function getConfigId(
    bytes32 destinationChainId,
    bytes32 userIdentifier,
    bytes memory userDefinedData
) public view virtual override returns (bytes32) 
```

Return the **verification config ID** that the hub should enforce for this request. In simple cases, you may store a single config ID in storage and return it. In advanced cases, compute a dynamic config id based on the inputs.

**Example (static config):**

```solidity
bytes32 public verificationConfigId;

function getConfigId(
    bytes32, bytes32, bytes memory
) public view override returns (bytes32) {
    return verificationConfigId;
}
```

### 2. `customVerificationHook`

```solidity
function customVerificationHook(
    ISelfVerificationRoot.GenericDiscloseOutputV2 memory output,
    bytes memory userData
) internal virtual override
```

This is called **after** hub verification succeeds. Use it to:

* Mark the user as verified
* Mint/allowlist/gate features
* Emit events or write your own structs

## Constructor & Scope

```solidity
constructor(
    address hubV2, 
    string memory scopeSeed
) SelfVerificationRoot(hubV2, scopeSeed) {}
```

`SelfVerificationRoot` computes a **scope** at deploy time:

* It Poseidon‑hashes the **contract address** (chunked) with your **`scopeSeed`** to produce a unique `uint256` scope.
* The hub enforces that **submitted proofs match this scope**.

Why scope matters:

* Prevents cross‑contract proof replay.
* Allow anonymity between different applications as the nullifier is calculated as a function of the scope.

**Guidelines**

* Keep `scopeSeed` short (≤31 ASCII bytes). Example: `"proof-of-human"`.
* **Changing contract address changes the scope** (by design). Re‑deploys will need a fresh frontend config.
* You can read the current scope on‑chain via `function scope() public view returns (uint256)`.

{% hint style="info" %}
You can get the hub addresses from [deployed-contracts](https://docs.self.xyz/contract-integration/deployed-contracts "mention")
{% endhint %}

## Setting Verification Configs

A verification config is simply what you want to verify your user against. Your contract must reference a **verification config** that the hub recognizes. Typical steps:

1. **Format and register** the config off‑chain or in a setup contract:

```solidity
SelfStructs.VerificationConfigV2 public verificationConfig;
bytes32 public verificationConfigId;

constructor(
    address hubV2, 
    string memory scopeSeed, 
    SelfUtils.UnformattedVerificationConfigV2 memory rawCfg
) SelfVerificationRoot(hubV2, scopeSeed) {
    // 1) Format the human‑readable struct into the on‑chain wire format
    verificationConfig = SelfUtils.formatVerificationConfigV2(rawCfg);

    // 2) Register the config in the Hub. **This call RETURNS the configId.**
    verificationConfigId = IIdentityVerificationHubV2(hubV2).setVerificationConfigV2(verificationConfig);
}
```

2. **Return the config id** from `getConfigId(...)` (static or dynamic):

```solidity
function getConfigId(
    bytes32, 
    bytes32, 
    bytes memory
) public view override returns (bytes32) {
    return verificationConfigId;
}
```

Here's how you would create a raw config:

```solidity
import { SelfUtils } from "@selfxyz/contracts/contracts/libraries/SelfUtils.sol";

//inside your contract
string[] memory forbiddenCountries = new string[](1);
  forbiddenCountries[0] = CountryCodes.UNITED_STATES;
  SelfUtils.UnformattedVerificationConfigV2 memory verificationConfig = SelfUtils.UnformattedVerificationConfigV2({
    olderThan: 18,
    forbiddenCountries: forbiddenCountries,
    ofacEnabled: false
});

```

{% hint style="warning" %}
Only a maximum of 40 countries are allowed!
{% endhint %}

### Frontend ↔ Contract config must match

{% hint style="danger" %}
The **frontend disclosure/verification config** used to produce the proof must **exactly match** the **contract’s verification config** (the `configId` you return). Otherwise the hub will detect a **mismatch** and verification fails.
{% endhint %}

Common pitfalls:

* Frontend uses `minimumAge: 18` but contract config expects `21` .
* Frontend uses different **scope** (e.g., points to a different contract address or uses a different `scopeSeed`).

{% hint style="success" %}
**Best practice:** Generate the config **once**, register it with the hub to get `configId`, and reference that same id in your dApp’s builder payload.
{% endhint %}

## Minimal Example: Proof Of Human

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {SelfVerificationRoot} from "@selfxyz/contracts/contracts/abstract/SelfVerificationRoot.sol";
import {ISelfVerificationRoot} from "@selfxyz/contracts/contracts/interfaces/ISelfVerificationRoot.sol";
import {SelfStructs} from "@selfxyz/contracts/contracts/libraries/SelfStructs.sol";
import {SelfUtils} from "@selfxyz/contracts/contracts/libraries/SelfUtils.sol";
import {IIdentityVerificationHubV2} from "@selfxyz/contracts/contracts/interfaces/IIdentityVerificationHubV2.sol";

/**
 * @title ProofOfHuman
 * @notice Test implementation of SelfVerificationRoot for the docs
 * @dev This contract provides a concrete implementation of the abstract SelfVerificationRoot
 */
contract ProofOfHuman is SelfVerificationRoot {
    // Storage for testing purposes
    SelfStructs.VerificationConfigV2 public verificationConfig;
    bytes32 public verificationConfigId;

    // Events for testing
    event VerificationCompleted(
        ISelfVerificationRoot.GenericDiscloseOutputV2 output,
        bytes userData
    );

    /**
     * @notice Constructor for the test contract
     * @param identityVerificationHubV2Address The address of the Identity Verification Hub V2
     */
    constructor(
        address identityVerificationHubV2Address,
        uint256 scopeSeed,
        SelfUtils.UnformattedVerificationConfigV2 memory _verificationConfig
    ) SelfVerificationRoot(identityVerificationHubV2Address, scopeSeed) {
        verificationConfig = 
            SelfUtils.formatVerificationConfigV2(_verificationConfig);
        verificationConfigId = 
            IIdentityVerificationHubV2(identityVerificationHubV2Address)
            .setVerificationConfigV2(verificationConfig);
    }
    
    /**
     * @notice Implementation of customVerificationHook for testing
     * @dev This function is called by onVerificationSuccess after hub address validation
     * @param output The verification output from the hub
     * @param userData The user data passed through verification
     */
    function customVerificationHook(
        ISelfVerificationRoot.GenericDiscloseOutputV2 memory output,
        bytes memory userData
    ) internal override {
        emit VerificationCompleted(output, userData);
    }

    function getConfigId(
        bytes32 /* destinationChainId */,
        bytes32 /* userIdentifier */,
        bytes memory /* userDefinedData */
    ) public view override returns (bytes32) {
        return verificationConfigId;
    }
}
```
# Deployed Contracts

Deployment addresses for the Self protocol, on Celo mainnet and testnet.

### Celo mainnet — Real passports

<table><thead><tr><th width="374">Contract</th><th>Deployment address</th><th data-hidden></th></tr></thead><tbody><tr><td>IdentityVerificationHub</td><td><a href="https://celoscan.io/address/0xe57F4773bd9c9d8b6Cd70431117d353298B9f5BF">0xe57F4773bd9c9d8b6Cd70431117d353298B9f5BF</a></td><td></td></tr></tbody></table>

### Celo Testnet — Mock passports

<table><thead><tr><th width="374">Contract</th><th>Deployment address</th><th data-hidden></th></tr></thead><tbody><tr><td>IdentityVerificationHub</td><td><a href="https://celo-sepolia.blockscout.com/address/0x16ECBA51e18a4a7e61fdC417f0d47AFEeDfbed74">0x16ECBA51e18a4a7e61fdC417f0d47AFEeDfbed74</a></td><td></td></tr></tbody></table>
# Airdrop Example

This example demonstrates V2 contract integration using the [Airdrop contract](https://github.com/selfxyz/self/blob/main/contracts/contracts/example/Airdrop.sol), which supports both E-Passport and EU ID Card verification with registration/claim phases and Merkle tree token distribution.

### Airdrop-Specific Features

This contract demonstrates:

* **Two-phase distribution:** Registration → Claim separation
* **Merkle tree allocation:** Fair token distribution
* **Multi-document registration:** Both E-Passport and EU ID cards supported
* **Anti-duplicate measures:** Nullifier and user identifier tracking

### Registration Logic

The registration phase validates user eligibility and prevents duplicate registrations:

**Key Validations:**

* Registration phase must be open
* Nullifier hasn't been used (prevents same document registering twice)
* Valid user identifier provided
* User identifier hasn't already registered (prevents address reuse)

### State Variables

```solidity
/// @notice Maps nullifiers to user identifiers for registration tracking
mapping(uint256 nullifier => uint256 userIdentifier) internal _nullifierToUserIdentifier;

/// @notice Maps user identifiers to registration status
mapping(uint256 userIdentifier => bool registered) internal _registeredUserIdentifiers;

/// @notice Tracks addresses that have claimed tokens
mapping(address => bool) public claimed;

/// @notice ERC20 token to be airdropped
IERC20 public immutable token;

/// @notice Merkle root for claim validation
bytes32 public merkleRoot;

/// @notice Phase control
bool public isRegistrationOpen;
bool public isClaimOpen;

/// @notice Verification config ID for identity verification
bytes32 public verificationConfigId;
```

For standard V2 integration patterns (constructor, getConfigId), see [Basic Integration Guide](https://docs.self.xyz/contract-integration/broken-reference).

**Registration Verification Hook:**

```solidity
function customVerificationHook(
    ISelfVerificationRoot.GenericDiscloseOutputV2 memory output,
    bytes memory /* userData */
) internal override {
    // Airdrop-specific validations
    if (!isRegistrationOpen) revert RegistrationNotOpen();
    if (_nullifierToUserIdentifier[output.nullifier] != 0) revert RegisteredNullifier();
    if (output.userIdentifier == 0) revert InvalidUserIdentifier();
    if (_registeredUserIdentifiers[output.userIdentifier]) revert UserIdentifierAlreadyRegistered();

    // Register user for airdrop
    _nullifierToUserIdentifier[output.nullifier] = output.userIdentifier;
    _registeredUserIdentifiers[output.userIdentifier] = true;
    
    emit UserIdentifierRegistered(output.userIdentifier, output.nullifier);
}
```

### Claim Function Implementation

```solidity
function claim(uint256 index, uint256 amount, bytes32[] memory merkleProof) external {
    if (isRegistrationOpen) {
        revert RegistrationNotClosed();
    }
    if (!isClaimOpen) {
        revert ClaimNotOpen();
    }
    if (claimed[msg.sender]) {
        revert AlreadyClaimed();
    }
    if (!_registeredUserIdentifiers[uint256(uint160(msg.sender))]) {
        revert NotRegistered(msg.sender);
    }

    // Verify the Merkle proof
    bytes32 node = keccak256(abi.encodePacked(index, msg.sender, amount));
    if (!MerkleProof.verify(merkleProof, merkleRoot, node)) revert InvalidProof();

    // Mark as claimed and transfer tokens
    claimed[msg.sender] = true;
    token.safeTransfer(msg.sender, amount);

    emit Claimed(index, msg.sender, amount);
}
```

### Configuration Management

The contract includes methods for managing verification configuration:

```solidity
// Set verification config ID
function setConfigId(bytes32 configId) external onlyOwner {
    verificationConfigId = configId;
}

// Override to provide configId for verification
function getConfigId(
    bytes32 destinationChainId,
    bytes32 userIdentifier,
    bytes memory userDefinedData
) public view override returns (bytes32) {
    return verificationConfigId;
}
```

### Administrative Functions

```solidity
// Set Merkle root for claim validation
function setMerkleRoot(bytes32 newMerkleRoot) external onlyOwner;

// Update verification scope
function setScope(uint256 newScope) external onlyOwner;

// Phase control
function openRegistration() external onlyOwner;
function closeRegistration() external onlyOwner;
function openClaim() external onlyOwner;
function closeClaim() external onlyOwner;
```

### Airdrop Flow

1. **Deploy:** Owner deploys with hub address, scope, and token
2. **Configure:** Set verification config ID and Merkle root using `setConfigId()` and `setMerkleRoot()`
3. **Open Registration:** Users prove identity to register
4. **Close Registration:** Move to claim phase
5. **Open Claims:** Registered users claim via Merkle proofs
6. **Distribution Complete:** Tokens distributed to verified users

For verification configuration setup, see [Hub Verification Process](https://docs.self.xyz/technical-docs/verification-in-the-identityverificationhub#v2-enhanced-verifications).

## Related Documentation

* [Basic Integration Guide](https://docs.self.xyz/contract-integration/broken-reference) - Core V2 integration patterns
* [Hub Verification Process](https://docs.self.xyz/technical-docs/verification-in-the-identityverificationhub) - Verification configuration
* [Identity Attributes](https://docs.self.xyz/contract-integration/broken-reference) - Working with verified data
* [Happy Birthday Example](https://docs.self.xyz/contract-integration/happy-birthday-example) - Date-based verification example
# Working with userDefinedData

The `userDefinedData` is mainly used in the frontend to allow users to pass in additional information during the time of verification.&#x20;

{% hint style="warning" %}
The `userDefinedData` passed in the QRCode gets converted from a **string** to **bytes**. You will have to convert it back from bytes to a string again and work on top of that.&#x20;
{% endhint %}

## Setting a config

When setting a config just creating the config is not enough. You should register the config with the hub and this method will also return the config id.&#x20;

```solidity
//internal map that stores from hash(data) -> configId
mapping(uint256 => uint256) public configs;

function setConfig(
    string memory configDesc, 
    SelfUtils.UnformattedVerificationConfigV2 config
) public {
    //create the key
    uint256 key = uint256(keccak256(bytes(configDesc)));
    //create the hub compliant config struct
    SelfStructs.VerificationConfigV2 verificationConfig = 
        SelfUtils.formatVerificationConfigV2(_verificationConfig);
    //register and get the id
    uint256 verificationConfigId = 
        IIdentityVerificationHubV2(identityVerificationHubV2Address)
        .setVerificationConfigV2(verificationConfig);
    //set it in the key
    configs[key] = verificationConfigId;
}
```

### Change the `getConfigId` in the `SelfVerificationRoot`

Now we just have to change the `getConfigId` that returns the config ids from this map. This is pretty simple as now we just have to hash the existing bytes:&#x20;

```solidity
function getConfigId(
    bytes32 destinationChainId,
    bytes32 userIdentifier,
    bytes memory userDefinedData
) public view virtual returns (bytes32) {
    //the string is already converted to bytes
    uint256 key = keccak256(userDefinedData);
    return configs[key];
}
```

# Self Map countries list

## Supported Countries

Self supports electronic passport and identity document verification across multiple countries worldwide. Our coverage includes both Document Signer Certificates (DSC) and Country Signing Certificate Authority (CSCA) support.

### Interactive Coverage Map

For a visual representation of our global coverage, visit our [Interactive Coverage Map](https://map.self.xyz/).

### Country Support Status

We currently support document verification for the following countries:

#### Full Support (Both DSC and CSCA)

These countries have both Document Signer Certificates and Country Signing Certificate Authority support:

| Country                   | Code | Region          |
| ------------------------- | ---- | --------------- |
| 🇦🇪 United Arab Emirates | AE   | Middle East     |
| 🇦🇷 Argentina            | AR   | South America   |
| 🇦🇹 Austria              | AT   | Europe          |
| 🇦🇺 Australia            | AU   | Oceania         |
| 🇧🇬 Bulgaria             | BG   | Europe          |
| 🇧🇭 Bahrain              | BH   | Middle East     |
| 🇧🇯 Benin                | BJ   | Africa          |
| 🇧🇷 Brazil               | BR   | South America   |
| 🇧🇿 Belize               | BZ   | Central America |
| 🇨🇦 Canada               | CA   | North America   |
| 🇨🇭 Switzerland          | CH   | Europe          |
| 🇨🇲 Cameroon             | CM   | Africa          |
| 🇨🇳 China                | CN   | Asia            |
| 🇨🇴 Colombia             | CO   | South America   |
| 🇨🇿 Czech Republic       | CZ   | Europe          |
| 🇩🇪 Germany              | DE   | Europe          |
| 🇪🇸 Spain                | ES   | Europe          |
| 🇪🇺 European Union       | EU   | Europe          |
| 🇫🇮 Finland              | FI   | Europe          |
| 🇫🇷 France               | FR   | Europe          |
| 🇬🇧 United Kingdom       | GB   | Europe          |
| 🇭🇺 Hungary              | HU   | Europe          |
| 🇮🇩 Indonesia            | ID   | Asia            |
| 🇮🇪 Ireland              | IE   | Europe          |
| 🇮🇶 Iraq                 | IQ   | Middle East     |
| 🇮🇷 Iran                 | IR   | Middle East     |
| 🇮🇸 Iceland              | IS   | Europe          |
| 🇮🇹 Italy                | IT   | Europe          |
| 🇯🇵 Japan                | JP   | Asia            |
| 🇰🇷 South Korea          | KR   | Asia            |
| 🇱🇺 Luxembourg           | LU   | Europe          |
| 🇲🇦 Morocco              | MA   | Africa          |
| 🇲🇩 Moldova              | MD   | Europe          |
| 🇲🇳 Mongolia             | MN   | Asia            |
| 🇲🇽 Mexico               | MX   | North America   |
| 🇲🇾 Malaysia             | MY   | Asia            |
| 🇳🇴 Norway               | NO   | Europe          |
| 🇳🇵 Nepal                | NP   | Asia            |
| 🇳🇿 New Zealand          | NZ   | Oceania         |
| 🇵🇦 Panama               | PA   | Central America |
| 🇶🇦 Qatar                | QA   | Middle East     |
| 🇷🇴 Romania              | RO   | Europe          |
| 🇷🇼 Rwanda               | RW   | Africa          |
| 🇸🇪 Sweden               | SE   | Europe          |
| 🇸🇬 Singapore            | SG   | Asia            |
| 🇸🇰 Slovakia             | SK   | Europe          |
| 🇹🇭 Thailand             | TH   | Asia            |
| 🇹🇲 Turkmenistan         | TM   | Asia            |
| 🇹🇿 Tanzania             | TZ   | Africa          |
| 🇺🇦 Ukraine              | UA   | Europe          |
| 🇺🇸 United States        | US   | North America   |
| 🇺🇿 Uzbekistan           | UZ   | Asia            |
| 🇻🇳 Vietnam              | VN   | Asia            |

#### CSCA Support Only

These countries have Country Signing Certificate Authority support:

| Country                               | Code | Region          |
| ------------------------------------- | ---- | --------------- |
| 🇦🇩 Andorra                          | AD   | Europe          |
| 🇦🇬 Antigua and Barbuda              | AG   | Caribbean       |
| 🇦🇱 Albania                          | AL   | Europe          |
| 🇦🇲 Armenia                          | AM   | Asia            |
| 🇦🇿 Azerbaijan                       | AZ   | Asia            |
| 🇧🇦 Bosnia and Herzegovina           | BA   | Europe          |
| 🇧🇧 Barbados                         | BB   | Caribbean       |
| 🇧🇩 Bangladesh                       | BD   | Asia            |
| 🇧🇪 Belgium                          | BE   | Europe          |
| 🇧🇸 Bahamas                          | BS   | Caribbean       |
| 🇧🇼 Botswana                         | BW   | Africa          |
| 🇧🇾 Belarus                          | BY   | Europe          |
| 🇨🇮 Côte d'Ivoire                    | CI   | Africa          |
| 🇨🇱 Chile                            | CL   | South America   |
| 🇨🇷 Costa Rica                       | CR   | Central America |
| 🇨🇾 Cyprus                           | CY   | Europe          |
| 🇩🇰 Denmark                          | DK   | Europe          |
| 🇩🇲 Dominica                         | DM   | Caribbean       |
| 🇩🇿 Algeria                          | DZ   | Africa          |
| 🇪🇨 Ecuador                          | EC   | South America   |
| 🇪🇪 Estonia                          | EE   | Europe          |
| 🇬🇪 Georgia                          | GE   | Asia            |
| 🇬🇭 Ghana                            | GH   | Africa          |
| 🇬🇲 Gambia                           | GM   | Africa          |
| 🇬🇷 Greece                           | GR   | Europe          |
| 🇭🇷 Croatia                          | HR   | Europe          |
| 🇮🇱 Israel                           | IL   | Middle East     |
| 🇮🇳 India                            | IN   | Asia            |
| 🇯🇲 Jamaica                          | JM   | Caribbean       |
| 🇰🇪 Kenya                            | KE   | Africa          |
| 🇰🇳 Saint Kitts and Nevis            | KN   | Caribbean       |
| 🇰🇵 North Korea                      | KP   | Asia            |
| 🇰🇸 Kosovo                           | KS   | Europe          |
| 🇰🇼 Kuwait                           | KW   | Middle East     |
| 🇰🇿 Kazakhstan                       | KZ   | Asia            |
| 🇱🇧 Lebanon                          | LB   | Middle East     |
| 🇱🇮 Liechtenstein                    | LI   | Europe          |
| 🇱🇹 Lithuania                        | LT   | Europe          |
| 🇱🇻 Latvia                           | LV   | Europe          |
| 🇲🇨 Monaco                           | MC   | Europe          |
| 🇲🇪 Montenegro                       | ME   | Europe          |
| 🇲🇰 North Macedonia                  | MK   | Europe          |
| 🇲🇹 Malta                            | MT   | Europe          |
| 🇲🇻 Maldives                         | MV   | Asia            |
| 🇳🇱 Netherlands                      | NL   | Europe          |
| 🇴🇲 Oman                             | OM   | Middle East     |
| 🇵🇪 Peru                             | PE   | South America   |
| 🇵🇭 Philippines                      | PH   | Asia            |
| 🇵🇱 Poland                           | PL   | Europe          |
| 🇵🇸 Palestine                        | PS   | Middle East     |
| 🇵🇹 Portugal                         | PT   | Europe          |
| 🇵🇾 Paraguay                         | PY   | South America   |
| 🇷🇸 Serbia                           | RS   | Europe          |
| 🇷🇺 Russia                           | RU   | Asia/Europe     |
| 🇸🇦 Saudi Arabia                     | SA   | Middle East     |
| 🇸🇨 Seychelles                       | SC   | Africa          |
| 🇸🇮 Slovenia                         | SI   | Europe          |
| 🇸🇲 San Marino                       | SM   | Europe          |
| 🇸🇳 Senegal                          | SN   | Africa          |
| 🇸🇾 Syria                            | SY   | Middle East     |
| 🇹🇯 Tajikistan                       | TJ   | Asia            |
| 🇹🇱 Timor-Leste                      | TL   | Asia            |
| 🇹🇷 Turkey                           | TR   | Asia/Europe     |
| 🇹🇼 Taiwan                           | TW   | Asia            |
| 🇺🇬 Uganda                           | UG   | Africa          |
| 🇺🇾 Uruguay                          | UY   | South America   |
| 🇻🇦 Vatican City                     | VA   | Europe          |
| 🇻🇨 Saint Vincent and the Grenadines | VC   | Caribbean       |
| 🇻🇪 Venezuela                        | VE   | South America   |
| 🇿🇼 Zimbabwe                         | ZW   | Africa          |

#### Special Territories and Organizations

* **UN** - United Nations Laissez-Passer
* **ZZ** - Unknown/Test Documents

### Technical Details

#### What is DSC (Document Signer Certificate)?

Document Signer Certificates are used to digitally sign the data stored in electronic passports and identity documents. They ensure the authenticity and integrity of the document data.

#### What is CSCA (Country Signing Certificate Authority)?

The Country Signing Certificate Authority is the root certificate authority for a country's electronic document infrastructure. It issues certificates to Document Signers.

#### Supported Cryptographic Standards

Our system supports various cryptographic algorithms including:

* **Signature Algorithms**: RSA, RSAPSS, ECDSA
* **Hash Algorithms**: SHA-1, SHA-256, SHA-384, SHA-512
* **Key Lengths**: 1024-6144 bits for RSA, 224-521 bits for ECDSA

### Data Sources

This information is compiled from our certificate registry:

* [DSC Registry Data](https://raw.githubusercontent.com/selfxyz/self/52dba2742b4c37a957eb5ab8ebee83fdccdcf187/registry/outputs/map_dsc.json)
* [CSCA Registry Data](https://raw.githubusercontent.com/selfxyz/self/52dba2742b4c37a957eb5ab8ebee83fdccdcf187/registry/outputs/map_csca.json)

### Updates

This list is regularly updated as new countries adopt electronic document standards and as we expand our certificate registry. For the most current information, please check our [Interactive Coverage Map](https://map.self.xyz/).

***
