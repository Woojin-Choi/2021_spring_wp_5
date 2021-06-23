import {Button} from "@material-ui/core";
import React from "react";
import firebase from "firebase";
import './LoginPanel.css'

export default function LoginPanel(props) {

    const loginFirebase = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
            .then((result)=>{
                localStorage.setItem("LOGIN_KEY", result.user.email);
                props.setUser(localStorage.LOGIN_KEY)
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
                props.setFavoritePanel(false);
                props.setUser(null);
            })
            .catch((error)=>{
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage);
            })
    }

    const favoriteCheck = async (e) =>{
        if(e==="u") props.setFavoritePanel(false);
        else {
            props.setFavoritePanel(true);
            const myFav = [];
            props.db.collection("favoriteOrg").get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        if(doc.data().userId === props.user) {
                            myFav.push(doc.data())
                        }
                    })
                    props.setFavLoc(myFav)
                })
        }
    }

    return(
        <div id={"login"}>
            {localStorage.getItem("LOGIN_KEY") ?
                <div id={"loggedIn"}>
                    <span>{localStorage.getItem("LOGIN_KEY")}님 반갑습니다!</span>
                    <div id={"menu"}>
                        <Button className="rightSideBtn" id="myFavorite"
                                onClick={() => props.favoritePanel ? favoriteCheck("u") : favoriteCheck("c")} variant="contained"
                                color="primary">{props.favoritePanel ? '전체 목록 보기' : '즐겨찾는 병원보기'}</Button>
                        <Button className="rightSideBtn" id="logoutButton" onClick={logoutFirebase} variant="contained"
                                color="primary">로그아웃</Button>
                    </div>
                </div>
                :
                <Button id="loginButton" onClick={loginFirebase} variant="contained"
                        color="primary">구글아이디로 로그인</Button>
            }
        </div>
    )
}