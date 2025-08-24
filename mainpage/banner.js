let banners = [];
let currentIndex = 0;
const bannersPerPage = 4;
const rotateInterval = 5000; // 5 segundos

function fetchBanners() {
  fetch("https://script.google.com/macros/s/AKfycbyD_pn1GA27TQ6UbtnATgUALMrpZvp3XZfOAiPzh-g1ICJVSlQs9M9dj_cBijK2JcE6/exec") // ← pon aquí tu URL
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
    div.className = "banner";
    div.innerHTML = `
      <h3>${banner.title}</h3>
      <p>${banner.description}</p>
      <img src="${banner.image_url}" alt="${banner.title}" width="200">
      <a href="${banner.link}">Ver más</a>
    `;
    container.appendChild(div);
  });

  // Avanza al siguiente grupo de banners
  currentIndex += bannersPerPage;
  if (currentIndex >= banners.length) {
    currentIndex = 0;
  }
}

document.addEventListener("DOMContentLoaded", fetchBanners);
