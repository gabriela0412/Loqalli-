const experiences = [];
const searchInput = document.querySelector('.input2');
const dropdownContents = document.querySelectorAll('.dropdown-content');
const experiencesContainer = document.getElementById('experiences-container');

// Función debounce para optimizar el input de búsqueda
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Función para obtener datos desde la API con cache en sessionStorage
async function fetchExperiences() {
  try {
    const cachedData = sessionStorage.getItem('experiences');
    if (cachedData) {
      experiences.push(...JSON.parse(cachedData));
      renderExperiences(experiences);
      return;
    }
    const response = await fetch('https://script.google.com/macros/s/AKfycbwxGKuA9DP6d3ApHXC2dwxPOVvCQBLdisXdMe77gOR7L7bvFT3SDtYVH--3tzByVqRE/exec');
    const data = await response.json();

    data.forEach(exp => {
      exp._titleLower = exp.title.toLowerCase();
    });

    experiences.push(...data);
    sessionStorage.setItem('experiences', JSON.stringify(data));
    renderExperiences(experiences);
  } catch (error) {
    console.error('Error cargando experiencias:', error);
  }
}

function renderExperiences(exps) {
  experiencesContainer.innerHTML = '';
  if (exps.length === 0) {
    experiencesContainer.innerHTML = '<p>No se encontraron experiencias con esos filtros.</p>';
    return;
  }
  const fragment = document.createDocumentFragment();
  exps.forEach(exp => {
    const card = document.createElement('div');
    card.classList.add('experience-card');
    card.innerHTML = `
      <img src="${exp.image}" alt="${exp.title}" loading="lazy" />
      <h3>${exp.title}</h3>
      <p class="description">${exp.description}</p>
      <p class="price"><strong>Precio:</strong> $${exp.price}</p>
      <button class="btn-details" data-id="${exp.id || encodeURIComponent(exp.title)}">Ver detalle</button>
    `;
    card.querySelector('.btn-details').addEventListener('click', () => {
      const value = exp.id ? exp.id : exp.title;
      window.location.href = reservas.html?id=${encodeURIComponent(value)};
    });
    fragment.appendChild(card);
  });
  experiencesContainer.appendChild(fragment);
}

// Obtener el filtro activo (solo un tipo a la vez)
function getActiveFilter() {
  for (const dropdown of dropdownContents) {
    const selectedBtn = dropdown.querySelector('button.selected');
    if (selectedBtn) {
      const filterType = dropdown.dataset.filter;
      if (filterType === 'price') {
        return {
          priceMin: Number(selectedBtn.dataset.min),
          priceMax: Number(selectedBtn.dataset.max),
          filterType: 'price',
        };
      } else {
        return {
          [filterType]: selectedBtn.dataset.value,
          filterType: filterType,
        };
      }
    }
  }
  return null;
}

function filterExperiences() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const activeFilter = getActiveFilter();
  const filtered = experiences.filter(exp => {
    if (searchTerm && !exp._titleLower.includes(searchTerm)) return false;
    if (!activeFilter) return true;
    if (activeFilter.filterType === 'category' && exp.category !== activeFilter.category) return false;
    if (activeFilter.filterType === 'location' && exp.location !== activeFilter.location) return false;
    if (activeFilter.filterType === 'date') {
      const expDate = new Date(exp.date);
      if (expDate.toISOString().slice(0, 7) !== activeFilter.date) return false;
    }
    if (activeFilter.filterType === 'price') {
      const expPrice = Number(exp.price);
      if (!(expPrice >= activeFilter.priceMin && expPrice <= activeFilter.priceMax)) return false;
    }
    return true;
  });
  renderExperiences(filtered);
}

dropdownContents.forEach(dropdown => {
  dropdown.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      dropdownContents.forEach(d =>
        d.querySelectorAll('button').forEach(b => b.classList.remove('selected'))
      );
      btn.classList.add('selected');
      filterExperiences();
    });
  });
});

// Evento para búsqueda con debounce
searchInput.addEventListener('input', debounce(filterExperiences, 300));

// Inicio: carga experiencias
fetchExperiences();