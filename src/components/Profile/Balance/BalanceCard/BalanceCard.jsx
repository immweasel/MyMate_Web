import "./BalanceCard.css"
import BalanceButton from "../BalanceButton/BalanceButton"
import iconPlus from "../../assets/icons/plus.svg"
import iconReplace from "../../assets/icons/replace.svg"

export default ({money}) => {
    return <div className="balance-card">
        <h3 className="balance-card__title">Баланс</h3>
        <span className="balance-card__money">{`${money} ₽`}</span>
        <div className="balance-card__btn">
            <BalanceButton
            img={iconPlus}
            text="Пополнить"
            />
            <BalanceButton
            img={iconReplace}
            text="Автопополнение"
            />
        </div>
    </div>
}