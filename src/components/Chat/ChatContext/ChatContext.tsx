import React, { createContext, useState, useContext } from 'react';
import { IChat } from '../../Chats/interfaces/interfaces';
import chatsItemMan from "../../../assets/images/chatsItemMan.png";
import chatItemGirl from "../../../assets/images/chatItemGirl.png";
import chatItemMan2 from "../../../assets/images/chatItemMan2.png";

interface ChatContextType {
    chats: IChat[];
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [chats] = useState<IChat[]>([
        { id: '123', name: 'Андрей Николаев', cover: chatsItemMan, status: 'Был(а) в сети 2 часа назад' },
        { id: '124', name: 'Кира Максимова', cover: chatItemGirl, status: 'В сети' },
        { id: '125', name: 'Кирилл Девятов', cover: chatItemMan2, status: 'Был(а) недавно' }
    ]);

    return (
        <ChatContext.Provider value={{ chats }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChatContext must be used within a ChatProvider');
    }
    return context;
};