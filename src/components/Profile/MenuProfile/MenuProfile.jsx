import "./MenuProfile.css";
import MenuProfileItem from "./MenuProfileItem/MenuProfileItem";
import logoUser from "../../../assets/icons/user.svg";
import logoAds from "../../../assets/icons/ads.svg";
import helpButton from "../../../assets/icons/obrsvaz.svg";
import logoColor from "../../../assets/icons/color.svg";
import logoHelp from "../../../assets/icons/help.svg";
import logoExit from "../../../assets/icons/exit.svg";

const menuItems = [
  { title: 'Личные данные', icon: logoUser, link: '/profile/personalData' },
  { title: 'Мои объявления', icon: logoAds, link: '/profile/myAds' },
  { title: 'Помощь', icon: logoHelp, link: '/profile/support' },
  { title: 'Обратная связь', icon: helpButton, link: '/profile/returnsup' },
  { title: 'Выйти из аккаунта', icon: logoExit, link: '/profile/logOut' }
];

export default function MenuProfile() {
  return (
    <div className="menu_profile_wrapper">
      {menuItems.map((item) => (
        <MenuProfileItem key={item.link} title={item.title} icon={item.icon} link={item.link} />
      ))}
    </div>
  );
}
