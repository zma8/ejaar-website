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

// Observe property cards and team cards
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.property-card, .team-card, .feature-card');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
});

// Optional: Add Firebase integration when ready
// Uncomment and configure when you have Firebase credentials

/*
// Import Firebase (add this script tag in HTML first)
// <script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-app.js"></script>
// <script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-firestore.js"></script>

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Fetch properties from Firebase
async function fetchProperties() {
    try {
        const propertiesSnapshot = await db.collection('properties').get();
        const propertiesGrid = document.querySelector('.properties-grid');
        propertiesGrid.innerHTML = ''; // Clear existing properties
        
        propertiesSnapshot.forEach((doc) => {
            const property = doc.data();
            const propertyCard = createPropertyCard(property);
            propertiesGrid.appendChild(propertyCard);
        });
    } catch (error) {
        console.error('Error fetching properties:', error);
    }
}

// Create property card element
function createPropertyCard(property) {
    const card = document.createElement('div');
    card.className = 'property-card';
    
    card.innerHTML = `
        <div class="property-image">
            <div class="property-status ${property.status}">${property.status}</div>
            <img src="${property.image}" alt="${property.title}">
        </div>
        <div class="property-info">
            <h3 class="property-title">${property.title}</h3>
            <p class="property-location">📍 ${property.address}</p>
            <p class="property-description">${property.description}</p>
            <div class="property-details">
                <span class="detail-item">🛏️ ${property.bedrooms} Beds</span>
                <span class="detail-item">🚿 ${property.bathrooms} Baths</span>
                <span class="detail-item">📐 ${property.space} sqft</span>
            </div>
            <div class="property-price">BHD ${property.price}/month</div>
        </div>
    `;
    
    return card;
}

// Call fetchProperties when page loads
// fetchProperties();
*/

console.log('Ejaar website loaded successfully!');