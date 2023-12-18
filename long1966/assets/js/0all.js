//載入地圖
const map = L.map('map', { zoomControl: false }).setView([0, 0], 16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> Contributors:<a href="https://github.com/fred39392001">ABow_Chen</a>'
}).addTo(map);

const violetIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const marker = L.marker([0, 0], { icon: violetIcon }).addTo(map);

//定位使用者位置
if ('geolocation' in navigator) {
    console.log('geolocation available');
    navigator.geolocation.getCurrentPosition(position => {
        userLat = position.coords.latitude;
        userLng = position.coords.longitude;
        console.log(userLat, userLng);
        map.setView([userLat, userLng], 13);
        marker.setLatLng([userLat, userLng]).bindPopup(
            `<h3>你的位置</h3>`)
            .openPopup();
    });
} else {
    console.log('geolocation not available');
}

//新增定位按鈕
let geoBtn = document.getElementById('jsGeoBtn');
geoBtn.addEventListener('click', function () {
    map.setView([userLat, userLng], 13);
    marker.setLatLng([userLat, userLng]).bindPopup(
        `<h3>你的位置</h3>`)
        .openPopup();
}, false);


//定義marker顏色  //要下監聽函式識別ABC,ICON
let mask;
// ABC
const greenIcon = new L.Icon({
  //C
  iconUrl:
    "https://upload.wikimedia.org/wikipedia/commons/7/73/Eo_circle_orange_white_letter-c.svg",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [50, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const orangeIcon = new L.Icon({
  //B
  iconUrl:
    "https://upload.wikimedia.org/wikipedia/commons/a/ab/Eo_circle_yellow_letter-b.svg",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [50, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const redIcon = new L.Icon({
  iconUrl:
    "https://upload.wikimedia.org/wikipedia/commons/3/34/Eo_circle_cyan_letter-a.svg",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [50, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
//取出全國藥局JSON資料至全域變數
let data;
/*
https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json */
/*https://www.tgos.tw/MapSites/getGeoJson?themeid=38356 */
function getData() {
    const xhr = new XMLHttpRequest;
    xhr.open('get', 'https://raw.githubusercontent.com/divine2u4/0925map/main/2getGeoJson.json ', true) //you data
    xhr.send(null);
    xhr.onload = function () {
        document.querySelector('.loader').style.display = 'none';
        data = JSON.parse(xhr.responseText).features;
        L.control.zoom({ position: 'topright' }).addTo(map);
        addMarker();
        renderList('1', '0');
        addCountyList();
    }
}

function init() {
    
    getData();
}

init();

//將marker群組套件載入
const markers = new L.MarkerClusterGroup({ disableClusteringAtZoom: 18 }).addTo(map);

//倒入全國藥局資料並標上marker 0917 
function addMarker() {
    for (let i = 0; i < data.length; i++) {
        const pharmacyName = data[i].properties.agency; //機構名稱?
        const maskAdult = data[i].properties.mask_adult; //機構電話 icon
        const maskChild = data[i].properties.mask_child; //機構負責人姓名icon
        const lat = data[i].geometry.coordinates[1]; //no
        const lng = data[i].geometry.coordinates[0]; //no
        const pharmacyAddress = data[i].properties.address; //地址全址
        const pharmacyPhone = data[i].properties.fax; //機構電話
        const pharmacyNote = data[i].properties.data; //no
       
        if (maskAdult == 0 || maskChild == 0) {
            mask = redIcon;
        } else if (maskAdult < 100 && maskAdult !== 0 || maskChild < 100 && maskChild !== 0) {
            mask = orangeIcon;
        } else {
            mask = greenIcon;
        }
        let maskAdultJudge;
        let maskChildJudge;
      
        markers.addLayer(L.marker([lat, lng], { icon: mask }).bindPopup(
            `<div class="popupInfo">
            <p class="popupTitle" data-name="${pharmacyName}"><span>${pharmacyName}</span></p>
            <hr>
            <p class="popupText"><i class="fas fa-map-marker-alt"></i> ${pharmacyAddress}</p>
            <p class="popupText"><i class="fas fa-phone-square-alt"></i> ${pharmacyPhone}</p>
            <p class="popupNote"> ${pharmacyNote}</p>
            <div class="panelMaskNum" data-name="${pharmacyName}">
            <div class="${maskAdultJudge}">
            <div class="popupLayout">
            <img class="adultIconS" src="img/adultIconS.svg" alt="">
            <p class="popupMaskNum">${maskAdult}</p>
            </div>
            </div>
            &nbsp;<div class="${maskChildJudge}">
            <div class="popupLayout">
            <img class="kidIconS" src="img/kidIconS.svg" alt="">
            <p class="popupMaskNum">${maskChild}</p>
            </div>
            </div>
            </div>
            </div>
            `
        ));
    }
    map.addLayer(markers);
}

//選單
const countySelector = document.querySelector('.countyList'); //html...56
function addCountyList() {
    let allCounty = [];
    let countyStr = '';
    countyStr += '<option>請選擇服務類別</option>'
    for (let abc = 0; abc < data.length; abc++) {
        const countyName = data[abc].properties.county; //county
        if (allCounty.indexOf(countyName) == -1 && countyName !== '') {
            allCounty.push(countyName);
            countyStr += `<option value="${countyName}">${countyName}</option>`
        }
    }``
    countySelector.innerHTML = countyStr; 
}
countySelector.addEventListener('change', addTownList); //0924監聽相關
//countySelector 用於選擇服務類別，並且當它的值發生變化時，它會觸發 addTownList 函數
//OK 0924


const townSelector = document.querySelector('.townList'); //html...59
townSelector.innerHTML = `<option value="">請選擇鄉鎮區</option>`; //外觀

function addTownList(e) {  //開始接收...
    let countyValue = e.target.value;
    let townStr = `<option value="">請選擇鄉鎮區</option>`;
    let allTown = [];
    let newTownList = '';
    for (let i = 0; i < data.length; i++) {
        let countyMatch = data[i].properties.county; //county
        if (countyValue == countyMatch) {
            allTown.push(data[i].properties.town);
        }
    }

    newTownList = new Set(allTown);
    newTownList = Array.from(newTownList);
    for (let i = 0; i < newTownList.length; i++) {
        townStr += `<option value="${newTownList[i]}">${newTownList[i]}</option>`
    }

    townSelector.innerHTML = townStr;
    townSelector.addEventListener('change', geoTownView);  //監聽 0917 看不懂

}

//選好鄉鎮後，定位至該鄉鎮
function geoTownView(e) {
    let town = e.target.value;
    let townLatLng = [];
    let county = '';

    for (let i = 0; i < data.length; i++) {
        let townTarget = data[i].properties.town;
        let countyTarget = data[i].properties.county;
        let lat = data[i].geometry.coordinates[0];
        let lng = data[i].geometry.coordinates[1];

        if (townTarget == town && countyTarget == countySelector.value) {
            townLatLng = [lng, lat];
            county = data[i].properties.county;
        }
    }
    map.setView(townLatLng, 18);
    renderList(town, county);
}

//在左邊欄印出藥局名稱
function renderList(town, county) {
    let str = '';
    for (let i = 0; i < data.length; i++) {
        const countyName = data[i].properties.county;
        const townName = data[i].properties.town;
        const pharmacyName = data[i].properties.Serve;
        const maskAdult = data[i].properties.mask_adult; // mail
        const maskChild = data[i].properties.mask_child; //
        const pharmacyAddress = data[i].properties.address;
        const pharmacyPhone = data[i].properties.fax;
        const pharmacyNote = data[i].properties.agency;
        let maskAdultJudge;
        let maskChildJudge;

        if (maskAdult >= 100) {
            maskAdultJudge = 'bg-sufficient';
        } else if (maskAdult < 100 && maskAdult !== 0) {
            maskAdultJudge = 'bg-insufficient';
        } else {
            maskAdultJudge = 'bg-none';
        }
        if (maskChild >= 100) {
            maskChildJudge = 'bg-sufficient';
        } else if (maskChild < 100 && maskChild !== 0) {
            maskChildJudge = 'bg-insufficient';

        } else {
            maskChildJudge = 'bg-none';
        }
        if (countyName == county && townName == town) { //town
            str += `<ul class="maskContent">
            <div class="pharmacyTitle" data-lat="${data[i].geometry.coordinates[1]}" data-lng="${data[i].geometry.coordinates[0]}">
            <li data-name="${pharmacyName}"><span>${pharmacyName}</span></li>
            <p class="infoText"><i class="fas fa-map-marker-alt"></i> ${pharmacyAddress}</p>
            <p class="infoText"><i class="fas fa-phone-square-alt"></i> ${pharmacyPhone}</p>
            <p class="noteText"> ${pharmacyNote}</p>
            <div class="panelMaskNum" data-name="${pharmacyName}">
            <div class="${maskAdultJudge}">
            <div class="infoLayout">
            <img class="adultIcon" src="img/adultIcon.svg" alt="">
            <p>${maskAdult}</p>
            </div>
            </div>
            &nbsp;<div class="${maskChildJudge}">
            <div class="infoLayout">
            <img class="kidIcon" src="img/kidIcon.svg" alt="">
            <p>${maskChild}</p>
            </div>
            </div>
            </div>
            </div>
            </ul>`
        }
    }
    document.querySelector('.pharmacyList').innerHTML = str; //1105     直接在style註解掉八 明天再看吧 好喔 改all 和cyList 改all 
    var pharmacyTitle = document.querySelectorAll('.pharmacyTitle');
    var pharmacyNameList = document.querySelectorAll('.maskContent');
    clickPharmacyGeo(pharmacyTitle, pharmacyNameList);
}
//都是置換icon

//選單點擊效果
function clickPharmacyGeo(pharmacyTitle, pharmacyNameList) {
    for (let i = 0; i < pharmacyNameList.length; i++) {
        pharmacyTitle[i].addEventListener('click', function (e) {
            Lat = Number(e.currentTarget.dataset.lat);
            Lng = Number(e.currentTarget.dataset.lng);
            map.setView([Lat, Lng], 20);
            markers.eachLayer(function (layer) {
                const layerLatLng = layer.getLatLng();
                if (layerLatLng.lat == Lat && layerLatLng.lng == Lng) {
                    layer.openPopup();
                }
            });
        })
    }
}

