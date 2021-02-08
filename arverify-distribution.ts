import Arweave from "arweave";
import { all } from "ar-gql";

const client = new Arweave({
  host: "arweave.net",
  port: 443,
  protocol: "https",
});

export const tokenAllocation = async (): Promise<{ address: string, weight: number }[]> => {
  const height = (await client.network.getInfo()).height;
  
  const query = `
query transactions($cursor: String, $fromBlock: Int) {
  transactions(
    tags: [
      { name: "Application", values: "ArVerify" }
      { name: "Action", values: "Verification" }
      { name: "Method", values: "Link" }
    ]
    after: $cursor
    block: { min: $fromBlock, max: ${height} }
  ) {
    pageInfo {
      hasNextPage
    }
    edges {
      cursor
      node {
        id
        recipient
        block {
          height
          timestamp
        }
        owner {
          address
        }
      }
    }
  }
}
`
  let timestamp = new Date();
  let yesterday = new Date(timestamp);
  yesterday.setDate(yesterday.getDate() - 1);

  const txs = await all(query)
  const filtered = txs.filter((tx) => {
    let timestamp = new Date(tx.node.block.timestamp * 1000);
    return yesterday.getTime() <= timestamp.getTime()
  })
  const owners = filtered.map((tx) => {
    return tx.node.owner.address
  })

  const allocations = {}
  for (const owner of owners) {
    if (!allocations[owner]) {
      allocations[owner] = 1
    } else {
      allocations[owner] += 1
    }
  }

  const astatine: { address: string, weight: number }[] = [];
  for (const address of Object.keys(allocations)) {
    astatine.push({
      "address": address,
      "weight": allocations[address]
    })
  }

  console.log(astatine)

  return astatine
}