
using System.Collections.Concurrent;
using System.Text.Json;

public class Group
{
    string groupId;
    string groupName;
    int onlineMembers;

    private static object membersLock = new object();


    ConcurrentDictionary<string, User> members = new ConcurrentDictionary<string, User>();

    public Group(string _groupId, string groupName)
    {
        this.groupId = _groupId;
        this.groupName = groupName;
        this.onlineMembers = 0;
    }
    public string getGroupID()
    {
        return this.groupId;
    }
    public string getGroupName()
    {
        return this.groupName;
    }
    public bool addMemberToGroup(User u)
    {
        if (members.TryAdd(u.GetId(), u)){
            lock(membersLock){
                onlineMembers++;
            }
            return true;
        }
        return false;
    }
    public void removeUser(User u)
    {
        KeyValuePair<string, User> userToRemove = new KeyValuePair<string, User>(u.GetId(), u);

        if (members.TryRemove(userToRemove))
        {
            lock (membersLock)
            {
                onlineMembers--;
            }
        }
    }
    public void broadCastMessege(GroupType messege)
    {
        ICollection<User> users = members.Values;
        foreach (User u in users)
        {
            if (u.GetId() != messege.source)
                new Thread(() => u.send(JsonSerializer.Serialize(messege))).Start();
        }
    }
}