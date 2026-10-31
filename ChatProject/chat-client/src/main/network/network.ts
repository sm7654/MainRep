import Socket from 'net'




export class Network {
  private socket:Socket.Socket

  constructor(ip:string, port:number) {
    this.socket = Socket.connect(port, ip)
  
  }

  
}