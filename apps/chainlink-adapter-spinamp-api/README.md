# chainlink-adapter-spinamp-api

A Chainlink external adapter to interact with the Spinamp API.
Heavily inspired by [this repository](https://github.com/zeuslawyer/cl-fall22-external-adapters/tree/3_advanced_ea_server).

Deployed with [`fly.io`](https://fly.io).

Request used :

```
query GetSongCreator {
  processedTrackById(id: "<track-id>") {
    id
    artistByArtistId {
      address
    }
  }
}
```

## Request example

- Deployed instance :
  `curl -X POST -H "content-type:application/json" "https://chainlink-adapter-spinamp-api.fly.dev/" --data '{ "id": 1, "data": { "idSong":"ethereum/0x003d03980d2d4332e5f92e54905a694c614df36f/1" } }'`

- Locally :
  `curl -X POST -H "content-type:application/json" "https://localhost:8080/" --data '{ "id": 1, "data": { "idSong":"ethereum/0x003d03980d2d4332e5f92e54905a694c614df36f/1" } }'`

Response example :

```
{"jobRunID":1,"data":{"result":{"data":{"processedTrackById":{"id":"ethereum/0x003d03980d2d4332e5f92e54905a694c614df36f/1","artistByArtistId":{"address":"0xe6445bd1d9674fE7fbEdAD2F56F3B1eAEA1b029e"}}}},"date":"Fri, 10 Feb 2023 09:35:25 GMT"},"result":{"data":{"processedTrackById":{"id":"ethereum/0x003d03980d2d4332e5f92e54905a694c614df36f/1","artistByArtistId":{"address":"0xe6445bd1d9674fE7fbEdAD2F56F3B1eAEA1b029e"}}}},"statusCode":200}%

```

## Deploy the adapter to fly.io

### Pre-requisites

- Get a [`fly.io`](https://fly.io) account
- Install `flyctl`, the fly CLI
- In your terminal, authenticate with `flyctl auth login`
- Run `flyctl launch`

### Deployment

- In your terminal, run `fly deploy`
