import { bootstrap } from '@libp2p/bootstrap'
import { tcp } from '@libp2p/tcp'
import { identify } from '@libp2p/identify'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'


export const getLibp2pOptions = (bn)=> {
    return {
      peerDiscovery:[bootstrap({list:bn}),
      ],
      addresses: {
        listen: ['/ip4/0.0.0.0/tcp/0'],
      },
      transports: [
      tcp(),
      ],
      connectionEncryption: [noise()],
      streamMuxers: [yamux()],
      connectionGater: {
        denyDialMultiaddr: () => false,
      },
      services: {
        identify: identify(),
      }
    }
    
  }