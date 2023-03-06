import { SUBGRAPH_API_ENDPOINT } from './config'

/**
 * @param query - free search text on ENS name
 */
export async function searchEnsName(args: { query: string }) {
  const result = await fetch(SUBGRAPH_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: `
          query Domains($query: String!) {
            domains(first: 30 where: {
                 name_contains: $query
                 resolvedAddress_not: null 
                }
            ) {
              id
              name
              resolvedAddress {
                  id
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

export default searchEnsName
