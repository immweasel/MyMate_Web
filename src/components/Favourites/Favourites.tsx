import './Favourites.css';
import { useEffect, useState } from 'react';
import favouritesMan from "../../assets/images/favouritesMan.png";
import chatsWindow from "../../assets/images/chatsWindow.svg";
import { FavouritesInterface } from './interfaces/interfaces';
import FavouriteItem from './FavouriteItem/FavouriteItem';
// import adAppartment1 from "../../assets/images/adAppartment1.png";
import Cookies from 'universal-cookie';
import axios from 'axios';
import { GetBackendUrl } from '../ServiceFunctions/GetBackendUrl';
import { RefreshTokens } from '../ServiceFunctions/RefreshTokens';


interface ServerResponseFlatInterface {
    id: number;
	name: string;
	about: string;
	price_from: number;
	price_to: number;
	neighborhoods_count: number;
	neightborhood_age_from: number;
	neightborhood_age_to: number;
	sex: string;
	created_at: string;
	up_in_search: number;
}

export default function Favourites() {

    const [favourites, setFavourites] = useState<FavouritesInterface[]>([]);
    const cookies = new Cookies()
    const limit = 20;
    const [offset, setOffset] = useState(0);
    let [imageUrls, setImageUrls] = useState<Record<number,string>>([]);
    const [alreadyEnded, setAlreadyEnded] = useState(false);
    const [needUpdateImages, setNeedUpdateImages] = useState(false);
    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        //setFavourites([{ id: 123, title: 'Ищу соседа в район Чистые пруды', subtitle: 'Квартира найдена, двушка, 50 кв.м., современный ремонт', cover: adAppartment1 }, { id: 1234, title: 'Ищу соседа в районе Сокол', subtitle: 'Квартира найдена, двушка, 63 кв.м., не самый новый ремонт', cover: adAppartment1  }, { id: 12345, title: 'В поиске соседей для съема жилья у метро Алтуфьево', subtitle: 'Квартира найдена, трешка, 80 кв.м., стильный ремонт', cover: adAppartment1  }]);
        axios.
            get(GetBackendUrl()+"/api/v1/favourites/"+`?limit=${limit}&offset=${offset}`, { headers: { "Authorization": cookies.get("access_token") } })
            .then((response) => {
                let data = response.data;
                if (data.error == "token expired") {
                    RefreshTokens(cookies)
                    load();
                    return
                }
                if (data.error != "" && data.error != null) {
                    console.log(data.error);
                    return
                }
                if (data.body.favourites.length < limit) {
                    setAlreadyEnded(true);
                }
                let favList: ServerResponseFlatInterface[] = data.body.favourites;
                let resArray: FavouritesInterface[] = [];
                favList.forEach((item) => {
                    let tempInterface: FavouritesInterface = {
                        id: item.id,
                        title: item.name,
                        subtitle: item.about,
                        cover: "",
                        dislikeFunc: ()=>deleteLike(item.id)
                    }
                    resArray.push(tempInterface);
                })
                setFavourites(resArray);
                setNeedUpdateImages(true);
            })
            .catch((error)=>{
                console.log(error)
            })
    };

    const getImages = async (favourite: FavouritesInterface) => {
        axios.get(GetBackendUrl() + `/api/v1/flats/${favourite.id}/images`, { headers: { "Authorization": cookies.get("access_token") } })
            .then((response) => {
                let data = response.data;
                if (data.error == "token expired") {
                    RefreshTokens(cookies)
                    load();
                    return
                }
                if (data.error != "" && data.error != null) {
                    console.log(data.error);
                    return
                }
                let image = "/media/flats/placeholder.png"
                if (data.body.images!=null && data.body.images.length>0) {
                    image = data.body.images[0].url 
                }
                setImageUrls(prev => ({ ...prev, [favourite.id]: image}));
            })
    }

    useEffect(()=>{
        if (needUpdateImages === false) return
        favourites.forEach((item)=>{
            getImages(item);
        })
    },[needUpdateImages])

    const deleteLike = (id:number) => {
        axios.delete(GetBackendUrl() + `/api/v1/favourites/${id}`, { headers: { "Authorization": cookies.get("access_token") } })
            .then((response) => {
                let data = response.data;
                if (data.error == "token expired") {
                    RefreshTokens(cookies)
                    deleteLike(id);
                    return
                }
                if (data.error != "" && data.error != null) {
                    console.log(data.error);
                    return
                }
                setFavourites((prev)=>prev.filter((item) => item.id !== id));
                setImageUrls(prev => ({ ...prev, [id]: "" }));
            })
            .catch((error) => {
                console.log(error);
            })
    }

    return (
        <div className='favouritesMain'>
            <p className='chatsTitle'>Избранное</p>
            {favourites.length === 0
                ? <div className='favourotesEmptyColumn'>
                    <div className='chatsEmptyTextBlock'>
                        <img src={chatsWindow} alt="No chats window" />
                        <p className='favouritesEmptyText'>Ты еще ничего не лайкнул...</p>
                    </div>
                    <img src={favouritesMan} alt="No chats illustration" className='favouritesEmptyImage' />
                </div>
                : <div className='favouritesColumn'>
                    {favourites.map(item => <FavouriteItem dislikeFunc={item.dislikeFunc} key={item.id} id={item.id} title={item.title} subtitle={item.subtitle} cover={imageUrls[item.id]} />)}
                </div>}
        </div>
    );
};