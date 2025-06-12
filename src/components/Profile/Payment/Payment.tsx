import './Payment.css';
import TopWithArrow from "../Common/TopWithArrow";
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import cardCheck from "../../../assets/icons/paymentCheck.svg";
import cardCheckFull from "../../../assets/icons/paymentCheckFull.svg";

export default function Payment() {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const promotion = queryParams.get('promotion');
    const [cards, setCards] = useState<string[]>(['*2407', 'Новая карта']);
    const [selectCard, setSelectCard] = useState<string>('');

    function selectPromotionBlock() {
        switch (promotion) {
            case '1':
                return <div className="paymentPromotionBlock">
                    <p className="paymentPromotionText">Тариф “Основной”</p>
                    <p className="paymentPromotionText">250р</p>
                </div>
            case '2':
                return <div className="paymentPromotionBlock">
                    <p className="paymentPromotionText">Тариф “Экспресс”</p>
                    <p className="paymentPromotionText">150р</p>
                </div>
            default:
                return <div className="paymentPromotionBlock">
                    <p className="paymentPromotionText">Выделение объявления</p>
                    <p className="paymentPromotionText">75р</p>
                </div>
        }
    };

    return <div className="paymentMain">
        <TopWithArrow link='/profile/myAds' />
        <div className="paymentContent">
            <div className='paymentColumn'>
                <p className="paymentTitle">Оплата</p>
                {selectPromotionBlock()}
            </div>
            <div className='paymentColumn'>
                <div className='paymentBlockCards' >
                    <p className='paymentBlockCardsTitle' >Способ оплаты:</p>
                    {cards.map((item, index) => <div key={index} className='paymentCardColumn'>
                        <div className='paymentCardLine' onClick={() => setSelectCard(item)}>
                            <p>{item}</p>
                            {selectCard === item
                                ? <img alt='' src={cardCheckFull} />
                                : <img alt='' src={cardCheck} />}
                        </div>
                        {cards.length - 1 !== index && <hr className='paymentCardHr' />}
                    </div>)}
                </div>
                <button className='paymentButton'>Оплатить</button>
            </div>
        </div>
    </div>
};