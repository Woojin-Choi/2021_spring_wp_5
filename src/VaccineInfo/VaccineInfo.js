import Map from "../Map";
import {Button, ButtonGroup} from "@material-ui/core";
import AddCircleOutlineRoundedIcon from "@material-ui/icons/AddCircleOutlineRounded";
import React, {useEffect, useState} from "react";
import {getVLocation} from "../Api";
import firebase from "firebase";
import './VaccineInfo.css'

export default function VaccineInfo(props) {

    const [vLocations, setVLocations] = useState([]);
    const [selectedLoc, setSelectedLoc] = useState(null);
    const [page, setPage] = useState(1);

    const db = firebase.firestore();

    const locationCheck = (e) => {
        setSelectedLoc(e.orgZipaddr);
    }

    const infoAlert = (e) => {
        const _locInfo = `
        전화번호: ${e.orgTlno}
        진료시간:${e.sttTm} ~ ${e.endTm}, 
        점심시간: ${e.lunchSttTm} ~ ${e.lunchEndTm}`
        alert(_locInfo.toString());
    }

    const addFavLoc = (elem) => {
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

    const delFavLoc = (elem) => {
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

    const pageLoad = (e) => {
        if(e==="u") {
            setPage(page + 1)
            getVLocation(page)
                .then(_info => {
                    setVLocations(_info)
                })
        } else {
            if(page>1) {
                setPage(page - 1)
                getVLocation(page)
                    .then(_info => {
                        setVLocations(_info)
                    })
            } else {alert("첫 페이지 입니다")}
        }
    }

    useEffect(()=>{
        getVLocation(page)
            .then(_info => {
                setVLocations(_info)
            })
    },[props.favoritePanel,page])

    return(
        <div className={"vaccineInfo"}>
            <div id={"map"}>
                <Map selectedLoc={selectedLoc}/>
            </div>
            <div id={"vaccinationLocation"}>
                <div>
                    {
                        props.favoritePanel ?
                            <div className="location">
                                <div>
                                    <h2>즐겨찾는 병원 (가나다 순)</h2>
                                </div>
                                <div className={"locationGroup"}>
                                    {
                                        props.favLoc.slice(0).sort(function (a, b) {
                                            return a.orgnm < b.orgnm ? -1 : a.orgnm > b.orgnm ? 1 : 0;
                                        }).map(elem => {
                                            return (
                                                <div className="locationBox" key={elem.orgcd}>
                                                    <ul className={"favInfo"}>
                                                        <li>기관명: {elem.orgnm}</li>
                                                        <li>주소: {elem.orgZipaddr}</li>
                                                        <li>당일 휴무여부: {elem.hldyYn}</li>
                                                    </ul>
                                                    <ButtonGroup className="btnGroup" color="primary"
                                                                 aria-label="outlined primary button group">
                                                        <Button className="locationButton" variant="outlined"
                                                                color="primary"
                                                                onClick={() => locationCheck(elem)}>위치
                                                            확인</Button>
                                                        <Button className="locationButton" onClick={() => infoAlert(elem)}>상세 정보</Button>
                                                        <Button id="favoriteDelButton" size="small"
                                                                startIcon={<AddCircleOutlineRoundedIcon/>}
                                                                onClick={() => delFavLoc(elem)}>즐겨찾기 삭제</Button>
                                                    </ButtonGroup>
                                                </div>);
                                        })
                                    }
                                </div>
                            </div>
                            :
                            <div className="location">
                                <div>
                                    <h2>백신 접종처</h2>
                                </div>
                                <div className={"locationGroup"}>
                                    {
                                        vLocations.slice(0).sort(function (a, b) {
                                            return a.orgZipaddr < b.orgZipaddr ? -1 : a.orgZipaddr > b.orgZipaddr ? 1 : 0;
                                        }).map(elem => {
                                            return (
                                                <div className="locationBox" key={elem.orgcd}>
                                                    <ul className={"favInfo"}>
                                                        <li>기관명: {elem.orgnm}</li>
                                                        <li>주소: {elem.orgZipaddr}</li>
                                                        <li>당일 휴무여부: {elem.hldyYn}</li>
                                                    </ul>
                                                    <ButtonGroup className="btnGroup" color="primary" aria-label="outlined primary button group">
                                                        <Button className="locationButton" onClick={() => locationCheck(elem)}>위치 확인</Button>
                                                        <Button className="locationButton" onClick={() => infoAlert(elem)}>상세 정보</Button>
                                                        <Button id="favoriteAddButton" size="small"
                                                                startIcon={<AddCircleOutlineRoundedIcon/>}
                                                                onClick={() => addFavLoc(elem)}>즐겨찾기 추가</Button>
                                                    </ButtonGroup>
                                                </div>);
                                        })
                                    }
                                </div>
                                <div className={"page"}>
                                    <Button id="prevPage" color="primary" variant="outlined" onClick={() => pageLoad("d")}>이전 페이지</Button>
                                    <Button id="nextPage" color="primary" variant="outlined" onClick={() => pageLoad("u")}>다음 페이지</Button>
                                </div>
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}