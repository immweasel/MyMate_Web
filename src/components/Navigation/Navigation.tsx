import './Navigation.css';
import { Link, useLocation } from 'react-router-dom';
import icons from './icons';

interface NavigationItem {
  text: string;
  iconKey: keyof typeof icons;
  link: string;
  items: string[];
}

const navigationItems: NavigationItem[] = [
  { text: 'Главная', iconKey: 'main', link: '/', items: [] },
  { text: 'Избранное', iconKey: 'favourites', link: '/favourites', items: [] },
  { text: 'Объявления', iconKey: 'adsNavigation', link: '/ads', items: [] },
  { text: 'Чаты', iconKey: 'chats', link: '/chats', items: [] },
  { text: 'Профиль', iconKey: 'profile', link: '/profile', items: ['/profile/myAds'] },
];

export default function Navigation() {
  const location = useLocation();
  const navigate = (e: React.MouseEvent,link: string) => {
    e.stopPropagation();
    e.preventDefault();
    window.location.href = link;
  }
  return (
    <div className="main">
      {navigationItems.map((item) => {
        const isActive = location.pathname === item.link || item.items.includes(location.pathname);

        return (
          <Link to={item.link} key={item.link} className="linkNoUnderlineNavigation">
            <div className="navigationItem" onClick={(e)=>navigate(e,item.link)}>
              <img
                src={isActive ? icons[item.iconKey].default : icons[item.iconKey].gray}
                alt={item.text}
                className="navigationItemIcon"
              />
              <p className={isActive ? 'navigationItemText' : 'navigationItemTextGray'}>{item.text}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
