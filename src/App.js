import './App.css'
import React, {useState, useEffect} from 'react'
import {Button, Box, TextField} from "@material-ui/core";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import {getVLocation, getCovidStatus} from './Api'
import StatTable from "./StatTable";
import VaccineInfo from "./VaccineInfo";

const firebaseConfig = {
    apiKey: "AIzaSyBg0dSBCz--2hhDtSeLQhwM-hKKi0FitF8",
    authDomain: "venweb-pro-2.firebaseapp.com",
    projectId: "venweb-pro-2",
    storageBucket: "venweb-pro-2.appspot.com",
    messagingSenderId: "949328612663",
    appId: "1:949328612663:web:bbe56b744d5a49c6ae9eb2"
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

    // const [email, setEmail] = useState(null);
    // const [password, setPassword] = useState(null);
    const [vLocations, setVLocations] = useState([]);
    const [user, setUser] = useState(null);
    const [favoritePanel, setFavoritePanel] = useState(false);
    const [favLoc, setFavLoc] = useState([]);
    const [covidStatus, setCovidStatus] = useState([]);

    const db = firebase.firestore();

    if(localStorage.LOGIN_KEY) {
        if(!user) setUser(localStorage.LOGIN_KEY)
    }

    const dbAdd = (category, data) => { // db에 추가하는 함수
        db.collection(category).add(data);
    }

    const [messages, setMessages] = useState([]);
    const [myChat, setMyChat] = useState(null);

    const messagesLog = []
    const loadChatBox = []
    const handleChange = ({ target: { value } }) => setMyChat({id : user, chat : value, date : new Date()});

    const addMessages = (e) => {
        e.preventDefault();
        if (user) {
            dbAdd("allChatLog", myChat);
            db.collection("allChatLog").get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    messagesLog.push(doc.data())
                })
                messagesLog.slice(0).sort(function(a,b) {
                    return a.date < b.date ? 1 : a.date > b.date ? -1: 0;
                }).map(elem => loadChatBox.push(elem.chat))
                setMessages(loadChatBox)
            })
        } else {
            alert("로그인 이후 사용가능합니다")
        }
    }

    const loadMessages = () => {
        db.collection("allChatLog").get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    messagesLog.push(doc.data())
                })
                messagesLog.slice(0).sort(function(a,b) {
                    return a.date < b.date ? -1 : a.date > b.date ? 1: 0;
                }).map(elem => loadChatBox.push(elem.chat))
                setMessages(loadChatBox)
            })
    }


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

    useEffect(() => {
        const intervalControl = setInterval(() => {loadMessages()}, 5000)
        return () => clearInterval(intervalControl);
    }, [messages]);

    // useEffect(()=>{ // db 내용 출력
    //     db.collection("datas").get().then((querySanpshot)=>{
    //         querySanpshot.forEach((doc) => {
    //             console.log(doc.data())
    //         })
    //     })
    // }, [])
    //
    //https://firebase.google.com/docs/firestore/manage-data/delete-data?hl=ko 삭제는 여기 참고

    // useEffect(()=> {
    //
    //     const provider = new firebase.auth.GoogleAuthProvider();
    //     firebase.auth().signInWithPopup(provider)
    //         .then((result)=>{
    //         console.log(result);
    //         });
    //
    //     firebase.auth().signInWithEmailAndPassword("aa@a.com", "aa")
    //         .then((res) => {
    //             console.log("signed in!");
    //             console.log(res);
    //             firebase.user;
    //         })
    //         .catch(function (error) {
    //             console.log(error);
    //         });
    //
    // },[]);

    return(
        <html className={"whole"}>
            <header id={"title"}>
                <h1>코로나 정보</h1>
            </header>

            <body>
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
                        <div id={"login"}>
                            {/*<form onSubmit={createAccount}>*/}
                            {/*    <input name={"email"} onChange={e=>setEmail(e.target.value)}/>*/}
                            {/*    <input name={"password"} onChange={e=>setPassword(e.target.value)}/>*/}
                            {/*    <input type={"submit"} value={"submit"}/>*/}
                            {/*</form>*/}
                            {localStorage.getItem("LOGIN_KEY") ?
                                <div id={"loggedIn"}>
                                    <span>{localStorage.getItem("LOGIN_KEY")}님 반갑습니다!</span>
                                    <div id={"menu"}>
                                        <Button className="rightSideBtn" id="myFavorite" onClick={()=>favoritePanel?favoriteCheck("u"):favoriteCheck("c")} variant="contained"
                                                        color="primary">{favoritePanel?'전체 목록 보기':'즐겨찾는 병원보기'}</Button>
                                        <Button className="rightSideBtn" id="logoutButton" onClick={logoutFirebase} variant="contained"
                                                color="primary">로그아웃</Button>
                                    </div>
                                </div>
                                :
                                <Button id="loginButton" onClick={loginFirebase} variant="contained"
                                        color="primary">구글아이디로 로그인</Button>
                            }
                        </div>
                        <div id={"cheerChat"}>
                            <div>
                                <h2>전국민 응원 한마디!</h2>
                            </div>
                            <form id="chatForm" onSubmit={addMessages}>
                                <TextField id="inputMessage" name="chat-message" type="text" variant="outlined" onChange={handleChange}/>
                                {console.log(myChat)}
                                <Button id="inputBtn" type="submit" variant={"outlined"}>입력</Button>
                            </form>
                            <div id={"chatBox"}>
                                { messages.map(elem => {
                                    return(<div> {elem} </div>)
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    )
}

export default App;


