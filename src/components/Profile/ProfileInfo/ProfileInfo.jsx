import "./ProfileInfo.css";
import defaultUserImg from "../../../assets/images/defaultUserImg.png"; // Замените на путь к вашему изображению по умолчанию
import arrowRight from "../../../assets/icons/rightArrow.png";

export default ({ userImg, userName, userCity, userDescription }) => {
    // Проверяем, есть ли у пользователя изображение
    const imageSrc = userImg || defaultUserImg;

    return (
        <div className="user-info">
            <div className="user-info__img">
                <img src={imageSrc} alt="User" />
            </div>
            <a href="#" className="user-info__name">
                <h2>
                    {userName}
                </h2>
                <img src={arrowRight} alt="Arrow" />
            </a>
            <span className="user-info__city">
                {userCity}
            </span>
            <div className="user-info__about-me">
                <span className="user-info__about-me_title">
                    О себе:
                </span>
                <p className="user-info__about-me_description">
                    {userDescription}
                </p>
            </div>
        </div>
    );
}
