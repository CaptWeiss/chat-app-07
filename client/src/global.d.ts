interface IUserDTO {
    createdAt: string;
    email: string;
    id: number;
    isFetching: boolean;
    photoUrl: string|null;
    updatedAt: string;
    username: string;
}
interface IConversationDTO {
    id: number;
    lastReadMessageId: number;
    latestMessageText: string;
    messages: IMessageDTO[];
    otherUser: IOtherUserDTO;
    typing: boolean;
    unreadMessages: number;
    user2: null;
}
interface IMessageDTO {
    conversationId: number;
    createdAt: string;
    id: number;
    read: boolean;
    senderId: number;
    text: string;
    updatedAt: string;
}
interface IOtherUserDTO {
    id: number;
    username: string;
    photoUrl: string;
    online?: boolean;
}
interface IStateDTO {
    activeConversation: string;
    conversations: IConversationDTO[];
    user: IUserDTO;
}
