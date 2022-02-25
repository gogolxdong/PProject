import { Component } from "react";
import { Grid, InputAdornment, OutlinedInput, Zoom, Slider } from "@material-ui/core";
import "./ido.scss";
import "./index.scss";
import poolabi from "./poolabi";
import usdtabi from "./usdtabi";
import { error, warning, success, info } from "../../store/slices/messages-slice";
import { ethers, BigNumber } from "ethers";
import logo from "../../assets/icons/JES.png";
import { formatUnits } from "ethers/lib/utils";

var featured = {
    closes_in: "Ended",
    distribute_token: 0,
    _id: "",
    start_date: Date.parse(new Date("2022-02-24 18:00:00 GMT+0800")),
    end_date: Date.parse(new Date("2022-03-24 00:00:00 GMT+0800")),
    pool_type: "featured",
    title: "JES",
    up_pool_raise: 5,
    usd_per_share: 1,
    content:
        "Jes Eco is a whole-industry structure ecosystem based on BSC, wholely-owned by Universe Guild, and a comprehensive ecological chain integrating DeFi+DAO+GameFi2.0+SocialFi+Metaverse.",
    images: "./JES.png",
    min_allocation: "",
    max_allocation: "",
    up_pool_access: "Public 1",
    participants: 0,
    swap_amount: null,
    min_swap_level: "",
    symbol: "JES",
    decimal: 18,
    address: "0xD6E58c7aA44C4aFf29ed4c686f74464848780Da7",
    token_address: "TBA",
    abi_name: "",
    raised: 0,
    total_supply: 12000000,
    idoPercent: 0.2,
    description: "<p>JES Eco</p>",
    twitter_link: "",
    git_link: "",
    telegram_link: "",
    reddit_link: "",
    medium_link: "",
    browser_web_link: "",
    youtube: "",
    instagram: "",
    discord: "",
    white_paper: "",
    network_type: "BSC",
    crypto_type: "USDT",
    idophase: "Public 1",
    token_distribution_date: "",
    fblink: "",
    contract_type: "",
    createdAt: "",
    updatedAt: Date.now(),
    __v: 0,
    Owner: null,
    price: null,
    time_duration: Date.now(),
    number1: 0,
    number2: 0,
};

var startDate = new Date(featured.start_date);
let year = startDate.getFullYear();
let month = startDate.getMonth() + 1;
let day = startDate.getDate();
let hour = startDate.getHours();
let minute = startDate.getMinutes();
let second = startDate.getSeconds();
const start = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;

const endDate = new Date(featured.end_date);
year = endDate.getFullYear();
month = endDate.getMonth() + 1;
day = endDate.getDate();
hour = endDate.getHours();
minute = endDate.getMinutes();
second = endDate.getSeconds();
const endTime = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;

let title = "";
const uint256MAX = BigNumber.from("115792089237316195423570985008687907853269984665640564039457584007913129639935");
let usdt = null;
let ido = null;
let closed = 0;
let closesIn = 0;
let startIn = 0;
let filled = 0;
let startTimeMobile = "";
let startTime = "";
let y = 0;
let address = "";

class IDO extends Component {
    constructor(props) {
        address = props.address;
        const signer = props.provider.getSigner();
        ido = new ethers.Contract(featured.address, poolabi, signer);
        // console.log("ido:", ido);
        usdt = new ethers.Contract("0xba3bbC92C70BF973920CdE3DdAFab34F7ad44A15", usdtabi, signer);
        // console.log("usdt:", usdt);

        ido.getBalance(address).then(balance => {
            console.log("balance:", balance);

            this.setState({ balance: formatUnits(balance, 18) });
        });
        super(props);
        this.state = {
            approved: false,
            dispatch: props.dispatch,
            number1: 0,
            number2: 0,
            balance: "",
            participants: 0,
            amount: 0,
        };
    }

