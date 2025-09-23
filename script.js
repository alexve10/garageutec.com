document.addEventListener('DOMContentLoaded', () => {

  // ===== NAVBAR TOGGLE =====
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }


  // ----- Helpers -----
  const normalize = s => String(s || '').toLowerCase().trim();

  // ----- Buscar el input de búsqueda (varias opciones) -----
  const searchInput =
    document.getElementById('searchInput') ||
    document.querySelector('.search-bar input') ||
    document.querySelector('input[type="search"]') ||
    document.querySelector('input[placeholder*="Buscar"]') ||
    document.querySelector('.search input');

  // ----- Encontrar el contenedor de categorías y sus botones -----
  const catContainer =
    document.querySelector('.categorias') ||
    document.querySelector('.categories') ||
    document.querySelector('.category-list');

  const categoryButtons = catContainer
    ? Array.from(catContainer.querySelectorAll('button, a')) // soporta botones o links
    : [];

  // ----- Encontrar todas las tarjetas de componentes (varios selectores por compatibilidad) -----
  const cardSelectors = [
    '.componente-card',
    '.component-card',
    '.componentes-grid .componente-card',
    '.componentes .componente-card',
    '.componentes-grid .component-card',
    '.component-card'
  ];
  const nodes = cardSelectors.flatMap(sel => Array.from(document.querySelectorAll(sel)));
  // eliminar duplicados
  const componentCards = Array.from(new Set(nodes));

  // estado actual de filtros
  let activeCategory = 'all';
  let searchValue = '';

  // función que decide si una tarjeta coincide con filtros
  function matchesFilters(card) {
    // 1) busqueda por texto (nombre, marca, etc)
    const text = normalize(card.innerText);
    if (searchValue && !text.includes(searchValue)) return false;

    // 2) filtro por categoria
    if (!activeCategory || activeCategory === 'all') return true;

    // principal: leer data-category
    const catAttr = normalize(card.getAttribute('data-category') || card.dataset.category || '');
    if (catAttr) return catAttr === activeCategory;

    // fallback: buscar un elemento .tag, .status o .categoria dentro de la card
    const tagEl = card.querySelector('.tag, .status, .categoria');
    if (tagEl) {
      const tagText = normalize(tagEl.innerText);
      // permitir coincidencia parcial (ej: categoría "resistencias" coincide con tag "Resistencias")
      return tagText.includes(activeCategory);
    }

    // si no hay forma de saber, no mostrar
    return false;
  }

  // aplicar filtros y actualizar la vista
  function updateView() {
    componentCards.forEach(card => {
      card.style.display = matchesFilters(card) ? '' : 'none'; // '' restablece al display por defecto
    });

    // contador opcional si existe un elemento con id="componentsCount"
    const countEl = document.getElementById('componentsCount');
    if (countEl) {
      const visible = componentCards.filter(matchesFilters).length;
      countEl.textContent = `${visible} componentes`;
    }
  }

  // ----- conectar búsqueda -----
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchValue = normalize(e.target.value);
      updateView();
    });
  } else {
    console.warn('No se encontró input de búsqueda (busca .search-bar input o id="searchInput")');
  }

  // ----- conectar botones de categoría -----
  if (categoryButtons.length) {
    categoryButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        // primero quitar active a todos
        categoryButtons.forEach(b => b.classList.remove('active'));

        // marcar el clicked
        btn.classList.add('active');

        // obterner categoría desde data-category o desde el texto del botón
        let cat = btn.getAttribute('data-category') || normalize(btn.innerText);
        if (!cat) cat = 'all';
        if (['todos', 'all', 'todas'].includes(cat)) cat = 'all';

        activeCategory = normalize(cat);
        updateView();
      });
    });
  } else {
    console.warn('No se encontraron botones de categoría (busca .categorias o .categories con botones)');
  }


  // inicializar vista
  updateView();

});

/*FAQ*/

document.querySelectorAll(".faq-question").forEach(button => {
  button.addEventListener("click", () => {
    const answer = button.nextElementSibling;

    button.classList.toggle("active");
    if (answer.style.display === "block") {
      answer.style.display = "none";
    } else {
      answer.style.display = "block";
    }
  });
});

