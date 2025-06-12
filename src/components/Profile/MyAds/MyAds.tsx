import { useState, useEffect, useRef } from 'react';
import TopWithArrow from '../Common/TopWithArrow';
import myAdsWindow from "../../../assets/images/myAdsWindow.svg";
import myAdsMan from "../../../assets/images/myAdsMan.png";
import myAdsMan2 from "../../../assets/images/myAdsMan2.png";
import AdAds from './AdAds/AdAds';

import './MyAds.css';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { GetBackendUrl } from '../../ServiceFunctions/GetBackendUrl';
import axios from 'axios';
import { RefreshTokens } from '../../ServiceFunctions/RefreshTokens';


interface AdInterface {
    id: string;
    name: string;
    about: string;
};

export default function MyAds({id}: {id: string}) {

    const [ads, setAds] = useState<AdInterface[]>([]);
    const [offset, setOffset] = useState<number>(0);
    const limit = 20;
    const [sortOpen, setSortOpen] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');

    const sortRef = useRef<HTMLDivElement>(null);
    const cookies = new Cookies();
    const [alreadyEnded, setAlreadyEnded] = useState<boolean>(false);

    const [flatsAvatars, setFlatsAvatars] = useState<Record<string, string>>({});
    
    const getFlats = () => {
        if (id == "") {
            let tempUser = JSON.parse(localStorage.getItem("userData") || "{}");
            id = tempUser?.uuid
        }
        let url = GetBackendUrl() + "/api/v1/flats?offset=" + offset + "&limit=" + limit+"&created_by_id="+id;
        if (search != "") {
            url += "&name=" + search;
        }
        
        axios
            .get(url, { headers: { "Authorization": cookies.get("access_token") } })
            .then((response) => {
                let data = response.data;
                if (data.error == "token expired") {
                    RefreshTokens(cookies)
                    getFlats();
                    return
                }
                if (data.error != "" && data.error != null) {
                    console.log(data.error);
                    return
                }
                if (data.body.flats.length < limit) {
                    setAlreadyEnded(true);
                }
                setAds(data.body.flats);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const getFlatsAvatars = (id: string) => {
        axios
            .get(GetBackendUrl() + `/api/v1/flats/${id}/images`)
            .then((response) => {
                let data = response.data;
                if (data.error == "token expired") {
                    RefreshTokens(cookies)
                    getFlatsAvatars(id);
                    return
                }
                if (data.error != null && data.error != "") {
                    console.log(data.error);
                    return
                }
                setFlatsAvatars((prev) => ({ ...prev, [id]: data.body.images.length > 0 ? data.body.images[0] : "/media/flat/placeholder.png" }));
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        getFlats();
        function handleClickOutside(event: MouseEvent) {
            if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
                setSortOpen(false);
            }
        }

        if (sortOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [sortOpen]);

    useEffect(()=>{

        ads.forEach((ad)=>{
            getFlatsAvatars(ad.id);
        })
    },[ads])


    return (
        <div className='mainMyAds'>
            <TopWithArrow link='/profile' />
            <div className='myAdsContent'>
                <div className='myAdsContentHeader'>
                    <p className='myAdsContentHeaderTitle'>Мои объявления</p>
                    <Link to='createAds' className='linkNoUnderlineCreate' >
                        <button className='myAdsContentHeaderButton'>Создать</button>
                    </Link>
                </div>
                {ads.length !== 0 ? (
                    <div className='adList'>
                        {ads.map((item: AdInterface) => (
                            <AdAds key={item.id} id={item.id} name={item.name} getFlats={getFlats} cover={flatsAvatars[item.id]} about={item.about} />
                        ))}
                    </div>
                ) : <img src={myAdsMan2} alt="No chats illustration" className='myAdsEmptyImage' />} 
                {/* filteredAds - отсортированный массив либо просто массив, поэтому можно сократить код, как показано выше */}
                {/* в будущем стоит переписать код, так как будет загрузка данных и будет не круто, если пользователь увидит, что у него нет объявлений, хотя они просто не успели загрузиться! */}
            </div>
        </div>
    );
};