    async componentDidMount() {
        if (featured.start_date) {
            let date = new Date();
            let now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
            if (this.state.number1 > "99.98") {
                startIn = 0;
                closesIn = 0;
                closed = 0;
                filled = 1;
                y = 1;
            } else if (endDate < now_utc) {
                closed = 1;
                y = 1;
            } else if (now_utc < startDate) {
                startIn = 1;
                y = 1;
            } else if (endDate >= now_utc && now_utc >= startDate) {
                closesIn = 1;
                startIn = 0;
                y = 0;
            } else {
                startIn = 0;
                closesIn = 0;
                y = 1;
            }
        }
        let intervalId;
        clearInterval(intervalId);
        intervalId = setInterval(() => {
            let date = new Date();
            let now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
            if (this.state.number1 > "99.98") {
                startIn = 0;
                closesIn = 0;
                closed = 0;
                filled = 1;
                y = 1;
            } else if (endDate < now_utc) {
                closed = 1;
                y = 1;
            } else if (now_utc < startDate) {
                startIn = 1;
                y = 1;
            } else if (endDate >= now_utc && now_utc >= startDate) {
                closesIn = 1;
                startIn = 0;
                y = 0;
            } else {
                startIn = 0;
                closesIn = 0;
                y = 1;
            }

            let closes_in_days = "";
            let closes_in_hours = "";
            let closes_in_minutes = "";
            let closes_seconds = "";
            let desktopTimer = "";
            let mobileTimer = "";
            let closes_in_sec = "";
            if (startDate && startIn) {
                closes_in_sec = (startDate - now_utc) / 1000;

                closes_in_days = Math.floor(closes_in_sec / (3600 * 24));

                closes_in_sec -= closes_in_days * 86400;

                closes_in_hours = Math.floor(closes_in_sec / 3600) % 24;
                closes_in_sec -= closes_in_hours * 3600;

                closes_in_minutes = Math.floor(closes_in_sec / 60) % 60;
                closes_in_sec -= closes_in_minutes * 60;

                closes_seconds = Math.floor(closes_in_sec % 60);

                desktopTimer = `${closes_in_days} days: ${closes_in_hours} hours: ${closes_in_minutes} minutes: ${closes_seconds} seconds`;
                mobileTimer = `${closes_in_days} d: ${closes_in_hours} h: ${closes_in_minutes} m: ${closes_seconds} s`;

                startTime = desktopTimer;
                startTimeMobile = mobileTimer;
            }

            if (endDate && closesIn) {
                closes_in_sec = (endDate - now_utc) / 1000;

                closes_in_days = Math.floor(closes_in_sec / (3600 * 24));

                closes_in_sec -= closes_in_days * 86400;

                closes_in_hours = Math.floor(closes_in_sec / 3600) % 24;
                closes_in_sec -= closes_in_hours * 3600;

                closes_in_minutes = Math.floor(closes_in_sec / 60) % 60;
                closes_in_sec -= closes_in_minutes * 60;

                closes_seconds = Math.floor(closes_in_sec % 60);

                desktopTimer = `${closes_in_days} days: ${closes_in_hours} hours: ${closes_in_minutes} minutes: ${closes_seconds} seconds`;
                mobileTimer = `${closes_in_days}d: ${closes_in_hours}h: ${closes_in_minutes}m: ${closes_seconds}s`;

                startTime = desktopTimer;
                startTimeMobile = mobileTimer;

                ido.IDOTotal().then(result => {
                    featured.raised = result;

                    this.setState({
                        number1: ((featured.raised * featured.up_pool_raise) / 10 ** 18 / (featured.total_supply * featured.idoPercent)) * 100,
                        number2: featured.raised / 10 ** 18,
                    });
                });

                ido.getBalance(address).then(result => {
                    this.setState({ balance: formatUnits(result, 18) });
                });
                ido.participants().then(result => {
                    this.setState({ participants: result });
                });

                usdt.allowance(address, featured.address).then(allowance => {
                    if (BigNumber.from(allowance) >= uint256MAX / 2) {
                        this.setState({ approved: true });
                    }
                });
            }
        }, 1000);
    }

