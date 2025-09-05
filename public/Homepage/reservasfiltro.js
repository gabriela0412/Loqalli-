function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const experienceIdRaw = getQueryParam("id");
const experienceId = experienceIdRaw ? experienceIdRaw.trim() : null;
console.log("ID recibido en URL (trim):", experienceId);

async function loadExperienceDetail() {
  if (!experienceId) {
    console.warn("No se recibió parámetro id en la URL");
    return;
  }

  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbwxGKuA9DP6d3ApHXC2dwxPOVvCQBLdisXdMe77gOR7L7bvFT3SDtYVH--3tzByVqRE/exec"
    );

    if (!response.ok) {
      console.error("Error en la respuesta del fetch:", response.status);
      return;
    }

    const data = await response.json();
    console.log("Datos recibidos de la API:", data);

    const experienceIdNum = Number(experienceId);

    
    const filteredExperiences = data.filter(exp => {
      const idMatch =
        !isNaN(experienceIdNum) && String(exp.id).trim() === String(experienceIdNum);
      const titleMatch =
        exp.title &&
        exp.title.toLowerCase().trim() === experienceId.toLowerCase();
      return idMatch || titleMatch;
    });

    if (filteredExperiences.length === 0) {
      console.error(
        "No se encontraron experiencias para id o título:",
        experienceId
      );
      return;
    }

    const selectedExperience = filteredExperiences[0];
    console.log("Experiencia encontrada:", selectedExperience);


    const titleEl = document.querySelector(".TitleExperience");
    const shortDescEl = document.querySelector(".ShortDescription");
    const inDescEl = document.querySelector(".Indescription");

    if (titleEl) titleEl.textContent = selectedExperience.title || "";
    if (shortDescEl) shortDescEl.textContent = selectedExperience.description || "";
    if (inDescEl) inDescEl.textContent = selectedExperience.indescription || "";

    
    const images = document.querySelectorAll(".gallery img");
    if (images.length > 0) {
      images[0].src = selectedExperience.image1 || "placeholder.jpg";
      if (images[1]) images[1].src = selectedExperience.image2 || "placeholder.jpg";
      if (images[2]) images[2].src = selectedExperience.image3 || "placeholder.jpg";
    }
  } catch (error) {
    console.error("Error al cargar detalles:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM cargado, iniciando carga de experiencia...");
  loadExperienceDetail();
});
