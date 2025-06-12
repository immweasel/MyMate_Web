import "./ProfileDashboard.css"

export default function ProfileDashboard({ cntAds, cntMoney, cntFavourites }) {
    return <div className="dashboard">
        <div className="dashboard__info">
            <span className="dashboard__info_cnt">
                {cntAds}
            </span>
            <span className="dashboard__info_title">
                объявлений
            </span>
        </div>
        <div className="dashboard__info">
            <span className="dashboard__info_cnt">
                {cntMoney}
            </span>
            <span className="dashboard__info_title">
                рублей
            </span>
        </div>
        <div className="dashboard__info">
            <span className="dashboard__info_cnt">
                {cntFavourites}
            </span>
            <span className="dashboard__info_title">
                избранное
            </span>
        </div>
    </div>
}
