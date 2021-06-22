/*global kakao*/
import React, { useEffect } from 'react'
import './App.css';
import Popup from 'react-semantic-popup';

const Map = (props) => {

    useEffect(()=>{
        // HTML5의 geolocation으로 사용할 수 있는지 확인합니다
        if (navigator.geolocation) {

            // GeoLocation을 이용해서 접속 위치를 얻어옵니다
            navigator.geolocation.getCurrentPosition(function(position) {

                let lat = position.coords.latitude, // 위도
                    lon = position.coords.longitude; // 경도

                const mapContainer = document.getElementById('map'), // 지도를 표시할 div
                    mapOption = {
                        center: new kakao.maps.LatLng(37.4811761,126.9527317), // 지도의 중심좌표
                        level: 6 // 지도의 확대 레벨
                    };

                const map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

                let locPosition = new kakao.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
                    message = '<div style="padding:10px;">GPS 기준 위치입니다</div>'; // 인포윈도우에 표시될 내용입니다

                // 마커와 인포윈도우를 표시합니다
                // displayMarker(locPosition, message);

                // 마커를 생성합니다
                let marker = new kakao.maps.Marker({
                    map: map,
                    position: locPosition
                });

                let iwContent = message, // 인포윈도우에 표시할 내용
                    iwRemoveable = false;

                // 인포윈도우를 생성합니다
                let infowindow = new kakao.maps.InfoWindow({
                    content : iwContent,
                    removable : iwRemoveable
                });

                // 인포윈도우를 마커위에 표시합니다
                infowindow.open(map, marker);

                // 지도 중심좌표를 접속위치로 변경합니다
                map.setCenter(locPosition);

            });

        } else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다

            const mapContainer = document.getElementById('map'), // 지도를 표시할 div
                mapOption = {
                    center: new kakao.maps.LatLng(37.4811761,126.9527317), // 지도의 중심좌표
                    level: 6 // 지도의 확대 레벨
                };

            const map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

            const locPosition = new kakao.maps.LatLng(37.4811761,126.9527317)

            // 마커를 생성합니다
            let marker = new kakao.maps.Marker({
                map: map,
                position: locPosition
            });

            let iwContent = '',
                iwRemoveable = false;

            // 인포윈도우를 생성합니다
            let infowindow = new kakao.maps.InfoWindow({
                content : iwContent,
                removable : iwRemoveable
            });

            // 인포윈도우를 마커위에 표시합니다
            infowindow.open(map, marker);

            // 지도 중심좌표를 접속위치로 변경합니다
            map.setCenter(locPosition);

        }
    },[])

    useEffect(()=>{
        const mapContainer = document.getElementById('map'), // 지도를 표시할 div
            mapOption = {
                center: new kakao.maps.LatLng(37.4811761,126.9527317), // 지도의 중심좌표
                level: 6 // 지도의 확대 레벨
            };

        // 지도를 생성합니다
        const map = new kakao.maps.Map(mapContainer, mapOption);

        // 주소-좌표 변환 객체를 생성합니다
        const geocoder = new kakao.maps.services.Geocoder();

        // 주소로 좌표를 검색합니다
        geocoder.addressSearch(props.selectedLoc, function(result, status) {

            // 정상적으로 검색이 완료됐으면
            if (status === kakao.maps.services.Status.OK) {

                let coords = new kakao.maps.LatLng(result[0].y, result[0].x);

                // 결과값으로 받은 위치를 마커로 표시합니다
                let marker = new kakao.maps.Marker({
                    map: map,
                    position: coords,
                });

                // 인포윈도우로 장소에 대한 설명을 표시합니다
                // let infowindow = new kakao.maps.InfoWindow({
                //     content: '<div style="width:150px;text-align:center;padding:6px 0;"></div>'
                // });
                // infowindow.open(map, marker);

                // kakao.maps.event.addListener(marker, 'click', popUpInfo());

                // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
                map.setCenter(coords);
            }
        });


    }, [props.selectedLoc])

    return (
        <div>
            <div id="map" style={{width:"500px", height:"400px"}}></div>
        </div>
    )
}

export default Map;