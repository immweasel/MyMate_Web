import topBg from "../../../assets/images/topBg.svg";
import backArrow from "../../../assets/icons/backArrow.svg";
import './Common.css';
import { Link } from "react-router-dom";

interface TopWithArrowProps {
    link: string;
};

export default function TopWithArrow({ link }: TopWithArrowProps) {
    return <>
        <img src={topBg} alt="" className="topBg" />
        <div className="topBgBlock" >
            <div onClick={() => window.location.href = link}>
                <img src={backArrow} alt="" className="topBgArrow" />
            </div>
        </div>
    </>;
};
