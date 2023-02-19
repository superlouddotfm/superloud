# Superloud Solidity smart-contracts

Superloud uses Spinamp API as its source of truth.

- `SuperloudCatalog.sol`: karaoke catalog smart contrat

  - List the karaoke version of a song
  - Edit the karaoke version of a song (including unindexing it)
  - Get a karaoke version by its id
  - Get all karaoke versions of a specific song
  - Get all karaoke songs listed by a specific curator

- `SuperloudChallenges.sol`: karaoke challenges smart contract

## Get started

### Setup your environment

- (recommended) Set-up a wallet to deploy the contracts and fund it
- Get an API key for Infura web3 services
- Get an API key for Infura IPFS
- Copy the content of `.env.dist` in a fresh `.env` file and replace all values with yours. **Make sure to keep those values private !**
- In your terminal, run `pnpm install` - This will install the dependencies and you'll be good to go.

---

### How to...

- `pnpm compile` - Compile smart contracts. The ABI will be available in `./build/contracts`
- `pnpm truffle migrate --reset --network matic` - Deploy the smart contract to Polygon mumbai.

- `pnpm truffle run verify <CONTRACT NAMES> --network matic` - Verify contracts on Sourcify
  You can edit the scripts in `package.json` as well as the deployment configuration in `truffle-config.js`.

## Tooling

- Truffle
- Infura
