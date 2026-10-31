
using System.CodeDom.Compiler;
using System.Collections.Concurrent;
using System.Net;
using System.Net.Sockets;
using System.Runtime.CompilerServices;
using System.Text.Json;
public static class services
{
    static ConcurrentDictionary<string, User> Users = new ConcurrentDictionary<string, User>();
    static ConcurrentDictionary<string, Group> groups = new ConcurrentDictionary<string , Group>();
    static MessagesGenerator generator = MessagesGenerator.GetIntance();


    private static string generateRandomString(int length)
    {
        Random _random = new Random();
        string chars = "a2QjWz3n0v1p7Gm5kI9oXebVd4yHcL6f8sT";

        char[] stringChars = new char[length];

        for (int i = 0; i < length; i++)
        {
            stringChars[i] = chars[_random.Next(chars.Length)];
        }
        return new string(stringChars);
    }
    private static string GenerateNewUserID(int length)
    {
        string ID;
        do
        {
            ID = generateRandomString(length);
        } while (Users.ContainsKey(ID));
        return ID;
    }
    private static string GenerateNewGroupID(int length)
    {
        string ID;
        do
        {
            ID = generateRandomString(length);
        } while (groups.ContainsKey(ID));
        return ID;
    }


    public static bool doesSessionExits(string ID)
    {
        if (Users.ContainsKey(ID) || groups.ContainsKey(ID))
            return false;
        return true;
    } 
    public static User CreateNewUser(TcpClient c,string nickname)
    {
        string ID = GenerateNewUserID(5);
        User u = new User(c, nickname, ID);
        Users.TryAdd(ID, u);
        return u;
    }
    public static bool tryAddUserToGroup(string gID, User u)
    {
        if (!groups.ContainsKey(gID))
            return false;
        Group g;
        groups.TryGetValue(gID, out g);
        //if memeber added to group send GroupJoined messege
        if (g.addMemberToGroup(u))
        {
            GroupType messege = generator.createGroupJoined(g, u);
            u.send(JsonSerializer.Serialize(messege));
            return true;
        }
        return false;
    }
    // create new chat between clients
    public static void tryCreateNewChat(string targetID, User source)
    {
        if (!Users.ContainsKey(targetID))
            return;
        User? target;
        Users.TryGetValue(targetID, out target);
        MessagesGenerator generator = MessagesGenerator.GetIntance();
        //send to chat creator new chat messege
        source.send( JsonSerializer.Serialize(generator.createNewChatMessege(source, target)) );
        //send to target new chat messege
        target.send( JsonSerializer.Serialize(generator.createNewChatMessege(target, source)) );
    }
    public static void createNewGroup(string groupName, User u)
    {
        string ID = GenerateNewGroupID(8);
        Group g = new Group(ID, groupName);
        g.addMemberToGroup(u);
        groups.TryAdd(ID, g);
        GroupType messege = generator.createGroupJoined(g, u);
        u.send(JsonSerializer.Serialize(messege));
    }
    public static Basic ParseMessage(string jsonString) {
        Basic? temp = JsonSerializer.Deserialize<Basic>(jsonString);
        
        if (temp == null) return null;

        switch (temp.type)
        {
            case MessegeType.messegeUser:
                return JsonSerializer.Deserialize<UserType>(jsonString);

            case MessegeType.messegeGroup:
            case MessegeType.groupJoined:
            case MessegeType.groupCreated:
            case MessegeType.createGroup:
                return JsonSerializer.Deserialize<GroupType>(jsonString);

            case MessegeType.ConnectStatus:
                return JsonSerializer.Deserialize<connectResponde>(jsonString);

            default:
                return temp;
        }
    }
    public static void handleServerMesseges(string JsonString, User u)
    {
        Basic messege;
        
        try {
            messege = ParseMessage(JsonString);
            switch (messege.type)
            {
            case MessegeType.NewChat:
                tryCreateNewChat(messege.target, u);
                break;
            case MessegeType.createGroup:
                createNewGroup(((GroupType)messege).groupName, u);
                break;
            case MessegeType.leaveGroup:
                break; 
            case MessegeType.joinGroup:

                tryAddUserToGroup(messege.target, u);
                break;
            default:
                break;
            }
        } catch (Exception E)
        {
            Console.WriteLine(E.Message + " the Json String is " + JsonString);
        }
        
    } 
    public static void passMessegeToTarget(string JsonString)
    {

        Group? g;
        User? u;
        Basic? deserializedMessege;
        
        deserializedMessege = JsonSerializer.Deserialize<Basic>(JsonString);
//        if ()

        
        if (groups.TryGetValue(deserializedMessege.target, out g))
        {
            Console.WriteLine("this is a group messege ");
            GroupType messege = (GroupType)ParseMessage(JsonString);
            g.broadCastMessege(messege);
        } else
        {
            Console.WriteLine("this is a user messege ");
         
            if (!Users.TryGetValue(deserializedMessege.target, out u))
                return;
            UserType messege = (UserType)ParseMessage(JsonString);
            u.send(JsonSerializer.Serialize(messege));
        }
    }

}








