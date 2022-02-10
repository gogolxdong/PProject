import Decentragram from "../abi/Decentragram.json";
import { Component } from "react";
import { Lobby, Upload, NotFound } from "../views";
import { ipfs } from "../views/Lobby";
import ViewBase from "../components/ViewBase";
import { Route, Redirect, Switch } from "react-router-dom";
import Web3 from "web3";
import { useSelector } from "react-redux";
import store from "../store";

const toBuffer = require("it-to-buffer");
const { dispatch } = store;

class App extends Component {
    async componentDidMount() {
        this.getLongLat();
        await this.loadWeb3();
        await this.loadBlockchainData();
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
        const web3 = window.web3;
        if (web3.eth) {
            const accounts = await web3.eth.getAccounts();
            this.setState({ account: accounts[0] });
        }
    }
    async loadBlockchainData() {
        const web3 = window.web3;
        var longitude = document.getElementById("longtitude").value;
        var latitude = document.getElementById("latitude").value;
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
                    images: this.state.images.sort((a, b) => {
                        Math.sqrt(Math.pow(b.longitude - longitude, 2) + Math.pow(b.latitude - latitude, 2)) -
                            Math.sqrt(Math.pow(a.longitude - longitude, 2) + Math.pow(a.latitude - latitude, 2));
                    }),
                });
                this.setState({ loading: false });
            } else {
                window.alert("Decentragram contract not deployed to detected network.");
            }
        } else {
            console.log("doesn't have eth wallet");
        }
    }

    getLongLat() {
        if (!navigator.geolocation) {
            alert("<p>doesn't support geo location</p>");
            return;
        }

        function success(position) {
            var longitude = document.getElementById("longtitude");
            var latitude = document.getElementById("latitude");
            if (latitude && longitude) {
                latitude.value = position.coords.latitude;
                longitude.value = position.coords.longitude;
            }
        }
        function error() {
            alert("<p>cannot get geo location/p>");
        }
        navigator.geolocation.getCurrentPosition(success, error);
    }

    captureFile = event => {
        event.preventDefault();
        const file = event.target.files[0];
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file);

        reader.onloadend = () => {
            this.setState({ buffer: Buffer(reader.result) });
        };
        const preview = document.getElementById("preview");
        preview.onload = function (e) {
            URL.revokeObjectURL(preview.src);
        };
        preview.src = URL.createObjectURL(file);
        preview.alt = "preview";
        console.log(preview.src);
    };

    uploadImage = async (description, longitude, latitude, gender, stakeAmount, stakeTime) => {
        if (this.state.decentragram && web3.eth) {
            const networkId = await web3.eth.net.getId();
            const networkData = Decentragram.networks[networkId];
            if (networkData) {
                const decentragram = new web3.eth.Contract(Decentragram.abi, networkData.address);
                this.setState({ decentragram });
                this.state.decentragram.events.ImageCreated("latest", (error, event) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("transactionHash:" + event.transactionHash);
                        console.log("blockNumber:" + event.blockNumber);
                    }
                });
                var result = await ipfs.add(this.state.buffer);

                this.setState({ loading: true });
                this.state.decentragram.methods
                    .uploadImage(result.path, description, longitude, latitude, gender, stakeAmount, stakeTime)
                    .send({ from: this.state.account })
                    .on("transactionHash", async hash => {
                        this.setState({ loading: false });
                    })
                    .on("confirmation", async hash => {
                        const res = ipfs.cat(result.cid);
                        const buffer = await toBuffer(res);
                        const blob = new Blob([buffer]);
                        const added = document.getElementById("added");
                        if (added) {
                            added.src = URL.createObjectURL(blob);
                            added.alt = "added";
                            added.onload = function (e) {
                                URL.revokeObjectURL(added.src);
                            };
                        }
                    });
            }
        } else {
            console.log("this.state.decentragram:", !this.state.decentragram);
            console.log("web3.eth:", web3.eth);
        }
    };

    tipImageOwner(id, tipAmount) {
        this.setState({ loading: true });
        this.state.decentragram.methods
            .tipImageOwner(id)
            .send({ from: this.state.account, value: tipAmount })
            .on("transactionHash", hash => {
                this.setState({ loading: false });
            });
        // .on('confirmation', (hash) => {
        //   window.location.reload();
        // })
    }

    constructor(props) {
        super(props);
        this.state = {
            account: "",
            decentragram: null,
            images: [],
            loading: true,
        };
        this.uploadImage = this.uploadImage.bind(this);
        this.tipImageOwner = this.tipImageOwner.bind(this);
        this.captureFile = this.captureFile.bind(this);
    }

    render() {
        return (
            <ViewBase>
                <Switch>
                    <Route exact path="/lobby">
                        <Lobby images={this.state.images} tipImageOwner={this.tipImageOwner} />
                    </Route>

                    <Route exact path="/">
                        <Redirect to="/upload" />
                    </Route>

                    <Route path="/upload">
                        {this.loading ? (
                            <div id="loader" className="text-center mt-5">
                                <p>Loading...</p>
                            </div>
                        ) : (
                            <Upload captureFile={this.captureFile} uploadImage={this.uploadImage} />
                        )}
                    </Route>
                    <Route component={NotFound} />
                </Switch>
            </ViewBase>
        );
    }
}

export default App;
