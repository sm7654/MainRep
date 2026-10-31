using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Text.Json;
public class ConnectRequest
{
    public string SessionID { get; set; }
    public string Nickname { get; set; }
}

public class Program
{
    public static void sendToClient(TcpClient c, string TXT)
    {
        byte[] bytes = Encoding.UTF8.GetBytes(TXT);
        byte[] lengthBytes = BitConverter.GetBytes(bytes.Length);
        c.GetStream().Write(lengthBytes);
        c.GetStream().Write(bytes);   
    }
    public static ConnectRequest reciveConnectRequest(TcpClient c)
    {
        byte[] LenBuffer = new byte[4];
        c.GetStream().ReadExactly(LenBuffer);
        int num = BitConverter.ToInt32(LenBuffer, 0);
        byte[] dataBuffer = new byte[num];
        c.GetStream().ReadExactly(dataBuffer);
        string jsonTxt = Encoding.UTF8.GetString(dataBuffer);
        ConnectRequest? deserializedReuqst = JsonSerializer.Deserialize<ConnectRequest>(jsonTxt);
        return deserializedReuqst;
    }


    public static void handleNewClient(TcpClient client) {
        //send to client
        ConnectRequest newRequest = reciveConnectRequest(client);
        connectResponde responde = new connectResponde();
        User NewUser = services.CreateNewUser(client, newRequest.Nickname);
        responde.target = NewUser.GetId(); 
        responde.source = "server";
        responde.type = MessegeType.ConnectStatus;
        responde.status = 100; // connected 



        sendToClient(client, JsonSerializer.Serialize(responde));
        if (newRequest.SessionID != "")
        {
            services.tryAddUserToGroup(newRequest.SessionID, NewUser);
            services.tryCreateNewChat(newRequest.SessionID, NewUser);
            
        }
    }
    public static void StartServer(int port=5000)
    {
        var listener = new TcpListener(IPAddress.Any, port);
        listener.Start();
        while (true)
        {
            
            
            TcpClient client = listener.AcceptTcpClient();  
            new Thread(() =>
            {
                handleNewClient(client);
            }).Start();
            
        }
    }
    static void Main()
    {
        GroupType Group = new GroupType();
        UserType User = new UserType();


        StartServer(5000);
    }

}