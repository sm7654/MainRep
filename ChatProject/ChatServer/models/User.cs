
using System.Net.Sockets;
using System.Text;
using System.Text.Json;
public class User
{
    string nickname {get; set;}
    string id {get; set;}
    
    TcpClient sock;

    private static object sendLock = new object();


    public User(TcpClient c,string _nickname, string _id)
    {
        this.nickname = _nickname;
        this.id = _id;
        this.sock = c;
        new Thread(listenToClient).Start();

    }

    public void listenToClient()
    {
        
        while (this.sock.Connected)
        {
            byte[] LenBuffer = new byte[4];

            try {
                this.sock.GetStream().ReadExactly(LenBuffer);
            } catch { this.sock.Close(); }
            int num = BitConverter.ToInt32(LenBuffer, 0);
            byte[] dataBuffer = new byte[num];

            try {
                this.sock.GetStream().ReadExactly(dataBuffer);
            } catch {this.sock.Close();}

            new Thread(() => handleData(dataBuffer)).Start();
        }
    }

    private void handleData(byte[] dataBuffer)
    {
        
        string jsonTxt = Encoding.UTF8.GetString(dataBuffer);
        Basic? deserializedMessege;
        try {
         deserializedMessege = JsonSerializer.Deserialize<Basic>(jsonTxt);
        } catch { return; }
        if (deserializedMessege?.target == "server")
        {
            services.handleServerMesseges(jsonTxt, this);
        }
        else
        {
            services.passMessegeToTarget(jsonTxt);
        }
        
    }

    public void send(string txt)
    {
        try{
        lock (sendLock) {
            byte[] bytes = Encoding.UTF8.GetBytes(txt);
            byte[] lengthBytes = BitConverter.GetBytes(bytes.Length);
            sock.GetStream().Write(lengthBytes);
            sock.GetStream().Write(bytes);  
        }} catch
        {
            this.sock.Close();
        }
    }

        public string GetId()
    {
        return this.id;
    }
    public string GetNickname()
    {
        return this.nickname;
    }

}









