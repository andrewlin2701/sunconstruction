// ===== PEXELS API KEY =====
const PEXELS_API_KEY = 'o1iJzxRV9TvlPTw2CA9OyRMR7HTR5PtYRwMkLclYaYHnMXegqrW9vIi6';

// ===== PROJECT DATA =====
const projects = [
  {
    id: 1,
    name: "Modern Hillside Retreat",
    category: "New House",
    description: "This 2,800 sq ft new construction sits on a sloped lot and was designed to work with the terrain rather than against it. The main level is anchored by a great room with 12-foot ceilings and walls of glass that frame views of the surrounding hills. The kitchen features custom white oak cabinetry, quartz countertops, and a large island with seating for four. Three bedrooms occupy the upper level, each with its own en-suite bath. A rooftop deck accessible from the primary suite was added at the client's request, finished with composite decking and a pergola. The home is fully electric with solar panels, a heat pump system, and a rainwater collection setup for irrigation.",
    thumbQuery: "modern house exterior architecture",
    detailQuery: "modern luxury house exterior"
  },
  {
    id: 2,
    name: "Craftsman Family Home",
    category: "Renovation",
    description: "The owners of this 1,950 sq ft 1940s craftsman came to us wanting to modernize the home without erasing its original character. We started by opening the wall between the kitchen and dining room to create a connected living space while keeping the original fir beam overhead. The kitchen was rebuilt with shaker cabinets, a farmhouse sink, and period-appropriate hardware. Both bathrooms were fully gutted and retiled. The original fir floors were sanded and refinished throughout. A rear mudroom and laundry addition — approximately 180 sq ft — was tied into the existing structure seamlessly. New electrical panel, updated plumbing, and added insulation throughout brought the home to current code.",
    thumbQuery: "craftsman bungalow house",
    detailQuery: "craftsman house renovation"
  },
  {
    id: 3,
    name: "Downtown ADU Suite",
    category: "ADU",
    description: "This 640 sq ft ADU was constructed above a detached two-car garage on a 6,000 sq ft urban lot. The clients wanted a rentable unit that would not feel like an afterthought. We designed a private exterior staircase with a landing and covered entry to give the unit a proper front door feel. Inside, the layout places the kitchen and living area toward the street-facing windows for natural light. The bedroom is separated by a half-wall and fitted wardrobe. The bathroom features a walk-in shower with large-format tile and in-floor heat. The unit has its own electrical meter, mini-split HVAC, and on-demand water heater. The project was fully permitted and passed all city inspections.",
    thumbQuery: "small apartment unit exterior",
    detailQuery: "studio apartment interior modern"
  },
  {
    id: 4,
    name: "Garden DADU Studio",
    category: "DADU",
    description: "This 460 sq ft detached structure was built at the rear of a residential property to serve as a quiet, self-contained workspace and occasional guest quarters. The clients — both architects — had strong opinions about natural light, so we oriented the building to maximize northern exposure and installed three roof skylights. The interior is finished with polished concrete floors, exposed cedar ceiling, and floor-to-ceiling built-in shelving along one wall. A Murphy bed folds out of a custom millwork unit, doubling the daytime workspace as an overnight space. The unit has a compact full bath and a kitchenette with sink, undercounter refrigerator, and two-burner induction cooktop. Connected to the main property's utilities with its own sub-panel.",
    thumbQuery: "backyard cottage garden studio",
    detailQuery: "small detached studio house backyard"
  },
  {
    id: 5,
    name: "Pacific Heights Remodel",
    category: "Renovation",
    description: "This three-story Victorian rowhouse had not been touched since the 1980s and needed a full update throughout its 2,200 sq ft. The kitchen was relocated from the back corner to the center of the main floor, opening it to both the dining room and a new rear deck. Custom painted cabinets, a Calacatta marble island, and a professional-grade range were the centerpieces of the new layout. The primary bathroom on the third floor was reconfigured to include a freestanding soaking tub, a double vanity, and a steam shower. A powder room was added on the main floor where a coat closet previously stood. Original redwood floors were repaired and refinished throughout all three levels. All wiring and plumbing were brought up to current code.",
    thumbQuery: "victorian rowhouse exterior",
    detailQuery: "victorian house renovation interior"
  },
  {
    id: 6,
    name: "Minimalist New Build",
    category: "New House",
    description: "The clients came to us with a clear vision: a home with no unnecessary surfaces, no ornamental detail, and nothing that didn't serve a purpose. The result is a 3,100 sq ft single-story structure built around a central courtyard. A series of ten-foot pocket doors across the rear of the main living area retract fully into the wall, dissolving the boundary between inside and outside. Floors are continuous honed limestone throughout. The kitchen is integrated into the main room as a single long run of cabinetry with no upper cabinets — storage is handled by a dedicated walk-in pantry behind a flush door. Three bedrooms each open directly to the courtyard. The roof is a low-slope membrane system with integrated drainage and a planted section over the primary bedroom wing for insulation and acoustics.",
    thumbQuery: "minimalist modern house exterior",
    detailQuery: "minimalist home interior design"
  }
];

