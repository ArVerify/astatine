import {all} from "ar-gql";

const tokenAllocation = async () => {
  const query = `
query transactions($cursor: String, $fromBlock: Int) {
  transactions(
    tags: [
      { name: "Application", values: "ArVerify" }
      { name: "Action", values: "Verification" }
      { name: "Method", values: "Link" }
    ]
    after: $cursor
    block: { min: $fromBlock }
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

  const allocation = {}
  for (const owner of owners) {
    if (!allocation[owner]) {
      allocation[owner] = 1
    } else {
      allocation[owner] += 1
    }
  }

  console.log(allocation)
}

tokenAllocation()