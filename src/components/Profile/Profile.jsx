import ProfileInfo from "./ProfileInfo/ProfileInfo";
import ProfileDashboard from "./ProfileDashboard/ProfileDashboard";
import MenuProfile from "./MenuProfile/MenuProfile";
import topBg from "../../assets/images/topBg.svg";
import "./Profile.css"

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ userImg, getUser,
    userName,
    userCity,
    userDescription,
    cntAds,
    cntMoney,
    cntFavourites }) => {
    return <div className="profile">
        <div>
            <img src={topBg} alt="" className="topBgProfile" />
        </div>
        <ProfileInfo
            userImg={userImg}
            userName={userName}
            userCity={userCity}
            userDescription={userDescription}
        />
        <ProfileDashboard
            cntAds={cntAds}
            cntMoney={cntMoney}
            cntFavourites={cntFavourites}
        />
        <MenuProfile />
    </div>
}