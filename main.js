// Main JavaScript file for EarthView360

document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile navigation
    initMobileNav();
    
    // Initialize placeholder data (for demo purposes)
    initPlaceholderData();
    
    // Initialize event listeners
    initEventListeners();
});

// Mobile Navigation
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
        
        // Close menu when clicking a nav link
        const navItems = navLinks.querySelectorAll('a');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
}

// Initialize placeholder data for demonstration
function initPlaceholderData() {
    // Update snapshot cards with animated counters
    animateValue('global-temp', 0, 1.2, 2000); // From 0 to 1.2°C
    animateValue('co2-level', 280, 418, 2000); // From pre-industrial 280 to current 418 ppm
    
    // Simulate data updates every 30 seconds
    setInterval(() => {
        // Generate slight random variations to simulate real-time updates
        const tempVariation = (Math.random() * 0.1 - 0.05).toFixed(2);
        const co2Variation = Math.floor(Math.random() * 3 - 1);
        
        document.getElementById('global-temp').innerText = `+${(1.2 + parseFloat(tempVariation)).toFixed(2)}°C`;
        document.getElementById('co2-level').innerText = `${418 + co2Variation} ppm`;
        
        // Random sea ice extent (simplified for demo)
        const month = new Date().getMonth();
        // Seasonal variation (more ice in winter)
        const seasonalComponent = month >= 9 || month <= 2 ? 2 : 0;
        const iceValue = (4.3 + seasonalComponent + (Math.random() * 0.4 - 0.2)).toFixed(1);
        document.getElementById('sea-ice').innerText = `${iceValue}M km²`;
        
        // Random drought index
        const droughtValues = ['Low', 'Moderate', 'High', 'Severe'];
        const randomDrought = droughtValues[Math.floor(Math.random() * droughtValues.length)];
        document.getElementById('drought-index').innerText = randomDrought;
        
        // Update charts if they exist
        if (window.updateCharts) {
            window.updateCharts();
        }
    }, 30000);
}

// Initialize event listeners
function initEventListeners() {
    // Chart type selector
    const chartTypeSelector = document.getElementById('chart-type');
    if (chartTypeSelector) {
        chartTypeSelector.addEventListener('change', function() {
            if (window.changeChartType) {
                window.changeChartType(this.value);
            }
        });
    }
    
    // Region selector
    const regionSelector = document.getElementById('region');
    if (regionSelector) {
        regionSelector.addEventListener('change', function() {
            // In a real application, this would update the map data
            console.log(`Region changed to: ${this.value}`);
            flashMessage(`Loading data for ${this.options[this.selectedIndex].text}...`);
        });
    }
}

// Animated counter for number values
function animateValue(id, start, end, duration) {
    const element = document.getElementById(id);
    if (!element) return;
    
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = progress * (end - start) + start;
        
        if (id === 'global-temp') {
            element.innerText = `+${value.toFixed(1)}°C`;
        } else if (id === 'co2-level') {
            element.innerText = `${Math.floor(value)} ppm`;
        } else {
            element.innerText = value.toFixed(1);
        }
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    
    window.requestAnimationFrame(step);
}

// Display temporary flash message
function flashMessage(message, duration = 3000) {
    // Create flash message element if it doesn't exist
    let flashContainer = document.getElementById('flash-container');
    
    if (!flashContainer) {
        flashContainer = document.createElement('div');
        flashContainer.id = 'flash-container';
        flashContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: var(--dark-color);
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(flashContainer);
    }
    
    // Set message and show
    flashContainer.textContent = message;
    flashContainer.style.opacity = '1';
    
    // Hide after duration
    setTimeout(() => {
        flashContainer.style.opacity = '0';
    }, duration);
}