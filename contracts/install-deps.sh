#!/bin/bash

echo "Installing Foundry dependencies..."

# Install OpenZeppelin contracts
echo "Installing OpenZeppelin contracts..."
forge install OpenZeppelin/openzeppelin-contracts --no-commit

# Install Self Protocol contracts (using the official self-sbt as reference)
echo "Installing Self Protocol contracts..."
forge install selfxyz/self --no-commit

# Create remappings file
echo "Creating remappings.txt..."
cat > remappings.txt << EOF
@openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/
@selfxyz/contracts-v2/=lib/self/contracts/
forge-std/=lib/forge-std/src/
EOF

echo "Dependencies installed successfully!"
echo "Run 'forge build' to compile contracts"