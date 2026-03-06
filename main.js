// Sticky Header Logic
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Universal Sidebar Category Accordion
document.addEventListener('DOMContentLoaded', () => {
    const sidebarTitle = document.querySelector('.sidebar-title');
    const sidebar = document.querySelector('.sidebar');
    const activeLink = document.querySelector('.category-list a.active');

    if (sidebarTitle && sidebar) {
        // Find the active category name robustly
        // 1. Try breadcrumbs span (static pages)
        // 2. Try #breadcrumb-category (dynamic products page)
        // 3. Fallback to .hero-title
        const breadcrumb = document.querySelector('.breadcrumbs span') ||
            document.getElementById('breadcrumb-category');
        const heroTitle = document.querySelector('.hero-title');

        const currentCategory = breadcrumb ? breadcrumb.textContent :
            (heroTitle ? heroTitle.textContent : '');

        if (currentCategory && currentCategory.toLowerCase() !== 'home') {
            sidebarTitle.textContent = currentCategory;
        }

        sidebarTitle.addEventListener('click', () => {
            sidebar.classList.toggle('sidebar-open');
        });
    }
});


// Scroll Reveal Animations
ScrollReveal().reveal('.hero-content', {
    delay: 200,
    distance: '50px',
    origin: 'bottom',
    duration: 1000
});

ScrollReveal().reveal('.about-text', {
    delay: 300,
    distance: '50px',
    origin: 'right',
    duration: 1000
});

ScrollReveal().reveal('.about-image', {
    delay: 300,
    distance: '50px',
    origin: 'left',
    duration: 1000
});

ScrollReveal().reveal('.product-card', {
    delay: 200,
    interval: 100,
    distance: '30px',
    origin: 'bottom',
    duration: 800
});

ScrollReveal().reveal('.founder-card', {
    delay: 300,
    scale: 0.9,
    duration: 1200
});

// Dynamic Product Loading Logic
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const categoryId = params.get('category');

    // Check if we are on the products.html page
    if (document.getElementById('product-grid')) {
        if (categoryId && PRODUCT_DATA[categoryId]) {
            renderCategory(categoryId);
        } else {
            // Default to pulses-millets if no category or invalid category
            renderCategory('pulses-millets');
        }
    }
});

// Product Search Logic
function initSearch() {
    const searchInput = document.getElementById('product-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        const productGrid = document.getElementById('product-grid');
        if (productGrid && typeof PRODUCT_DATA !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const categoryId = params.get('category') || 'pulses-millets';
            const data = PRODUCT_DATA[categoryId];

            if (data) {
                const filtered = data.products.filter(p =>
                    p.name.toLowerCase().includes(query)
                );
                renderCategory(categoryId, filtered);
            }
        } else {
            // Static Page Filtering
            const cards = document.querySelectorAll('.cat-prod-card');
            cards.forEach(card => {
                const name = card.querySelector('h4').textContent.toLowerCase();
                if (name.includes(query)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }
    });
}

// Initialize search on load
document.addEventListener('DOMContentLoaded', initSearch);

function renderCategory(id, items = null) {
    const data = PRODUCT_DATA[id];
    const grid = document.getElementById('product-grid');
    const pageTitle = document.getElementById('page-title');
    const breadcrumb = document.getElementById('breadcrumb-category');

    if (!data || !grid) return;

    // Update Labels & Sidebar
    if (pageTitle) pageTitle.textContent = data.title;
    if (breadcrumb) breadcrumb.textContent = data.title;
    document.title = `${data.title} | Malayil Food Park`;

    const sidebarTitle = document.querySelector('.sidebar-title');
    const sidebar = document.querySelector('.sidebar');
    if (sidebarTitle) sidebarTitle.textContent = data.title;
    // Don't close sidebar here if we're searching, as it might be annoying
    // But we need to close it when a category is actually clicked.
    // Let's keep the close logic only for direct category clicks if possible.

    // Update Active Sidebar Link
    document.querySelectorAll('.category-list a').forEach(link => {
        if (link.getAttribute('data-cat') === id) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Use items if provided (for search), otherwise use full data
    const productsToRender = items || data.products;

    if (productsToRender.length === 0) {
        grid.innerHTML = `<div class="text-center py-5 w-100"><p class="text-gray">No products found matching your search.</p></div>`;
        return;
    }

    // Render Products
    grid.innerHTML = productsToRender.map((product, index) => {
        const isVideo = product.image.toLowerCase().endsWith('.mp4') || product.image.toLowerCase().endsWith('.webm');
        const mediaTag = isVideo
            ? `<video src="${product.image}" autoplay muted loop playsinline class="product-img"></video>`
            : `<img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">`;

        return `
            <div class="product-card" style="visibility: hidden;">
                <div class="product-img-wrapper">
                    ${mediaTag}
                </div>
                    <div class="cat-prod-details">
                    <h4 class="product-name">${product.name}</h4>
                    <p class="product-availability">Availability : <span>${product.availability}</span></p>
                </div>
            </div>
        `;
    }).join('');

    // Re-trigger ScrollReveal for new elements
    ScrollReveal().reveal('.product-card', {
        delay: 100,
        interval: 50,
        distance: '20px',
        origin: 'bottom',
        duration: 600
    });
}
