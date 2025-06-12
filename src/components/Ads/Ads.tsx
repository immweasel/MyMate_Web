import './Ads.css';
import bigLogo from "../../assets/icons/bigLogo.svg";
import adsMan from "../../assets/images/adsMan.png";
import chatsWindow from "../../assets/images/chatsWindow.svg";

export default function Ads() {
    return <div className='adsMain'>
        <img src={bigLogo} alt='' />
        <div className='adsColumn'>
            <div className='chatsEmptyTextBlock'>
                <img src={chatsWindow} alt="No chats window" />
                <p className='adsEmptyText'>Тут еще разработка идет. Ожидайте...</p>
            </div>
            <img src={adsMan} alt='' className='adsImage' />
        </div>
    </div>
};