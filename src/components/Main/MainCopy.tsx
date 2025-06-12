import { useState } from 'react';
import './Main.css';
import mainGirlEmpty from "../../assets/images/mainGirlEmpty.png";
import mainGirlNoAds from "../../assets/images/mainGirlNoAds.png";
import chatsWindow from "../../assets/images/chatsWindow.svg";
import sortIcon from "../../assets/icons/sortIcon.svg";
import checkMark from "../../assets/icons/checkMark.svg";
import SearchBlock from './SearchBlock/SearchBlock';
import AdCard from './AdCard/AdCard';

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
    image: string;
}

interface Filters {
    price_from?: string;
    price_to?: string;
    neighbor_from?: string;
    neighbor_to?: string;
    gender?: string;
}

// 🖼️ Локальные тестовые данные с картинками
const testAds: IAds[] = [
    {
        id: "1",
        name: "Квартира у метро Сокол",
        about: "Просторная квартира, 2 комнаты, стильный ремонт",
        image: "https://bigfoto.name/photo/uploads/posts/2024-03/1709364449_bigfoto-name-p-interer-elitnoi-kvartiri-v-moskve-71.jpg "
    },
    {
        id: "2",
        name: "Двушка в районе Чистые пруды",
        about: "Квартира найдена, двушка, современный ремонт",
        image: "https://idei.club/raznoe/uploads/posts/2022-11/1669259255_idei-club-p-chistovaya-otdelka-pod-klyuch-dizain-insta-40.jpg "
    },
    {
        id: "3",
        name: "Трешка у Алтуфьево",
        about: "80 кв.м., стильный ремонт, рядом парк",
        image: "https://abrakadabra.fun/uploads/posts/2022-12/1670916862_2-abrakadabra-fun-p-pik-shourum-2.jpg "
    },
    {
        id: "4",
        name: "Уютное гнёздышко",
        about: "Студия в центре Москвы, всё рядом",
        image: "https://banki.loans/storage/posts/April2021/oTiEp3D9CzFYnJWa9TBq.jpg "
    },
    {
        id: "5",
        name: "Комната в общаге",
        about: "Без хозяина, 18 м²",
        image: "https://avatars.mds.yandex.net/get-altay/13200126/2a0000019368c0b6fca53b9d16a552b3ac81/XXXL "
    },
    {
        id: "6",
        name: "Квартира у метро Сокол",
        about: "Просторная квартира, 2 комнаты, стильный ремонт. Метро в пешей доступности",
        image: "https://bigfoto.name/photo/uploads/posts/2024-03/1709364449_bigfoto-name-p-interer-elitnoi-kvartiri-v-moskve-71.jpg "
    },
    {
        id: "7",
        name: "Двушка в районе Чистые пруды",
        about: "Квартира найдена, двушка, современный ремонт",
        image: "https://idei.club/raznoe/uploads/posts/2022-11/1669259255_idei-club-p-chistovaya-otdelka-pod-klyuch-dizain-insta-40.jpg "
    },
    {
        id: "8",
        name: "Трешка у Алтуфьево",
        about: "80 кв.м., стильный ремонт, рядом парк",
        image: "https://abrakadabra.fun/uploads/posts/2022-12/1670916862_2-abrakadabra-fun-p-pik-shourum-2.jpg "
    },
    {
        id: "9",
        name: "Уютное гнёздышко",
        about: "Студия в центре Москвы, всё рядом",
        image: "https://banki.loans/storage/posts/April2021/oTiEp3D9CzFYnJWa9TBq.jpg "
    },
    {
        id: "10",
        name: "Комната в общаге",
        about: "Без хозяина, 18 м²",
        image: "https://avatars.mds.yandex.net/get-altay/13200126/2a0000019368c0b6fca53b9d16a552b3ac81/XXXL "
    }
];

