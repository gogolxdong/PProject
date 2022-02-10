import React, { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, InputAdornment, OutlinedInput, Zoom } from "@material-ui/core";
import RebaseTimer from "../../components/RebaseTimer";
import { trim } from "../../helpers";
import "./upload.scss";
import { useWeb3Context } from "../../hooks";
import { IPendingTxn, isPendingTxn, txnButtonText } from "../../store/slices/pending-txns-slice";
import { Skeleton } from "@material-ui/lab";
import { IReduxState } from "../../store/slices/state.interface";
import { messages } from "../../constants/messages";
import classnames from "classnames";
import { warning } from "../../store/slices/messages-slice";

class Upload extends React.Component {
    componentDidMount() {
        this.getLongLat();
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
    readonly = event => {
        if (event.target.value) {
            event.target.setAttribute("readonly", "");
        }
    };

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
    render() {
        return (
            <div className="stake-view">
                <div className="container-fluid mt-5">
                    <div className="row">
                        <main role="main" className="col-lg-12 ml-auto mr-auto">
                            <div className="content mr-auto ml-auto" style={{ color: "white" }}>
                                <p>&nbsp;</p>
                                <h2>Share Image</h2>
                                <form
                                    onSubmit={event => {
                                        event.preventDefault();
                                        const description = this.imageDescription.value;
                                        const longtitude = this.longtitude.value;
                                        const latitude = this.latitude.value;
                                        const gender = this.gender.value;
                                        const stakeAmount = this.stakeAmount.value;
                                        const days = Number(this.stakeTime.value.split(" ")[0]);
                                        const stakeTime = Math.round(Date.now() / 1000) + days * 86400;
                                        this.props.uploadImage(description, longtitude, latitude, gender, stakeAmount, stakeTime);
                                    }}
                                >
                                    <input type="file" accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={this.props.captureFile} />
                                    <div className="form-group mr-sm-2">
                                        <br></br>
                                        <input
                                            id="imageDescription"
                                            type="text"
                                            ref={input => {
                                                this.imageDescription = input;
                                            }}
                                            className="form-control"
                                            placeholder="Image description..."
                                            required
                                        />
                                        <br />
                                        <input
                                            id="longtitude"
                                            type="text"
                                            ref={input => {
                                                this.longtitude = input;
                                            }}
                                            className="form-control"
                                            placeholder="longtitude"
                                            required
                                            readonly
                                            onFocus={this.readonly}
                                            autocomplete="off"
                                        />
                                        <br />
                                        <input
                                            id="latitude"
                                            type="text"
                                            ref={input => {
                                                this.latitude = input;
                                            }}
                                            className="form-control"
                                            placeholder="latitude"
                                            required
                                            onFocus={this.readonly}
                                            autocomplete="off"
                                        />
                                        <br />
                                        <input
                                            id="gender"
                                            type="text"
                                            ref={input => {
                                                this.gender = input;
                                            }}
                                            className="form-control"
                                            placeholder="gender"
                                            list="genderlist"
                                            required
                                            onChange={this.readonly}
                                            autocomplete="off"
                                        />
                                        <datalist id="genderlist">
                                            <option>Male</option>
                                            <option>Female</option>
                                        </datalist>
                                        <br />
                                        <input
                                            id="stakeAmount"
                                            type="text"
                                            ref={input => {
                                                this.stakeAmount = input;
                                            }}
                                            className="form-control"
                                            placeholder="stake amount"
                                            onChange={this.readonly}
                                            required
                                            autocomplete="off"
                                        />
                                        <br />
                                        <input
                                            id="stakeTime"
                                            type="text"
                                            ref={input => {
                                                this.stakeTime = input;
                                            }}
                                            className="form-control"
                                            placeholder="stake time"
                                            required
                                            onChange={this.readonly}
                                            autocomplete="off"
                                            list="stakeTimeList"
                                        />
                                        <datalist id="stakeTimeList">
                                            <option>30 days</option>
                                            <option>60 days</option>
                                            <option>180 days</option>
                                        </datalist>
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-block btn-lg">
                                        Upload
                                    </button>
                                </form>

                                <p>&nbsp;</p>
                                <img id="preview" width="50%" style={{ color: "white" }}></img>
                                <img id="added" width="50%" style={{ color: "white" }}></img>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        );
    }
}

export default Upload;
