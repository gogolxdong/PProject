import { Component, useEffect, useState, useCallback, useMemo } from "react";
import Loading from "../Loader";
import { getAddresses } from "../../constants";
import { Decentiktok } from "../../abi";
import { useWeb3Context } from "../../hooks";
import { BigNumber, ethers } from "ethers";
import "./style.scss";

import CircularProgress from "@material-ui/core/CircularProgress";

const toBuffer = require("it-to-buffer");

const { create } = require("ipfs-http-client");
export const ipfs = create({
    host: "ipfs.infura.io",
    port: "5001",
    protocol: "https",
});

class ImageLoader extends Component {
    async componentDidMount() {
        var image = this.props.image;
        var res = ipfs.cat(image.hash);
        var buffer = await toBuffer(res);
        var blob = new Blob([buffer]);
        var data = { ...image, isDownloadActionDone: false };
        data.src = URL.createObjectURL(blob);
        this.setState({ data });
        const img = new Image();
        img.onload = () => {
            data.isDownloadActionDone = true;
            this.setState({
                data,
            });
        };
        img.onerror = () => {
            data.isDownloadActionDone = true;
            this.setState({
                data,
            });
        };
        img.src = data.src;
    }
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.image,
        };
    }

    render() {
        const { data } = this.state;
        return (
            <div className="card-header">
                {data.isDownloadActionDone ? (
                    <img id={data.id} className="mr-2 imgStyle" height="240" alt={data.description} src={data.src} />
                ) : (
                    <CircularProgress size={60} color="inherit" />
                )}
            </div>
        );
    }
}
export default ImageLoader;
