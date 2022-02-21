import { Component, useEffect, useState, useCallback, useMemo } from "react";
import Loading from "../Loader";
import { getAddresses } from "../../constants";
import { Decentiktok } from "../../abi";
import { useWeb3Context, useAddress } from "../../hooks";
import { BigNumber, ethers } from "ethers";
import "./style.scss";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import CardMedia from "@material-ui/core/CardMedia";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import ImageList from "@material-ui/core/ImageList";
import ImageListItem from "@material-ui/core/ImageListItem";
import ImageListItemBar from "@material-ui/core/ImageListItemBar";
import IconButton from "@material-ui/core/IconButton";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import { makeStyles } from "@material-ui/core/styles";

const toBuffer = require("it-to-buffer");

const { create } = require("ipfs-http-client");
export const ipfs = create({
    host: "ipfs.infura.io",
    port: "5001",
    protocol: "https",
});

class ImageLoader extends Component {
    constructor(props) {
        super(props);
        this.props.image.isDownloadActionDone = false;
        this.state = {
            image: this.props.image,
            isSmallScreen: this.props.isSmallScreen,
            contract: this.props.contract,
            address: this.props.address,
        };
    }
    async componentDidMount() {
        const { image, isSmallScreen, contract, address } = this.state;
        var res = ipfs.cat(image.hash);
        var buffer = await toBuffer(res);
        var blob = new Blob([buffer]);
        image.src = URL.createObjectURL(blob);
        var img = new Image();
        img.onload = () => {
            image.isDownloadActionDone = true;
            this.setState({ image: image });
        };
        img.onerror = event => {
            image.isDownloadActionDone = true;
            this.setState({ image: image });
        };
        img.src = image.src;
    }
    async componentDidUpdate() {}

    render() {
        const { image, isSmallScreen, address } = this.state;

        return (
            <>
                {image.isDownloadActionDone && (
                    <div
                        style={{
                            top: "0",
                            left: "0",
                            margin: "0px",
                            width: isSmallScreen ? "100vw" : "100%",
                            height: isSmallScreen ? "100vh" : "100%",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                            webkitBackgroundSize: "cover",
                            oBackgroundSize: "cover",
                            backgroundPosition: "center 0",
                            backgroundImage: `url(${image.src})`,
                        }}
                    ></div>
                )}
                {!image.isDownloadActionDone && (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                        <CircularProgress color="inherit" size={isSmallScreen ? 100 : 60} />
                    </Box>
                )}
            </>
        );
    }
}
export default ImageLoader;
