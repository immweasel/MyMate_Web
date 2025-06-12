import React, { useState } from "react";
import "./Register.css";
import Logo from "../../assets/images/logo.svg";
import Arrow from "../../assets/icons/arrow.svg";
import SelectIcon from "../../assets/icons/select.svg";
import Check from "../../assets/icons/eye.svg";
import { Link } from "react-router-dom";
import CodeInput from "../Login/RestorePassword/CodeInput";
import axios from "axios";
import { GetBackendUrl } from "../ServiceFunctions/GetBackendUrl";
import Cookies from "universal-cookie";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);
    const [date, setDate] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [activatePage, setActivatePage] = useState(false)
    const [activateCode, setActivateCode] = useState("")
    const [uuid, setUuid] = useState("")
    const cookies = new Cookies();
    const submit = () => {
        if (password !== passwordRepeat) {
            alert("Пароли не совпадают");
            return;
        }

        if (!firstName || !lastName || !date || !email || !password || !passwordRepeat) {
            alert("Заполните все поля");
            return;
        }
        
        axios
            .post(GetBackendUrl()+"/api/v1/auth/mail/sign-up",{
                "firstname": firstName,
                "lastname": lastName,
                "birthdate": date,
                "email": email,
                "password": password
            })
            .then((response) => {
                let data = response.data;
                
                if (data.error == "invalid data") {
                    alert("Некорректные данные");
                    return
                }

                if (data.error == "user already exists") {
                    alert("Пользователь с таким email уже зарегистрирован");
                    return
                }

                if (data.error!="" && data.error!=null) {
                    alert("Что-то пошло не так");
                    console.log(data.error);
                    return
                }

                setActivatePage(true)
                setUuid(data.body.user_id)
            })
            .catch((error) => {
                console.log(error);
            });  
    }

    const activate = () => {
        axios
            .post(GetBackendUrl()+"/api/v1/auth/mail/activate/"+uuid,{
                "otp": activateCode
            })
            .then((response) => {
                let data = response.data;
                if (data.error == "invalid data") {
                    alert("Некорректные данные");
                    return
                }
                if (data.error == "attempts ended") {
                    alert("Количество попыток истекло");
                    return
                }
                if (data.error == "timed out") {
                    alert("Время истекло");
                    return
                }
                if (data.error == "user already activated") {
                    alert("Пользователь уже активирован");
                    return
                }
                if (data.error == "user not found") {
                    alert("Пользователь не найден");
                    return
                }
                if (data.error!="" && data.error!=null) {
                    alert("Что-то пошло не так");
                    console.log(data.error);
                    return
                }
                cookies.set("access_token", data.body.access_token, { path: "/", maxAge: 31536000 });
                cookies.set("refresh_token", data.body.refresh_token, { path: "/", maxAge: 31536000 });
                window.location.href = "/";
            })
            .catch((error) => {
                console.log(error);
            });
    }
    const handleDateClick = (event: React.MouseEvent<HTMLInputElement>) => {
        const input = event.target as HTMLInputElement;
        if ("showPicker" in input) {
            input.showPicker();
        }
    };


    const getNewOTP = () => {
        axios
            .post(GetBackendUrl()+"/api/v1/auth/mail/get-otp",{
                "email":email
            })
            .then((response) => {
                let data = response.data;
                if (data.error == "user not found") {
                    alert("Пользователь не найден");
                    return
                }
                if (data.error == "invalid data") {
                    alert("Некорректные данные");
                    return
                }
                if (data.error == "email not set") {
                    alert("Email не установлен");
                    return
                }
                if (data.error == "wait 5 minutes before trying again") {
                    alert("Попробуйте еще раз через 5 минут");
                    return
                }
                if (data.error!="" && data.error!=null) {
                    alert("Что-то пошло не так");
                    console.log(data.error);
                    return
                }
                alert("Код отправлен на вашу почту")
            })
            .catch((error) => {
                console.log(error);
            });
    }
    return (
        <div className="mainRegister">
            { !activatePage &&<>
            <img src={Arrow} className="iconArrow"></img>
            <img src={Logo} className="imgLogoReg"></img>

            <form className="formRegister">
                <h2>Регистрация</h2>

                <div className="fieldsFormReg">

                    {/* Имя */}
                    <input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        type="text"
                        placeholder="Имя"
                        className="inputFormReg"
                    />
                    
                    {/* Фамилия */}
                    <input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        type="text"
                        placeholder="Фамилия"
                        className="inputFormReg"
                    />

                    {/* Дата рождения */}
                    <div className="inputFormReg inputDate">
                        <span>
                        {
                            date != "" ? date.split("-").reverse().join(".") : "Дата рождения"    
                        }
                        </span>
                        <input
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            type="date"
                            onClick={handleDateClick}
                            className="inputDateHidden"
                        />
                    </div>
                    {/* Город         
                    <div className="selectCont">
                        <select className="selectFormReg">
                            <option value="" disabled selected hidden>Город</option>
                            <option value="Москва">Москва</option>
                            <option value="Санкт-Петербург">Санкт-Петербург</option>
                            <option value="Сочи">Сочи</option>
                        </select>
                        <img src={SelectIcon} className="iconSelect"></img>
                    </div>
                    */}

                    {/* Статус 
                    <div className="selectCont">
                        <select className="selectFormReg">
                            <option value="" disabled selected hidden>Статус</option>
                            <option value="Ищу соседа">Ищу соседа</option>
                            <option value="Хочу быть соседом">Хочу быть соседом</option>
                        </select>
                        <img src={SelectIcon} className="iconSelect"></img>
                    </div>
                    */}

                    {/*Место учебы
                    <div className="selectCont">
                        <select className="selectFormReg">
                            <option value="" disabled selected hidden>Место учебы</option>
                            <option value="ВУЗ">ВУЗ</option>
                            <option value="Колледж">Колледж</option>
                        </select>
                        <img src={SelectIcon} className="iconSelect"></img>
                    </div>
                    */}

                    {/* Курс
                    <div className="selectCont">
                        <select className="selectFormReg">
                            <option value="" disabled selected hidden>Курс</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                        <img src={SelectIcon} className="iconSelect"></img>
                    </div>
                    */}
                    {/* Почта */}
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="text"
                        placeholder="Почта (логин)"
                        className="inputFormReg"
                    />

                    {/* Пароль */}
                    <div className="contInputFieldReg">
                        <input
                            value={password}
                            type={showPassword ? "text" : "password"}
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            name="password"
                            placeholder="Пароль"
                            className="inputFormReg"
                        />
                        <img
                            src={Check}
                            className="iconCheck"
                            alt="Показать пароль"
                            onClick={() => setShowPassword(prev => !prev)}
                        />
                    </div>

                    {/* Повтор пароля */}
                    <div className="contInputFieldReg">
                        <input
                            type={showPasswordRepeat ? "text" : "password"}
                            id="password"
                            name="password"
                            value={passwordRepeat}
                            onChange={(e) => setPasswordRepeat(e.target.value)}
                            placeholder="Повторите пароль"
                            className="inputFormReg"
                        />
                        <img
                            src={Check}
                            className="iconCheck"
                            alt="Показать пароль"
                            onClick={() => setShowPasswordRepeat(prev => !prev)}
                        />
                    </div>
                    
                </div>

                {/* Кнопка регистрации */}
                <div className="buttonsBlock">
                    <div className="buttonLog" onClick={submit}>Зарегистрироваться</div>
                    <Link to="/login">Войти</Link>
                </div>
                
            </form></>
            }
        {
            activatePage &&
            (
                <div className="formRegister">
                    <h2>Активация аккаунта</h2>
                    <p>
                        Введите код подтверждения, который был выслан на вашу почту. Проверьте “Корзину” и “Спам”, код мог попасть туда
                    </p>
                    <CodeInput
                        length={6}
                        onComplete={(code) => {
                            console.log('Полученный код:', code);
                            setActivateCode(code);
                            // Здесь можно вызвать API для проверки кода
                        }}
                    />
                    <div className="buttonsBlock">
                        <div className="buttonRestore" onClick={() => activate()}>Активировать</div>
                        <div onClick={() => getNewOTP()}> Запросить новый код </div>
                    </div>
                </div>
            )
        }
        </div>
    );
};
