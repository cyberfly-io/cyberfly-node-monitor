import { createLibp2p } from 'libp2p'
import { getLibp2pOptions } from './config.js'
import { getNodes } from './pact-services.js'
import { getNodeInfo } from './node-services.js'
import { multiaddr } from '@multiformats/multiaddr'
import { disableNode } from './pact-services.js'

let bootstrap_nodes = ["/dns4/node.cyberfly.io/tcp/31001/p2p/QmSbaexTeVSBTjhFwJRZpvCc7PqPs84pBHysgvWUz5DeW6"]

const libp2p = await createLibp2p(getLibp2pOptions(bootstrap_nodes))

libp2p.addEventListener('peer:connect', (evt) => {
    const peerId = evt.detail
    console.log('Connection established to:', peerId.toString())
  })



const monitor_nodes = async()=>{
const nodeData = await getNodeInfo()
const connectedPeers = nodeData.peers
  getNodes().then(nodes=>{
    const data = nodes.result.data
      data.forEach(element =>{
        const ma = multiaddr(element.multiaddr)
        libp2p.dial(ma).then(d=>console.log(element.peer_id + ' - dial success')).catch(err=>{
          
          if (!connectedPeers.includes(element.peer_id)){
            disableNode(element.peer_id, element.multiaddr)
          }
          else{
            console.log(element.peer_id+ " - connected to bootstrap node")
          }
        })
      });
  })
}
monitor_nodes()
setInterval(monitor_nodes, 3600000)