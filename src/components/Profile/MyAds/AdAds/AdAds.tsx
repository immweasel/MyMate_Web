import { useEffect, useState } from 'react';
import adAppartment from "../../../../assets/images/adAppartment2.png";
import './AdAds.css';
import { Link } from 'react-router-dom';
import { GetBackendUrl } from '../../../ServiceFunctions/GetBackendUrl';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { RefreshTokens } from '../../../ServiceFunctions/RefreshTokens';

interface AdCardInterface {
    id: string;
    name: string;
    about: string;
    cover: string;

    getFlats: () => void;
};

interface AdDataInterface {
    cover: string;
    title: string;
    aboutApartment: string;
};

export default function AdAds({ id, name, getFlats, about, cover }: AdCardInterface) {
    const cookies = new Cookies();
    const deleteFlat = () => {
        let url = GetBackendUrl() + "/api/v1/flats/" + id;
        axios
            .delete(url, { headers: { "Authorization": cookies.get("access_token") } })
            .then((response) => {
                let data = response.data;
                if (data.error == "token expired") {
                    RefreshTokens(cookies)
                    deleteFlat();
                    return
                }
                if (data.error != "" && data.error != null) {
                    console.log(data.error);
                    return
                }
                getFlats();
            })
            .catch((error) => {
                console.log(error);
            });
    }
    return (
        <div className='adCards'>
                <>
                    <div className='myAds'>
                        <div className='textAds'>{name}</div>
                        {/* <div className='mainText'>Квартира найдена, двушка, 50 кв.м., совр...</div> */}
                        <div className='mainText'>{about}</div>

                        <div className='Buttons'>
                            <a href={`myAds/createAds?id=${id}`}  className='linkNolineCreate' >
                                <button className='changeButton'>Изменить</button>
                            </a>
                            <a href='#' className='linkNolineCreate' >
                                <Link to='/profile/prodvigate' className='linkNolineCreate'>
                                    <button className='prodvigateButton'>Продвинуть</button>
                                </Link>
                            </a>
                            <a href='#' className='linkNolineCreate' onClick={deleteFlat}>
                                <button className='deleteButton'>Удалить</button>
                            </a>
                        </div>
                    </div>
                </>
            
        </div>
    );
}
