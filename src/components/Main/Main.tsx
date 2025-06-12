import { useState, useEffect, useRef } from 'react';
import './Main.css';
import mainGirlEmpty from "../../assets/images/mainGirlEmpty.png";
import mainGirlNoAds from "../../assets/images/mainGirlNoAds.png";
import chatsWindow from "../../assets/images/chatsWindow.svg";
import sortIcon from "../../assets/icons/sortIcon.svg";
import checkMark from "../../assets/icons/checkMark.svg";
import SearchBlock from './SearchBlock/SearchBlock';
import AdCard from './AdCard/AdCard';
import { GetBackendUrl } from '../ServiceFunctions/GetBackendUrl';
import axios from 'axios';
import { RefreshTokens } from '../ServiceFunctions/RefreshTokens';
import Cookies from 'universal-cookie';

interface SortItem {
    text: string;
    state: string;
}

const itemSort: SortItem[] = [
    { text: 'По алфавиту (возр)', state: 'alphabetUp' },
    { text: 'По алфавиту (убыв)', state: 'alphabetDown' }
];

interface IAds {
    id: string;
    name: string;
    about: string;
}

interface Filters {
    price_from?: string;
    price_to?: string;
    neighbor_from?: string;
    neighbor_to?: string;
    gender?: string;
}

