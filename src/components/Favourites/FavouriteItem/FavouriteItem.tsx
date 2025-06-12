import { FavouritesInterface } from '../interfaces/interfaces';
import breakFavourite from "../../../assets/icons/breakHeart.svg";
import './FavouriteItem.css';
import { Link } from 'react-router-dom';

export default function FavouriteItem({ id, title, subtitle, cover, dislikeFunc }: FavouritesInterface) {
    const handleDislike = (e: React.MouseEvent) => {
        e.stopPropagation(); // Останавливаем всплытие
        e.preventDefault(); // На всякий случай предотвращаем действие по умолчанию
        dislikeFunc(); // Вызываем функцию
    };
    return <Link to={`/ad/${id}?page=favourites`} className='linkNoUnderline' >
        <div className='favouriteItem'>
            <div className='favouriteItemLine' >
                <img src={cover} alt='' className='favouriteItemCover' />
                <div className='favouriteItemColumn'>
                    <p className='favouriteItemTitle'>{title}</p>
                    <p className='favouriteItemSubtitle'>{subtitle}</p>
                </div>
            </div>
            <button className='unFavouriteButton' onClick={handleDislike}>
                <img src={breakFavourite} alt='' />
            </button>
        </div>
    </Link>
};