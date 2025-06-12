import Cookies from "universal-cookie"
import "./MenuProfileItem.css"

import { Link } from "react-router-dom"

export default function MenuProfileItem({ title, icon, condition, link }) {
    const cookies = new Cookies()
    const logout = () => {
        cookies.remove("access_token")
        cookies.remove("refresh_token")
        window.location.href = "/auth";
    }
    if (link === "/profile/logOut") {
        return (<div className="menu-item" onClick={logout}>
            <img src={icon} alt=""/>
            <div className="menu-item__text">
                <p className="menu-item__text_title">{title}</p>
                {/* <p className="menu-item__text_condition">{condition}</p> */}
            </div>
        </div>
            
        )
    }
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    return <Link to={link} className="menu-item">
        <img src={icon} alt="" />
        <div className="menu-item__text">
            <p className="menu-item__text_title">{title}</p>
            {/* <p className="menu-item__text_condition">{condition}</p> */}
        </div>
    </Link>
}
