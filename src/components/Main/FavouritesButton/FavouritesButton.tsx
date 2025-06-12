import './FavouritesButton.css';
import favButton from "../../../assets/icons/favButton.svg";
import favButtonSmall from "../../../assets/icons/favButtonSmall.svg";
import likeIcon from "../../../assets/icons/like.svg";

interface FavouritesButtonInterface {
    type: string;
    onclick: () => void;
    isActive?: boolean;
}

export default function FavouritesButton({ type, onclick, isActive }: FavouritesButtonInterface) {
    // return (type === 'onAdCard'
    //     ? <div onClick={onclick}><button className="favButtonSmall">
    //         <img src={favButtonSmall} alt="" />
    //     </button></div>
    //     : <div onClick={onclick}><button className="favButtonBig">
    //         <img src={favButton} alt="" />
    //     </button></div>
    // )

    const buttonClass = isActive ? 'favButtonSmall active' : 'favButtonSmall';

    return (
        <div onClick={onclick}>
            <button className={buttonClass} type="button">
                <img src={isActive ? likeIcon : favButtonSmall} alt="" />
            </button>
        </div>
    );
}