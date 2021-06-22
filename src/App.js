import React, {useState, useEffect} from 'react'
import Map from './Map'
import './App.css'
import {Button, ButtonGroup, Box} from "@material-ui/core";
import AddCircleOutlineRoundedIcon from '@material-ui/icons/AddCircleOutlineRounded';

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import {getVLocation, getCovidStatus} from './Api'
import StatTable from "./StatTable";
import VaccineInfo from "./VaccineInfo";

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

    const [vLocations, setVLocations] = useState([]);
    const [user, setUser] = useState(null);
    const [favoritePanel, setFavoritePanel] = useState(false);
    const [favLoc, setFavLoc] = useState([]);
    const [covidStatus, setCovidStatus] = useState([]);

    const db = firebase.firestore();

    if(localStorage.LOGIN_KEY) {
        if(!user) setUser(localStorage.LOGIN_KEY)
    }

    // if(!vLocations) {
    //
    //     console.log("되나")
    //     getVLocation()
    //     .then(_info => {
    //         console.log(_info, "얘는");
    //         setVLocations(_info)
    //     })
    //
    //     console.log(vLocations);
    //     console.log("출력");
    // }

    // const createAccount =(e)=> {
    //     e.preventDefault();
    //
    //     firebase.auth().createUserWithEmailAndPassword(email, password)
    //         .then((res)=>{
    //             console.log(res);
    //         })
    //         .catch(function(error){
    //             console.log(error);
    //         })
    // }

    const loginFirebase = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
            .then((result)=>{
                localStorage.setItem("LOGIN_KEY", result.user.email);
                setUser(localStorage.LOGIN_KEY)
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
                localStorage.clear();
                setFavoritePanel(false);
                setUser(null);

                console.log(result);
            })
            .catch((error)=>{
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage);
            })
    }

    // const locationCheck = (e) => {
    //     setSelectedLoc(e.orgZipaddr);
    //     const _locInfo = {
    //         "전화번호": `${e.orgTlno}`,
    //         "진료시간": `${e.sttTm} ~ ${e.endTm}`,
    //         "점심시간": `${e.lunchSttTm} ~ ${e.lunchEndTm}`
    //     }
    //     console.log(_locInfo)
    //     setLocInfo(_locInfo)
    // }
    //
    // const favoriteAdd = (elem) => {
    //     if(user) {
    //         elem.userId = user;
    //         const myFav = [];
    //         let redundancy = false;
    //         db.collection("favoriteOrg").get()
    //             .then((querySnapshot) => {
    //                 querySnapshot.forEach((doc) => {
    //                     if (doc.data().userId === user) {
    //                         myFav.push(doc.data())
    //                     }
    //                 })
    //                 myFav.map((e) => {
    //                     if (e.orgcd === elem.orgcd) redundancy = true;
    //                 })
    //
    //                 if(!redundancy) dbAdd("favoriteOrg",elem);
    //                 else {alert("즐겨찾기에 이미 추가된 병원입니다")}
    //             })
    //     }
    //
    //     else {
    //         alert("로그인 이후 사용가능합니다")
    //     }
    // }

    const favoriteCheck = async (e) =>{
        if(e==="u") setFavoritePanel(false);
        else {
            setFavoritePanel(true);
            const myFav = [];
            db.collection("favoriteOrg").get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if(doc.data().userId === user) {
                        myFav.push(doc.data())
                    }
                })

                setFavLoc(myFav)
                console.log(myFav)
            })

        }
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


    // const dbAdd = (category, data) => { // db에 추가하는 함수
    //    db.collection(category).add(data);
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
        <html className={"whole"}>
            <header id={"title"}>
                <h1>코로나 정보</h1>
            </header>

            <body>
                <Box className={"topLevel"}>
                    <div className={"leftSide"}>
                        <div id={"covidConfirmed"}>
                            <div>
                                <StatTable/>
                            </div>
                        </div>

                    </div>

                    <div className={"middle"}>
                        <VaccineInfo user={user} favoritePanel={favoritePanel} favLoc={favLoc}/>
                    </div>

                    <div className={"rightSide"}>
                        <div id={"login"}>
                            {/*<form onSubmit={createAccount}>*/}
                            {/*    <input name={"email"} onChange={e=>setEmail(e.target.value)}/>*/}
                            {/*    <input name={"password"} onChange={e=>setPassword(e.target.value)}/>*/}
                            {/*    <input type={"submit"} value={"submit"}/>*/}
                            {/*</form>*/}
                            {localStorage.getItem("LOGIN_KEY") ?
                                <div id={"loggedIn"}>
                                    <span>{localStorage.getItem("LOGIN_KEY")}님 반갑습니다!</span>
                                    <Button id="loginButton" onClick={logoutFirebase} variant="contained"
                                            color="primary">로그아웃</Button>
                                    <Button id="myFavorite" onClick={()=>favoritePanel?favoriteCheck("u"):favoriteCheck("c")} variant="contained"
                                                    color="primary">{favoritePanel?'전체 목록 보기':'즐겨찾는 병원보기'}</Button>
                                </div>
                                :
                                <Button id="loginButton" onClick={loginFirebase} variant="contained"
                                        color="primary">구글아이디로 로그인</Button>
                            }
                        </div>
                        <div id={"news"}>
                            응원의 한마디
                        </div>
                    </div>

                </Box>
            </body>
        </html>
    )
}

export default App;


