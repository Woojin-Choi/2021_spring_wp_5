import React, {useState, useEffect} from 'react'
import Map from './Map'
import './App.css'
import {Button, ButtonGroup} from "@material-ui/core";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import {getVLocation} from './Api'
// import {showLocation} from "./showLocation";

const firebaseConfig = {
    apiKey: "AIzaSyDDP4UaX_T76Q1l4tGOmVebgbSTJhScj6E",
    authDomain: "venweb-final-project.firebaseapp.com",
    projectId: "venweb-final-project",
    storageBucket: "venweb-final-project.appspot.com",
    messagingSenderId: "484267133169",
    appId: "1:484267133169:web:0315353ef85ef78efb8150"
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

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [vLocations, setVLocations] = useState([]);
    const [selectedLoc, setSelectedLoc] = useState(null);
    const [locInfo, setLocInfo] = useState({});
    const [user, setUser] = useState(null);

    const db = firebase.firestore();

    if(!vLocations) {

        console.log("되나")
        getVLocation()
        .then(_info => {
            console.log(_info, "얘는");
            setVLocations(_info)
        })

        console.log(vLocations);
        console.log("출력");
    }

    const createAccount =(e)=> {
        e.preventDefault();

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
                setUser(result.user.email);
            })
            .catch((error)=>{
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage);
            })
    }

    const logoutFirebase = () => {
        firebase.auth().signOut()
            .then((result)=>{
                setUser(null);
                console.log(result);
            })
    }


    const locationCheck = (e) => {
        setSelectedLoc(e.orgZipaddr);
        const _locInfo = {
            "전화번호": `${e.orgTlno}`,
            "진료시간": `${e.sttTm} ~ ${e.endTm}`,
            "점심시간": `${e.lunchSttTm} ~ ${e.lunchEndTm}`
        }
        console.log(_locInfo)
        setLocInfo(_locInfo)
    }

    useEffect(()=>{
        getVLocation()
            .then(_info => {
                setVLocations(_info)
            })
    },[])
    // const DBFUNC1 = () => { // db에 추가하는 함수
    //    db.collection("datas").add({
    //         first: "1",
    //         last: "2",
    //         born: 1995
    //     })
    // }
    //
    // //https://firebase.google.com/docs/firestore/manage-data/delete-data?hl=ko 삭제는 여기 참고
    //
    // useEffect(()=>{ // db 내용 출력
    //     db.collection("datas").get().then((querySanpshot)=>{
    //         querySanpshot.forEach((doc) => {
    //             console.log(doc.data())
    //         })
    //     })
    // }, [])
    //

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
        <div className={"whole"}>
            <header id={"title"}>
                <h1>코로나 정보</h1>
            </header>

            <body>
                <div className={"topLevel"}>
                    <div className={"leftSide"}>
                        <div id={"covidConfirmed"}>
                            확진자 정보 미구현
                        </div>
                        <div className={"vaccineInfo"}>
                            <div id={"map"}>
                                <Map selectedLoc={selectedLoc} locInfo={locInfo}/>
                            </div>
                            <div id={"vaccinationLocation"}>
                                <h2>백신 접종처(가나다 순)</h2>
                                <div className="location">
                                    {
                                        vLocations.slice(0).sort(function(a,b) {
                                            return a.orgnm < b.orgnm ? -1 : a.orgnm > b.orgnm ? 1: 0;
                                        }).map(elem => {
                                            return (
                                                <div className="locationBox" key={elem.orgcd}>
                                                    <ul>
                                                        <li>기관명: {elem.orgnm}</li>
                                                        <li>전화번호: {elem.orgTlno}</li>
                                                        <li>주소: {elem.orgZipaddr}</li>
                                                        <li>당일 휴무여부: {elem.hldyYn}</li>
                                                        <Button id="locationButton" variant="outlined" color="primary" onClick={()=>locationCheck(elem)}>위치 확인</Button>
                                                    </ul>
                                                </div>);
                                        })
                                    }
                                </div>
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
                            {user ?
                                <Button id="loginButton" onClick={logoutFirebase} variant="contained"
                                        color="primary">로그아웃</Button>
                                :
                                <Button id="loginButton" onClick={loginFirebase} variant="contained"
                                color="primary">로그인</Button>
                            }
                        </div>
                        <div id={"news"}>
                            뉴스 미구현
                        </div>
                    </div>

                </div>
            </body>
        </div>
    )
}

export default App;


