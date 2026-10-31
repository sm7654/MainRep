
export class messege {
    messegeKey: number = 0
    senderNickname:string = ""
    messege: string = ""
    isMe: boolean = false

    constructor(senderNickname:string, messege: string, isMe:boolean) {
        this.senderNickname = senderNickname
        this.messege = messege
        this.isMe = isMe
    }
}
export class group {
    groupID: string = ""
    groupName: string = ""
    members: number = 0
    isUserChat: boolean = false
    messeges: messege[] = []
    constructor(groupID:string, groupName:string, memCount: number) {
        this.groupID = groupID;
        this.groupName = groupName;
        this.members = memCount;
    }

    addMessege(newMessege:messege) {
        if (this.messeges.length > 0)
        {
            newMessege.messegeKey = this.messeges[this.messeges.length - 1].messegeKey + 1
        } else {
            newMessege.messegeKey = 1;
        }
        this.messeges.push(newMessege)
    }
    getMesseges():messege[] {
        return this.messeges
    }
}

export class chatMenegment {
    static #instance: chatMenegment;

    groupsCount: number = 0;
    groupMap = new Map<string, group>();
    nickname:string = ""
    ID:string = ""

    constructor() {
        
    }
    public static getIntance():chatMenegment {
        if (!chatMenegment.#instance)
            chatMenegment.#instance = new chatMenegment();
        
        return chatMenegment.#instance;
    }
    doesGroupExist(groupID: string) {
        return this.groupMap.has(groupID)
    }
    addGroup(Group:group): void {
        if (!this.doesGroupExist(Group.groupID))
            this.groupMap.set(Group.groupID, Group)
    }
    getGroup(groupID: string) {
        if (!this.doesGroupExist(groupID))
            return
        return this.groupMap.get(groupID)
    }
    getMessegesFromGroup(groupID: string) {
        if (!this.doesGroupExist(groupID))
            return
        return this.groupMap.get(groupID)?.messeges
    }
    addMessegeToGroup(groupID: string, newMessege:messege) {
        if (this.doesGroupExist(groupID))
            this.groupMap.get(groupID)?.addMessege(newMessege)
    }
    getGroupsMap() {
        return Array.from(this.groupMap.values())
    }
}