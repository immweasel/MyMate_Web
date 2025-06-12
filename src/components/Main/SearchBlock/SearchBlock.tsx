import searchIcon from "../../../assets/icons/search.svg";

interface ISearch {
    search: string;
    setSearch: (value: string) => void;
}

export default function SearchBlock({ search, setSearch }: ISearch) {

    return (
        <div className='mainHeaderSearchBlock'>
            <input
                placeholder='Найти соседа'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='mainHeaderSearchInput'
            />
            <img src={searchIcon} alt="Search" className='mainHeaderSearchIcon' />
        </div>
    );
}
