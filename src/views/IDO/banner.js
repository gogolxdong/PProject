import React from "react";
import TelegramIcon from "@material-ui/icons/Telegram";
import LanguageIcon from "@material-ui/icons/Language";
import YouTubeIcon from "@material-ui/icons/YouTube";
import InstagramIcon from "@material-ui/icons/Instagram";
import PropTypes from "prop-types";

class Banner extends React.Component {
    componentDidMount() {}

    constructor(props) {
        super(props);
        this.state = {
            pool_detail: props.pool_detail,
        };
    }

    render() {
        const pool_detail = this.state.pool_detail;
        if (!pool_detail) {
            return "";
        }
        return (
            <div className="pool_detail_banner">
                <div className="container_cust">
                    <div className="inner_pool_detail_banner">
                        <div className="left_ban">
                            <div className="ti_tle">
                                <img alt="" src={pool_detail.images} />
                                <div className="socia_grd">
                                    <div>
                                        <h3>{pool_detail.title}</h3>
                                        <p>{pool_detail.content}</p>
                                    </div>
                                    <div className="socia_l">
                                        <ul>
                                            {pool_detail.telegram_link ? (
                                                <li className="nav-item">
                                                    <a className="nav-link" href={pool_detail.telegram_link} rel="noopener noreferrer">
                                                        {" "}
                                                        <TelegramIcon />
                                                    </a>
                                                </li>
                                            ) : (
                                                ""
                                            )}
                                            {pool_detail.browser_web_link ? (
                                                <li className="nav-item">
                                                    <a className="nav-link" href={pool_detail.browser_web_link} rel="noopener noreferrer">
                                                        {" "}
                                                        <LanguageIcon />
                                                    </a>
                                                </li>
                                            ) : (
                                                ""
                                            )}
                                            {pool_detail.youtube ? (
                                                <li className="nav-item">
                                                    <a className="nav-link" href={pool_detail.youtube} target="_blank" rel="noopener noreferrer">
                                                        {" "}
                                                        <YouTubeIcon />
                                                    </a>
                                                </li>
                                            ) : (
                                                ""
                                            )}
                                            {pool_detail.instagram ? (
                                                <li className="nav-item">
                                                    <a className="nav-link" href={pool_detail.instagram} target="_blank" rel="noopener noreferrer">
                                                        {" "}
                                                        <InstagramIcon />
                                                    </a>
                                                </li>
                                            ) : (
                                                ""
                                            )}
                                            {pool_detail.discord ? (
                                                <li className="nav-item ">
                                                    <a className="nav-link" href={pool_detail.discord} target="_blank" rel="noopener noreferrer">
                                                        <span>
                                                            <i className="fa fa-discord" area-hidden="true"></i>
                                                        </span>{" "}
                                                    </a>
                                                </li>
                                            ) : (
                                                ""
                                            )}
                                            {pool_detail.fblink ? (
                                                <li className="nav-item ">
                                                    <a className="nav-link" href={pool_detail.fblink} target="_blank" rel="noopener noreferrer">
                                                        <span>
                                                            <i className="fa fa-facebook-square" aria-hidden="true"></i>
                                                        </span>{" "}
                                                    </a>
                                                </li>
                                            ) : (
                                                ""
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {this.props.rightBan}
                    </div>
                </div>
            </div>
        );
    }
}

Banner.propTypes = {
    rightBan: PropTypes.element,
};

export default Banner;
