# GOAT Starter VARA

A starter project for interacting with the VARA network using TypeScript with natural language command support.

## Features

- Connect to VARA network
- Get wallet address and balance
- Send VARA tokens using natural language commands
- Interactive command-line interface
- TypeScript support
- Environment variable configuration

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd goat-starter-vara
```

2. Install dependencies:
```bash
pnpm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Add your VARA wallet mnemonic to `.env`:
```
VARA_MNEMONIC="your twelve word mnemonic here"
```

## Usage

1. Start the application:
```bash
pnpm start
```

2. Use natural language commands:
```
Enter command: send 1 VARA to kGgwmYab55mPWS3q4wWNTqeis5h7kAK4tFHsm3CEUaYxE2pPK
```

Available commands:
- `send X VARA to address` - Send VARA tokens to an address
- `exit` - Quit the application

## Development

1. Start development server with hot reload:
```bash
pnpm dev
```

2. Build the project:
```bash
pnpm build
```

## Example Code

```typescript
// Initialize wallet
const wallet = new VaraWalletClient(mnemonic, VARA_MAINNET);
await wallet.init();

// Get wallet address
const address = wallet.getAddress();

// Get wallet balance
const balance = await wallet.getBalance();

// Send VARA tokens using natural language
const result = await executeCommand("send 1 VARA to address", wallet);
```

## Security Notes

- Never commit your `.env` file or expose your mnemonic
- Use test mnemonics for development
- Keep your production mnemonic secure

## License

MIT 