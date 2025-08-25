let banners = [];
let currentIndex = 0;
const bannersPerPage = 4;
const rotateInterval = 10000; // 5 segundos

function fetchBanners() {
  fetch("https://script.google.com/macros/s/AKfycbyD_pn1GA27TQ6UbtnATgUALMrpZvp3XZfOAiPzh-g1ICJVSlQs9M9dj_cBijK2JcE6/exec")
    .then(res => res.json())
    .then(data => {
      banners = data;
      showBanners();
      setInterval(showBanners, rotateInterval);
    })
    .catch(err => console.error("Error al cargar banners:", err));
}

function showBanners() {
  const container = document.getElementById("banner-container");
  container.innerHTML = ""; // Limpia los banners anteriores

  const slice = banners.slice(currentIndex, currentIndex + bannersPerPage);

  slice.forEach(banner => {
    const div = document.createElement("div");
    div.className = "banner-item";

    div.innerHTML = `
      <img class="banner-image" src="${banner.image_url}" alt="${banner.title}">
      <div class="banner-content">
        <h3>${banner.title}</h3>
        <p>${banner.description}</p>
      </div>
    `;

    div.style.cursor = "pointer";
    div.onclick = () => {
      if (banner.link) {
        window.open(banner.link, "_blank");
      }
    };

    container.appendChild(div);
  });

  currentIndex += bannersPerPage;
  if (currentIndex >= banners.length) {
    currentIndex = 0;
  }
}

document.addEventListener("DOMContentLoaded", fetchBanners);