export default function MainDev() {
    const [sort, setSort] = useState<string>('alphabetUp');
    const [sortOpen, setSortOpen] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const [filters, setFilters] = useState<Filters>({});
    const [filtersOpen, setFiltersOpen] = useState<boolean>(false);

    // 🧪 Пример фильтрации по названию
    const filteredAds = testAds.filter(ad =>
        ad.name.toLowerCase().includes(search.toLowerCase())
    );

    const commitFilters = () => {
        console.log("Фильтры применены:", filters);
    };

    return (
        <div className='mainColumn'>
            <div className='mainHeader'>
                <SearchBlock search={search} setSearch={setSearch} />
                <div className='mainHeaderSortRow'>
                    <div className={`mainHeaderSortColumn ${sortOpen ? 'mainHeaderSortColumnTop' : ''}`}>
                        {!sortOpen ? (
                            <button className='mainHeaderSortButton' onClick={() => setSortOpen(true)}>
                                <img src={sortIcon} alt="Sort" />
                                <p className='mainHeaderSortButtonText'>Сортировать по</p>
                            </button>
                        ) : (
                            <div className='mainHeaderSortBlock'>
                                <button className='mainHeaderSortBlockButton' onClick={() => setSortOpen(false)}>
                                    <img src={sortIcon} alt="Sort" />
                                    <p className='mainHeaderSortButtonText'>Сортировать по</p>
                                </button>
                                {itemSort.map((item, index) => (
                                    <div
                                        key={item.state}
                                        className={`mainHeaderSortBlockItem ${itemSort.length - 1 === index ? 'noBorderBottom' : ''}`}
                                        onClick={() => { setSort(item.state); setSortOpen(false); }}
                                    >
                                        <p className='mainHeaderSortBlockItemText'>{item.text}</p>
                                        {item.state === sort && <img src={checkMark} alt='Check mark' />}
                                    </div>
                                ))}
                                <hr className='mainHeaderSortHr' />
                            </div>
                        )}
                    </div>

                    <div className={`mainHeaderSortColumn ${filtersOpen ? 'mainHeaderSortColumnTop' : ''}`}>
                        {!filtersOpen ? (
                            <button className='mainHeaderSortButton' onClick={() => setFiltersOpen(true)}>
                                <p className='mainHeaderSortButtonText'>Фильтры</p>
                            </button>
                        ) : (
                            <div className='mainHeaderFilterBlock'>
                                <button className='mainHeaderSortBlockButton' onClick={() => setFiltersOpen(false)}>
                                    <p className='mainHeaderSortButtonText'>Фильтры</p>
                                </button>
                                <div className='mainHeaderSortBlockItem'>
                                    <p className='mainHeaderSortBlockItemText'>Цена</p>
                                </div>
                                <div className='mainHeaderSortBlockItem'>
                                    <input
                                        type="text"
                                        style={{ width: '50%' }}
                                        value={filters.price_from || ''}
                                        placeholder='от'
                                        onChange={(e) => setFilters({ ...filters, price_from: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        style={{ width: '50%' }}
                                        value={filters.price_to || ''}
                                        placeholder='до'
                                        onChange={(e) => setFilters({ ...filters, price_to: e.target.value })}
                                    />
                                </div>
                                <div className='mainHeaderSortBlockItem'>
                                    <p className='mainHeaderSortBlockItemText'>Количество соседей</p>
                                </div>
                                <div className='mainHeaderSortBlockItem'>
                                    <input
                                        type="text"
                                        style={{ width: '50%' }}
                                        value={filters.neighbor_from || ''}
                                        placeholder='от'
                                        onChange={(e) => setFilters({ ...filters, neighbor_from: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        style={{ width: '50%' }}
                                        value={filters.neighbor_to || ''}
                                        placeholder='до'
                                        onChange={(e) => setFilters({ ...filters, neighbor_to: e.target.value })}
                                    />
                                </div>
                                <div className='mainHeaderSortBlockItem noBorderBottom'>
                                    <button className='adCardButton' onClick={commitFilters}>Применить</button>
                                </div>
                                <hr className='mainHeaderSortHr' />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 📦 Результаты поиска */}
            {filteredAds.length === 0 ? (
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
                    {filteredAds.map((item) => (
                        <AdCard
                            key={item.id}
                            id={item.id}
                            itemUrl={item.image}
                            about={item.about}
                            name={item.name}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}