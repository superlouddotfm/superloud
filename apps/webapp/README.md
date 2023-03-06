# Superloud webapp

## Pre-requisites

- `node >=18` (use `nvm` to switch version easily)
- Install dependencies with `pnpm install`
- Get an Infura API (web3)
- Get an Infura API (IPFS)
- Get a Livepeer API key
- Create a Web3Auth account and create a project

## Environment variables

Copy `.env.dist` in your own `.env`.
It should look like this :

```
VITE_IPFS_INFURA_PROJECT_ID=
VITE_IPFS_INFURA_API_SECRET=
VITE_WEB3_INFURA_API_KEY_SECRET=
VITE_CONTRACT_CATALOG=0xFD722E360eEAC232593DEd6bAbD433b1d97e528E
VITE_CONTRACT_CHALLENGES=
VITE_SUBGRAPH_CONTRACT_CATALOG_ENDPOINT=
VITE_SUBGRAPH_CONTRACT_CHALLENGES=
VITE_RPC_URL_MUMBAI_QUICKNODE=
VITE_RPC_URL_MUMBAI_INFURA=
VITE_LIVEPEER_API_KEY=
VITE_WEB3AUTH_CLIENT_ID=
```

Replace all empty values with your own.
