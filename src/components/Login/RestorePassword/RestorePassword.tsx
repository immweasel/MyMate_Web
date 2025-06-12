import React, { useState } from "react";
import "./RestorePassword.css";
import { Link } from 'react-router-dom';
import Logo from "../../../assets/images/logo.svg";
import Arrow from "../../../assets/icons/arrow.svg";
import Check from "../../../assets/icons/eye.svg";
import People from "../../../assets/images/peopleRestorePassword.svg";
import CodeInput from "./CodeInput";
import axios from "axios";
import { GetBackendUrl } from "../../ServiceFunctions/GetBackendUrl";

export default function RestorePassword() {
    const [step, setStep] = useState<'email' | 'code' | 'newPassword'>('email');

    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [resetHash, setResetHash] = useState('');
    const [uuid, setUuid] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        axios
            .post(GetBackendUrl()+"/api/v1/auth/mail/get-otp", {
                "email": email
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
                setUuid(data.body.user_id)
                setStep('code');
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleCodeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        axios
            .post(GetBackendUrl()+"/api/v1/auth/mail/get-reset-hash/"+uuid, {
                "otp": code
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
                if (data.error!="" && data.error!=null) {
                    alert("Что-то пошло не так");
                    console.log(data.error);
                    return
                }
                setResetHash(data.body.reset_hash);
                setStep('newPassword');
            })
            .catch((error) => {
                console.log(error);
            })
    };

    const handleNewPasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        axios
            .post(GetBackendUrl()+"/api/v1/auth/mail/reset-password/"+uuid, {
                "reset_hash": resetHash,
                "password": newPassword
            })
            .then((response) => {
                let data = response.data;
                if (data.error == "invalid data") {
                    alert("Некорректные данные");
                    return
                }
                if (data.error!="" && data.error!=null) {
                    alert("Что-то пошло не так");
                    console.log(data.error);
                    return
                }
                alert("Пароль успешно изменен");
                window.location.href = "/login";
            })
            .catch((error) => {
                console.log(error);
            })
    };

    return (
        <div className="mainRestorePassword">
            <div className="contentRestore">
                <Link to="/login" className="arrowReturn">
                    <img src={Arrow} />
                </Link>

                <img src={Logo} className="imgLogoRestore" />

                <form className="formRestore" onSubmit={step === 'email' ? handleEmailSubmit : step === 'code' ? handleCodeSubmit : handleNewPasswordSubmit}>
                    <h2>Восстановление пароля</h2>
                    {step === 'email' && (
                        <>
                            <p>Введите свою почту, на которую был зарегистрирован аккаунт. На данную почту будет направлен код для подтверждения восстановления пароля</p>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Ваша почта"
                                className="inputFormRestore inputMailRestore"
                            />
                            <button type="submit" className="buttonRestore">Восстановить</button>
                        </>
                    )}

                    {step === 'code' && (
                        <>
                            <p>
                                Введите код подтверждения, который был выслан на вашу почту. Проверьте “Корзину” и “Спам”, код мог попасть туда
                            </p>
                            <CodeInput
                                length={6}
                                onComplete={(code) => {
                                    console.log('Полученный код:', code);
                                    setCode(code);
                                }}
                            />
                            <button type="submit" className="buttonRestore">Восстановить</button>
                        </>
                    )}

                    {step === 'newPassword' && (
                        <>
                            <p>Введите новый пароль и подтвердите его в поле ниже</p>
                            <div className="fieldsPasswordRestore">
                                <div className="contInputFieldRestore">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Новый пароль"
                                        className="inputFormRestore"
                                    />
                                    <img
                                        src={Check}
                                        className="iconCheck"
                                        alt="Показать пароль"
                                        onClick={() => setShowPassword(prev => !prev)}
                                    />
                                </div>

                                <div className="contInputFieldRestore">
                                    <input
                                        type={showPasswordRepeat ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        placeholder="Повторите пароль"
                                        className="inputFormRestore"
                                    />
                                    <img
                                        src={Check}
                                        className="iconCheck"
                                        alt="Показать пароль"
                                        onClick={() => setShowPasswordRepeat(prev => !prev)}
                                    />
                                </div>
                            </div>
                            
                            
                            <button type="submit" className="buttonRestore">Войти</button>
                        </>
                    )}
                </form>

                {/* <form className="formRestore">
                    <h2>Восстановление пароля</h2>
                    <p>
                        Введите свою почту, на которую был зарегистрирован аккаунт. На данную почту будет направлен код для подтверждения восстановления пароля
                    </p>
                    <input
                        type="text"
                        placeholder="Ваша почта"
                        className="inputFormRestore"
                    />
                    <button type="submit" className="buttonRestore">Восстановить</button>
                </form> */}
            </div>

            <img src={People} className="imgPeopleRestore" />

        </div>
    );
};
