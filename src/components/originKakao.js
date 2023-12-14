/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import './kakaoMap.css'

export default function OriginKakao() {

  useEffect(() => {
      // 컨트롤러 추가
      let map = document.getElementById('kakao-map')
      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울의 좌표
        lelve: 3
      }

      map = new window.kakao.maps.Map(map, options)
      
      // const control = new window.kakao.maps.ZoomControl();
      // map.addControl(control, window.kakao.maps.ControlPosition.TOPRIGHT); 

      // 지도 드래그 종료 이벤트 등록
      // window.kakao.maps.event.addListener(map, 'dragend', function () {
      //   const center = map.getCenter(); // 중심 좌표 얻기
      // });

      // 지도 상태 변화 종료 이벤트 등록 (드래그, 확대/축소 등)
      window.kakao.maps.event.addListener(map, 'idle', function () {
        const center = map.getCenter(); // 중심 좌표
        const level = map.getLevel(); // 확대 수준
        const bound = map.getBounds() // 지도 경계 좌표
        const mapTypeId = map.getMapTypeId() // 지도 타입??
        const projection = map.getProjection() // 지도 좌표를 픽셀 좌표로 변환하는데 사용되는 프로젝션 객체??
      });

      // 여러 이미지 정보를 담은 배열
      const images = [
        { path: process.env.PUBLIC_URL + '/2.png', position: new window.kakao.maps.LatLng(37.5665, 126.9780) },
        { path: process.env.PUBLIC_URL + '/2.png', position: new window.kakao.maps.LatLng(37.5705, 126.9790) },
        { path: process.env.PUBLIC_URL + '/2.png', position: new window.kakao.maps.LatLng(37.5685, 126.9900) },
      ];

      // 각 이미지를 지도에 표시
      images.forEach(({ path, position }) => {
        const imageUrl = path;

        // 커스텀 오버레이 생성
        const customOverlay = new window.kakao.maps.CustomOverlay({
          position: position,
          content: `<div><img src="${imageUrl}" style="width: 50px; height: 50px;"></div>`,
          map: map,
        });
        
        // 클릭 이벤트 연결
        window.kakao.maps.event.addListener(customOverlay, 'click', () => {
          // 여기에 클릭 이벤트 처리 로직 추가
        });
      });


      // 마커
      const markerPositionList = [
        { position: new window.kakao.maps.LatLng(37.5665, 126.9780) },
        { position: new window.kakao.maps.LatLng(37.5705, 126.9790) },
        { position: new window.kakao.maps.LatLng(37.5725, 126.9900) },
        { position: new window.kakao.maps.LatLng(37.5625, 126.9600) },
        { position: new window.kakao.maps.LatLng(37.5615, 126.9620) },
        { position: new window.kakao.maps.LatLng(37.5555, 126.9640) },
        { position: new window.kakao.maps.LatLng(37.5585, 126.9660) },
        { position: new window.kakao.maps.LatLng(37.5690, 126.9680) },
        { position: new window.kakao.maps.LatLng(37.5702, 126.9700) },
        { position: new window.kakao.maps.LatLng(37.5708, 126.9720) },
        { position: new window.kakao.maps.LatLng(37.5720, 126.9740) },
        { position: new window.kakao.maps.LatLng(37.5696, 126.9760) },
        { position: new window.kakao.maps.LatLng(37.5681, 126.9780) },
        { position: new window.kakao.maps.LatLng(37.5689, 126.9800) },
        { position: new window.kakao.maps.LatLng(37.5664, 126.9820) },
        { position: new window.kakao.maps.LatLng(37.5659, 126.9840) },
        { position: new window.kakao.maps.LatLng(37.5691, 126.9860) },
        { position: new window.kakao.maps.LatLng(37.5693, 126.9880) },
        { position: new window.kakao.maps.LatLng(37.5696, 126.9900) },
        { position: new window.kakao.maps.LatLng(37.5708, 126.9920) },
      ]
      
      markerPositionList.forEach(({position}) => {
        const marker = new window.kakao.maps.Marker({
          map: map,
          position: position
        })        

        const content = document.createElement('div')

        const wrapDiv = document.createElement('div');
        wrapDiv.classList.add('wrap');

        const infoDiv = document.createElement('div');
        infoDiv.classList.add('info');

        const titleDiv = document.createElement('div');
        titleDiv.classList.add('title');
        titleDiv.textContent = '카카오 맵 테스트중';

        const closeDiv = document.createElement('div');
        closeDiv.classList.add('close');
        closeDiv.title = '닫기';
        closeDiv.addEventListener('click', () => {
          customOverlay.setMap(null);
        });

        titleDiv.appendChild(closeDiv);

        const bodyDiv = document.createElement('div');
        bodyDiv.classList.add('body');

        const imgDiv = document.createElement('div');
        imgDiv.classList.add('img');

        const imgElement = document.createElement('img');
        imgElement.src = process.env.PUBLIC_URL + '/2.png';
        imgElement.width = 73;
        imgElement.height = 70;

        imgDiv.appendChild(imgElement);

        const descDiv = document.createElement('div');
        descDiv.classList.add('desc');

        const ellipsis1Div = document.createElement('div');
        ellipsis1Div.classList.add('ellipsis');
        ellipsis1Div.textContent = '서울 특별시 내 집 있으면 좋겠다';

        const ellipsis2Div = document.createElement('div');
        ellipsis2Div.classList.add('jibun', 'ellipsis');
        ellipsis2Div.textContent = '(우) 11111 (지번) 김승환 1234';

        const linkDiv = document.createElement('div');
        const linkElement = document.createElement('a');
        linkElement.href = 'https://arirang.com/';
        linkElement.target = '_blank';
        linkElement.classList.add('link');
        linkElement.textContent = '홈페이지';

        linkDiv.appendChild(linkElement);

        descDiv.appendChild(ellipsis1Div);
        descDiv.appendChild(ellipsis2Div);
        descDiv.appendChild(linkDiv);

        bodyDiv.appendChild(imgDiv);
        bodyDiv.appendChild(descDiv);

        infoDiv.appendChild(titleDiv);
        infoDiv.appendChild(bodyDiv);

        wrapDiv.appendChild(infoDiv);

        const customOverlay = new window.kakao.maps.CustomOverlay({
          content: wrapDiv,
          map: map,
          position: marker.getPosition()
        })

        window.kakao.maps.event.addListener(marker, 'click', function() {
          customOverlay.setMap(map)
        })
        
        function closeOverlay() {
          customOverlay.setMap(null);
        }
      })
  }, []);
  

  return (
    <div>
      <div id="kakao-map" style={{ width: '100%', height: '100vh' }}/>
    </div>
  );
};

