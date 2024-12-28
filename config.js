import { bootstrap } from '@libp2p/bootstrap'
import { tcp } from '@libp2p/tcp'
import { identify } from '@libp2p/identify'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { preSharedKey } from '@libp2p/pnet'
import { kadDHT } from "@libp2p/kad-dht";

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const filePath = path.join(__dirname, "swarm.key")
const swarmKey = fs.readFileSync(filePath, 'utf8')

export const getLibp2pOptions = (bn)=> {
    return {
      peerDiscovery:[bootstrap({list:bn})
      ],
      connectionProtector: preSharedKey({
        psk: Buffer.from(swarmKey)
      }),
      addresses: {
        listen: ['/ip4/0.0.0.0/tcp/0'],
      },
      transports: [
      tcp()
      ],
      connectionEncrypters: [noise()],
      streamMuxers: [yamux()],
      services: {
        identify: identify(),
        dht: kadDHT({
          clientMode: false,
        }),
      }
    }
    
  }