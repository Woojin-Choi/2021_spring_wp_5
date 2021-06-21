import React, {useState, useEffect} from 'react'
import Map from './Map'
import './App.css'
import {Button, ButtonGroup} from "@material-ui/core";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDDP4UaX_T76Q1l4tGOmVebgbSTJhScj6E",
    authDomain: "venweb-final-project.firebaseapp.com",
    projectId: "venweb-final-project",
    storageBucket: "venweb-final-project.appspot.com",
    messagingSenderId: "484267133169",
    appId: "1:484267133169:web:0315353ef85ef78efb8150"
};

firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(function(user){
    if(user){
        console.log(user);
    } else{

    }
});

function App() {

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    const createAccount =(e)=> {
        e.preventDefault();
        firebase.auth().signInWithPopup(firebase.auth())

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((res)=>{
                console.log(res);
            })
            .catch(function(error){
                console.log(error);
            })
    }

    const loginFirebase = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
            .then((result)=>{
                console.log(result);
            });

    }
    // useEffect(()=> {
    //
    //     const provider = new firebase.auth.GoogleAuthProvider();
    //     firebase.auth().signInWithPopup(provider)
    //         .then((result)=>{
    //         console.log(result);
    //         });

        // firebase.auth().signInWithEmailAndPassword("aa@a.com", "aa")
        //     .then((res) => {
        //         console.log("signed in!");
        //         console.log(res);
        //         firebase.user;
        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     });

    // },[]);





    return(
        <div> <h1 id={"title"}>코로나 정보</h1>

            <div className={"topLevel"}>


                <div className={"leftSide"}>
                    <div id={"covidConfirmed"}>
                        확진자 정보 미구현
                    </div>
                    <div className={"vaccineInfo"}>
                        <div id={"map"}>
                            지도
                            <Map/>
                        </div>
                        <div id={"vaccinationLocation"}>
                            백신 접종처 정보 미구현
                        </div>
                    </div>
                </div>

                <div className={"rightSide"}>
                    <div id={"login"}>
                        {/*<form onSubmit={createAccount}>*/}
                        {/*    <input name={"email"} onChange={e=>setEmail(e.target.value)}/>*/}
                        {/*    <input name={"password"} onChange={e=>setPassword(e.target.value)}/>*/}
                        {/*    <input type={"submit"} value={"submit"}/>*/}
                        {/*</form>*/}
                        <button onClick={loginFirebase}>로그인</button>
                    </div>
                    <div id={"news"}>
                        뉴스 미구현
                    </div>
                </div>

            </div>
        </div>
    )
}

export default App;


