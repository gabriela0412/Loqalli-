const experiences = [];

const searchInput = document.querySelector('.input2');
const dropdownContents = document.querySelectorAll('.dropdown-content');
const experiencesContainer = document.getElementById('experiences-container');

async function fetchExperiences() {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbwxGKuA9DP6d3ApHXC2dwxPOVvCQBLdisXdMe77gOR7L7bvFT3SDtYVH--3tzByVqRE/exec');
    const data = await response.json();
    experiences.push(...data);
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

  exps.forEach(exp => {
    const card = document.createElement('div');
    card.classList.add('experience-card');
    card.innerHTML = `
      <img src="${exp.image}" alt="${exp.title}" />
      <h3>${exp.title}</h3>
      <p>${exp.description}</p>
      <p><strong>Precio:</strong> $${exp.price}</p>
    `;
    experiencesContainer.appendChild(card);
  });
}

function getActiveFilter() {
  // Retorna un solo filtro activo (único) de todos los dropdowns
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
  // Si no hay ninguno seleccionado
  return null;
}

function filterExperiences() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const activeFilter = getActiveFilter();

  const filtered = experiences.filter(exp => {
    if (searchTerm && !exp.title.toLowerCase().includes(searchTerm)) return false;

    if (!activeFilter) return true; // No hay filtro activo, mostrar todo

    // Filtrado único según tipo de filtro activo
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

// Al hacer clic en un botón de cualquier dropdown,
// limpiamos todas las selecciones previas y seleccionamos sólo ese botón.
dropdownContents.forEach(dropdown => {
  dropdown.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      // Limpiar todas las selecciones en todos los dropdowns
      dropdownContents.forEach(d => d.querySelectorAll('button').forEach(b => b.classList.remove('selected')));

      // Marcar sólo el botón clickeado como seleccionado
      btn.classList.add('selected');

      filterExperiences();
    });
  });
});

searchInput.addEventListener('input', filterExperiences);

fetchExperiences();
