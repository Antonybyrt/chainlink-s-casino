import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { TypeormDatabase } from '@subsquid/typeorm-store'
import * as erc20Abi from './abi/usdt'
import { Transfer } from './model'
import dotenv from 'dotenv'
dotenv.config()

const rpcUrl = process.env.RPC_ETH_HTTP
if (!rpcUrl) {
  throw new Error('RPC_ETH_HTTP environment variable is required')
}

// CasinoChip (CHIP) ERC20 on Sepolia
const chipAddress = (process.env.CHIP_ADDRESS ?? '0x6A39e7Aa28bF62Fad6f3eCef1beD77C03dD53095').toLowerCase()
// Block where the CHIP token was deployed (no CHIP transfers exist before it)
const startBlock = Number(process.env.START_BLOCK ?? 11278486)

const processor = new EvmBatchProcessor()
  .setGateway({
    url: 'https://v2.archive.subsquid.io/network/ethereum-sepolia',
    apiKey: process.env.SQD_API_KEY
  })
  .setRpcEndpoint({
    url: rpcUrl,
    rateLimit: 10
  })
  .setFinalityConfirmation(75) // 15 mins to finality
  .setBlockRange({ from: startBlock })
  .addLog({
    address: [chipAddress],
    topic0: [erc20Abi.events.Transfer.topic]
  })

const db = new TypeormDatabase()

processor.run(db, async ctx => {
  const transfers: Transfer[] = []
  for (let block of ctx.blocks) {
    for (let log of block.logs) {
      let { from, to, value } = erc20Abi.events.Transfer.decode(log)
      transfers.push(new Transfer({
        id: log.id,
        // lowercased so the GraphQL API can be queried with exact-match filters
        from: from.toLowerCase(),
        to: to.toLowerCase(),
        value,
        blockNumber: block.header.height,
        timestamp: new Date(block.header.timestamp)
      }))
    }
  }
  await ctx.store.insert(transfers)
})
