import React, { useEffect, useState } from "react";
import App from "./App";
import Landing from "./Landing";
import { HashRouter } from "react-router-dom";
import Loading from "../components/Loader";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { Web3ContextProvider } from "../hooks";

import store from "../store";

function Root() {
    const isApp = () => {
        return true;
    };

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, []);

    if (loading) return <Loading />;

    const app = () => (
        <HashRouter>
            <App />
        </HashRouter>
    );

    return isApp() ? app() : <Landing />;
}

export default Root;
