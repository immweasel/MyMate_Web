import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import TopWithArrow from "../Common/TopWithArrow";
import './PersonalData.css';
import InputMask from "react-input-mask";
import universities from "../../../../src/moscow-universities.json";
import axios from "axios";
import { GetBackendUrl } from "../../ServiceFunctions/GetBackendUrl";
import Cookies from "universal-cookie";
import { RefreshTokens } from "../../ServiceFunctions/RefreshTokens";

interface University {
    title: string;
    shortTitle: string;
};

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

const statusOptions = ['Учусь', 'Поступаю', 'Работаю'];
const courseOptions = ['Бакалавриат', 'Магистратура', 'Аспирантура'];

export default function PersonalData({userData, getUser}:{userData:User, getUser:Function}) {

    const file = useRef<FormData>(new FormData());
    const [statusOpen, setStatusOpen] = useState(false);
    const [courseOpen, setCourseOpen] = useState(false);
    const [universityOpen, setUniversityOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(userData.education_place);
    const [personalData, setPersonalData] = useState<User>(userData);

    const dropdownStatusRef = useRef<HTMLDivElement>(null);
    const dropdownCourseRef = useRef<HTMLDivElement>(null);
    const universityDropdownRef = useRef<HTMLDivElement>(null);
    const cookies = new Cookies();
    const universitiesArray: University[] = Object.values(universities);
    const filteredUniversities = universitiesArray.filter((university) =>
        university.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        university.shortTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const [pictureName, setPictureName] = useState(userData.avatar_file_name);

    const toggleStatusDropdown = () => setStatusOpen(!statusOpen);
    const toggleCourseDropdown = () => setCourseOpen(!courseOpen);
    const toggleUniversityDropdown = () => setUniversityOpen(!universityOpen);

    const handleStatusClick = (status: string) => {
        setPersonalData({ ...personalData, status });
        setStatusOpen(false);
    };

    const handleCourseClick = (course: string) => {
        setPersonalData({ ...personalData,  education_level: course});
        setCourseOpen(false);
    };

    const handleUniversityClick = (universityShortTitle: string) => {
        setPersonalData({ ...personalData, education_place: universityShortTitle });
        setSearchTerm(universityShortTitle);
        setUniversityOpen(false);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPersonalData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownStatusRef.current && !dropdownStatusRef.current.contains(event.target as Node)) {
            setStatusOpen(false);
        }
        if (dropdownCourseRef.current && !dropdownCourseRef.current.contains(event.target as Node)) {
            setCourseOpen(false);
        }
        if (universityDropdownRef.current && !universityDropdownRef.current.contains(event.target as Node)) {
            setUniversityOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    const hasFiles = (formData: FormData) => {
        const entries = Array.from(formData.entries());
        return entries.some(([_, value]) => value instanceof File);
    }
    const saveFile = async () => {
        await axios.patch(
            `${GetBackendUrl()}/api/v1/users/${userData?.uuid}/avatar`,
            file.current,
            {
                headers: {
                    "Authorization": cookies.get("access_token"),
                    "Content-Type": "multipart/form-data",
                },
            }
        ).then((response)=>{
            let data = response.data;
            if (data.error == "token expired") {
                RefreshTokens(cookies)
                saveFile();
                return
            }
            if (data.error != "" && data.error != null) {
                console.log(data.error);
                return
            }
            
        })
        .catch((error)=>{console.log(error)})
        
    }

    const sendNewUserInfo = async () => {
        console.log(personalData.birthdate)
        let [day, month, year] = personalData.birthdate.split(".");
        if (day === "") {
            day = "01"
        }
        if (month === "") {
            month = "01"
        }
        if (year === "") {
            year = "0001"
        }
        const date = new Date(`${year}-${month}-${day}`);
        const isoString = date.toISOString();
        let data = {
            "firstname": personalData.firstname,
            "lastname": personalData.lastname,
            "birthdate": isoString,
            "status": personalData.status,
            "education_place": personalData.education_place,
            "education_level": personalData.education_level,
            "about": personalData.about,
        }
        console.log(data)
        await axios.patch(GetBackendUrl()+`/api/v1/users/${userData?.uuid}`,data, {headers:{Authorization:cookies.get("access_token")}})
            .then((response)=>{
                let data = response.data
                if (data.error === "token expired") {
                    RefreshTokens(cookies);
                    sendNewUserInfo();
                    return
                }
                if (data.error !== null && data.error !== "") {
                    console.log(data)
                    return
                }
            })
            .catch((error)=>{console.log(error)})
        if (!file.current || !hasFiles(file.current)) {
            return
        }
        console.log(file.current)
        await saveFile();
        
    }
    const save = async () => {
        // Функция для сохранения персональных данных
        await sendNewUserInfo();
        await getUser();
        window.location.href = '/profile'
        return
    };

    const deleteAvatar = async () => {
        if (!file.current || !hasFiles(file.current)) {
            await axios.delete(GetBackendUrl()+`/api/v1/users/${userData?.uuid}/avatar`, {headers:{Authorization:cookies.get("access_token")}})
                .then((response)=>{
                    let data = response.data
                    if (data.error === "token expired") {
                        RefreshTokens(cookies);
                        deleteAvatar();
                        return
                    }
                    if (data.error !== null && data.error !== "") {
                        console.log(data)
                        return
                    }
                    
                })
                .catch((error)=>{console.log(error)})
            setPictureName("")
            return
        }
        
    }

    return (
        <div className="personalDataMain">
            <TopWithArrow link="/profile" />
            <div className="personalDataContent">
                <p className="personalDataTitle">Личные данные</p>
                <div className='personalDataLilColumn'>
                    <p className='personalDataSubtitle'>Фотографии</p>
                    <label className="input-file">
                        <input
                            type='file'
                            onChange={(e) => {
                                if (e.target.files) {
                                    file.current.append('file', e.target.files[0]);
                                    setPictureName(e.target.files[0].name);
                                }
                            }}
                        />
                        <div className="createAdsUplodaImageButton">
                            <p>{pictureName}</p>
                            {pictureName && <hr className='createAdsUplodaImageButtonHr' />}
                        </div>
                    </label>
                    <button className="removePhotoButton" onClick={deleteAvatar}>Удалить фото</button>
                </div>
                <div className="personalDataLilColumn">
                    <p className="personalDataSubtitle">Имя</p>
                    <input
                        className="persondalDataInput"
                        name="firstname"
                        value={personalData.firstname}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="personalDataLilColumn">
                    <p className="personalDataSubtitle">Фамилия</p>
                    <input
                        className="persondalDataInput"
                        name="lastname"
                        value={personalData.lastname}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="personalDataLilColumn">
                    <p className="personalDataSubtitle">Дата рождения</p>
                    <InputMask
                        mask="99.99.9999"
                        className="persondalDataInput"
                        name="birthdate"
                        value={personalData.birthdate}
                        onChange={handleInputChange}
                    />
                </div>

               

                <div className="personalDataLilColumn">
                    <p className="personalDataSubtitle">Статус</p>
                    <div className="personalDataDropdown" ref={dropdownStatusRef}>
                        <button className="personalDataDropdownButton" onClick={toggleStatusDropdown}>
                            <p className="personalDataDropdownButtonText">{personalData.status || ''}</p>
                            <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L7 7L13 1" stroke="#4B2D10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        {statusOpen && (
                            <ul className="personalDataDropdownMenu">
                                {statusOptions.map((status, index) => (
                                    <div key={index} className="personalDataDropdownMenuBox">
                                        <li className="personalDataDropdownMenuItem" onClick={() => handleStatusClick(status)}>{status}</li>
                                        {statusOptions.length - 1 !== index && <hr className="personalDataDropdownMenuItemHr" />}
                                    </div>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="personalDataLilColumn">
                    <p className="personalDataSubtitle">Наименование вуза</p>
                    <div className="personalDataDropdown" ref={universityDropdownRef}>
                        <div className="personalDataDropdownLine">
                            <input
                                className="persondalDataInput"
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClick={toggleUniversityDropdown}
                            />
                            <svg className="persondalDataInputIcon" width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L7 7L13 1" stroke="#4B2D10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        {universityOpen && (
                            <ul className="personalDataDropdownMenu">
                                {filteredUniversities.map((university, index) => (
                                    <div key={index} className="personalDataDropdownMenuBox">
                                        <li className="personalDataDropdownMenuItem" onClick={() => handleUniversityClick(university.shortTitle)}>
                                            {university.shortTitle} - {university.title}
                                        </li>
                                        {filteredUniversities.length - 1 !== index && <hr className="personalDataDropdownMenuItemHr" />}
                                    </div>
                                ))}
                                {filteredUniversities.length === 0 && (
                                    <div className="personalDataDropdownMenuBox">
                                        <li className="personalDataDropdownMenuItem">Ничего не найдено</li>
                                    </div>
                                )}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="personalDataLilColumn">
                    <p className="personalDataSubtitle">Курс обучения</p>
                    <div className="personalDataDropdown" ref={dropdownCourseRef}>
                        <button className="personalDataDropdownButton" onClick={toggleCourseDropdown}>
                            <p className="personalDataDropdownButtonText">{personalData.education_level || ''}</p>
                            <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L7 7L13 1" stroke="#4B2D10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        {courseOpen && (
                            <ul className="personalDataDropdownMenu">
                                {courseOptions.map((course, index) => (
                                    <div key={index} className="personalDataDropdownMenuBox">
                                        <li className="personalDataDropdownMenuItem" onClick={() => handleCourseClick(course)}>{course}</li>
                                        {courseOptions.length - 1 !== index && <hr className="personalDataDropdownMenuItemHr" />}
                                    </div>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="personalDataLilColumn">
                    <p className="personalDataSubtitle">О себе</p>
                    <textarea
                        className="persondalDataTextArea"
                        name="about"
                        value={personalData.about}
                        onChange={handleInputChange}
                    />
                </div>

                <button className="personalDataButton" onClick={save} >Сохранить изменения</button>
            </div>
        </div>
    );
}
