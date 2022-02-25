import { useCallback, useState } from "react";
import { NavLink } from "react-router-dom";
import Social from "./social";
import StakeIcon from "../../../assets/icons/stake.svg";
import ReferralIcon from "../../../assets/icons/referral.svg";
import BondIcon from "../../../assets/icons/bond.svg";
import JESIcon from "../../../assets/icons/JES.png";
import DashboardIcon from "../../../assets/icons/dashboard.svg";
import { trim, shorten } from "../../../helpers";
import { useAddress } from "../../../hooks";
import { Link } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import "./drawer-content.scss";
import DocsIcon from "../../../assets/icons/stake.svg";
import GlobeIcon from "../../../assets/icons/wonderglobe.svg";
import classnames from "classnames";

function NavContent() {
    const [isActive] = useState();
    const address = useAddress();

    const checkPage = useCallback((location: any, page: string): boolean => {
        const currentPath = location.pathname.replace("/", "");
        if (currentPath.indexOf("lobby") >= 0 && page === "lobby") {
            return true;
        }
        if (currentPath.indexOf("upload") >= 0 && page === "upload") {
            return true;
        }
        return false;
    }, []);

    return (
        <div className="dapp-sidebar">
            <div className="branding-header">
                <img alt="" src={JESIcon} width="100px" />

                {address && (
                    <div className="wallet-link">
                        <p>{shorten(address)}</p>
                    </div>
                )}
            </div>

            <div className="dapp-menu-links">
                <div className="dapp-nav">
                    <Link
                        component={NavLink}
                        to="/ido"
                        isActive={(match: any, location: any) => {
                            return checkPage(location, "ido");
                        }}
                        className={classnames("button-dapp-menu", { active: isActive })}
                    >
                        <div className="dapp-menu-item">
                            <img alt="" src={StakeIcon} />
                            <p>IDO</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NavContent;
