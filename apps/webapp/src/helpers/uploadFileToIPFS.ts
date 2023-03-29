import { ipfsClient } from '~/config/ipfs'

async function uploadFileToIPFS(file: any) {
    const result = await ipfsClient.add(file)
    const cid = result.path
    return `ipfs://${cid}`
}

export default uploadFileToIPFS