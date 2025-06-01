let currentFilter = 'all';
let filteredSites = [...sitesData];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    renderSites(sitesData);
    updateResultsCount(sitesData.length);
});

// Render site cards
function renderSites(sites) {
    const sitesGrid = document.getElementById('sitesGrid');
    
    if (sites.length === 0) {
        sitesGrid.innerHTML = `
            <div class="empty-state">
                <h3>No sites found</h3>
                <p>Try adjusting your search criteria or filters</p>
            </div>
        `;
        return;
    }
    
    sitesGrid.innerHTML = sites.map(site => `
        <div class="site-card" onclick="openSiteDetails(${site.id})">
            <img src="${site.image}" alt="${site.name}" class="site-image" 
                 onerror="this.style.background='#f3f4f6'; this.style.display='block';">
            
            <div class="site-content">
                <div class="site-header">
                    <div>
                        <h4 class="site-name">${site.name}</h4>
                        <p class="site-location">${site.location}</p>
                    </div>
                    <div class="site-price">$${site.pricePerDay}/day</div>
                </div>
                
                <div class="industry-badge industry-${site.industry}">
                    ${getIndustryName(site.industry)}
                </div>
                
                <p class="site-description">${site.description}</p>
                
                <div class="site-services">
                    ${site.services.slice(0, 3).map(service => 
                        `<span class="service-tag">${service}</span>`
                    ).join('')}
                    ${site.services.length > 3 ? `<span class="service-tag">+${site.services.length - 3} more</span>` : ''}
                </div>
                
                <div class="site-rating">
                    <span class="star">★</span>
                    <span>${site.rating}</span>
                    <span>(${site.reviews} reviews)</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter sites by industry
function filterBy(industry) {
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    currentFilter = industry;
    
    if (industry === 'all') {
        filteredSites = [...sitesData];
    } else {
        filteredSites = sitesData.filter(site => site.industry === industry);
    }
    
    renderSites(filteredSites);
    updateResultsCount(filteredSites.length);
}

// Search functionality
function searchSites() {
    const location = document.getElementById('location').value.toLowerCase();
    const industry = document.getElementById('industry').value;
    const duration = document.getElementById('duration').value.toLowerCase();
    
    let results = [...sitesData];
    
    // Filter by location
    if (location.trim()) {
        results = results.filter(site => 
            site.location.toLowerCase().includes(location) ||
            site.name.toLowerCase().includes(location)
        );
    }
    
    // Filter by industry
    if (industry) {
        results = results.filter(site => site.industry === industry);
        
        // Update filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        const filterBtn = Array.from(document.querySelectorAll('.filter-btn'))
            .find(btn => btn.textContent.toLowerCase().includes(industry.toLowerCase()));
        if (filterBtn) filterBtn.classList.add('active');
        
        currentFilter = industry;
    }
    
    // Filter by services if duration contains specific terms
    if (duration.includes('24/7') || duration.includes('24')) {
        results = results.filter(site => 
            site.features.some(feature => feature.includes('24/7')) ||
            site.services.some(service => service.includes('24'))
        );
    }
    
    filteredSites = results;
    renderSites(results);
    updateResultsCount(results.length);
}

// Update results count
function updateResultsCount(count) {
    const resultsCount = document.getElementById('resultsCount');
    resultsCount.textContent = `${count} sites available`;
}

// Get industry display name
function getIndustryName(industry) {
    const industryNames = {
        'agtech': 'AgTech',
        'mobility': 'Mobility',
        'robotics': 'Robotics',
        'climate': 'Climate Tech'
    };
    return industryNames[industry] || industry;
}

// Open site details modal
function openSiteDetails(siteId) {
    const site = sitesData.find(s => s.id === siteId);
    if (!site) return;
    
    // Populate modal content
    document.getElementById('modalTitle').textContent = site.name;
    document.getElementById('modalImage').src = site.image;
    document.getElementById('modalImage').alt = site.name;
    
    document.querySelector('.modal-price').textContent = `$${site.pricePerDay}/day`;
    document.querySelector('.modal-location').textContent = site.location;
    
    document.querySelector('.modal-industry').innerHTML = 
        `<span class="industry-badge industry-${site.industry}">${getIndustryName(site.industry)}</span>`;
    
    document.querySelector('.modal-rating').innerHTML = `
        <span class="star">★</span>
        <span>${site.rating}</span>
        <span>(${site.reviews} reviews)</span>
    `;
    
    document.querySelector('.modal-description').textContent = site.description;
    
    // Populate services
    document.getElementById('modalServices').innerHTML = site.services
        .map(service => `<div class="service-item">${service}</div>`)
        .join('');
    
    // Populate features
    document.getElementById('modalFeatures').innerHTML = site.features
        .map(feature => `<div class="feature-item">${feature}</div>`)
        .join('');
    
    // Show modal
    document.getElementById('siteModal').style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Close site details modal
function closeSiteModal() {
    document.getElementById('siteModal').style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Close modal when clicking outside of it
window.addEventListener('click', function(event) {
    const modal = document.getElementById('siteModal');
    if (event.target === modal) {
        closeSiteModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeSiteModal();
    }
});

// Enhanced search with Enter key support
document.getElementById('location').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchSites();
    }
});

document.getElementById('duration').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchSites();
    }
});

// Auto-search when industry dropdown changes
document.getElementById('industry').addEventListener('change', function() {
    searchSites();
});

// Price range filtering (future enhancement)
function filterByPriceRange(min, max) {
    filteredSites = sitesData.filter(site => 
        site.pricePerDay >= min && site.pricePerDay <= max
    );
    renderSites(filteredSites);
    updateResultsCount(filteredSites.length);
}

// Sort functionality
function sortSites(criteria) {
    let sorted = [...filteredSites];
    
    switch(criteria) {
        case 'price-low':
            sorted.sort((a, b) => a.pricePerDay - b.pricePerDay);
            break;
        case 'price-high':
            sorted.sort((a, b) => b.pricePerDay - a.pricePerDay);
            break;
        case 'rating':
            sorted.sort((a, b) => b.rating - a.rating);
            break;
        case 'reviews':
            sorted.sort((a, b) => b.reviews - a.reviews);
            break;
        default:
            // Default sort by name
            sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    renderSites(sorted);
}