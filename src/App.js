import React, {useState, useEffect} from "react";
import {Route, Switch, withRouter} from "react-router-dom";
import {LoginAction} from "./actions";
import {SignUp} from "./actions/forms";
import {HomePage, RouteNotFound, Header, ActionsSwitcher} from "./components";
import offline from "./assets/images/offline.svg";
import Footer from "./components/Footer"
import {useTranslation} from "react-i18next";
import './assets/css/styles.css'
import './assets/css/mediaqueries.css'

const App = () => {
    const {t} = useTranslation();
    const routes = [{
        path: '/',
        component: HomePage,
    }, {
        path: '/LoginAction',
        component: LoginAction,
    },  {
        path: '/SignUp',
        component: SignUp,
    },{
        path: '/ActionsSwitcher',
        component: ActionsSwitcher,
    }];

    const [isOnline, setNetwork] = useState(window.navigator.onLine);
    const updateNetwork = () => {
        setNetwork(window.navigator.onLine);
    };
    useEffect(() => {
        window.addEventListener("offline", updateNetwork);
        window.addEventListener("online", updateNetwork);
        return () => {
            window.removeEventListener("offline", updateNetwork);
            window.removeEventListener("online", updateNetwork);
        };
    });

    return (

        <div className="app">
            <div>
                {
                    !isOnline ?
                        <div className="network-check">
                            <div className="center">
                                <img src={offline} alt="offline"/>
                                <p>{t("NETWORK_ERROR")}</p>
                            </div>
                        </div>
                        : ""
                }
                <div className="container app-nav">
                    <div className="">
                        <Header/>
                    </div>
                </div>

                <Switch>
                    {
                        routes.map((route) =>
                            <Route
                                key={route.path}
                                exact
                                component={route.component}
                                path={route.path}/>,
                        )
                    }

                    <Route component={RouteNotFound}/>
                </Switch>
            </div>
            <Footer/>

        </div>
    );
}

export default withRouter(App);
