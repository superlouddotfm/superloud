import { create as ipfsHttpClient } from 'ipfs-http-client'
// To generate your project ID and secret key:
// -> https://www.infura.io/

export const ipfsClient = ipfsHttpClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: `Basic ${Buffer.from(
      import.meta.env.VITE_IPFS_INFURA_PROJECT_ID + ':' + import.meta.env.VITE_IPFS_INFURA_API_SECRET,
    ).toString('base64')}`,
  },
})
