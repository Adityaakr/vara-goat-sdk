# VARA Wallet for GOAT SDK

A VARA wallet implementation with AI-powered natural language transactions.

## Quick Start

1. Install:
```bash
pnpm add @goat-sdk/wallets-vara
```

2. Basic Usage:
```typescript
import { vara } from '@goat-sdk/wallets-vara';

const wallet = await vara("your mnemonic here");
await wallet.connect();

// Send VARA
const result = await wallet.sendVara({
  to: "recipient-address",
  amount: 1
});
```

3. AI-Powered Usage:
```typescript
import { vara } from '@goat-sdk/wallets-vara';
import { getOnChainTools } from '@goat-sdk/adapters-vercel-ai';

const wallet = await vara("your mnemonic here");
await wallet.connect();

// Use natural language
const tools = await getOnChainTools({
  wallet: wallet,
  plugins: [sendVara()]
});

// Example: "send 1 vara to kGgwmYab55mPWS3q4wWNTqeis5h7kAK4tFHsm3CEUaYxE2pPK"
```

## Notes

- Amounts are in VARA units (e.g., 1 for 1 VARA)
- Requires OpenAI API key for natural language features
- Automatically handles decimals (18 decimals for VARA)

## License

MIT 