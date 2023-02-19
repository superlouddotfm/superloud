export function web3UriToUrl(uri: string): string {
  return uri?.replace('ipfs://', 'https://ipfs.io/ipfs/').replace('ar://', 'https://arweave.net/')
}
export default web3UriToUrl
