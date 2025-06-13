import './App.css'
import { ChatProvider } from "./components/Chat/ChatContext/ChatContext";
import Profile from "./components/Profile/Profile";
// import profileImg from "./assets/images/profileImg.png";
import Navigation from "./components/Navigation/Navigation";
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Chats from "./components/Chats/Chats";
import Chat from "./components/Chat/Chat";
import Main from "./components/Main/Main";
// import MainCopy from "./components/Main/MainCopy";
import Auth from "./components/Auth/Auth";

import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import RestorePassword from './components/Login/RestorePassword/RestorePassword';

import Favourites from "./components/Favourites/Favourites";
import Ads from "./components/Ads/Ads";
import MyAds from "./components/Profile/MyAds/MyAds";
import Ad from "./components/Main/Ad/Ad";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CreateAds from "./components/Profile/CreateAds/CreateAds";
import PersonalData from "./components/Profile/PersonalData/PersonalData";
import Supporting from "./components/Profile/Help/Help";
import Balance from "./components/Profile/Balance/Balance.jsx";
import ReturnSup from "./components/Profile/ReturnSup.jsx";
import Promotion from "./components/Profile/Promotion/Promotion";
import Payment from "./components/Profile/Payment/Payment";
import Prodvigate from "./components/Profile/Prodvigate/Prodvigate";
import { useEffect, useState } from "react";
import { GetBackendUrl, GetBackendUrlWebsockets } from "./components/ServiceFunctions/GetBackendUrl";
import Cookies from "universal-cookie";
import axios from "axios";
import { RefreshTokens } from "./components/ServiceFunctions/RefreshTokens";
import { HelmetProvider } from 'react-helmet-async';

/*
import Support from "./components/Ads/Ads";
import ThemeColor from "./components/Ads/Ads";
import LogOut from "./components/Ads/Ads";
*/



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


interface MessageI {
  id: number;
  message: string;
  receiver_id: string;
  sender_id: string;
  created_at: string;
}

