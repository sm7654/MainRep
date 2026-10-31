public enum MessegeType: ushort
{
    messegeUser = 0,
    messegeGroup= 1,
    createGroup = 2,
    leaveGroup = 3,

    groupJoined = 4,
    groupCreated = 5,

    NewChat = 6,

    ConnectStatus = 7,
    joinGroup = 8
}
public class Basic
{
    public string? source {get; set;}
    public string? target {get; set;}
    public MessegeType type {get; set;}
}
public class GroupType: Basic
{
    public string? GroupID {get; set;}
    public string? groupName {get; set;}
    public string? sender {get; set;}
    public string? messege {get; set;}
}
public class UserType : Basic
{
    public string? sender {get; set;}
    public string? messege {get; set;}    
}
public class connectResponde : Basic
{
    public int status {get; set;}
}