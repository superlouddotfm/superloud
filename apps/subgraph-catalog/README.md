# Superloud catalog subgraph

## Pre-requisites

- Authenticate on The Graph hosted service and get your access token from your dashboard
- Install `@graphprotocol/graph-cli` on your machine (`pnpm i -g @graphprotocol/graph-cli`)

## Get started

- Grab the ABI of the contract you want to create a subgraph for, and paste it in `./abi`
- in `subgraph.yaml`, edti `dataSources` and make sure to use the right contract address, contract name and events

- `pnpm codegen` : Generate types

## Deploy subgraph to hosted service

Grab your access token from [your dashboard](https://thegraph.com/hosted-service/dashboard).

1. Authenticate with `graph auth --product hosted-service <ACCESS_TOKEN>`
2. Deploy with `graph deploy --product hosted-service <GITHUB_USER>/<SUBGRAPH NAME>`
