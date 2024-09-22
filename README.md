# WIZZ

WIZZ is a Fully On-Chain SocialFi platform where users can build, share, and earn. Own your data, showcase your skills, create opportunities, and connect directly with peers—all while earning for your content.

## How It's Made

WIZZ is built using Next.js for the frontend, making it fast and user-friendly. The smart contracts are developed using Remix IDE, fully optimized for secure and cost-efficient transactions on the Flow blockchain, which is known for its scalability and low fees.

We integrated the wagmi library for smooth blockchain interactions, and ENS (Ethereum Name Service) for easy-to-read addresses.

WIZZ also integrates IPFS (InterPlanetary File System) and pinning services to ensure decentralized storage for content and data. This allows users to store and access data securely, without relying on centralized servers, enhancing privacy and data ownership.

For job listings, we used the Sign protocol to verify the poster's credibility with attestations, ensuring genuine job postings. This creates a decentralized, transparent, and efficient platform for users to build, share, and earn.

## Getting Started

To get started with WIZZ, follow these steps:

1. **Install MetaMask**: If you haven't already, install the MetaMask extension for your browser.

2. **Add EVM on Flow Testnet to MetaMask**:
   - Open MetaMask and navigate to the "Networks" dropdown.
   - Click on "Add Network" and fill in the following details:

   | Name                  | Value                                      |
   |-----------------------|--------------------------------------------|
   | **Network Name**      | EVM on Flow Testnet                       |
   | **Description**       | The public RPC url for Flow Testnet       |
   | **RPC Endpoint**      | https://testnet.evm.nodes.onflow.org      |
   | **Chain ID**         | 545                                        |
   | **Currency Symbol**   | FLOW                                       |
   | **Block Explorer**    | [Flow Testnet Explorer](https://evm-testnet.flowscan.io) |

3. **Use the Flow Testnet Faucet**: Fund your account for testing by using the Flow Testnet Faucet.

## Running the Project

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about WIZZ and its features, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your WIZZ app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