function Layout() {
  const location = useLocation();
  // const hideNavigation = location.pathname.toLowerCase() === '/auth';
  const currentPath = location.pathname.toLowerCase();
  // const hideNavigation = currentPath === '/auth' || currentPath === '/register' || currentPath === '/login' || currentPath === '/login/restore-password';
  const hideNavigation = ['/auth', '/register', '/login', '/login/restore-password', ''].includes(currentPath)
    || currentPath.startsWith('/chats/') || currentPath.startsWith('/chat/');
  const maincookies = new Cookies();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<MessageI[]>([]);

  const initWebsocket = () => {
    const newSocket = new WebSocket(GetBackendUrlWebsockets()+"/api/v1/chats/websocket?token=" + encodeURIComponent(maincookies.get("access_token")));
    newSocket.onmessage = socketOnMessage;
    
    newSocket.onclose = (event) => {
      console.log("socker closed:", event);
    }

    newSocket.onopen = () => {
      console.log("socker open");
    }

    newSocket.onerror = (event) => {
      console.log("socker error", event);
    }


    setSocket(newSocket);
  }

  const socketOnMessage = (event: MessageEvent) => {
    let data = JSON.parse(event.data);
    if (data.error == "token expired") {
      RefreshTokens(maincookies);
      initWebsocket();
      return
    }

    if (data.error != null && data.error != "" && data.error != undefined) {
      console.log(data);
      return
    }

    setMessages((prevMessages) => [...prevMessages, data.body.message]);
  }

  useEffect(() => {
    localStorage.setItem("messages",JSON.stringify(messages));
  },[messages])

  const [isTgLoaded,setIsTgLoaded] = useState(false);
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

  const [adsCount, setAdsCount] = useState(0)
  const [likesCount, setLikesCount] = useState(0)


  const loadLikes = async () => {
    //setFavourites([{ id: 123, title: 'Ищу соседа в район Чистые пруды', subtitle: 'Квартира найдена, двушка, 50 кв.м., современный ремонт', cover: adAppartment1 }, { id: 1234, title: 'Ищу соседа в районе Сокол', subtitle: 'Квартира найдена, двушка, 63 кв.м., не самый новый ремонт', cover: adAppartment1  }, { id: 12345, title: 'В поиске соседей для съема жилья у метро Алтуфьево', subtitle: 'Квартира найдена, трешка, 80 кв.м., стильный ремонт', cover: adAppartment1  }]);
    axios.
        get(GetBackendUrl()+"/api/v1/favourites/"+`?limit=${20}&offset=${0}`, { headers: { "Authorization": cookies.get("access_token") } })
        .then((response) => {
            let data = response.data;
            if (data.error == "token expired") {
                RefreshTokens(cookies)
                loadLikes();
                return
            }
            if (data.error != "" && data.error != null) {
                console.log(data.error);
                return
            }
            setLikesCount(data.body.favourites?.length || 0);
        })
        .catch((error)=>{
            console.log(error)
        })
  };


  const getFlats = () => {
    
    let url = GetBackendUrl() + "/api/v1/flats?offset=" + 0 + "&limit=" + 20+"&created_by_id="+userData.uuid;
    axios
        .get(url, { headers: { "Authorization": cookies.get("access_token") } })
        .then((response) => {
            let data = response.data;
            if (data.error == "token expired") {
                RefreshTokens(cookies)
                getFlats();
                return
            }
            if (data.error != "" && data.error != null) {
                console.log(data.error);
                return
            }
            setAdsCount(data.body.flats?.length || 0);
        })
        .catch((error) => {
            console.log(error);
        });
  }


  const cookies = new Cookies();
  const getUser = () => {
    const url = GetBackendUrl() + "/api/v1/users/me";
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
        localStorage.setItem("userData",JSON.stringify({...data.body.user,birthdate:(new Date(data.body.user.birthdate.Time).toLocaleDateString('ru-RU'))}))
      })
      .catch((error)=>{
        console.log(error)
      })
  }
  useEffect(()=>{
    if (isTgLoaded) {
      getUser()
    }
  },[isTgLoaded])
  useEffect(()=>{
    let tempMessages = JSON.parse(localStorage.getItem("messages") || "[]");
    setMessages(tempMessages);
    initWebsocket();
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-web-app.js';
    script.async = true;
    script.onload = () => {
      if ((window as any).Telegram && (window as any).Telegram.WebApp) {
        (window as any).Telegram?.WebApp?.ready();
        localStorage.setItem("initData",JSON.stringify((window as any).Telegram?.WebApp?.initData));
        setIsTgLoaded(true)
      } else {
        setIsTgLoaded(false)
      }
    };
    script.onerror = () => {
        setIsTgLoaded(true)
    }
    document.body.appendChild(script);
  },[])

  useEffect(()=>{
    if (userData.uuid != "" && window.location.pathname.toLowerCase() == "/profile") {
      getFlats()
      loadLikes()
    }
  },[userData])

  return (
    <>
      {!hideNavigation && <Navigation />}
      {isTgLoaded &&
      <Routes>
        <Route path="/" element={<Main />} />
        {/* <Route path="/maincopy" element={<MainCopy />} /> */}
        <Route path="/auth" element={<Auth />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/restore-password" element={<RestorePassword />} />

        <Route path="/favourites" element={<Favourites />} />
        <Route path="/ads" element={<Ads />} />
        <Route path="/chats" element={<Chats setMessages={setMessages} messages={messages}/>} />
        {/* <Route path="/chats/:userName" element={<Chat setMessages={setMessages} socket={socket} messages={messages}/>}  />*/}
        <Route path="/chat/:uuid" element={<Chat setMessages={setMessages} socket={socket} messages={messages}/>}  />
        <Route path="/profile" element={<Profile getUser={getUser} userImg={userData.avatar_url} userName={userData.firstname + " " + userData.lastname} userCity={userData.education_place} userDescription={userData.about} cntAds={adsCount} cntMoney={userData.amount} cntFavourites={likesCount} />} />
        <Route path="/profile/myAds" element={<MyAds id={userData.uuid}/>} />


        <Route path="/profile/balance" element={<Balance money="" />} />
        <Route path="/profile/support" element={<Supporting />} />
        <Route path="/profile/returnsup" element={<ReturnSup Obr="" formLink={"https://forms.yandex.ru/u/6723b7ad73cee78f6876e5eb/"}/>} />

        <Route path="/profile/promotion" element={<Promotion />} />
        <Route path="/profile/prodvigate" element={<Prodvigate />} />
        <Route path="/profile/payment" element={<Payment />} />
        {/*  <Route path="/profile/support" element={<Support />} />
        пока не ясно куда ведет
        <Route path="/profile/themeColor" element={<ThemeColor />} />
        <Route path="/profile/logOut" element={<LogOut />} />
        */}

        <Route path="/ad/:id" element={<Ad />} />
        <Route path="/profile/myAds/createAds" element={<CreateAds />} />
        <Route path="/profile/personalData" element={<PersonalData userData={userData} getUser={getUser}/>} />
      </Routes>
    }
    </>
    
  )
}

function App() {


  return (
    <HelmetProvider>
      <Router>
        {/* <Layout /> */}
        <ChatProvider>
          <Layout />  
        </ChatProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
