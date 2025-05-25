# Vara Goat SDK

A TypeScript SDK for interacting with the Vara Network, built on top of the Goat SDK framework.

## Project Structure

```
typescript/
├── packages/
│   └── wallets/
│       └── vara/                  # Vara Network Wallet Implementation
│           ├── src/
│           │   ├── types/         # TypeScript type definitions
│           │   ├── VaraWalletClient.ts    # Main wallet client implementation
│           │   ├── send.plugin.ts # Send transaction plugin
│           │   ├── sendVara.ts    # Vara-specific send implementation
│           │   └── index.ts       # Package entry point
│           ├── package.json       # Package configuration
│           └── tsconfig.json      # TypeScript configuration
└── examples/
    └── by-framework/
        └── vercel-ai/            # Example implementation using Vercel AI
```

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/Adityaakr/vara-goat-sdk.git
cd vara-goat-sdk
```

2. Install dependencies:
```bash
pnpm install
```

3. Configure environment variables:
   - Copy `.env.template` to `.env`
   - Add your credentials:
```env
VARA_MNEMONIC=your_mnemonic_here
OPENAI_API_KEY=your_openai_api_key_here
```

## Running the Example

1. Navigate to the example directory:
```bash
cd typescript/examples/by-framework/vercel-ai
```

2. Start the application:
```bash
pnpm start
```

## Features

- Vara Network wallet integration
- Transaction sending capabilities
- TypeScript support
- Integration with Goat SDK framework
- Example implementation with Vercel AI

## Dependencies

- Node.js
- pnpm
- TypeScript
- Goat SDK

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