export default function Main() {
    const [ads, setAds] = useState<IAds[]>([]);
    const [sort, setSort] = useState<string>('alphabetUp');
    const [sortOpen, setSortOpen] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const [filters, setFilters] = useState<Filters>({});
    const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
    let resFilters: Filters = {};
    const [flatsAvatars, setFlatsAvatars] = useState<Record<string, string>>({});
    const [offset, setOffset] = useState<number>(0);
    const limit = 20;
    const sortRef = useRef<HTMLDivElement>(null);
    const filtersRef = useRef<HTMLDivElement>(null);
    const cookies = new Cookies();
    const [alreadyEnded, setAlreadyEnded] = useState<boolean>(false);
    
    const commitFilters = () => {
        resFilters = filters;
        setOffset(0);
        setAds([]);
        setFiltersOpen(false);
        getFlats();
    }

    const getFlats = () => {
        let url = GetBackendUrl() + "/api/v1/flats/?offset=" + offset + "&limit=" + limit;
        if (search != "") {
            url += "&name=" + search;
        }
        if (filters.price_from != null) {
            url += "&price_from=" + resFilters.price_from;
        }
        if (filters.price_to != null) {
            url += "&price_to=" + resFilters.price_to;
        }
        if (filters.neighbor_from != null) {
            url += "&neighborhoods_count_from=" + resFilters.neighbor_from;
        }
        if (filters.neighbor_to != null) {
            url += "&neighborhoods_count_to=" + resFilters.neighbor_to;
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
                    window.location.href = "/auth"
                    return
                }
                if (data.body.flats.length < limit) {
                    setAlreadyEnded(true);
                }
                setAds((prev)=>prev.concat(data.body.flats));
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const getFlatsAvatars = (id: string) => {
        axios
            .get(GetBackendUrl() + `/api/v1/flats/${id}/images`, {headers:{Authorization:cookies.get("access_token")}})
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
                setFlatsAvatars((prev) => ({ ...prev, [id]: data.body.images?.length > 0 ? data.body.images[0]?.url : "/media/flat/placeholder.png" }));
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(()=>{
        setOffset(0);
        setAds([]);
        let timeout = setTimeout(() => {
            getFlats();
        }, 500);
        return () => clearTimeout(timeout);
    },[search]);

    useEffect(()=>{
        if (offset == 0) {
            return
        }
        getFlats();
    },[offset]);
    
    useEffect(() => {
        ads.forEach((ad) => {
            getFlatsAvatars(ad.id);
        });
    }, [ads]);

    useEffect(() => {
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

    return (
        <div className='mainColumn'>
            <div className='mainHeader'>
                <SearchBlock search={search} setSearch={setSearch} />
                <div className='mainHeaderSortRow'>
                    <div className={`mainHeaderSortColumn ${sortOpen ? 'mainHeaderSortColumnTop' : ''}`} ref={sortRef}>
                        {!sortOpen
                            ? <button className='mainHeaderSortButton' onClick={() => setSortOpen(true)}>
                                <img src={sortIcon} alt="Sort" />
                                <p className='mainHeaderSortButtonText'>Сортировать по</p>
                            </button>
                            : <div className='mainHeaderSortBlock'>
                                <button className='mainHeaderSortBlockButton' onClick={() => setSortOpen(false)}>
                                    <img src={sortIcon} alt="Sort" />
                                    <p className='mainHeaderSortButtonText'>Сортировать по</p>
                                </button>
                                {itemSort.map((item, index) => (
                                    <div key={item.state} className={`mainHeaderSortBlockItem ${itemSort.length - 1 === index ? 'noBorderBottom' : ''}`} onClick={() => { setSort(item.state); setSortOpen(false); }}>
                                        <p className='mainHeaderSortBlockItemText'>{item.text}</p>
                                        {item.state === sort && <img src={checkMark} alt='Check mark' />}
                                    </div>
                                ))}
                            </div>}
                        <hr className='mainHeaderSortHr' />
                    </div>
                    <div className={`mainHeaderSortColumn ${filtersOpen ? 'mainHeaderSortColumnTop' : ''}`} ref={filtersRef}>
                        {!filtersOpen
                            ? <button className='mainHeaderSortButton' onClick={() => setFiltersOpen(true)}>
                                <p className='mainHeaderSortButtonText'>Фильтры</p>
                            </button>
                            : <div className='mainHeaderFilterBlock'>
                                <button className='mainHeaderSortBlockButton' onClick={() => setFiltersOpen(false)}>
                                    <p className='mainHeaderSortButtonText'>Фильтры</p>
                                </button>
                                <div className={`mainHeaderSortBlockItem`}>
                                    <p className='mainHeaderSortBlockItemText'>Цена</p>
                                </div>
                                <div className={`mainHeaderSortBlockItem`}>
                                    <input type="text" style={{ width: '50%'}} value={filters.price_from} placeholder='от' onChange={(e) => setFilters({ ...filters, price_from: e.target.value })}/>
                                    <input type="text" style={{ width: '50%'}}  value={filters.price_to} placeholder='до' onChange={(e) => setFilters({ ...filters, price_to: e.target.value })}/>
                                </div>
                                <div className={`mainHeaderSortBlockItem`}>
                                    <p className='mainHeaderSortBlockItemText'>Количество соседей</p>
                                </div>
                                <div className={`mainHeaderSortBlockItem`}>
                                    <input type="text" style={{ width: '50%'}} value={filters.neighbor_from} placeholder='от' onChange={(e) => setFilters({ ...filters, neighbor_from: e.target.value })}/>
                                    <input type="text" style={{ width: '50%'}}  value={filters.neighbor_to} placeholder='до' onChange={(e) => setFilters({ ...filters, neighbor_to: e.target.value })}/>
                                </div>
                                <div className={`mainHeaderSortBlockItem noBorderBottom`}>
                                    <button className='adCardButton' onClick={() => commitFilters()}>Применить</button>
                                </div>
                            </div>}
                        <hr className='mainHeaderSortHr' />
                    </div>
                </div>
            </div>

            {ads.length === 0 ? (
                search ? (
                    <div className='mainEmptyColumn'>
                        <div className='chatsEmptyTextBlock'>
                            <img src={chatsWindow} alt="No ads window" />
                            <p className='chatsEmptyText'>Ничего не найдено...</p>
                        </div>
                        <img src={mainGirlNoAds} alt="No ads illustration" className='mainEmptyImage' />
                    </div>
                ) : (
                    <div className='mainEmptyColumn'>
                        <div className='chatsEmptyTextBlock'>
                            <img src={chatsWindow} alt="No ads window" />
                            <p className='chatsEmptyText'>Тут еще пусто...</p>
                        </div>
                        <img src={mainGirlEmpty} alt="No ads illustration" className='mainEmptyImage' />
                    </div>
                )
            ) : (
                <div className='adsList'>
                    {ads.map((item: IAds) => (
                        <AdCard key={item.id} id={item.id} itemUrl={flatsAvatars[item.id] || "/media/flat/placeholder.png" } about={item.about} name={item.name} />
                    ))}
                </div>
            )}
        </div>
    );
}
