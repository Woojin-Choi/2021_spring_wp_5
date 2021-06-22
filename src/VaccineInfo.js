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
    const db = firebase.firestore();

    const dbAdd = (category, data) => { // db에 추가하는 함수
        db.collection(category).add(data);
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
        if(props.user) {
            elem.userId = props.user;
            const myFav = [];
            let redundancy = false;
            db.collection("favoriteOrg").get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        console.log(doc,"doc이 뭐지")
                        if (doc.data().userId === props.user) {
                            console.log(doc.data(),"doc.date는 뭐지")
                            myFav.push(doc.data())
                        }
                    })
                    myFav.map((e) => {
                        if (e.orgcd === elem.orgcd) redundancy = true;
                    })

                    if(!redundancy) {
                        const doc_id=props.user+"_"+elem.orgcd;
                        db.collection("favoriteOrg").doc(doc_id).set(elem);
                        alert("즐겨찾기에 추가되었습니다")
                    }
                    else {alert("즐겨찾기에 이미 추가된 병원입니다")}
                })
        }
        else {alert("로그인 이후 사용가능합니다")}
    }

    const updateFavLoc = () => {
        const myFav = [];
        db.collection("favoriteOrg").get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if(doc.data().userId === props.user) {
                        myFav.push(doc.data())
                    }
                })

                props.setFavLoc(myFav)
            })
    }

    const favoriteDel = (elem) => {
        if(props.user) {
            elem.userId = props.user;
            db.collection("favoriteOrg").get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        if (doc.data().userId === props.user) {
                            if(doc.data().orgcd === elem.orgcd) {
                                const doc_id=props.user+"_"+elem.orgcd;
                                db.collection("favoriteOrg").doc(doc_id).delete()
                                    .then(() => {
                                        updateFavLoc();
                                        alert("즐겨찾기에서 삭제되었습니다.");
                                    }).catch((error) => {
                                        console.error("Error removing document: ", error);
                                    });
                            }
                        }
                    })
                })
        }
        else {alert("로그인 이후 사용가능합니다")}
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
                                                <ButtonGroup color="primary"
                                                             aria-label="outlined primary button group">
                                                    <Button class="locationButton" variant="outlined"
                                                            color="primary"
                                                            onClick={() => locationCheck(elem)}>위치
                                                        확인</Button>
                                                    <Button id="favoriteDelButton" size="small"
                                                            startIcon={<AddCircleOutlineRoundedIcon/>}
                                                            onClick={() => favoriteDel(elem)}>즐겨찾기
                                                        삭제</Button>
                                                </ButtonGroup>
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
                                                    <Button class="locationButton" onClick={() => locationCheck(elem)}>위치
                                                        확인</Button>
                                                    <Button id="favoriteAddButton" size="small"
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