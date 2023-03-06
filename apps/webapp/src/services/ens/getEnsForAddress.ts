import { SUBGRAPH_API_ENDPOINT } from './config'

/**
 * @param query - get ENS name
 */
export async function getEnsForAddress(args: { query: string }) {
  const result = await fetch(SUBGRAPH_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: `
          query DomainsByAddress($query: String!) {
            domains(
              where: { 
                owner_contains_nocase: $query
              }
            ) {
              name
              resolver {
               texts
              }
          }          
        }
        `,
      variables: {
        query: args.query ?? '',
      },
    }),
  })

  return result
}

export default getEnsForAddress
