/*global kakao*/
import React, { useEffect } from 'react'
import './App.css';

const Map = ({ searchPlace }) =>{

    const places = new kakao.maps.services.Places();
    const callback = function(result, status) {
        if (status === kakao.maps.services.Status.OK) {
            console.log(result);
        }
    };

    places.keywordSearch('판교 치킨', callback);

    useEffect(()=>{
        const container = document.getElementById('map');
        const options = {
            center: new kakao.maps.LatLng(37.4824761,126.9519317),
            level: 3
        };
        const map = new kakao.maps.Map(container, options);

        const markerPosition  = new kakao.maps.LatLng(37.4824761,126.9519317);
        const marker = new kakao.maps.Marker({
            position: markerPosition
        });

        const ps = new kakao.maps.services.Places();

        ps.keywordSearch('입력 값', placesSearchCB);

        function placesSearchCB (data, status, pagination) {
            if (status === kakao.maps.services.Status.OK) {

                let bounds = new kakao.maps.LatLngBounds();

                for (let i=0; i<data.length; i++) {
                    displayMarker(data[i]);
                    bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
                }

                map.setBounds(bounds);
            }
        }



        function displayMarker(place) {
            const marker = new kakao.maps.Marker({
                map: map,
                position: new kakao.maps.LatLng(place.y, place.x)
            });
        }

        // 마커를 클릭했을 때 마커 위에 표시할 인포윈도우를 생성합니다
        const iwContent = '<div style="padding:5px;">Hello World!</div>', // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
            iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

        // 인포윈도우를 생성합니다
        const infowindow = new kakao.maps.InfoWindow({
            content : iwContent,
            removable : iwRemoveable
        });

        // 마커에 클릭이벤트를 등록합니다
        kakao.maps.event.addListener(marker, 'click', function() {
            // 마커 위에 인포윈도우를 표시합니다
            infowindow.open(map, marker);
        });

        // 마커에 마우스오버 이벤트를 등록합니다
        kakao.maps.event.addListener(marker, 'mouseover', function() {
            // 마커에 마우스오버 이벤트가 발생하면 인포윈도우를 마커위에 표시합니다
            infowindow.open(map, marker);
        });

        // 마커에 마우스아웃 이벤트를 등록합니다
        kakao.maps.event.addListener(marker, 'mouseout', function() {
            // 마커에 마우스아웃 이벤트가 발생하면 인포윈도우를 제거합니다
            infowindow.close();
        });

        // 지도에 확대 축소 컨트롤을 생성한다
        const zoomControl = new kakao.maps.ZoomControl();

        // 지도의 우측에 확대 축소 컨트롤을 추가한다
        map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

        // 지도 클릭 이벤트를 등록한다 (좌클릭 : click, 우클릭 : rightclick, 더블클릭 : dblclick)
        kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
            console.log('지도에서 클릭한 위치의 좌표는 ' + mouseEvent.latLng.toString() + ' 입니다.');
        });

        function relayout() {

            // 지도를 표시하는 div 크기를 변경한 이후 지도가 정상적으로 표출되지 않을 수도 있습니다
            // 크기를 변경한 이후에는 반드시  map.relayout 함수를 호출해야 합니다
            // window의 resize 이벤트에 의한 크기변경은 map.relayout 함수가 자동으로 호출됩니다
            map.relayout();
        }

        marker.setMap(map);},[searchPlace])


    return (
        <div>
            <div id="map" ></div>
        </div>
    )
}

export default Map;