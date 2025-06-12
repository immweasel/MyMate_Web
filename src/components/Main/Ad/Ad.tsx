import { useEffect, useState } from 'react';
import adAppartment1 from "../../../assets/images/adAppartment1.png";
import adAppartment2 from "../../../assets/images/adAppartment2.png";
import './Ad.css';
import FavouritesButton from '../FavouritesButton/FavouritesButton';
import AdCard from '../AdCard/AdCard';
import AdSlider from './AdSlider/AdSlider';
import backArrowLight from "../../../assets/icons/backArrowLight.svg";
import { Link, useLocation } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { RefreshTokens } from '../../ServiceFunctions/RefreshTokens';
import { GetBackendUrl } from '../../ServiceFunctions/GetBackendUrl';
import axios from 'axios';

interface DataAd {
    name: string;
    about: string;
    neighborhoods_count: number;
    sex: string;
    price_from: number;
    created_by_id: number;
    price_to: number;
    neightborhood_age_from: number;
    neightborhood_age_to: number;
};

export default function Ad() {
    const [dataAd, setDataAd] = useState<DataAd>({
        name: '',
        about: '',
        neighborhoods_count: 0,
        sex: '',
        price_from: 0,
        price_to: 0,
        created_by_id: 0,
        neightborhood_age_from: 0,
        neightborhood_age_to: 0
    });
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const page = queryParams.get('page');
    const [images, setImages] = useState<string[]>(["/media/flat/placeholder.png"]);
    const cookies = new Cookies();
    useEffect(() => {
        load();
        loadImages();
    }, []);

    const loadImages = async () => {
        const pathParts = window.location.pathname.split('/');
        const userId = pathParts[pathParts.length - 1];
        axios
            .get(GetBackendUrl() + `/api/v1/flats/${userId}/images`, {headers:{Authorization:cookies.get("access_token")}})
            .then((response) => {
                let data = response.data;
                if (data.error == "token expired") {
                    RefreshTokens(cookies)
                    loadImages();
                    return
                }
                if (data.error != null && data.error != "") {
                    console.log(data.error);
                    return
                }
                let urls = data.body.images.map((image: any) => image.url);
                setImages(urls);
            })
            .catch((error)=>{console.log(error)})
    }
    const load = async () => {
        const pathParts = window.location.pathname.split('/');
        const userId = pathParts[pathParts.length - 1];
        axios
            .get(GetBackendUrl() + `/api/v1/flats/${userId}`, {headers:{Authorization:cookies.get("access_token")}})
            .then((response) => {
                let data = response.data;
                if (data.error == "token expired") {
                    RefreshTokens(cookies)
                    load();
                    return
                }
                if (data.error != null && data.error != "") {
                    console.log(data.error);
                    return
                }
                setDataAd(data.body.flat);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    function selectBackLink() {
        switch (page) {
            case 'favourites':
                return '/favourites'
            default:
                return '/';
        };
    };
    const addToFavourites = () => {
        const pathParts = window.location.pathname.split('/');
        const userId = pathParts[pathParts.length - 1];
        axios.post(GetBackendUrl() + `/api/v1/favourites`, { flat_id: Number(userId) }, { headers: { "Authorization": cookies.get("access_token") } })
            .then((response) => {
                let data = response.data;
                if (data.error == "token expired") {
                    RefreshTokens(cookies)
                    addToFavourites();
                    return
                }
                if (data.error != "" && data.error != null) {
                    console.log(data.error);
                    alert("Уже в избранном")
                    return
                }
                alert("Добавлено в избранное")
            })
            .catch((error) => {
                console.log(error);
            })
    }
    return (
        <div className='adMain'>
            <div className='adBackHeader'>
                <Link to={selectBackLink()}>
                    <img alt='' src={backArrowLight} />
                </Link>
            </div>
            <div className='adContent'>
                <div className='adSlider'>
                    <AdSlider images={images} />
                </div>
                <div className='adDataColumn'>
                    <div className='adDataLine'>
                        <p className='adDataTitle' >{dataAd.name}</p>
                        <FavouritesButton type='inAd' onclick={addToFavourites} />
                    </div>
                    <button className='adDataButtonChat' onClick={() => { window.location.href = "/chat/"+dataAd.created_by_id }}>Перейти в чат</button>
                    <div className='adDataLilColumn'>
                        <p className='adDataSubtitle'>О квартире:</p>
                        <p className='adDataText'>{dataAd.about}</p>
                    </div>
                    <div className='adDataLilLine'>
                        <p className='adDataSubtitle'>Количество соседей:</p>
                        <p className='adDataTextBig'>{dataAd.neighborhoods_count}</p>
                    </div>
                    <div className='adDataLilColumn'>
                        <p className='adDataSubtitle'>Бюджет на 1 человека:</p>
                        <div className='adDataBigLine'>
                            <div className='adDataSummBlock'>
                                <p className='adDataSummText'>от</p>
                                <p className='adDataSummText'>{dataAd.price_from}</p>
                                <p className='adDataSummText'>₽</p>
                            </div>
                            <div className='adDataSummBlock'>
                                <p className='adDataSummText'>до</p>
                                <p className='adDataSummText'>{dataAd.price_to}</p>
                                <p className='adDataSummText'>₽</p>
                            </div>
                        </div>
                    </div>
                    <div className='adDataLilLine'>
                        <p className='adDataSubtitle'>Пол:</p>
                        <p className='adDataTextBig'>{dataAd.sex}</p>
                    </div>
                    <div className='adDataLilColumn'>
                        <p className='adDataSubtitle'>Возраст соседа:</p>
                        <div className='adDataBigLine'>
                            <div className='adDataSummBlock'>
                                <p className='adDataSummText'>от</p>
                                <p className='adDataSummText'>{dataAd.neightborhood_age_from}</p>
                                <p className='adDataSummText'></p>
                            </div>
                            <div className='adDataSummBlock'>
                                <p className='adDataSummText'>до</p>
                                <p className='adDataSummText'>{dataAd.neightborhood_age_to}</p>
                                <p className='adDataSummText'></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
