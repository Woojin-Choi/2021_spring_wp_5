import './App.css'
import React, {useState, useEffect} from 'react'
import {getVLocation, getCovidStatus} from './Api'
import StatTable from "./StatTable";
import VaccineInfo from "./VaccineInfo/VaccineInfo";
import LoginPanel from "./LoginPanel/LoginPanel";
import CheerChat from "./CheerChat/CheerChat"

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCUNkOnuyl5QUxllRKWVcF9lVRVOyAf8vw",
    authDomain: "venweb-pro-3.firebaseapp.com",
    projectId: "venweb-pro-3",
    storageBucket: "venweb-pro-3.appspot.com",
    messagingSenderId: "1006017505978",
    appId: "1:1006017505978:web:87c64a6aaa438f6d237083"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}else {
    firebase.app();
}

firebase.auth().onAuthStateChanged(function(user){
    if(user){
        console.log(user);
    } else{

    }
});

function App() {
    const [vLocations, setVLocations] = useState([]);
    const [user, setUser] = useState(null);
    const [favoritePanel, setFavoritePanel] = useState(false);
    const [favLoc, setFavLoc] = useState([]);
    const [covidStatus, setCovidStatus] = useState([]);
    const [messages, setMessages] = useState([]);
    const [myChat, setMyChat] = useState(null);
    const db = firebase.firestore();

    if(localStorage.LOGIN_KEY) {
        if(!user) setUser(localStorage.LOGIN_KEY)
    }

    useEffect(()=>{
        getVLocation()
            .then(_info => {
                setVLocations(_info)
            })
    },[favoritePanel])

    useEffect(()=>{
        getCovidStatus()
            .then(_info => {
                setCovidStatus(_info)
            })
    },[])

    return(
        <div className={"whole"}>
            <header id={"title"}>
                <h1>코로나 정보</h1>
            </header>

            <div>
                <div className={"topLevel"}>
                    <div className={"leftSide"}>
                        <div id={"covidConfirmed"}>
                                <StatTable/>
                        </div>
                        <div id={"vaccineInfo"}>
                            <VaccineInfo user={user} favoritePanel={favoritePanel} favLoc={favLoc} setFavLoc={setFavLoc}/>
                        </div>

                    </div>

                    <div className={"rightSide"}>
                        <LoginPanel db={db} favoritePanel={favoritePanel} setFavoritePanel={setFavoritePanel} user={user} setUser={setUser} favLoc={favLoc} setFavLoc={setFavLoc}/>
                        <CheerChat db={db} user={user} myChat={myChat} setMyChat={setMyChat} messages={messages} setMessages={setMessages}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App;


