const TRIPS = {
  tokyo: {
    city: "東京 Tokyo",
    period: "5 天 4 夜",
    flight: "TPE → HND / NRT",
    days: [
      {
        title: "Day 1｜淺草與晴空塔",
        center: [35.7119, 139.7967],
        activities: [
          { time: "09:00", title: "抵達與飯店寄放行李", place: "上野站周邊", lat: 35.7138, lng: 139.7772 },
          { time: "11:00", title: "淺草寺參拜與仲見世散策", place: "淺草寺", lat: 35.7148, lng: 139.7967 },
          { time: "14:30", title: "東京晴空塔展望台", place: "Tokyo Skytree", lat: 35.71, lng: 139.8107 },
          { time: "18:00", title: "隅田川夜景散步", place: "隅田公園", lat: 35.7101, lng: 139.8048 }
        ]
      },
      {
        title: "Day 2｜澀谷與原宿",
        center: [35.662, 139.704],
        activities: [
          { time: "09:30", title: "明治神宮", place: "明治神宮", lat: 35.6764, lng: 139.6993 },
          { time: "12:00", title: "原宿竹下通逛街", place: "竹下通", lat: 35.6702, lng: 139.7026 },
          { time: "15:00", title: "澀谷十字路口", place: "澀谷站", lat: 35.6595, lng: 139.7005 },
          { time: "19:00", title: "Shibuya Sky 夜景", place: "Shibuya Scramble Square", lat: 35.658, lng: 139.7016 }
        ]
      }
    ]
  },
  osaka: {
    city: "大阪 Osaka",
    period: "4 天 3 夜",
    flight: "TPE → KIX",
    days: [
      {
        title: "Day 1｜難波美食日",
        center: [34.6687, 135.5015],
        activities: [
          { time: "10:00", title: "抵達與飯店入住", place: "難波站", lat: 34.6672, lng: 135.5008 },
          { time: "12:00", title: "道頓堀章魚燒與拉麵", place: "道頓堀", lat: 34.6687, lng: 135.5019 },
          { time: "15:00", title: "心齋橋購物", place: "心齋橋筋", lat: 34.6731, lng: 135.5016 },
          { time: "18:30", title: "法善寺橫丁晚餐", place: "法善寺", lat: 34.6676, lng: 135.503 }
        ]
      },
      {
        title: "Day 2｜大阪城與梅田",
        center: [34.6873, 135.5262],
        activities: [
          { time: "09:00", title: "大阪城公園散步", place: "大阪城天守閣", lat: 34.6873, lng: 135.5262 },
          { time: "12:30", title: "天滿橋午餐", place: "京阪 City Mall", lat: 34.6913, lng: 135.5162 },
          { time: "15:00", title: "梅田藍天大廈", place: "空中庭園展望台", lat: 34.7055, lng: 135.4899 },
          { time: "19:00", title: "梅田地下街逛街", place: "Whity Umeda", lat: 34.7008, lng: 135.5008 }
        ]
      }
    ]
  },
  seoul: {
    city: "首爾 Seoul",
    period: "5 天 4 夜",
    flight: "TPE → ICN",
    days: [
      {
        title: "Day 1｜景福宮與北村",
        center: [37.5796, 126.977],
        activities: [
          { time: "09:30", title: "景福宮韓服拍照", place: "景福宮", lat: 37.5796, lng: 126.977 },
          { time: "12:00", title: "三清洞咖啡街", place: "三清洞", lat: 37.5825, lng: 126.9824 },
          { time: "15:00", title: "北村韓屋村散策", place: "北村韓屋村", lat: 37.5826, lng: 126.9831 },
          { time: "18:00", title: "仁寺洞晚餐", place: "仁寺洞", lat: 37.5743, lng: 126.986 }
        ]
      },
      {
        title: "Day 2｜弘大與漢江",
        center: [37.5563, 126.9236],
        activities: [
          { time: "10:00", title: "弘大早午餐", place: "弘大入口站", lat: 37.5572, lng: 126.9244 },
          { time: "13:30", title: "延南洞散步", place: "京義線林蔭道", lat: 37.5631, lng: 126.9242 },
          { time: "17:00", title: "汝矣島漢江公園野餐", place: "漢江公園", lat: 37.5287, lng: 126.9328 },
          { time: "20:00", title: "首爾塔夜景", place: "N 首爾塔", lat: 37.5512, lng: 126.9882 }
        ]
      }
    ]
  }
};

const destinationSelect = document.getElementById("destinationSelect");
const tripMeta = document.getElementById("tripMeta");
const dayTabs = document.getElementById("dayTabs");
const timeline = document.getElementById("timeline");

let map;
let markers = [];
let activeDayIndex = 0;

function initSelector() {
  Object.entries(TRIPS).forEach(([key, trip]) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = `${trip.city}（${trip.period}）`;
    destinationSelect.append(option);
  });

  destinationSelect.addEventListener("change", () => {
    activeDayIndex = 0;
    renderTrip(destinationSelect.value);
  });
}

function initMap(defaultCenter) {
  map = L.map("map").setView(defaultCenter, 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
}

function renderTrip(tripKey) {
  const trip = TRIPS[tripKey];
  const currentDay = trip.days[activeDayIndex];

  tripMeta.innerHTML = `
    <strong>${trip.city}</strong><br>
    行程長度：${trip.period}<br>
    航線：${trip.flight}
  `;

  renderDayTabs(trip);
  renderTimeline(currentDay.activities);
  updateMap(currentDay);
}

function renderDayTabs(trip) {
  dayTabs.innerHTML = "";

  trip.days.forEach((day, index) => {
    const button = document.createElement("button");
    button.className = `day-tab ${index === activeDayIndex ? "active" : ""}`;
    button.textContent = day.title;
    button.type = "button";

    button.addEventListener("click", () => {
      activeDayIndex = index;
      renderTrip(destinationSelect.value);
    });

    dayTabs.append(button);
  });
}

function renderTimeline(activities) {
  timeline.innerHTML = "";

  activities.forEach((activity) => {
    const item = document.createElement("li");
    item.innerHTML = `
      <time>${activity.time}</time>
      <strong>${activity.title}</strong>
      <span class="activity-place">📍 ${activity.place}</span>
    `;
    timeline.append(item);
  });
}

function clearMarkers() {
  markers.forEach((marker) => marker.remove());
  markers = [];
}

function updateMap(dayPlan) {
  clearMarkers();

  map.setView(dayPlan.center, 13);
  const points = [];

  dayPlan.activities.forEach((activity, idx) => {
    const marker = L.marker([activity.lat, activity.lng]).addTo(map);
    marker.bindPopup(`<strong>${idx + 1}. ${activity.title}</strong><br>${activity.time}｜${activity.place}`);
    markers.push(marker);
    points.push([activity.lat, activity.lng]);
  });

  if (points.length > 1) {
    const route = L.polyline(points, { color: "#2f6fed", weight: 4, opacity: 0.8 }).addTo(map);
    markers.push(route);
    map.fitBounds(route.getBounds(), { padding: [30, 30] });
  }
}

initSelector();
const firstTripKey = Object.keys(TRIPS)[0];
initMap(TRIPS[firstTripKey].days[0].center);
renderTrip(firstTripKey);
