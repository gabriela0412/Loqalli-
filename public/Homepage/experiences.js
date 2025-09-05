const experiences = [];
const searchInput = document.querySelector('.input2');
const dropdownContents = document.querySelectorAll('.dropdown-content');
const experiencesContainer = document.getElementById('experiences-container');


async function fetchExperiences() {
  try {
    const response = await fetch(
      'https://script.google.com/macros/s/AKfycbwxGKuA9DP6d3ApHXC2dwxPOVvCQBLdisXdMe77gOR7L7bvFT3SDtYVH--3tzByVqRE/exec'
    );
    const data = await response.json();

    if (Array.isArray(data)) {
      experiences.push(...data);
      renderExperiences(experiences);
    } else {
      console.error('La API no devolvió un array válido:', data);
      experiencesContainer.innerHTML = '<p>Error al cargar experiencias.</p>';
    }
  } catch (error) {
    console.error('Error cargando experiencias:', error);
    if (experiencesContainer) {
      experiencesContainer.innerHTML = '<p>No se pudieron cargar las experiencias.</p>';
    }
  }
}


function renderExperiences(exps) {
  if (!experiencesContainer) return;

  experiencesContainer.innerHTML = '';
  if (exps.length === 0) {
    experiencesContainer.innerHTML = '<p>No se encontraron experiencias con esos filtros.</p>';
    return;
  }

  exps.forEach(exp => {
    const card = document.createElement('div');
    card.classList.add('experience-card');

    card.innerHTML = `
      <img src="${exp.image || ''}" alt="${exp.title || 'Experiencia'}" />
      <h3>${exp.title || 'Sin título'}</h3>
      <p class="description">${exp.description || 'Sin descripción disponible.'}</p>
      <p class="price"><strong>Precio:</strong> $${exp.price || '0'}</p>
      <button class="btn-details site-btn" data-id="${exp.id || encodeURIComponent(exp.title || '')}">
        Ver detalle
      </button>
    `;

    experiencesContainer.appendChild(card);


    const detailsBtn = card.querySelector('.btn-details');
    if (detailsBtn) {
      detailsBtn.addEventListener('click', () => {
        const value = exp.id ? exp.id : exp.title;
        window.location.href = `reservas.html?id=${encodeURIComponent(value)}`;
      });
    }
  });
}


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
  const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const activeFilter = getActiveFilter();

  const filtered = experiences.filter(exp => {
    if (searchTerm && !(exp.title || '').toLowerCase().includes(searchTerm)) {
      return false;
    }

    if (!activeFilter) return true;

    if (activeFilter.filterType === 'category' && exp.category !== activeFilter.category) {
      return false;
    }

    if (activeFilter.filterType === 'location' && exp.location !== activeFilter.location) {
      return false;
    }

    if (activeFilter.filterType === 'date') {
      if (!exp.date) return false;
      const expDate = new Date(exp.date);
      if (isNaN(expDate.getTime())) return false;
      if (expDate.toISOString().slice(0, 7) !== activeFilter.date) return false;
    }

    if (activeFilter.filterType === 'price') {
      const expPrice = Number(exp.price);
      if (isNaN(expPrice)) return false;
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


if (searchInput) {
  searchInput.addEventListener('input', filterExperiences);
}


fetchExperiences();

