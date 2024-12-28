export const getNodeInfo = async(url)=>{
    // Construct the URL using the current protocol and the retrieved host
    url = `${url}/api/`;
    const res =await fetch(url, {headers:{ 'Accept': 'application/json',
    'Content-Type': 'application/json'}})
    const data = await res.json()
     return data
  }