import Map from "./Map";
import {Button, ButtonGroup} from "@material-ui/core";
import AddCircleOutlineRoundedIcon from "@material-ui/icons/AddCircleOutlineRounded";
import React, {useEffect, useState} from "react";
import {getVLocation} from "./Api";
import firebase from "firebase";


export default function VaccineInfo(props) {

    const [vLocations, setVLocations] = useState([]);
    const [selectedLoc, setSelectedLoc] = useState(null);
    const [locInfo, setLocInfo] = useState({});
    // const [favoritePanel, setFavoritePanel] = useState(false);
    // const [favLoc, setFavLoc] = useState([]);

    const db = firebase.firestore();

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
        if(props.user) {
            elem.userId = props.user;
            const myFav = [];
            let redundancy = false;
            db.collection("favoriteOrg").get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        if (doc.data().userId === props.user) {
                            myFav.push(doc.data())
                        }
                    })
                    myFav.map((e) => {
                        if (e.orgcd === elem.orgcd) redundancy = true;
                    })

                    if(!redundancy) dbAdd("favoriteOrg",elem);
                    else {alert("즐겨찾기에 이미 추가된 병원입니다")}
                })
        }

        else {
            alert("로그인 이후 사용가능합니다")
        }
    }

    // const favoriteCheck = async (e) =>{
    //     if(e==="u") setFavoritePanel(false);
    //     else {
    //         setFavoritePanel(true);
    //         const myFav = [];
    //         db.collection("favoriteOrg").get()
    //             .then((querySnapshot) => {
    //                 querySnapshot.forEach((doc) => {
    //                     if(doc.data().userId === props.user) {
    //                         myFav.push(doc.data())
    //                     }
    //                 })
    //
    //                 setFavLoc(myFav)
    //                 console.log(myFav)
    //             })
    //
    //     }
    // }

    const dbAdd = (category, data) => { // db에 추가하는 함수
       db.collection(category).add(data);
    }

    useEffect(()=>{
        getVLocation()
            .then(_info => {
                setVLocations(_info)
            })
    },[props.favoritePanel])

    return(
        <div className={"vaccineInfo"}>
            <div id={"map"}>
                <Map selectedLoc={selectedLoc} locInfo={locInfo}/>
            </div>
            <div id={"vaccinationLocation"}>
                <div className="location">
                    {
                        props.favoritePanel ?
                            <div>
                                <h2>즐겨찾는 병원 (가나다 순)</h2>
                                {
                                    props.favLoc.slice(0).sort(function (a, b) {
                                        return a.orgnm < b.orgnm ? -1 : a.orgnm > b.orgnm ? 1 : 0;
                                    }).map(elem => {
                                        return (
                                            <div className="favLocationBox" key={elem.orgcd}>
                                                <ul>
                                                    <li>기관명: {elem.orgnm}</li>
                                                    <li>전화번호: {elem.orgTlno}</li>
                                                    <li>주소: {elem.orgZipaddr}</li>
                                                    <li>당일 휴무여부: {elem.hldyYn}</li>
                                                </ul>
                                                <Button id="locationButton" variant="outlined" color="primary"
                                                        onClick={() => locationCheck(elem)}>위치 확인</Button>
                                            </div>);
                                    })
                                }
                            </div>
                            :
                            <div>
                                <h2>백신 접종처 (가나다 순)</h2>
                                {
                                    vLocations.slice(0).sort(function (a, b) {
                                        return a.orgnm < b.orgnm ? -1 : a.orgnm > b.orgnm ? 1 : 0;
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
                                                    <Button id="locationButton" onClick={() => locationCheck(elem)}>위치
                                                        확인</Button>
                                                    <Button id="favoriteButton" size="small"
                                                            startIcon={<AddCircleOutlineRoundedIcon/>}
                                                            onClick={() => favoriteAdd(elem)}>즐겨찾기 추기</Button>
                                                </ButtonGroup>
                                            </div>);
                                    })
                                }
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}