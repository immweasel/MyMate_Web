import './CreateAds.css';
import TopWithArrow from "../Common/TopWithArrow";
import { useState, useRef, useEffect } from 'react';
import InputMask from "react-input-mask";
import { GetBackendUrl } from '../../ServiceFunctions/GetBackendUrl';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { RefreshTokens } from '../../ServiceFunctions/RefreshTokens';

interface IAd {
    title: string;
    aboutAppartment: string;
    budgetFrom: string;
    budgetTo: string;
    countFriends: string;
    ageNeighborFrom: string;
    ageNeighborTo: string;
    gender: string;
    pictureName: string;
}

interface FlatImageI {
    id: number;
    url: string;
    flat_id: number;
}

export default function CreateAds() {
    const file = useRef<FormData>(new FormData());
    const genders = ['Мужской', 'Женский', 'Любой'];
    const cookies = new Cookies();
    const [newAd, setNewAd] = useState<IAd>({
        title: '',
        aboutAppartment: '',
        budgetFrom: '',
        budgetTo: '',
        countFriends: '',
        ageNeighborFrom: '',
        ageNeighborTo: '',
        gender: '',
        pictureName: '',
    });

    const [files, setFiles] = useState<File[]>([]);
    const [backendImages, setBackendImages] = useState<FlatImageI[]>([]);

    
    const saveFile = async (file:File, id: any) => {
        let formdata = new FormData();
        formdata.append("file", file);
        console.log(file)
        console.log(formdata)
        await axios.post(
            `${GetBackendUrl()}/api/v1/flats/${id}/images`,
            formdata,
            {
                headers: {
                    "Authorization": cookies.get("access_token"),
                    "Content-Type": "multipart/form-data",
                },
            }
        ).then((response)=>{
            let data = response.data;
            console.log(data)
            if (data.error == "token expired") {
                RefreshTokens(cookies)
                saveFile(file,id);
                return
            }
            if (data.error != "" && data.error != null) {
                console.log(data.error);
                return
            }
            console.log("savepictire:")
            console.log(data);
        })
        .catch((error)=>{
            console.log("savepictire:")
            console.log(error)
        })
    }

    const savePicture = async (id: any) => {
        
        if (files.length === 0) {
            console.error("No file selected");
            return;
        }
        for (let i = 0; i < files.length; i++) {
            await saveFile(files[i], id);
        }
        
    }
    const saveFlat = async () => {
        let id = -1;
        let data = {
            "name": newAd.title,
            "about": newAd.aboutAppartment,
            "price_from": Number(newAd.budgetFrom) || 0,
            "price_to": Number(newAd.budgetTo) || 0,
            "neighborhoods_count": Number(newAd.countFriends) || 0,
            "neightborhood_age_from": Number(newAd.ageNeighborFrom) || 0,
            "neightborhood_age_to": Number(newAd.ageNeighborTo) || 0,
            "sex": newAd.gender
        }
        const urlParams = new URLSearchParams(window.location.search);
        const inputid = urlParams.get('id');
        if (!inputid) {
            await axios.post(GetBackendUrl() + '/api/v1/flats/', data, { headers: { "Authorization": cookies.get("access_token") } })
            .then((response) => {
                let data = response.data;
                if (data.error == "token expired") {
                    RefreshTokens(cookies)
                    saveFlat();
                    return 
                }
                if (data.error != "" && data.error != null) {
                    console.log(data.error);
                    return
                }
                id = data.body.id
                console.log(data);
            })
            .catch((error) => {
                console.log(error);
            });
            return id    
        }
        else {
            await axios.patch(GetBackendUrl() + '/api/v1/flats/'+inputid, data, { headers: { "Authorization": cookies.get("access_token") } })
            .then((response) => {
                let data = response.data;
                if (data.error == "token expired") {
                    RefreshTokens(cookies)
                    saveFlat();
                    return 
                }
                if (data.error != "" && data.error != null) {
                    console.log(data.error);
                    return
                }
                id = data.body.id
                console.log(data);
            })
            .catch((error) => {
                console.log(error);
            });
            return inputid
        }
        
    }
    const save = async () => {
        let id = await saveFlat();
        if (id == -1) {
            
            window.location.href = '/profile/myAds'
            return
        }
        await savePicture(id);
        
        window.location.href = '/profile/myAds'
        return
        
    };


    const getFlats = (id: any) => {
        let url = GetBackendUrl() + "/api/v1/flats/"+String(id);

        axios
            .get(url, { headers: { "Authorization": cookies.get("access_token") } })
            .then((response) => {
                let data = response.data;
                if (data.error == "token expired") {
                    RefreshTokens(cookies)
                    getFlats(id);
                    return
                }
                if (data.error != "" && data.error != null) {
                    console.log(data.error);
                    return
                }
                setNewAd({
                    title: data.body.flat.name,
                    aboutAppartment: data.body.flat.about,
                    budgetFrom: String(data.body.flat.price_from),
                    budgetTo: String(data.body.flat.price_to),
                    countFriends: String(data.body.flat.neighborhoods_count),
                    ageNeighborFrom: String(data.body.flat.neightborhood_age_from),
                    ageNeighborTo: String(data.body.flat.neightborhood_age_to),
                    gender: data.body.flat.sex,
                    pictureName: '',
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const getFlatImages = (id: any) => {
        let url = GetBackendUrl() + "/api/v1/flats/"+String(id)+"/images";
        axios
            .get(url, { headers: { "Authorization": cookies.get("access_token") } })
            .then((response) => {
                let data = response.data;
                if (data.error == "token expired") {
                    RefreshTokens(cookies)
                    getFlatImages(id);
                    return
                }
                if (data.error != "" && data.error != null) {
                    console.log(data.error);
                    return
                }
                if (data.body.images == null) {
                    return
                }
                setBackendImages(data.body.images);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    useEffect(()=>{
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (id) {
            getFlats(id)
            getFlatImages(id)
        }
    },[])

    const deleteFlatImage = async (id: any, image_id: any) => {
        let url = GetBackendUrl() + "/api/v1/flats/"+String(id)+"/images/"+String(image_id);
        await axios.delete(url, { headers: { "Authorization": cookies.get("access_token") } })
        .then((response) => {
            let data = response.data;
            if (data.error == "token expired") {
                RefreshTokens(cookies)
                deleteFlatImage(id, image_id);
                return
            }
            if (data.error != "" && data.error != null) {
                console.log(data.error);
                return
            }
            setBackendImages((prevImages) => prevImages.filter((image) => image.id !== image_id));
        })
        .catch((error) => {
            console.log(error);
        });
    }

    const deleteFile = (index: number) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    }


    const handleInputChange = (field: keyof IAd, value: string) => {
        setNewAd(prevData => ({ ...prevData, [field]: value }));
    };

    return (
        <div className="createAdsMain">
            <TopWithArrow link='/profile/myAds' />
            <div className="createAdsContent">
                <p className='createAdsTitle'>Создание объявления</p>
                <div className='createAdsColumn'>
                    <div className='createAdsLilColumn'>
                        <p className='createAdsSubtitle'>Название объявления</p>
                        <input
                            className='createAdsInput'
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            value={newAd.title}
                        />
                    </div>
            
                    <div className='createAdsLilColumn'>
                        <p className='createAdsSubtitle'>О квартире</p>
                        <input
                            className='createAdsInput'
                            onChange={(e) => handleInputChange('aboutAppartment', e.target.value)}
                            value={newAd.aboutAppartment}
                        />
                    </div>
                    <div className='createAdsLilColumn'>
                        <p className='createAdsSubtitle'>Бюджет на 1 человека</p>
                        <div className='createAdsLilLine'>
                            <input
                                className='createAdsInputLil'
                                placeholder='Бюджет от'
                                onChange={(e) => handleInputChange('budgetFrom', e.target.value)}
                                value={newAd.budgetFrom}
                            />
                            <p className='createAdsInputLilSymbol'>₽</p>
                            <input
                                className='createAdsInputLil'
                                placeholder='до'
                                onChange={(e) => handleInputChange('budgetTo', e.target.value)}
                                value={newAd.budgetTo}
                            />
                            <p className='createAdsInputLilSymbol'>₽</p>
                        </div>
                    </div>
                    <div className='createAdsLilColumn'>
                        <p className='createAdsSubtitle'>Количество гостей</p>
                        <input
                            className='createAdsInput'
                            type='number'
                            onChange={(e) => handleInputChange('countFriends', e.target.value)}
                            value={newAd.countFriends}
                        />
                    </div>
                    <div className='createAdsLilColumn'>
                        <p className='createAdsSubtitle'>Возраст соседа</p>
                        <div className='createAdsLilLine'>
                            <input
                                className='createAdsInputLil'
                                placeholder='Возраст от'
                                type='number'
                                onChange={(e) => handleInputChange('ageNeighborFrom', e.target.value)}
                                value={newAd.ageNeighborFrom}
                            />
                            <input
                                className='createAdsInputLil'
                                placeholder='до'
                                type='number'
                                onChange={(e) => handleInputChange('ageNeighborTo', e.target.value)}
                                value={newAd.ageNeighborTo}
                            />
                        </div>
                    </div>
                    <div className='createAdsLilColumn'>
                        <p className='createAdsSubtitle'>Пол</p>
                        <div className='createAdsLilLine'>
                            {genders.map((item, index) => (
                                <button
                                    key={index}
                                    className={`createAdsGenderButton ${newAd.gender === item ? 'createAdsGenderButtonSelect' : ''}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleInputChange('gender', item);
                                    }}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className='createAdsLilColumn'>
                        <p className='createAdsSubtitle'>Фотографии</p>
                        {/*<label className="input-file">
                            <input
                                type='file'
                                onChange={(e) => {
                                    if (e.target.files) {
                                        file.current.append('file', e.target.files[0]);
                                        handleInputChange('pictureName', e.target.files[0].name);
                                    }
                                }}
                            />
                            <div className="createAdsUplodaImageButton">
                                <p>{newAd.pictureName || 'Добавить фото'}</p>
                                {!newAd.pictureName && <hr className='createAdsUplodaImageButtonHr' />}
                            </div>
                        </label>
                        <button className="removePhotoButton">Удалить фото</button>
                        */}
                        {
                            backendImages.map((item, index) => (<>
                                <div className="createAdsUplodaImageButton">
                                    <p>{item.url}</p>
                                    </div>
                                <div className="removePhotoButton" onClick={()=>deleteFlatImage(item.flat_id, item.id)}>Удалить фото</div>
                                
                                </>
                            ))
                        }

                        {
                            files.map((item, index) => (<>
                                <div className="createAdsUplodaImageButton">
                                    <p>{item.name}</p>
                                    
                                </div>
                                <div className="removePhotoButton" onClick={() => deleteFile(index)}>Удалить фото</div>
                                </>
                            ))
                        }

                        <label className="input-file">
                            <input
                                type='file'
                                onChange={(e) => {
                                    if (e.target.files) {
                                        const selectedFiles = e.target.files;
                                        if (selectedFiles[0]) {
                                            setFiles((prevFiles) => [...prevFiles, selectedFiles[0]]);
                                        }
                                    }
                                }}
                            />
                            <div className="createAdsUplodaImageButton">
                                <p>Добавить фото</p>
                            </div>
                        </label>

                        
                    </div>
                </div>
                <button className='createAdsButtonSave' onClick={save}>Сохранить</button>
            </div>
        </div>
    );
}
