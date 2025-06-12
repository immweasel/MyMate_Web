//import React, { useState } from "react";
import "./Auth.css";
// import CustomInputLogin from "./CustomInputLogin/CustomInputLogin";
// import { ReactComponent as EmailSvg } from "../../assets/icons/email.svg";
// import { ReactComponent as PasswordSvg } from "../../assets/icons/password.svg";
// import { ReactComponent as LogoSvg } from "../../assets/icons/logo.svg";
import Logo from "../../assets/images/logo.png";
import Book from "../../assets/icons/book.svg";
import Eyes from "../../assets/icons/eyes.svg";
import Dialogue from "../../assets/icons/dialogue.svg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import axios from 'axios';
import { GetBackendUrl } from "../ServiceFunctions/GetBackendUrl";

export default function Auth() {
    const cookies = new Cookies();
    const navigate = useNavigate(); 
    const [isTelegram, setIsTelegram] = useState<boolean>(false);

    const infoItems = [
      {
        icon: Book,
        title: "Заполняй профиль",
        description: "Расскажи о себе, чтобы идеальный сосед нашел тебя сам",
      },
      {
        icon: Eyes,
        title: "Ищи соседа",
        description:
          "Найди себе идеального соседа, с которым у тебя будут совпадать интересы",
      },
      {
        icon: Dialogue,
        title: "Используй чаты",
        description:
          "Знакомься с будущими соседями, общайся и находи того, с кем тебе будет комфортно",
      },
    ];

    const authenticateTelegram = (isRegister: boolean = false) => {
      let initData = JSON.parse(localStorage.getItem("initData") || "{}");
        axios.
          post(!isRegister ? GetBackendUrl()+"/api/v1/auth/telegram/sign-in" : "/api/v1/auth/telegram/sign-up", {"initData":initData})
          .then((response)=>{
            let data = response.data;
            if (data.error == "user not exists" && !isRegister) {
              authenticateTelegram(true);
              return
            }
            if (data.error != null && data.error != "") {
              console.log(data.error);
              return
            }
            cookies.set("access_token",data.body.access_token, {maxAge:31536000});
            cookies.set("refresh_token",data.body.refresh_token, {maxAge:31536000});
            navigate("/");
          })
    }
    const handleStart = () => {
      if (isTelegram) {
        authenticateTelegram();
        return;
      }
    };

    useEffect(()=>{
      if (localStorage.getItem("initData") == null || localStorage.getItem("initData") == undefined || localStorage.getItem("initData") == "" || localStorage.getItem("initData") == `""`) {
        setIsTelegram(false)
        window.location.href = "/login"
        return
      } 
      setIsTelegram(true)
    },[])
    

  return (
    <div className="mainAuth">
      <img src={Logo}  width="295" height="120.55"></img>
      <p className='nameAuth'>Найди своего <p className="nameAuth">идеального соседа</p></p>

      <div className="infoApp">
        {infoItems.map((item, index) => (
          <div className="infoItem" key={index}>
            <div>
              <img src={item.icon} alt={`${item.title} icon`} />
              <span>{item.title}</span>
            </div>
            <p>{item.description}</p>
          </div>
        ))}
      </div>

      <div className="AuthDown">

        <p className='OpisAuth'>Нажимая на кнопку "Начать", вы соглашаетесь с <br></br> <span>
            <a href='https://dev.vk.com/ru/user-agreement'>
              правилами использования сервиса
            </a>
        </span> и <a href='https://dev.vk.com/ru/privacy-policy'>
            правилами защиты информации о пользователях сервиса
          </a>
        </p>

        {/* <p className='OpisAuth'>Нажимая на кнопку "Начать", вы соглашаетесь с</p>
        
        <div className="texti">
          <a href='https://dev.vk.com/ru/user-agreement' className="Link">
              <p className='OpisAuth'>правилами использования сервиса</p>
          </a>
          <div className='OpisAuth'>и</div>
          <a href='https://dev.vk.com/ru/privacy-policy' className="Link">
              <div className='OpisAuth'>правилами защиты</div>
          </a>
        </div>

        <a href='https://dev.vk.com/ru/privacy-policy' className="Link">
            <p className='OpisAuth'>информации о пользователях сервиса</p>
        </a> */}

        <button className='AuthButton' onClick={handleStart}>Начать</button>

        <div className="AuthDown" onClick={()=>navigate("/login")}><p className='OpisAuth'>Войти с помощью почты</p></div>
      </div>
        {/* <button className='AuthButton' onClick={handleStart}>Начать</button> */}
    </div>
  );
};