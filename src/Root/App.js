import { Component, useEffect, useState, useCallback, useMemo, useRef } from "react";
import ViewBase from "../components/ViewBase";
import { Route, Redirect, Switch } from "react-router-dom";
import { useWeb3Context } from "../hooks";
import { IReduxState } from "../store/slices/state.interface";
import { useAddress } from "../hooks";
import { useSelector, useDispatch } from "react-redux";
import { BigNumber, ethers } from "ethers";
import { getAddresses } from "../constants";
import { Decentiktok } from "../abi";
import { loadAppDetails } from "../store/slices/app-slice";
import { createTheme, ThemeProvider, makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import { Grid, InputAdornment, OutlinedInput, Zoom, Slider, MenuItem, ImageList } from "@material-ui/core";
import "./App.scss";
import "./style.scss";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { NotFound, IDO } from "../views";

const toBuffer = require("it-to-buffer");
const { create } = require("ipfs-http-client");
export const ipfs = create({
    host: "ipfs.infura.io",
    port: "5001",
    protocol: "https",
});

function App() {
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const isSmallScreen = useMediaQuery("(max-width: 600px)");
    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    primary: {
                        // light: will be calculated from palette.primary.main,
                        main: "#141416",
                        dark: "#141416",
                        contrastText: "#FCFCFD",
                    },
                    secondary: {
                        // light: '#0066ff',
                        main: "#23262e",
                        dark: "#23262e",
                        contrastText: "white",
                    },
                    // Used by `getContrastText()` to maximize the contrast between
                    // the background and the text.
                    contrastThreshold: 0,
                    // Used by the functions below to shift a color's luminance by approximately
                    // two indexes within its tonal palette.
                    // E.g., shift from Red 500 to Red 300 or Red 700.
                    tonalOffset: 0,
                },
            }),
        [prefersDarkMode],
    );
    const useStyles = makeStyles(() => ({
        root: {
            color: "white",
            flexGrow: 1,
            display: "flex",
            flexWrap: "wrap",
        },
        head: {
            height: "90px",
            borderBottom: "0.4px solid #353945",
        },
        middle: {
            verticalAlign: "middle",
        },
        spacing: {
            flexGrow: 1,
        },
        chip: {
            borderColor: "#353945",
            borderWidth: "2px",
            fontSize: 14,
            padding: 5,
            height: 40,
            borderRadius: 20,
            fontWeight: "bold",
            wordSpacing: 1.1,
            letterSpacing: 1.1,
        },
        navButtons: {
            color: theme.palette.secondary.contrastText,
            textTransform: "none",
            marginRight: theme.spacing(1),
            fontSize: 14,
        },
        dataWidth: {
            width: isSmallScreen ? "100vw" : "61.8vw",
        },
        body: {
            justifyContent: "center",
        },
        start: {
            marginLeft: theme.spacing(2),
        },
        up: {
            marginTop: theme.spacing(5),
        },
        endButton: {
            color: "white",
            textTransform: "none",
            marginRight: theme.spacing(2),
            fontSize: 14,
        },
        icon: {
            width: "10px",
            height: "10px",
            color: theme.palette.secondary.contrastText,
            marginRight: theme.spacing(2),
        },
        title: {
            fontWeight: "medium",
            wordSpacing: 1.1,
            letterSpacing: 1.1,
            paddingTop: "50px",
            marginBottom: "40px",
        },
        bodys: {
            maxWidth: "300px",
            color: theme.palette.secondary.contrastText,
        },
        contentCard: {
            justifyContent: "center",
        },
        subhead: {
            fontSize: "14",
            textAlign: "left",
        },
        subtitle: {
            color: theme.palette.secondary.contrastText,
            textAlign: "left",
        },
        upload: {
            "& > *": {
                margin: theme.spacing(1),
            },
            height: "250px",
            background: theme.palette.secondary.dark,
            borderRadius: 20,
            marginTop: "20px",
            color: theme.palette.secondary.contrastText,
            marginBottom: theme.spacing(5),
        },
        temp: {
            marginTop: "85px",
        },
        inputColor: {
            color: theme.palette.secondary.contrastText,
        },
        none: {
            display: "none",
        },
        chipBlue: {
            // backgroundColor: "rgba(55, 114, 255, 0.1)",
            fontSize: 16,
            padding: 5,
            borderRadius: 25,
            color: "rgb(55, 114, 255)",
        },
        form: {
            "& .MuiTextField-root": {
                "& fieldset": {
                    borderColor: "#353945",
                    color: theme.palette.secondary.contrastText,
                },
            },
            "& MuiInputBase-root": {
                color: "white",
            },
            "& MuiInputBase-input": {
                color: "white",
            },
            "& label.Mui-focused": {
                color: theme.palette.secondary.contrastText,
            },
            "& label.Mui-normal": {
                color: theme.palette.secondary.contrastText,
            },
            "& .MuiInput-underline:after": {
                borderBottomColor: theme.palette.secondary.contrastText,
                color: theme.palette.secondary.contrastText,
            },
            "& .MuiOutlinedInput-input": {
                borderColor: "#353945",
                color: "white",
            },
            "& .MuiOutlinedInput-label": {
                borderColor: "#353945",
                color: "white",
            },
            "& .MuiOutlinedInput-root": {
                color: theme.palette.secondary.contrastText,
                "& fieldset": {
                    borderColor: "#353945",
                    color: theme.palette.secondary.contrastText,
                },
                "&:hover fieldset": {
                    borderColor: theme.palette.secondary.contrastText,
                    color: theme.palette.secondary.contrastText,
                },
                "&.Mui-focused fieldset": {
                    borderColor: theme.palette.secondary.contrastText,
                    color: theme.palette.secondary.contrastText,
                },
            },
        },
        imageItem: {
            "& .MuiImageListItem-root": {
                height: "unset",
            },
        },
        background: {
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
        },
    }));

    const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

    const address = useAddress();

    const classes = useStyles();
    const { connect, disconnect, connected, web3Modal, web3, chainID, checkWrongNetwork, provider } = useWeb3Context();
    const [isConnected, setConnected] = useState(connected);
    const dispatch = useDispatch();

    var [description, setDescription] = useState();
    var [imageHash, setImageHash] = useState();
    var [longitude, setLongitude] = useState();
    var [latitude, setLatitude] = useState();
    var [gender, setGender] = useState();
    var [stakeTime, setTime] = useState();
    var [stakeAmount, setAmount] = useState();
    var [json, setJson] = useState();
    var [images, setImages] = useState([]);
    var [location, setLocation] = useState("");

    function onFormChange() {
        const data = {
            description,
            imageHash,
            longitude,
            latitude,
            gender,
            stakeTime,
            stakeAmount,
        };
        setJson(data);
    }
    const addresses = getAddresses(chainID);
    const decentiktok = new ethers.Contract(addresses.ADDRESS, Decentiktok, provider.getSigner());

    const isAppLoaded = useSelector(state => !Boolean(state.app.marketPrice));

    const loadApp = useCallback(
        loadProvider => {
            dispatch(loadAppDetails({ networkID: chainID, provider: loadProvider }));
        },
        [connected],
    );

    const loadAccountDetails = createAsyncThunk("account/loadAccountDetails", async ({ networkID, provider, address }) => {
        let images = [];
    });
    const LoadImages = useCallback(
        loadProvider => {
            dispatch(loadAccountDetails({ networkID: chainID, address, provider: loadProvider }));
        },
        [connected],
    );

    function connectWallet() {
        return (
            <div className="referral-view">
                <div className="referral-card">
                    <div className="referral-card-area">
                        <div className="referral-card-wallet-notification">
                            <div className="referral-card-wallet-connect-btn" onClick={connect}>
                                <p>Connect Wallet</p>
                            </div>
                            <p className="referral-card-wallet-desc-text">Connect your wallet!</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <ViewBase>
            <Switch>
                <Route exact path="/">
                    <Redirect to="/ido" />
                </Route>

                <Route path="/ido">{address ? <IDO provider={provider} address={address} dispatch={dispatch} /> : connectWallet()}</Route>
                <Route component={NotFound} />
            </Switch>
        </ViewBase>
    );
}

export default App;
