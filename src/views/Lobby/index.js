import { useState, useCallback, Component } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, InputAdornment, OutlinedInput, Zoom } from "@material-ui/core";
import RebaseTimer from "../../components/RebaseTimer";
import { trim } from "../../helpers";
import "./lobby.scss";
import { useWeb3Context } from "../../hooks";
import { IPendingTxn, isPendingTxn, txnButtonText } from "../../store/slices/pending-txns-slice";
import { Skeleton } from "@material-ui/lab";
import { IReduxState } from "../../store/slices/state.interface";
import { messages } from "../../constants/messages";
import classnames from "classnames";
import { warning } from "../../store/slices/messages-slice";
import Web3 from "web3";
import Decentragram from "../../abi/Decentragram.json";
import store from "../../store";
const toBuffer = require("it-to-buffer");

const { create } = require("ipfs-http-client");
export const ipfs = create({
    host: "ipfs.infura.io",
    port: "5001",
    protocol: "https",
});
class Lobby extends Component {
    async componentDidMount() {
        await this.loadWeb3();
        await this.loadBlockchainData();
        await this.createUrl();
    }

    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            window.alert("Non-Ethereum browser detected.");
        }
    }

    async loadBlockchainData() {
        const web3 = window.web3;
        console.log(this.state.images);
        if (web3.eth) {
            const accounts = await web3.eth.getAccounts();
            this.setState({ account: accounts[0] });
            const networkId = await web3.eth.net.getId();
            const networkData = Decentragram.networks[networkId];
            if (networkData) {
                const decentragram = new web3.eth.Contract(Decentragram.abi, networkData.address);
                this.setState({ decentragram });
                const imagesCount = await decentragram.methods.imageCount().call();
                this.setState({ imagesCount });
                for (var i = 1; i <= imagesCount; i++) {
                    const image = await decentragram.methods.getImage(i).call();
                    console.log(image);
                    this.setState({
                        images: [...this.state.images, image],
                    });
                }
                this.setState({
                    images: this.state.images.sort((a, b) => b.tipAmount - a.tipAmount),
                });
                this.setState({ loading: false });
            } else {
                window.alert("Decentragram contract not deployed to detected network.");
            }
        } else {
            console.log("doesn't have eth wallet");
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            account: "",
            decentragram: null,
            loading: true,
            images: [],
        };
    }

    async createUrl() {
        Promise.all(
            this.state.images.map(async (image, key) => {
                try {
                    const res = ipfs.cat(image.hash);
                    const buffer = await toBuffer(res);
                    const blob = new Blob([buffer]);
                    const added = document.getElementById(key);
                    if (added) {
                        added.src = URL.createObjectURL(blob);
                        added.onload = function (e) {
                            URL.revokeObjectURL(added.src);
                        };
                    }
                } catch {}
            }),
        );
    }

    render() {
        return (
            <div className="stake-view">
                {this.state.images.map((image, key) => {
                    return (
                        <div className="card mb-4" key={key} style={{ color: "white" }}>
                            <div className="card-header">
                                <img id={key} className="mr-2" width="200" alt={image.description} />
                            </div>
                            <ul id="imageList" className="list-group list-group-flush">
                                {image.description && (
                                    <li className="list-group-item">
                                        <a target="_blank" href={`ipfs://${image.hash}`} style={{ color: "white" }}>
                                            {image.description}
                                        </a>
                                    </li>
                                )}
                                <li key={key} className="list-group-item py-2">
                                    <small className="float-left mt-1 text-muted">TIPS: {window.web3.utils.fromWei(image.tipAmount.toString(), "Ether")} BNB</small>
                                    <button
                                        className="btn btn-link btn-sm float-right pt-0"
                                        name={image.id}
                                        onClick={event => {
                                            let tipAmount = window.web3.utils.toWei("0.001", "Ether");
                                            this.props.tipImageOwner(event.target.name, tipAmount);
                                        }}
                                    >
                                        TIP
                                    </button>
                                </li>
                            </ul>
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default Lobby;
