import TopWithArrow from '../Common/TopWithArrow';

import skidka from "../../../assets/images/skidka.png";
import photo1 from "../../../assets/images/photo1.png";
import tarif1 from "../../../assets/images/tarif1.png";
import text1 from "../../../assets/images/text1.png";

import photo2 from "../../../assets/images/photo2.png";
import tarif2 from "../../../assets/images/tarif2.png";
import text2 from "../../../assets/images/text2.png";

import photo3 from "../../../assets/images/photo3.png";
import tarif3 from "../../../assets/images/tarif3.png";
import text3 from "../../../assets/images/text3.png";

import './Prodvigate.css';

import { Link } from 'react-router-dom';

/*

interface AdInterface {

    id: number;

    title: string;

};

*/

export default function Prodvigate() {

    return (
        <div className='mainProdvigate'>

            <TopWithArrow link='/profile/myAds' />

            <div className='myProdvigateContent'>
                <div className='myProdvigateContentHeader'>
                    <p className='myProdvigateContentHeaderTitle'>Выберите продвижение</p>
                </div>

                <div className='myProdvigateContentHeader'>
                    <div className='myProdvigateContentHeaderTitle'>
                        
                        <div className='myProdvigateBlocks'>
                            <div className='QR'>
                                <div className='myProdvigates'>
                                    <div className='Photos'>
                                        <img src={photo1}  width=" 141" height=" 135"></img>
                                        <img src={skidka}  width="58" height="28" className='skida'></img>
                                        <div className='tarifElements'>
                                            <p className='nameTarif'>Выделение объявления</p>
                                            <img src={tarif1}  width="90" height="22"></img>
                                            <img src={text1}  width="147" height="113"></img>
                                        </div>
                                    </div>
                                </div>

                                <div className='myProdvigates'>
                                    <div className='Photos'>
                                        <img src={photo2}  width=" 141" height=" 135"></img>
                                        <img src={skidka}  width="58" height="28" className='skida'></img>
                                        <div className='tarifElements'>
                                            <p className='nameTarif'>Тариф</p>
                                            <p className='nameTarif'>"Основной"</p>
                                            <img src={tarif2}  width="90" height="22"></img>
                                            <img src={text2}  width="147" height="113"></img>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='myProdvigatesExpress'>
                                <div className='Photos'>
                                    <img src={photo3}  width=" 335" height=" 121.11"></img>
                                    <img src={skidka}  width="58" height="28" className='skida'></img>
                                    <div className='tarifElements'>
                                        <p className='nameTarif'>Тариф "Экспресс"</p>
                                        <img src={tarif3}  width="104" height="25"></img>
                                        <img src={text3}  width="341" height="80"></img>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                
                <Link to='/profile/payment' className='linkNolineCreate'>
                    <button className='myProdvigateContentButton'>Оплатить</button>
                </Link>
                
            </div>
        </div>
    );
};