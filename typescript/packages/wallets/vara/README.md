<div align="center">
<a href="https://github.com/goat-sdk/goat">

<img src="https://github.com/user-attachments/assets/5fc7f121-259c-492c-8bca-f15fe7eb830c" alt="GOAT" width="100px" height="auto" style="object-fit: contain;">
</a>
</div>

# Vara Wallet for GOAT

## Installation
```
npm install @goat-sdk/wallet-vara
yarn add @goat-sdk/wallet-vara
pnpm add @goat-sdk/wallet-vara
```

## Usage
```typescript
import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
import { vara } from "@goat-sdk/wallet-vara";

const mnemonic = process.env.VARA_MNEMONIC;
const seed = bip39.mnemonicToSeedSync(mnemonic);

const tools = await getOnChainTools({
    wallet: vara({
        seed,
        chain: "mainnet", // or "testnet"
    }),
});
```

<footer>
<br/>
<br/>
<div>
<a href="https://github.com/goat-sdk/goat">
  <img src="https://github.com/user-attachments/assets/59fa5ddc-9d47-4d41-a51a-64f6798f94bd" alt="GOAT" width="100%" height="auto" style="object-fit: contain; max-width: 800px;">
</a>
</div>
</footer>

## Quick Start

1. Install:
```bash
pnpm add @goat-sdk/wallets-vara
```