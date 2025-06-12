import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './Chat.css';
import { useChatContext } from './ChatContext/ChatContext';
import Arrow from "../../assets/icons/arrow.svg";
import { ReactComponent as Send } from "../../assets/icons/send.svg";
import Tail from "../../assets/icons/messageTail.svg";
import Read from "../../assets/icons/arrowsRead.svg";
import axios from 'axios';
import { GetBackendUrl } from '../ServiceFunctions/GetBackendUrl';
import Cookies from 'universal-cookie';
import { RefreshTokens } from '../ServiceFunctions/RefreshTokens';

interface MessageI {
    id: number;
    message: string;
    receiver_id: string;
    sender_id: string;
    created_at: string;
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
export default function Chat({setMessages,messages, socket}: {setMessages: any ,messages: MessageI[], socket: WebSocket|null}) {

    const [uuid, setUuid] = useState<string>('');
    const cookies = new Cookies();
    const getUser = (usId = String(window.location.pathname.split("/").pop())) => {
        if (usId == '') return
        if (localStorage.getItem(usId) != null) {
          setUserData(JSON.parse(localStorage.getItem(usId)!))
          return
        }
        const url = GetBackendUrl() + "/api/v1/users/"+usId;
        axios
          .get(url,{headers:{Authorization:cookies.get("access_token")}})
          .then((response)=>{
            let data = response.data
            if (data.error == "token expired" && window.location.pathname.toLowerCase() != "/auth") {
              RefreshTokens(cookies)
              getUser()
              return
            }
            if (data.error != null && data.error != "") {
              console.log(data)
              return
            }
            setUserData({...data.body.user,birthdate:(new Date(data.body.user.birthdate.Time).toLocaleDateString('ru-RU'))})
            localStorage.setItem(usId,JSON.stringify({...data.body.user,birthdate:(new Date(data.body.user.birthdate.Time).toLocaleDateString('ru-RU'))}))
          })
          .catch((error)=>{
            console.log(error)
          })
      }    

    
    const [userData, setUserData] = useState<User>({
        uuid: "",
        email: "",
        telegram_id: 0,
        firstname: "",
        lastname: "",
        avatar_url: "",
        avatar_file_name: "",
        password_hash: "",
        birthdate: "",
        status: "",
        education_place: "",
        education_level: "",
        about: "",
        jwt_version: 0,
        is_superuser: false,
        amount: 0
      });

    const [inputValue, setInputValue] = useState('');

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        if (socket == null ) {
            return
        }

        socket.send(JSON.stringify({
            message: inputValue,
            receiver_id: uuid,
        }))

        setMessages((prev: any)=>{
            return [
                ...prev,
                {
                    id: prev.length + 1,
                    message: inputValue,
                    receiver_id: uuid,
                    sender_id: cookies.get("uuid"),
                    created_at: new Date().toISOString()
                }     
            ]
        })
        setInputValue('');
    };


    const [isEnded, setIsEnded] = useState(false);
    useEffect(() => {
        let curUuid = String(window.location.pathname.split("/").pop());
        console.log(curUuid);
        setUuid(curUuid);
        getUser();
        let curMessages = JSON.parse(localStorage.getItem("messages") || "[]").filter((mes: MessageI) => mes.receiver_id == curUuid || mes.sender_id == curUuid);
        if (curMessages.length < 40) {
            getMessages();
        }
    },[])
    
    const getMessages = (usId = String(window.location.pathname.split("/").pop())) => {
        if (isEnded) return
        let url = GetBackendUrl()+"/api/v1/chats/"+usId+`?limit=40&offset=0` 
        if (messages.filter(mes=>mes.receiver_id == usId || mes.sender_id == usId).sort((a,b)=> a.id - b.id)[0]!=undefined) {
            url += "&from="+messages.filter(mes=>mes.receiver_id == usId || mes.sender_id == usId).sort((a,b)=> a.id - b.id)[0].id
        }
        axios
            .get(url, { headers: { "Authorization": cookies.get("access_token") } })
            .then((response) => {
                let data = response.data;
                if (data.error == "token expired") {
                    RefreshTokens(cookies)
                    getMessages();
                    return
                }
                if (data.error != "" && data.error != null) {
                    console.log(data.error);
                    return
                }
                if (data.body.messages == null) {
                    setIsEnded(true)
                    return
                } 
                if (data.body.messages.length < 40) {
                    setIsEnded(true)
                }
                setMessages((prevMessages: any) =>{ 
                    let tempMessages = []
                    for (let i = 0; i < data.body.messages.length; i++) {
                        data.body.messages[i].created_at = data.body.messages[i].created_at.Time
                        tempMessages.push(data.body.messages[i])
                    }
                    localStorage.setItem("messages",JSON.stringify([...prevMessages, ...tempMessages]))
                    
                    return [...prevMessages, ...tempMessages]
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }
    return (
        <div className="chatMain">
            <div className="chatHeader">
                <Link to="/chats" className="arrowReturnChat">
                    <img src={Arrow} />
                </Link>
                <img src={userData.avatar_url} alt="Аватар" className="chatUserAvatar" />
                <div className="chatUserInfo">
                    <h2>{userData.firstname+" "+userData.lastname}</h2>
                </div>
            </div>
            <div className="chatMessagesContainer">
                
                {
                    
                    messages.filter((msg) => msg.receiver_id === uuid || msg.sender_id === uuid).sort((a,b)=> a.id - b.id).map((msg) => (
                        <div key={msg.id} className={msg.sender_id === uuid ? "message received" : "message sent" }>
                            <p>{msg.message}</p>
                            <span className="time">
                                {
                                    String(new Date(msg.created_at).getUTCHours()).padStart(2, '0')+":"+ String(new Date(msg.created_at).getUTCMinutes()).padStart(2, '0')
                                }
                            </span>
                            <img src={Tail} alt="" className="tail" />
                            <img src={Read} alt="" className="arrowsRead" />
                        </div>
                    ))
                }
            </div>
        
            <form onSubmit={handleSendMessage} className="chatInputBlock">
                <input
                    type="text"
                    placeholder="Написать сообщение"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="chatInput"
                />
                <button type="submit" className="chatSendButton">
                    <Send className="sendIcon" />
                </button>
            </form>
        </div>
    );
}