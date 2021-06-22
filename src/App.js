import React, {useState, useEffect} from 'react'
import Map from './Map'
import './App.css'
import {Button, ButtonGroup, Box} from "@material-ui/core";
import AddCircleOutlineRoundedIcon from '@material-ui/icons/AddCircleOutlineRounded';

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import {getVLocation, getCovidStat} from './Api'

const firebaseConfig = {
    apiKey: "AIzaSyDDP4UaX_T76Q1l4tGOmVebgbSTJhScj6E",
    authDomain: "venweb-final-project.firebaseapp.com",
    projectId: "venweb-final-project",
    storageBucket: "venweb-final-project.appspot.com",
    messagingSenderId: "484267133169",
    appId: "1:484267133169:web:0315353ef85ef78efb8150"
};

console.log(getCovidStat())


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
    const [favoritePanel, setFavoritePanel] = useState(false);
    const [favLoc, setFavLoc] = useState([]);
    const [messages, setMessages] = useState([]);
    const [myChat, setMyChat] = useState(null);



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

    const favoriteAdd = (elem) => {
        if(user) {
            elem.userId=user;
            dbAdd("favoriteOrg",elem)}
        else {
            alert("로그인 이후 사용가능합니다")
        }
    }

    const addMessages = () => {
        if(user) {
            dbAdd("allMessages",myChat);
            alert(myChat)
        }
        else {
            alert("로그인 이후 사용가능합니다")
        }
    }

    const getFavorite = async () => {


        // setFavLoc(db.collection.get("favoriteOrg"))

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

    const messagesLog = []

    useEffect(() => {
            db.collection("allMessages").get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        messagesLog.push(doc.data().chat)
                    })

                    setMessages(messagesLog)
                })
    }, []);



    useEffect(()=>{
        getVLocation()
            .then(_info => {
                setVLocations(_info)
            })
    },[])

    const handleChange = ({ target: { value } }) => setMyChat({id : user, chat : value});



    const dbAdd = (category, data) => { // db에 추가하는 함수
       db.collection(category).add(data);
    }
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
                <Box className={"topLevel"}>
                    <div className={"leftSide"}>
                        <div id={"covidConfirmed"}>
                            확진자 정보 미구현
                        </div>
                        <div className={"vaccineInfo"}>
                            <div id={"map"}>
                                <Map selectedLoc={selectedLoc} locInfo={locInfo}/>
                            </div>
                            <div id={"vaccinationLocation"}>

                                <div className="location">
                                    {
                                        favoritePanel?
                                            <div>
                                                <h2>즐겨찾는 병원</h2>
                                                {
                                                    favLoc.slice(0).sort(function(a,b) {
                                                        return a.orgnm < b.orgnm ? -1 : a.orgnm > b.orgnm ? 1: 0;
                                                    }).map(elem => {
                                                        return (
                                                            <div className="locationBox" key={elem.orgcd}>
                                                                <ul>
                                                                    <li>기관명: {elem.orgnm}</li>
                                                                    <li>전화번호: {elem.orgTlno}</li>
                                                                    <li>주소: {elem.orgZipaddr}</li>
                                                                    <li>당일 휴무여부: {elem.hldyYn}</li>
                                                                </ul>
                                                                    <Button id="locationButton" variant="outlined" color="primary" onClick={()=>locationCheck(elem)}>위치 확인</Button>
                                                            </div>);
                                                    })
                                                }
                                            </div>
                                            :
                                            <div>
                                                <h2>백신 접종처 (가나다 순)</h2>
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
                                                                </ul>
                                                                <ButtonGroup color="primary" aria-label="outlined primary button group">
                                                                    <Button id="locationButton" onClick={()=>locationCheck(elem)}>위치 확인</Button>
                                                                    <Button id="favoriteButton" size="small" startIcon={<AddCircleOutlineRoundedIcon/>} onClick={()=>favoriteAdd(elem)}>즐겨찾기 추기</Button>
                                                                </ButtonGroup>
                                                            </div>);
                                                    })
                                                }
                                            </div>
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
                        <div id="chats">
                            <div>
                                <h2>응원 메시지</h2>
                            </div>
                            <form id="chatForm" onSubmit={addMessages}>
                                <input name="chat-message" type="text" onChange={handleChange} />
                                {console.log(myChat)}
                                <input type="submit" value = "입력" />
                            </form>
                            { messages.map(elem => {
                                return(<div> {elem} </div>)
                            })}
                        </div>
                    </div>

                </Box>
            </body>
        </div>
    )
}

export default App;


