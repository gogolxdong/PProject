import { Component, useEffect, useState, useCallback, useMemo, useRef } from "react";
import { NotFound } from "../views";
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
import Loading from "../components/Loader";
import ImageLoader from "../components/ImageLoader";
// import ipfs from "../components/ImageLoader";
import ImageListItem from "@material-ui/core/ImageListItem";
import ImageListItemBar from "@material-ui/core/ImageListItemBar";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { wrap } from "module";
import IconButton from "@material-ui/core/IconButton";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import CircularProgress from "@material-ui/core/CircularProgress";
import { unset } from "lodash";
import FavoriteIcon from "@material-ui/icons/Favorite";

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
    var [imageCount, setImageCount] = useState(0);

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

    // const decentiktok = new web3.eth.Contract(Decentiktok, addresses.ADDRESS);
    const isAppLoaded = useSelector(state => !Boolean(state.app.marketPrice));

    const loadApp = useCallback(
        loadProvider => {
            dispatch(loadAppDetails({ networkID: chainID, provider: loadProvider }));
        },
        [connected],
    );

    const loadAccountDetails = createAsyncThunk("account/loadAccountDetails", async ({ networkID, provider, address }) => {
        let images = [];
        const imageCount = await decentiktok.imageCount();
        images = await Promise.all(
            range(1, imageCount, 1).map(async i => {
                var image = await decentiktok.getImage(i);
                var cloned = { ...image, src: "" };
                // var res = ipfs.cat(image.hash);
                // var buffer = await toBuffer(res);
                // var blob = new Blob([buffer]);
                // cloned.src = URL.createObjectURL(blob);
                return cloned;
                // console.log("cloned:", cloned);
                // images.push(cloned);
            }),
        );
        if (images.length) {
            // console.log("setImages");
            setImages(images);
        }
    });
    const LoadImages = useCallback(
        loadProvider => {
            dispatch(loadAccountDetails({ networkID: chainID, address, provider: loadProvider }));
        },
        [connected],
    );
    useMemo(() => {
        getLongLat();
        if (connected && address) {
            LoadImages(provider);
        }
    }, [connected, address]);

    function getLongLat() {
        if (!navigator.geolocation) {
            alert("<p>doesn't support geo location</p>");
            return;
        }
        function success(position) {
            setLongitude(String(position.coords.longitude));
            setLatitude(String(position.coords.latitude));
        }
        var options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        };
        function error(err) {
            switch (err.code) {
                case 1:
                    alert("PERMISSION_DENIED");
                    break;
                case 2:
                    alert("POSITION_UNAVAILABLE");
                    break;
                case 3:
                    alert("TIMEOUT");
                    break;
                default:
                    alert("UNKNOWN_ERROR");
                    break;
            }
        }
        navigator.geolocation.getCurrentPosition(success, error, options);
    }

    async function readAdd(event) {
        event.preventDefault();
        const file = event.target.files?.item(0);
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = async () => {
            var arrayBuffer = reader.result;
            var result = await ipfs.add(arrayBuffer);
            setImageHash(result.path);
        };
        const preview = document.getElementById("preview");
        preview.onload = function (e) {
            URL.revokeObjectURL(preview.src);
        };
        preview.src = URL.createObjectURL(file);
        preview.alt = "preview";
    }

    function connectWallet() {
        // return <Loading />;
        return (
            <div className="referral-card-area">
                <div className="referral-card-wallet-notification">
                    <div className="referral-card-wallet-connect-btn" onClick={connect}>
                        <p>Connect Wallet</p>
                    </div>
                    <p className="referral-card-wallet-desc-text">Connect your wallet!</p>
                </div>
            </div>
        );
    }
    function upload() {
        return (
            <div className={classes.root}>
                <div className={classes.dataWidth}>
                    <form className={classes.form} noValidate autoComplete="off">
                        <TextField
                            type="file"
                            accept=".jpg, .jpeg, .png, .bmp, .gif"
                            id="outlined-basic"
                            color="white"
                            size="medium"
                            variant="outlined"
                            margin="normal"
                            InputLabelProps={{ className: classes.inputColor }}
                            onChange={readAdd}
                            fullWidth
                        />
                        <br />
                        <TextField
                            color="white"
                            size="medium"
                            label="Image Description"
                            variant="outlined"
                            margin="normal"
                            InputLabelProps={{ className: classes.inputColor }}
                            id="outlined-basic"
                            required
                            fullWidth
                            value={description}
                            onChange={e => {
                                setDescription(e.target.value);
                                onFormChange();
                            }}
                        />
                        <br />
                        <OutlinedInput
                            id="outlined-basic"
                            color="white"
                            size="medium"
                            variant="outlined"
                            margin="normal"
                            InputLabelProps={{ className: classes.inputColor }}
                            value={longitude}
                            required
                            fullWidth
                            onChange={e => setLongitude(e.target.value)}
                        />
                        <br />
                        <TextField
                            id="latitude"
                            color="white"
                            size="medium"
                            variant="outlined"
                            margin="normal"
                            InputLabelProps={{ className: classes.inputColor }}
                            value={latitude}
                            required
                            fullWidth
                        />
                        <br />
                        <TextField
                            id="gender"
                            select
                            list="genderlist"
                            color="white"
                            size="medium"
                            label="Gender"
                            variant="outlined"
                            margin="normal"
                            InputLabelProps={{ className: classes.inputColor }}
                            value={gender}
                            required
                            onChange={e => {
                                setGender(e.target.value);
                                onFormChange();
                            }}
                            fullWidth
                        >
                            <MenuItem value={"Male"}>Male</MenuItem>
                            <MenuItem value={"Female"}>Female</MenuItem>
                        </TextField>

                        <br />
                        <TextField
                            id="stakeAmount"
                            color="white"
                            size="medium"
                            label="Stake Amount"
                            variant="outlined"
                            margin="normal"
                            InputLabelProps={{ className: classes.inputColor }}
                            value={stakeAmount}
                            required
                            onChange={e => {
                                setAmount(e.target.value);
                                onFormChange();
                            }}
                            fullWidth
                        />
                        <br />
                        <TextField
                            id="stakeTime"
                            select
                            color="white"
                            size="medium"
                            label="Stake Time"
                            variant="outlined"
                            margin="normal"
                            InputLabelProps={{ className: classes.inputColor }}
                            value={stakeTime}
                            required
                            autocomplete="off"
                            list="stakeTimeList"
                            onChange={e => {
                                setTime(e.target.value);
                                onFormChange();
                            }}
                            fullWidth
                        >
                            <MenuItem value={"30 days"}>30 days</MenuItem>
                            <MenuItem value={"60 days"}>60 days</MenuItem>
                            <MenuItem value={"180 days"}>180 days</MenuItem>
                        </TextField>

                        <br />
                        <Chip
                            className={classes.chipBlue}
                            label="Upload"
                            onClick={async () => {
                                decentiktok.on("ImageCreated", result => {
                                    if (result) {
                                        console.log("transactionHash:" + result.transactionHash);
                                        console.log("blockNumber:" + result.blockNumber);
                                    }
                                });
                                var days = Number(stakeTime.split(" ")[0]) * 86400;
                                var time = Math.round(Date.now() / 1000) + days;
                                var result = await decentiktok.uploadImage(json.longitude, json.latitude, json.imageHash, json.description, json.gender, json.stakeAmount, time);
                                var tx = await result.wait();
                                const res = ipfs.cat(json.imageHash);
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
                                LoadImages(provider);
                            }}
                        />
                    </form>

                    <p>&nbsp;</p>
                    <img id="preview" width="50%" style={{ color: "white" }}></img>
                    <img id="added" width="50%" style={{ color: "white" }}></img>
                </div>
            </div>
        );
    }

    return (
        <ViewBase>
            <Switch>
                <Route exact path="/lobby">
                    <ImageList cols={isSmallScreen ? 1 : 5} rowHeight={isSmallScreen ? "100vh" : 240}>
                        {images.map(image => {
                            return (
                                <ImageListItem key={image.id} style={isSmallScreen ? { height: "100vh" } : {}}>
                                    <ImageLoader key={image.id} image={image} isSmallScreen={isSmallScreen} contract={decentiktok} address={address} />
                                    <ImageListItemBar
                                        title={
                                            window.navigator.brave ? (
                                                <a target="_blank" href={`ipfs://${image.hash}`} style={{ color: "white" }}>
                                                    {image.description}
                                                </a>
                                            ) : (
                                                <a target="_blank" href={`https://ipfs.io/ipfs/${image.hash}`} style={{ color: "white" }}>
                                                    {image.description}
                                                </a>
                                            )
                                        }
                                        actionIcon={
                                            <IconButton
                                                id={image.id}
                                                aria-label={`star ${image.id}`}
                                                onClick={event => {
                                                    if (event.target.id) {
                                                        let tipAmount = ethers.utils.parseEther("0.001");
                                                        decentiktok.tipImageOwner(event.target.id, { from: address, value: tipAmount });
                                                    }
                                                }}
                                            >
                                                <StarBorderIcon />
                                                <FavoriteIcon />
                                            </IconButton>
                                        }
                                    ></ImageListItemBar>
                                    <div></div>
                                </ImageListItem>
                            );
                        })}
                    </ImageList>
                </Route>

                <Route exact path="/">
                    <Redirect to="/upload" />
                </Route>

                <Route path="/upload">
                    <div className="referral-view">
                        <Zoom in={true}>
                            <div className="referral-card">
                                <div className="referral-card-area">{!address ? connectWallet() : upload()}</div>
                            </div>
                        </Zoom>
                    </div>
                </Route>
                <Route component={NotFound} />
            </Switch>
        </ViewBase>
    );
}

export default App;
