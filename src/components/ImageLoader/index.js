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
import ImageList from "@material-ui/core/ImageList";
import ImageListItem from "@material-ui/core/ImageListItem";
import ImageListItemBar from "@material-ui/core/ImageListItemBar";
import IconButton from "@material-ui/core/IconButton";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import { makeStyles } from "@material-ui/core/styles";

const toBuffer = require("it-to-buffer");

const { create } = require("ipfs-http-client");
export const ipfs = create({
    host: "207.148.117.14",
    port: "5001",
    protocol: "http",
});

class ImageLoader extends Component {
    constructor(props) {
        super(props);
        this.props.image.isDownloadActionDone = false;
        this.state = {
            data: this.props.image,
            isSmallScreen: this.props.isSmallScreen,
            contract: this.props.contract,
            address: this.props.address,
        };
    }
    async componentDidMount() {
        const { data, isSmallScreen, contract, address } = this.state;
        var img = new Image();
        img.onload = () => {
            data.isDownloadActionDone = true;
            this.setState({ data });
        };
        img.onerror = event => {
            data.isDownloadActionDone = true;
            this.setState({ data });
        };
        console.log("data:", data.src);
        img.src = data.src;
    }
    async componentDidUpdate() {}
    render() {
        const { data, isSmallScreen, contract, address } = this.state;
        return (
            <div>
                {data.isDownloadActionDone && (
                    <ImageListItem
                        key={data.id}
                        style={{
                            top: "0",
                            left: "0",
                            margin: "0px",
                            width: "100%",
                            height: "100%",
                            background: `url(${data.src}) 0% 0% / cover no-repeat fixed`,
                        }}
                    >
                        <ImageListItemBar
                            title={data.description}
                            actionIcon={
                                <IconButton
                                    id={data.id}
                                    aria-label={`star ${data.id}`}
                                    onClick={event => {
                                        if (event.target.id) {
                                            let tipAmount = ethers.utils.parseEther("0.001");
                                            console.log(event.target);
                                            contract.tipImageOwner(event.target.id, { from: address, value: tipAmount });
                                        }
                                    }}
                                >
                                    <StarBorderIcon />
                                </IconButton>
                            }
                        >
                            {/* <div id="imageList" className="list-group list-group-flush">
                                {data.description && (
                                    <div className="list-group-item">
                                        {window.navigator.brave ? (
                                            <a target="_blank" href={`ipfs://${data.hash}`} style={{ color: "white" }}>
                                                {" "}
                                                {data.description}
                                            </a>
                                        ) : (
                                            <a target="_blank" href={`https://ipfs.io/ipfs/${data.hash}`} style={{ color: "white" }}>
                                                {" "}
                                                {data.description}
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div> */}
                        </ImageListItemBar>
                    </ImageListItem>
                )}
                {!data.isDownloadActionDone && <CircularProgress size={this.state.isSmallScreen ? 100 : 60} color="inherit" />}
            </div>
        );
    }
}
export default ImageLoader;
