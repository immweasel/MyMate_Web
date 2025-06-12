import "./BalanceButton.css"

export default ({img, text, func}) => {
    return <button onClick={func} className="balace-btn">
        <img src={img} alt="" />
        {text}
    </button>
}