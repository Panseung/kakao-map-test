/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import './kakaoMap.css'

export default function KakaoMap() {
  const mapRef = useRef(null)
  const [map, setMap] = useState()
  const [bounds, setBounds] = useState({})  //현재 표시되는 지도 영역 좌표
  const [resZ, setResZ] = useState(0)

  // 맵 띄우는 함수
  const initMap = function() {
    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울의 좌표
      lelve: 3
    }
    const newMap = new window.kakao.maps.Map(mapRef.current, options)
    setBounds(newMap.getBounds())

    // 지도 드래그 할 때 바뀌는 영역 반영
    window.kakao.maps.event.addListener(newMap, 'dragend', function() {
      const bounds = newMap.getBounds()
      setBounds(bounds)
    })
    
    // 지도 줌 할 때 바뀌는 영역 반영
    window.kakao.maps.event.addListener(newMap, 'zoom_changed', function() {
      const bounds = newMap.getBounds()
      setBounds(bounds)
    })

    setMap(newMap)
  }

  // 초기 렌더링 시에 맵 띄우는 함수 실행
  useEffect(() => {
    if (mapRef.current) {
      initMap()
    }
  }, [mapRef])


  // 서치  
  const [keyWord, setKeyWord] = useState('')
  const onHandleKeyWord = function(e) {
    setKeyWord(e.target.value)
  }

  const searchInputRef = useRef(null)
  const isRendered = useRef(null)
  useEffect(() => {
    if (!isRendered.current) {
      isRendered.current = true
    } else {
      const handleKeyDown = function(e) {
        if (e.key === 'Enter') {
          e.preventDefault()
          onSearch()
        }
      }

      searchInputRef.current.addEventListener('keydown', handleKeyDown)

      return () => {
        searchInputRef.current.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [searchInputRef, keyWord])
  
  const markersOverlayRef = useRef([])
  const onSearch = function() {
    for (let i = 0; i < markersOverlayRef.current.length; i ++) {
      const prevMarker = markersOverlayRef.current[i][0]
      const prevOverlay = markersOverlayRef.current[i][1]
      prevMarker.setMap(null)
      prevOverlay.setMap(null)
    }
    markersOverlayRef.current = []
    
    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(keyWord, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        for (let i = 0; i < data.length; i++) {
          displayMarker(data[i], i)
        }

        map.setBounds(bounds)
      } else {
        // 현재 영역 내에서 1차 검색 안될 경우 검색범위를 전국으로 바꿔서 검색 후 해당 검색 결과들의 가운데 좌표로 이동
        ps.keywordSearch(keyWord, (data, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const bounds = new window.kakao.maps.LatLngBounds()        
            for (let i = 0; i < data.length; i++) {
              displayMarker(data[i], i)
              bounds.extend(new window.kakao.maps.LatLng(data[i].y, data[i].x))
            }
    
            map.setBounds(bounds)
          }
        })
      }
    }, { bounds: bounds })  //1차 검색 때 현재 영역 내에서만 검색 되도록 영역 설정

    const displayMarker = function(place, idx) {
      const position = new window.kakao.maps.LatLng(place.y, place.x)
      const marker = new window.kakao.maps.Marker({
        map: map,
        position: position
      })

      const wrapDiv = document.createElement('div');
      const makeWrapDiv = function() {
        wrapDiv.classList.add('wrap');

        const infoDiv = document.createElement('div');
        infoDiv.classList.add('info');
  
        const titleDiv = document.createElement('div');
        titleDiv.classList.add('title');
        titleDiv.textContent = place?.place_name ? place?.place_name : '등록되지 않은 상호명' ;
  
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
        const imgIdx = (idx + 1) > 10 ? idx - 9 : idx + 1
        imgElement.src = process.env.PUBLIC_URL + `/${imgIdx}.png`;
        imgElement.width = 73;
        imgElement.height = 70;
  
        imgDiv.appendChild(imgElement);
  
        const descDiv = document.createElement('div');
        descDiv.classList.add('desc');
  
        const ellipsis1Div = document.createElement('div');
        ellipsis1Div.classList.add('ellipsis');
        ellipsis1Div.textContent = place?.category_name ? place?.category_name : '';
  
        const ellipsis2Div = document.createElement('div');
        ellipsis2Div.classList.add('jibun', 'ellipsis');
        ellipsis2Div.textContent = place?.address_name ? place?.address_name : '';
  
        const linkDiv = document.createElement('div');
        if (place?.place_url){
          const linkElement = document.createElement('a');
          linkElement.href = place.place_url;
          linkElement.target = '_blank';
          linkElement.classList.add('link');
          linkElement.textContent = '홈페이지';
          linkDiv.appendChild(linkElement);
        }
  
        descDiv.appendChild(ellipsis1Div);
        descDiv.appendChild(ellipsis2Div);
        descDiv.appendChild(linkDiv);
  
        bodyDiv.appendChild(imgDiv);
        bodyDiv.appendChild(descDiv);
  
        infoDiv.appendChild(titleDiv);
        infoDiv.appendChild(bodyDiv);
  
        wrapDiv.appendChild(infoDiv);     
      }
      makeWrapDiv()        

      // 커스텀 오버레이 생성
      const customOverlay = new window.kakao.maps.CustomOverlay({
        position: position,
        content: wrapDiv,
        map: map
      });

      window.kakao.maps.event.addListener(marker, 'click', function() {
        customOverlay.setMap(map)    
      });
      markersOverlayRef.current.push([marker, customOverlay])
    }
  }  

  return (
    <div>
      <input ref={searchInputRef} onChange={(e) => {onHandleKeyWord(e)}}/>
      <button onClick={() => {onSearch()}}>search</button>
      <div id="kakao-map" ref={mapRef} style={{ width: '100%', height: '100vh' }}/>
    </div>
  );
};

