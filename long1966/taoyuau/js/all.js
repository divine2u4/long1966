//載入地圖
const map = L.map("map", { zoomControl: false }).setView([0, 0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> Contributors:<a href="https://github.com/fred39392001">ABow_Chen</a>',
}).addTo(map);

const violetIcon = new L.Icon({
  iconUrl:
    "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const marker = L.marker([0, 0], { icon: violetIcon }).addTo(map);

//定位使用者位置
if ("geolocation" in navigator) {
  console.log("geolocation available");
  navigator.geolocation.getCurrentPosition((position) => {
    userLat = position.coords.latitude;
    userLng = position.coords.longitude;
    console.log(userLat, userLng);
    map.setView([userLat, userLng], 13);
    marker
      .setLatLng([userLat, userLng])
      .bindPopup(`<h3>你的位置</h3>`)
      .openPopup();
  });
} else {
  console.log("geolocation not available");
}

//新增定位按鈕
let geoBtn = document.getElementById("jsGeoBtn");
geoBtn.addEventListener(
  "click",
  function () {
    map.setView([userLat, userLng], 13);
    marker
      .setLatLng([userLat, userLng])
      .bindPopup(`<h3>你的位置</h3>`)
      .openPopup();
  },
  false
);

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
  const xhr = new XMLHttpRequest();
  xhr.open(
    "get",
    "https://raw.githubusercontent.com/yi960199/kkbox/main/%E6%A1%83%E5%9C%92%E5%B8%82.json ",
    true
  ); //you data
  xhr.send(null);
  xhr.onload = function () {
    document.querySelector(".loader").style.display = "none";
    data = JSON.parse(xhr.responseText).features;
    L.control.zoom({ position: "topright" }).addTo(map);
    addMarker();
    renderList("竹山鎮", "南投縣");
    addCountyList();
  };
}

function init() {
  renderDate();
  getData();
}

init();

//將marker群組套件載入
const markers = new L.MarkerClusterGroup({ disableClusteringAtZoom: 18 }).addTo(
  map
);

//倒入全國藥局資料並標上marker 0917
function addMarker() {
  for (let i = 0; i < data.length; i++) {
    const pharmacyName = data[i].properties.agency;
    const pharmacyabc = data[i].properties.O_ABC;
    const pharmacyAddress = data[i].properties.address;
    const pharmacyPhone = data[i].properties.fax;
    const pharmacyName2 = data[i].properties.name;
    const pharmacyMail = data[i].properties.mail;
    const pharmacyServe = data[i].properties.Serve;
    const lat = data[i].geometry.coordinates[1]; // 获取经纬度
    const lng = data[i].geometry.coordinates[0];

    // 设置不同的图标
    let mask;

    if (pharmacyabc === "C") {
      mask = greenIcon;
    } else if (pharmacyabc === "B") {
      mask = orangeIcon;
    } else if (pharmacyabc === "A") {
      mask = redIcon;
    }

    markers.addLayer(
      L.marker([lat, lng], { icon: mask }).bindPopup(
        `<div class="popupInfo">
          <p class="popupTitle" data-name="${pharmacyName}"><span>${pharmacyName}</span></p>
          <p class="popupText2"><i class="fas 	fa fa-user"></i> 長照分級ABC: ${pharmacyabc}</p>
          <p class="popupText2"><i class="fas fa fa-circle"></i> 特約服務項目: ${pharmacyServe}</p>
          <p class="popupText"><i class="fas fa-map-marker-alt"></i> 地址: ${pharmacyAddress}</p>
          <p class="popupText"><i class="fas fa-phone-square-alt"></i> 機構電話: ${pharmacyPhone}</p>
          <p class="popupText1"><i class="fas fa fa-circle"></i> 負責人姓名: ${pharmacyName2}</p>
          <p class="popupText1"><i class="fas fa fa-circle"></i> 電子郵件 : ${pharmacyMail}</p>
        </div>`
      )
    );
  }
  map.addLayer(markers);
}

//在panel印出今天日期
function renderDate() {}
const toggle_btn = document.querySelector(".js_toggle");
const panel = document.querySelector(".panel");
toggle_btn.onclick = function (e) {
  // e.preventDefault();
  panel.classList.toggle("panelClose");
};

//選單
const countySelector = document.querySelector(".countyList"); //html...56
function addCountyList() {
  let allCounty = [];
  let countyStr = "";
  countyStr += "<option>請選擇縣市</option>";
  for (let abc = 0; abc < data.length; abc++) {
    const countyName = data[abc].properties.county; //county
    if (allCounty.indexOf(countyName) == -1 && countyName !== "") {
      allCounty.push(countyName);
      countyStr += `<option value="${countyName}">${countyName}</option>`;
    }
  }
  ``;
  countySelector.innerHTML = countyStr;
}
countySelector.addEventListener("change", addTownList); //0924監聽相關
//countySelector 用於選擇服務類別，並且當它的值發生變化時，它會觸發 addTownList 函數
//OK 0924

const townSelector = document.querySelector(".townList"); //html...59
townSelector.innerHTML = `<option value="">請選擇鄉鎮區</option>`; //外觀

function addTownList(e) {
  //開始接收...
  let countyValue = e.target.value;
  let townStr = `<option value="">請選擇鄉鎮區</option>`;
  let allTown = [];
  let newTownList = "";
  for (let i = 0; i < data.length; i++) {
    let countyMatch = data[i].properties.county; //county
    if (countyValue == countyMatch) {
      allTown.push(data[i].properties.town);
    }
  }

  newTownList = new Set(allTown);
  newTownList = Array.from(newTownList);
  for (let i = 0; i < newTownList.length; i++) {
    townStr += `<option value="${newTownList[i]}">${newTownList[i]}</option>`;
  }

  townSelector.innerHTML = townStr;
  townSelector.addEventListener("change", geoTownView); //監聽 0917 看不懂
}

//選好鄉鎮後，定位至該鄉鎮
function geoTownView(e) {
  let town = e.target.value;
  let townLatLng = [];
  let county = "";

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
  let str = "";
  for (let i = 0; i < data.length; i++) {
    const countyName = data[i].properties.county;
    const townName = data[i].properties.town;
    const pharmacyName = data[i].properties.agency;
    const pharmacyabc = data[i].properties.O_ABC;
    const pharmacyAddress = data[i].properties.address;
    const pharmacyPhone = data[i].properties.fax;
    const pharmacyName2 = data[i].properties.name;
    const pharmacyMail = data[i].properties.mail;
    const pharmacyServe = data[i].properties.Serve;
    const lat = data[i].geometry.coordinates[1]; // 获取经纬度
    const lng = data[i].geometry.coordinates[0];

    let mask;

    if (pharmacyabc === "C") {
      mask = greenIcon;
    } else if (pharmacyabc === "B") {
      mask = orangeIcon;
    } else if (pharmacyabc === "A") {
      mask = redIcon;
    }
    if (countyName == county && townName == town) {
      //town
      str += `<ul class="popupInfo1">
      <div class="pharmacyTitle" data-lat="${data[i].geometry.coordinates[1]}" data-lng="${data[i].geometry.coordinates[0]}">
      <l data-name="${pharmacyName}"><span>${pharmacyName}</span></l>  
      <p class="popupText2"><i class="fas 	fa fa-user"></i> 長照分級ABC: ${pharmacyabc}</p>
      <p class="popupText2"><i class="fas fa fa-circle"></i> 特約服務項目: ${pharmacyServe}</p>
      <p class="popupText"><i class="fas fa-map-marker-alt"></i> 地址: ${pharmacyAddress}</p>
      <p class="popupText"><i class="fas fa-phone-square-alt"></i> 機構電話: ${pharmacyPhone}</p>
      <p class="popupText1"><i class="fas fa fa-circle"></i> 負責人姓名: ${pharmacyName2}</p>
      <p class="popupText1"><i class="fas fa fa-circle"></i> 電子郵件 : ${pharmacyMail}</p>
      <hr>
    </div>`;
    }
  }
  document.querySelector(".pharmacyList").innerHTML = str;
  var pharmacyTitle = document.querySelectorAll(".pharmacyTitle");
  var pharmacyNameList = document.querySelectorAll(".popupInfo1");
  clickPharmacyGeo(pharmacyTitle, pharmacyNameList);
}
//都是置換icon+

//選單點擊效果
function clickPharmacyGeo(pharmacyTitle, pharmacyNameList) {
  for (let i = 0; i < pharmacyNameList.length; i++) {
    pharmacyTitle[i].addEventListener("click", function (e) {
      Lat = Number(e.currentTarget.dataset.lat);
      Lng = Number(e.currentTarget.dataset.lng);
      map.setView([Lat, Lng], 20);
      markers.eachLayer(function (layer) {
        const layerLatLng = layer.getLatLng();
        if (layerLatLng.lat == Lat && layerLatLng.lng == Lng) {
          layer.openPopup();
        }
      });
    });
  }
}
