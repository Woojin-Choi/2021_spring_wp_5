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
                    message = '<div style="padding:10px;">우리 동네</div>'; // 인포윈도우에 표시될 내용입니다

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



    //
    //
    // const popUpInfo =()=>{
    //     alert(props.locInfo);
    // }
    //
    // useEffect(()=>{
    //     const container = document.getElementById('map'), // 지도를 표시할 div
    //         option = {
    //             center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
    //             level: 10 // 지도의 확대 레벨
    //         };
    //
    //     const map = new kakao.maps.Map(container, option); // 지도를 생성합니다
    //
    //     // 지도에 마커와 인포윈도우를 표시하는 함수입니다
    //     function displayMarker(locPosition, message) {
    //
    //         // 마커를 생성합니다
    //         var marker = new kakao.maps.Marker({
    //             map: map,
    //             position: locPosition
    //         });
    //
    //         var iwContent = message, // 인포윈도우에 표시할 내용
    //             iwRemoveable = true;
    //
    //         // 인포윈도우를 생성합니다
    //         var infowindow = new kakao.maps.InfoWindow({
    //             content : iwContent,
    //             removable : iwRemoveable
    //         });
    //
    //         // 마커에 마우스오버 이벤트를 등록합니다
    //         kakao.maps.event.addListener(marker, 'mouseover', function() {
    //             // 마커에 마우스오버 이벤트가 발생하면 인포윈도우를 마커위에 표시합니다
    //             infowindow.open(map, marker);
    //         });
    //
    //         // 마커에 마우스아웃 이벤트를 등록합니다
    //         kakao.maps.event.addListener(marker, 'mouseout', function() {
    //             // 마커에 마우스아웃 이벤트가 발생하면 인포윈도우를 제거합니다
    //             infowindow.close();
    //         });
    //
    //         // 지도의 우측에 확대 축소 컨트롤을 추가한다
    //         map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
    //
    //         // 인포윈도우를 마커위에 표시합니다
    //         infowindow.open(map, marker);
    //
    //         // 지도 중심좌표를 접속위치로 변경합니다
    //         map.setCenter(locPosition);
    //     }
    //
    //     // HTML5의 geolocation으로 사용할 수 있는지 확인합니다
    //     if (navigator.geolocation) {
    //         console.log("어디로1")
    //
    //         // GeoLocation을 이용해서 접속 위치를 얻어옵니다
    //         navigator.geolocation.getCurrentPosition(function(position) {
    //
    //             let lat = position.coords.latitude, // 위도
    //                 lon = position.coords.longitude; // 경도
    //
    //             console.log(lat,lon, "위도,경도")
    //
    //             let locPosition = new kakao.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
    //                 message = '<div style="padding:5px;">현재 위치</div>'; // 인포윈도우에 표시될 내용입니다
    //
    //             // 마커와 인포윈도우를 표시합니다
    //             displayMarker(locPosition, message);
    //
    //         });
    //
    //     } else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
    //         console.log("어디로2")
    //         let locPosition = new kakao.maps.LatLng(37.4811761,126.9527317),
    //             message = '현재 위치를 추적할 수 없습니다'
    //
    //         displayMarker(locPosition, message);
    //     }
    //
    //     function relayout() {
    //         // 지도를 표시하는 div 크기를 변경한 이후 지도가 정상적으로 표출되지 않을 수도 있습니다
    //         // 크기를 변경한 이후에는 반드시  map.relayout 함수를 호출해야 합니다
    //         // window의 resize 이벤트에 의한 크기변경은 map.relayout 함수가 자동으로 호출됩니다
    //         map.relayout();
    //     }
    //     relayout();
    //
    // }, [])
    //
    // useEffect(()=>{
    //     const container = document.getElementById('map');
    //     const options = {
    //         center: new kakao.maps.LatLng(37.4811761,126.9527317),
    //         level: 3
    //     };
    //
    //     const map = new kakao.maps.Map(container, options);
    //     const markerPosition  = new kakao.maps.LatLng(37.4811761,126.9527317);
    //     const marker = new kakao.maps.Marker({
    //         position: markerPosition
    //     });
    //     marker.setMap(map);
    //
    //     // 마커를 클릭했을 때 마커 위에 표시할 인포윈도우를 생성합니다
    //     const iwContent = '<div style="padding:5px;"></div>', // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
    //         iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다
    //
    //     // 인포윈도우를 생성합니다
    //     const infowindow = new kakao.maps.InfoWindow({
    //         content : iwContent,
    //         removable : iwRemoveable
    //     });
    //
    //     // 마커에 마우스오버 이벤트를 등록합니다
    //     kakao.maps.event.addListener(marker, 'mouseover', function() {
    //         // 마커에 마우스오버 이벤트가 발생하면 인포윈도우를 마커위에 표시합니다
    //         infowindow.open(map, marker);
    //     });
    //
    //     // 마커에 마우스아웃 이벤트를 등록합니다
    //     kakao.maps.event.addListener(marker, 'mouseout', function() {
    //         // 마커에 마우스아웃 이벤트가 발생하면 인포윈도우를 제거합니다
    //         infowindow.close();
    //     });
    //
    //     // 지도의 우측에 확대 축소 컨트롤을 추가한다
    //     map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
    //
    //     // 인포윈도우를 마커위에 표시합니다
    //     infowindow.open(map, marker);
    //
    // })
    //
    //
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
                let infowindow = new kakao.maps.InfoWindow({
                    content: '<div style="width:150px;text-align:center;padding:6px 0;">정보를 확인하려면 클릭하세요</div>'
                });
                infowindow.open(map, marker);

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