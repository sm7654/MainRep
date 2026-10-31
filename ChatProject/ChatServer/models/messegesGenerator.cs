public class MessagesGenerator
{
    private static MessagesGenerator? _instance;
    private static object intanceLock = new object();

    private MessagesGenerator()
    {
    }

    public static MessagesGenerator? Instance;

    public static MessagesGenerator GetIntance()
    {
        lock(intanceLock) {
            if (_instance == null)
            {
                _instance = new MessagesGenerator();
            }
            return _instance;
        }
    }

    public UserType createNewChatMessege(User target, User source)
    {
        UserType messege = new UserType();
        messege.target = target.GetId();
        messege.source = source.GetId();
        messege.sender = source.GetNickname();
        messege.type = MessegeType.NewChat;
        return messege;
    }
    public GroupType createGroupJoined(Group group, User source)
    {
        GroupType messege = new GroupType();
        messege.GroupID = group.getGroupID();
        messege.groupName = group.getGroupName();
        messege.source = "server";
        messege.target = source.GetId();
        messege.sender = "";
        messege.type = MessegeType.groupJoined;
        return messege;
    }
}
