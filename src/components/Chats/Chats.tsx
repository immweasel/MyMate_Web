import { useEffect, useState } from 'react';
import './Chats.css';
import chatsGirl from "../../assets/images/chatsGirl.png";
import chatsWindow from "../../assets/images/chatsWindow.svg";
import { IChat } from './interfaces/interfaces';
import ChatsItem from './ChatsItem/ChatsItem';
import chatsItemMan from "../../assets/images/chatsItemMan.png";
import chatItemMan2 from "../../assets/images/chatItemMan2.png";
import chatItemGirl from "../../assets/images/chatItemGirl.png";

import { useChatContext } from "../Chat/ChatContext/ChatContext";
import Cookies from 'universal-cookie';
import axios from 'axios';
import { GetBackendUrl } from '../ServiceFunctions/GetBackendUrl';
import { RefreshTokens } from '../ServiceFunctions/RefreshTokens';


interface ChatMessage {
    id: number
    message: string
    receiver_id: string
    sender_id: string
    created_at: string
}
interface User {
    uuid: string;
    email: string;
    telegram_id: number;
    firstname: string;
    lastname: string;
    avatar_url: string;
    avatar_file_name: string;
    password_hash: string;
    birthdate: string;
    status: string;
    education_place: string;
    education_level: string;
    about: string;
    jwt_version: number;
    is_superuser: boolean;
    amount: number;
}
interface ChatWithUser {
    chat: ChatMessage
    user: User
}
export default function Chats({setMessages,messages}: any) {
    const [chats, setChats] = useState<ChatWithUser[]>([])
    const cookies = new Cookies();
    const getChats = () => {
        axios
            .get(GetBackendUrl() + "/api/v1/chats/", { headers: { "Authorization": cookies.get("access_token") } })
            .then((response) => {
                let data = response.data;
                if (data.error == "token expired") {
                    RefreshTokens(cookies)
                    getChats();
                    return
                }
                if (data.error != "" && data.error != null) {
                    console.log(data.error);
                    return
                }
                for (let i = 0; i < data.body.chats.length; i++) {
                    localStorage.setItem(data.body.chats[i].user.uuid, JSON.stringify(data.body.chats[i].user));         
                }
                setChats(data.body.chats);

            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(()=>{
        getChats();
    },[messages])

    return (
        <div className='chatsMain'>
            <p className='chatsTitle'>Диалоги</p>
            {chats.length === 0 ? (
                <div className='chatsEmptyColumn'>
                    <div className='chatsEmptyTextBlock'>
                        <img src={chatsWindow} alt="No chats window" />
                        <p className='chatsEmptyText'>Пока сообщений нет</p>
                    </div>
                    <img src={chatsGirl} alt="No chats illustration" className='chatsEmptyImage' />
                </div>
            ): (
                    <div className = 'chatsColumnItems'>
                        {chats.sort((a,b)=> a.chat.id - b.chat.id).map((item, index) => (
                            <ChatsItem
                                key={item.chat.id}
                                id={item.user.uuid}
                                name={item.user.firstname + " " + item.user.lastname}
                                cover={item.user.avatar_url}
                                state={true}
                            />
                        ))}
                    </div>
                )
            }
        </div >
    );

    // const [chats, setChats] = useState<IChat[]>([]);

    // useEffect(() => {
    //     load();
    // }, []);

    // const load = async () => {
    //     setChats([
    //         { id: 123, name: 'Андрей Николаев', cover: chatsItemMan, status: 'в сети' },
    //         { id: 124, name: 'Кира Максимова', cover: chatItemGirl, status: 'в сети' },
    //         { id: 125, name: 'Кирилл Девятов', cover: chatItemMan2, status: 'в сети' }
    //     ]);
    // };

    // return (
    //     <div className='chatsMain'>
    //         <p className='chatsTitle'>Диалоги</p>
    //         {chats.length === 0
    //             ? <div className='chatsEmptyColumn'>
    //                 <div className='chatsEmptyTextBlock'>
    //                     <img src={chatsWindow} alt="No chats window" />
    //                     <p className='chatsEmptyText'>Пока сообщений нет</p>
    //                 </div>
    //                 <img src={chatsGirl} alt="No chats illustration" className='chatsEmptyImage' />
    //             </div>
    //             : <div className='chatsColumnItems'>
    //                 {chats.map((item, index) => (
    //                     <ChatsItem
    //                         key={item.id}
    //                         id={item.id}
    //                         name={item.name}
    //                         cover={item.cover}
    //                         state={chats.length - 1 !== index} // передаем state как булево значение
    //                     />
    //                 ))}
    //             </div>}
    //     </div>
    // );
}
