import { useEffect, useState } from 'react';
import adAppartment2 from "../../../assets/images/adAppartment2.png";
import './AdCard.css';
import { Link } from 'react-router-dom';
import FavouritesButton from '../FavouritesButton/FavouritesButton';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { GetBackendUrl } from '../../ServiceFunctions/GetBackendUrl';
import { RefreshTokens } from '../../ServiceFunctions/RefreshTokens';

interface AdCardInterface {
    id: string;
    itemUrl: string;
    about: string;
    name: string;
};

interface AdDataInterface {
    cover: string;
    title: string;
    aboutApartment: string;
};

const truncate = (str: string, maxLength: number) => {
    return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
};

// 🔁 Флаг для локального тестирования
const IS_LOCAL_TESTING = true;

export default function AdCard({ id, itemUrl, about, name }: AdCardInterface) {
    const truncatedName = truncate(name, 40);
    // const truncatedAbout = truncate(about, 200);

    // 🔁 Локальное состояние для "в избранном"
    const [isFavourite, setIsFavourite] = useState(false);

    const cookies = new Cookies();

    // 🔁 Запрашиваем начальное состояние "в избранном" при монтировании
    // useEffect(() => {
    //     checkIsFavourite();
    // }, []);

    // 🔍 Загружаем статус только если не в режиме локального тестирования
    useEffect(() => {
        if (!IS_LOCAL_TESTING) {
            checkIsFavourite();
        }
    }, []);

    const checkIsFavourite = () => {
        axios.get(GetBackendUrl() + `/api/v1/favourites`, {
            headers: { Authorization: cookies.get("access_token") }
        })
            .then(response => {
                let data = response.data;
                if (data.error === "token expired") {
                    RefreshTokens(cookies);
                    checkIsFavourite();
                    return;
                }

                if (data.body && Array.isArray(data.body.favourites)) {
                    const found = data.body.favourites.some((fav: any) => fav.flat_id === id);
                    setIsFavourite(found);
                }
            })
            .catch(error => {
                console.log('Ошибка проверки избранного:', error);
            });
    };
    
    const addToFavourites = () => {
        if (IS_LOCAL_TESTING) {
            setIsFavourite(true); // просто обновляем UI
            return;
        }

        axios.post(GetBackendUrl() + `/api/v1/favourites`, { flat_id: id }, { headers: { "Authorization": cookies.get("access_token") } })
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

    const removeFromFavourites = () => {
        if (IS_LOCAL_TESTING) {
            setIsFavourite(false); // просто обновляем интерфейс
            return;
        }
        
        axios.delete(`${GetBackendUrl()}/api/v1/favourites/${id}`, {
            headers: { Authorization: cookies.get("access_token") }
        })
            .then(response => {
                let data = response.data;
                if (data.error === "token expired") {
                    RefreshTokens(cookies);
                    removeFromFavourites();
                    return;
                }

                alert("Удалено из избранного");
                setIsFavourite(false); // 🎯 Меняем состояние
            })
            .catch(error => {
                console.log('Ошибка удаления из избранного:', error);
                alert('Не удалось удалить');
            });
    };

    const toggleFavourite = () => {
        if (isFavourite) {
            removeFromFavourites();
        } else {
            addToFavourites();
        }
    };

    return (
        <div className='adCard'>
            <div className='adCardInfoCont'>
                <div className='adCardCover' style={{ backgroundImage: `url(${itemUrl})` }}>
                    {/* <FavouritesButton onclick={() => addToFavourites()} type='onAdCard' /> */}
                    <FavouritesButton onclick={toggleFavourite} type='onAdCard' isActive={isFavourite} />
                </div>
                <div className='adCardColumn'>
                    <p className='adCardTitle'>{truncatedName}</p>
                    <p className='adCardText'>{about}</p>
                </div>
            </div>
            <Link to={`/ad/${id}`} className='linkNoUnderline'>
                <button className='adCardButton'>Подробнее</button>
            </Link>
        </div>
    );
}
