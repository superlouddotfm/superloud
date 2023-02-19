# Superloud webapp

## Pre-requisites

- `node >=18` (use `nvm` to switch version easily)
- Install dependencies with `pnpm install`
- Get an Infura API (web3)
- Get an Infura API (IPFS)

## Environment variables

Copy `.env.dist` in your own `.env`.
It should look like this :

```
IPFS_INFURA_PROJECT_ID=
IPFS_INFURA_API_SECRET=
WEB3_INFURA_API_KEY_SECRET=
CONTRACT_CATALOG=0x49dD1c27100acDe5af60D5Bbd0a615c952bE2C5d
CONTRACT_CHALLENGES=
SUBGRAPH_CONTRACT_CATALOG=
SUBGRAPH_CONTRACT_CHALLENGES=
```

Replace all empty values with your own.
