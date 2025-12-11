// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetSection.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Update active nav link
            updateActiveNavLink(targetId);
        }
    });
});

// Update active navigation link based on scroll position
function updateActiveNavLink(targetId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
}

// Highlight active section while scrolling
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const navHeight = document.querySelector('.navbar').offsetHeight;
        
        if (window.pageYOffset >= (sectionTop - navHeight - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
    
    // Add shadow to navbar on scroll
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Add fade-in animation to elements when they come into view
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Create property card element from Firebase data
function createPropertyCard(property) {
    const card = document.createElement('div');
    card.className = 'property-card';
    
    // Determine status - default to available since you don't have status field yet
    const status = property.status || 'available';
    const statusText = status === 'booked' ? 'Booked' : 'Available';
    
    // Get image from your Firebase structure
    // Try: images array first, then img field, then placeholder
    let imageUrl = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800';
    if (property.images && property.images.length > 0) {
        imageUrl = property.images[0];
    } else if (property.img) {
        imageUrl = property.img;
    }
    
    // Use your exact field names from Firebase
    const title = property.propertyTitle || 'Property';
    const location = property.location || 'Bahrain';
    const description = property.description || 'Beautiful property available for rent.';
    const bedrooms = property.bedrooms || 'N/A';
    const baths = property.baths || 'N/A';
    const space = property.space || 'N/A';
    const price = property.price || 'N/A';
    
    card.innerHTML = `
        <div class="property-image">
            <div class="property-status ${status}">${statusText}</div>
            <img src="${imageUrl}" alt="${title}" onerror="this.src='https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'">
        </div>
        <div class="property-info">
            <h3 class="property-title">${title}</h3>
            <p class="property-location">📍 ${location}</p>
            <p class="property-description">${description}</p>
            <div class="property-details">
                <span class="detail-item">🛏️ ${bedrooms} Beds</span>
                <span class="detail-item">🚿 ${baths} Baths</span>
                <span class="detail-item">📐 ${space} sqft</span>
            </div>
            <div class="property-price">BHD ${price}/month</div>
        </div>
    `;
    
    // Add animation
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    
    return card;
}

// Fetch properties from Firebase
async function fetchProperties() {
    const propertiesGrid = document.getElementById('properties-grid');
    const loading = document.getElementById('loading');
    const noProperties = document.getElementById('no-properties');
    
    try {
        console.log('Fetching properties from Firebase...');
        
        // Try different collection names - adjust based on your Firebase structure
        const collectionNames = ['properties', 'Properties', 'listings', 'Listings'];
        let propertiesSnapshot = null;
        
        for (const collectionName of collectionNames) {
            try {
                const snapshot = await db.collection(collectionName).get();
                if (!snapshot.empty) {
                    propertiesSnapshot = snapshot;
                    console.log(`Found ${snapshot.size} properties in collection: ${collectionName}`);
                    break;
                }
            } catch (err) {
                console.log(`Collection ${collectionName} not found, trying next...`);
            }
        }
        
        // Hide loading
        loading.style.display = 'none';
        
        if (!propertiesSnapshot || propertiesSnapshot.empty) {
            console.log('No properties found in Firebase. Showing sample data...');
            loadSampleProperties();
            return;
        }
        
        // Clear existing properties
        propertiesGrid.innerHTML = '';
        
        // Add each property
        propertiesSnapshot.forEach((doc, index) => {
            const property = { id: doc.id, ...doc.data() };
            console.log('Property:', property);
            
            const propertyCard = createPropertyCard(property);
            propertiesGrid.appendChild(propertyCard);
            
            // Animate cards
            setTimeout(() => {
                observer.observe(propertyCard);
            }, index * 100);
        });
        
        console.log('Properties loaded successfully!');
        
    } catch (error) {
        console.error('Error fetching properties:', error);
        loading.style.display = 'none';
        
        // Show sample properties on error
        console.log('Loading sample properties...');
        loadSampleProperties();
    }
}

// Load sample properties (fallback)
function loadSampleProperties() {
    const propertiesGrid = document.getElementById('properties-grid');
    const loading = document.getElementById('loading');
    
    loading.style.display = 'none';
    propertiesGrid.innerHTML = '';
    
    const sampleProperties = [
        {
            title: "Modern Apartment in Seef",
            address: "Seef District, Manama",
            description: "Luxurious 2-bedroom apartment with stunning city views and modern amenities.",
            bedrooms: 2,
            bathrooms: 2,
            space: 1200,
            price: 450,
            status: "available",
            image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"
        },
        {
            title: "Spacious Family Villa",
            address: "Saar, Bahrain",
            description: "Beautiful 4-bedroom villa with private garden and parking space.",
            bedrooms: 4,
            bathrooms: 3,
            space: 2500,
            price: 800,
            status: "booked",
            image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
        },
        {
            title: "Cozy Studio Apartment",
            address: "Juffair, Manama",
            description: "Perfect for singles or couples, fully furnished with all utilities included.",
            bedrooms: 1,
            bathrooms: 1,
            space: 600,
            price: 300,
            status: "available",
            image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"
        },
        {
            title: "Luxury Penthouse",
            address: "Amwaj Islands",
            description: "Exclusive penthouse with breathtaking sea views and premium facilities.",
            bedrooms: 3,
            bathrooms: 3,
            space: 1800,
            price: 950,
            status: "available",
            image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"
        },
        {
            title: "Modern Townhouse",
            address: "Riffa Views",
            description: "Contemporary 3-bedroom townhouse in a gated community with pool access.",
            bedrooms: 3,
            bathrooms: 2,
            space: 1600,
            price: 650,
            status: "booked",
            image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800"
        },
        {
            title: "Executive Apartment",
            address: "Diplomatic Area, Manama",
            description: "High-end 2-bedroom apartment ideal for professionals and executives.",
            bedrooms: 2,
            bathrooms: 2,
            space: 1100,
            price: 550,
            status: "available",
            image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"
        }
    ];
    
    sampleProperties.forEach((property, index) => {
        const propertyCard = createPropertyCard(property);
        propertiesGrid.appendChild(propertyCard);
        
        setTimeout(() => {
            observer.observe(propertyCard);
        }, index * 100);
    });
    
    console.log('Sample properties loaded');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Ejaar website loaded!');
    
    // Fetch properties from Firebase
    fetchProperties();
    
    // Observe feature cards and team cards for animation
    const cards = document.querySelectorAll('.team-card, .feature-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
});