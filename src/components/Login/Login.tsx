import React from 'react';
import "./Login.css";
import { Link } from 'react-router-dom';
import Logo from "../../assets/images/logo.svg";
import Mail from "../../assets/icons/mail.svg";
import Lock from "../../assets/icons/lock.svg";
import Check from "../../assets/icons/eye.svg";
import People from "../../assets/images/peopleLogin.svg";
import axios from 'axios';
import Cookies from 'universal-cookie';
import { GetBackendUrl } from '../ServiceFunctions/GetBackendUrl';

export default function Login() {
    const [showPassword, setShowPassword] = React.useState(false);
    const [login, setLogin] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [remember, setRemember] = React.useState(false);
    const cookies = new Cookies();
    const signIn = () => {
        axios
            .post(GetBackendUrl()+"/api/v1/auth/mail/sign-in", {
                "email": login,
                "password": password
            })
            .then((response) => {
                let data = response.data;
                if (data.error == "user is not active") {
                    alert("Пользователь не активирован");
                    return
                }
                if (data.error == "invalid data") {
                    alert("Некорректные данные");
                    return
                }
                if (data.error == "invalid credentials") {
                    alert("Неправильные логин или пароль");
                    return
                }
                if (data.error!="" && data.error!=null) {
                    alert("Что-то пошло не так");
                    console.log(data.error);
                    return
                }
                cookies.set("access_token",data.body.access_token, {maxAge:remember ? 31536000 : 300});
                cookies.set("refresh_token",data.body.refresh_token, {maxAge:remember ? 31536000 : 300});
                window.location.href = "/";
            })
    }
    
    return (
        <div className="mainLogin">
            <div className="contentLogin">
                <img src={Logo} className="imgLogoLogin"></img>

                <div className="formLogin">
                    <h2>Авторизация</h2>

                    <div className="fieldsFormLog">
                        <div className="contInputField">
                            <img src={Mail} className="iconInput"></img>
                            <input
                                value={login}
                                onChange={(e)=>setLogin(e.target.value)}
                                type="text"
                                id="login"
                                name="login"
                                placeholder="Логин"
                                className="inputFormLog"
                            />
                        </div>

                        <div className="contInputField">
                            <img src={Lock} className="iconInput" />
                            <input
                                value={password}
                                onChange={(e)=>{setPassword(e.target.value)}}
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                placeholder="Пароль"
                                className="inputFormLog"
                            />
                            <img
                                src={Check}
                                className="iconCheck"
                                alt="Показать пароль"
                                onClick={() => setShowPassword(prev => !prev)}
                            />
                        </div>
                    </div>

                    <div className="rememberBlock">
                        <label className="checkboxLabel">
                            { !remember ?
                                <input type="checkbox" onChange={(e)=>setRemember(true)} className="checkboxInput" />
                            :
                                <input type="checkbox" onChange={(e)=>setRemember(false)} className="checkboxInput" />
                            }
                            <span className="checkboxCustom"></span>
                            <span className="checkboxText">Запомнить</span>
                        </label>
                        <Link to="restore-password" className="forgotPassword">Забыли пароль?</Link>
                    </div>

                    <div className="buttonsBlock">
                        <button className="buttonLog" onClick={signIn}>Войти</button>
                        <Link to="/register">Зарегистрироваться</Link>
                    </div>
                </div>
            </div>

            <img src={People} className="imgPeopleLog" />
            
        </div>
    );
};