    async buyToken() {
        const usdPerShare = featured.usd_per_share;
        let stake = (BigNumber.from(10).pow(18) * this.state.amount * usdPerShare).toString();
        const res = await ido.attendIDO(stake);
    }
    render() {
        let allocation;
        let full = "";
        let num;
        let length = featured.content && featured.content.length && featured.content.length > 210;
        title = featured.title && featured.title.length && featured.title.length >= 20 ? `${featured.title.substring(0, 20)}...` : featured.title;
        num = Math.ceil(this.state.number1 / 2);
        allocation = this.state.number2 * featured.up_pool_raise;
        if (num === 50) {
            full = "fullupload";
        }
        return (
            <div className="calculator-view">
                <Zoom in={true}>
                    <div className="calculator-card">
                        <div className="home">
                            <div className="pools feat_ured">
                                <div className="container_cust">
                                    <div className="inner_pools">
                                        <div className="pool_grid home">
                                            {" "}
                                            <div className="pool_card">
                                                <div className="pool-link">
                                                    <div className="tit_le">
                                                        <div className="title-img">
                                                            <img className="image_circle" src={logo} alt="Logo" />
                                                        </div>
                                                        <div className="title-head">
                                                            <h3>
                                                                <div className="h-title">{title}</div>
                                                                <span>
                                                                    1 {featured.crypto_type === "USDT" ? "USDT" : "BNB"} = {featured.up_pool_raise} {featured.symbol}
                                                                </span>
                                                            </h3>
                                                            <div className="title-info">
                                                                <p>
                                                                    {length ? featured.content.substring(0, 170) : featured.content}
                                                                    {length ? "..." : ""}
                                                                    {length && <a href="#read-more">Read More</a>}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="title-head-mob">
                                                        <h3>
                                                            <div className="h-title">{title}</div>
                                                        </h3>
                                                        <div className="title-info">
                                                            <p>
                                                                {length ? featured.content.substring(0, 170) : featured.content}
                                                                {length ? "..." : ""}
                                                                {length && (
                                                                    <a href="#read-more" onClick={this.handleOpen}>
                                                                        Read More
                                                                    </a>
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="center-bg"></div>
                                                <div className="home-progress">
                                                    <div className="raise-three mob">
                                                        <div className="raise">
                                                            <p className="total_raise">Total Raised</p>
                                                            <h2>
                                                                {this.state.number2 ? this.state.number2.toFixed(2) : "0"} {featured.crypto_type === "USDT" ? "USDT" : "BNB"}
                                                            </h2>
                                                        </div>
                                                        <div className="allocation">
                                                            <div>
                                                                <p className="feature_max">Maximum</p>
                                                                <h3>
                                                                    {featured.max_allocation
                                                                        ? featured.max_allocation + (featured.crypto_type === "USDT" ? " USDT" : " BNB")
                                                                        : "TBA"}
                                                                </h3>
                                                            </div>
                                                            <div>
                                                                <p className="feature_max">Access</p>
                                                                <h3>{featured.up_pool_access}</h3>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="allocation-mob">
                                                        <div>
                                                            <p className="feature_max">Maximum</p>
                                                            <h3>
                                                                {featured.max_allocation ? featured.max_allocation + (featured.crypto_type === "USDT" ? " USDT" : " BNB") : "TBA"}
                                                            </h3>
                                                        </div>
                                                        <div>
                                                            <p className="feature_max">Access</p>
                                                            <h3>{featured.up_pool_access}</h3>
                                                        </div>
                                                    </div>
                                                    <div className="rts">
                                                        {startIn ? <p className="status-p">Start in</p> : ""}
                                                        <div className="timer_desktop">
                                                            {startIn === 1 ? (
                                                                <h3 style={{ color: "white", fontSize: 18 }} id="poolonpagestart">
                                                                    {startTime}
                                                                </h3>
                                                            ) : (
                                                                ""
                                                            )}
                                                        </div>
                                                        <div className="timer_mobile">
                                                            {startIn === 1 ? (
                                                                <h3 style={{ color: "white", fontSize: 14 }} id="poolonpagestart">
                                                                    {startTimeMobile}
                                                                </h3>
                                                            ) : (
                                                                ""
                                                            )}
                                                        </div>
                                                        {closesIn ? <p className="status-p">Ends in</p> : ""}
                                                        <div className="timer_desktop">
                                                            {closesIn === 1 ? (
                                                                <h3 style={{ color: "white", fontSize: 18 }} id="poolonpagestart">
                                                                    {startTimeMobile}
                                                                </h3>
                                                            ) : (
                                                                ""
                                                            )}
                                                        </div>
                                                        <div className="timer_mobile">
                                                            {closesIn === 1 ? (
                                                                <h3 style={{ color: "white", fontSize: 14 }} id="poolonpagestart">
                                                                    {startTimeMobile}
                                                                </h3>
                                                            ) : (
                                                                ""
                                                            )}
                                                        </div>
                                                        {closed ? <p className="status-p">Status</p> : ""}
                                                        {closed ? <h3>Closed</h3> : ""}
                                                        {filled ? <h3>Filled</h3> : ""}
                                                    </div>
                                                    <div className="prog_bar">
                                                        <div className="prog_bar_grd">
                                                            <span className="prog">Progress</span>
                                                            <span className="parti">
                                                                Max Participants <span className="white_text">{this.state.participants.toString()}</span>
                                                            </span>
                                                        </div>
                                                        <div className={`battery ${full}`}>
                                                            {num ? [...Array(num)].map((item, index) => <div className="bar active" key={index} data-power="10"></div>) : ""}
                                                        </div>
                                                        <div className="prog_bar_grd">
                                                            {<span className="prog _percent">{this.state.number1 ? this.state.number1.toFixed(2) : "0"}%</span>}
                                                            {
                                                                <span className="parti _nls">
                                                                    {allocation ? allocation.toFixed(2) : "0"}/{featured.total_supply * 0.2} {featured.symbol}
                                                                </span>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                        <div className="buy-btnbtc">
                                                            <div className="buy-token">
                                                                {this.state.approved ? (
                                                                    <OutlinedInput
                                                                        id="buy-button"
                                                                        className="btnn_white"
                                                                        style={{ color: "white", border: "2px solid #2f2f37" }}
                                                                        type="number"
                                                                        placeholder="Amount"
                                                                        value={this.state.amount}
                                                                        onChange={e => {
                                                                            var value = e.target.value;
                                                                            this.setState({ amount: value });
                                                                        }}
                                                                        endAdornment={
                                                                            <InputAdornment position="end">
                                                                                <div
                                                                                    style={{ cursor: "pointer" }}
                                                                                    className="wrap-action-input-btn"
                                                                                    onClick={async () => {
                                                                                        var balance = await ido.getBalance(address);
                                                                                        if (balance == 0) {
                                                                                            if (this.state.amount >= 100 && this.state.amount <= 1000) {
                                                                                                this.buyToken(this.state.amount);
                                                                                            } else {
                                                                                                this.state.dispatch(
                                                                                                    error({ text: "The first staking have to bewteen 100 and 1000" }),
                                                                                                );
                                                                                            }
                                                                                        } else {
                                                                                            var added = balance.add(BigNumber.from(10).pow(18).mul(this.state.amount));
                                                                                            if (added > BigNumber.from(10).pow(18) * 1000) {
                                                                                                this.state.dispatch(error({ text: "Total staking have to be smaller than 1000" }));
                                                                                            } else {
                                                                                                this.buyToken(this.state.amount);
                                                                                            }
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    <p>Buy</p>
                                                                                </div>
                                                                            </InputAdornment>
                                                                        }
                                                                    ></OutlinedInput>
                                                                ) : (
                                                                    <button
                                                                        className="btnn_white"
                                                                        onClick={async () => {
                                                                            await usdt.approve(featured.address, BigNumber.from(uint256MAX));
                                                                        }}
                                                                    >
                                                                        Approve
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p>My Balance:{this.state.balance}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Zoom>
            </div>
        );
    }
}

export default IDO;
