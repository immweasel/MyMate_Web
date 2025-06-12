import TopWithArrow from "../Common/TopWithArrow";
import './Promotion.css';
import promotionOne from "../../../assets/images/promotionOne.png";
import promotionTwo from "../../../assets/images/promotionTwo.png";
import promotionFour from "../../../assets/images/promotionFour.png";
import { useState } from "react";
import { Link } from "react-router-dom";

const promotionData = [
    { title: 'Выделение объявления', cost: '75р', oldCost: '150р', cover: promotionOne, items: ['выделение названия;', 'увеличение размера объявления;', 'увеличение размера названия'], term: '7 дней' },
    { title: 'Тариф “Основной”', cost: '250р', oldCost: '500р', cover: promotionTwo, items: ['показ в первой строке;', 'выделение объявления;', 'улучшенные рекомендации;'], term: '5 дней' },
    { title: 'Тариф “Экспресс”', cost: '150р', oldCost: '300р', cover: promotionFour, items: ['показ объявления всем;', 'закрепление в первой строке во всех разделах;', 'выделение среди других объявлений'], term: '2 дня' }
];

export default function Promotion() {

    const [selectPromotion, setSelectPromotion] = useState<number>(-1);

    return <div className="promotionMain">
        <TopWithArrow link='/profile/myAds' />
        <div className="promotionContent">
            <p className="promotionTitle">Выберите продвижение</p>
            <div className="promotionLine">
                {[0, 1].map(item => <div key={item} className={`promotionSmallBlock ${selectPromotion === item ? "promotionBlockSelect" : ""}`} onClick={() => setSelectPromotion(item)}>
                    <div className="promotionCoverBox">
                        <img src={promotionData[item].cover} alt="" className="promotionCover" />
                        <p className="promotionSale">-50%</p>
                    </div>
                    <p className="promotionItemTitle">{promotionData[item].title}</p>
                    <div className="promotionCostLine">
                        <p className="promotionItemCost">{promotionData[item].cost}</p>
                        <p className="promotionItemCostOld">{promotionData[item].oldCost}</p>
                    </div>
                    <ul>
                        {promotionData[item].items.map((x, i) => <li key={i}>{x}</li>)}
                    </ul>
                    <hr className="promotionItemHr" />
                    <p className="promotionItemTerm" >{promotionData[item].term}</p>
                </div>)}
            </div>
            <div className={`promotionBigBlock ${selectPromotion === 2 ? "promotionBlockSelect" : ""}`} onClick={() => setSelectPromotion(2)}>
                <div className="promotionCoverBox">
                    <img src={promotionData[2].cover} alt="" className="promotionCover" />
                    <p className="promotionSaleBig">-50%</p>
                </div>
                <p className="promotionItemBigTitle">{promotionData[2].title}</p>
                <div className="promotionCostLine">
                    <p className="promotionItemCost">{promotionData[2].cost}</p>
                    <p className="promotionItemCostOld">{promotionData[2].oldCost}</p>
                </div>
                <ul className="promotionBigUl" >
                    {promotionData[2].items.map((x, i) => <li key={i}>{x}</li>)}
                </ul>
                <hr className="promotionItemHr" />
                <p className="promotionItemTerm" >{promotionData[2].term}</p>
            </div>
            <Link to={selectPromotion >= 0 ? `/profile/payment?promotion=${selectPromotion}` : ''} className="link">
                <button className={`promotionButton ${selectPromotion >= 0 ? "promotionButtonSelect" : ""}`} onClick={() => console.log(selectPromotion)}>Оплатить</button>
            </Link>
        </div>
    </div>
};  