// ===== IMAGE CACHE =====
const imageCache = {};

async function fetchPhotos(query, count = 4, page = 1) {
  const cacheKey = `${query}_${count}_${page}`;
  if (imageCache[cacheKey]) return imageCache[cacheKey];

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}&page=${page}&orientation=landscape`,
      { headers: { Authorization: PEXELS_API_KEY } }
    );
    if (!res.ok) throw new Error(`Pexels error ${res.status}`);
    const data = await res.json();
    const urls = data.photos.map(p => p.src.large2x || p.src.large);
    imageCache[cacheKey] = urls;
    return urls;
  } catch (err) {
    console.error('Pexels fetch failed:', err);
    return [];
  }
}

// ===== NAVIGATION HISTORY =====
const navHistory = [];

function showPage(pageId, pushHistory = true) {
  const current = document.querySelector('.page.active');
  if (current && pushHistory) navHistory.push(current.id);
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goBack() {
  const prev = navHistory.length > 0 ? navHistory.pop() : 'page-home';
  showPage(prev, false);
}

// ===== BUILD GALLERY =====
async function buildGallery() {
  const grid = document.getElementById('gallery-grid');
  grid.innerHTML = '<p class="gallery-loading">Loading projects\u2026</p>';

  const results = await Promise.all(
    projects.map(p => fetchPhotos(p.thumbQuery, 1))
  );

  grid.innerHTML = '';
  projects.forEach((project, i) => {
    const thumb = results[i][0] || '';
    const card = document.createElement('div');
    card.className = 'gallery-card';
    card.innerHTML = `
      <img src="${thumb}" alt="${project.name}" loading="lazy" />
      <div class="gallery-card-overlay">
        <div class="gallery-card-info">
          <h3>${project.name}</h3>
          <span>${project.category}</span>
        </div>
      </div>
    `;
    card.addEventListener('click', () => openProject(project.id));
    grid.appendChild(card);
  });
}

// ===== OPEN PROJECT DETAIL =====
async function openProject(id) {
  const project = projects.find(p => p.id === id);
  if (!project) return;

  // Navigate first so user sees the page immediately
  showPage('page-project');

  const detail = document.getElementById('project-detail');
  detail.innerHTML = `
    <div class="project-detail-header">
      <h1>${project.name}</h1>
      <div class="project-meta"><span class="category-tag">${project.category}</span></div>
    </div>
    <p class="detail-loading">Loading images\u2026</p>
  `;

  // Fetch 4 photos from the same search — consistent look for this project type
  const imgs = await fetchPhotos(project.detailQuery, 4);
  const [heroImg, ...restImgs] = imgs;

  detail.innerHTML = `
    <div class="project-detail-header">
      <h1>${project.name}</h1>
      <div class="project-meta"><span class="category-tag">${project.category}</span></div>
    </div>
    <img class="project-hero-img" src="${heroImg}" alt="${project.name}" />
    <p class="project-description">${project.description}</p>
    <div class="project-img-grid">
      ${restImgs.map(url => `<img src="${url}" alt="${project.name}" loading="lazy" />`).join('')}
    </div>
  `;
}

// ===== INIT =====
buildGallery();
