// API Handler for EarthView360
// This file handles data fetching from environmental APIs

document.addEventListener('DOMContentLoaded', function() {
    // Initialize API connections and data fetching
    initAPIConnections();
});

// Initialize API connections 
function initAPIConnections() {
    // In a production environment, this would connect to real environmental data APIs
    console.log('API connections initialized');
    
    // For demonstration purposes, we'll use simulated data
    // But in a real application, you would fetch data from actual environmental APIs
    
    // Example API endpoints that could be used in a production version:
    // NASA GISS Surface Temperature: https://data.giss.nasa.gov/gistemp/
    // NOAA Climate: https://www.ncdc.noaa.gov/cdo-web/webservices/v2
    // CO2 Data: https://scrippsco2.ucsd.edu/data/atmospheric_co2/primary_mlo_co2_record.html
    
    // Try to fetch some real data if APIs are available
    // This is just a demonstration of how you would structure API calls
    tryFetchRealData();
}

// Attempt to fetch some real data if available
async function tryFetchRealData() {
    try {
        // Example: Try to fetch NASA GISS temperature data
        // Note: This is a demonstration and may not work due to CORS or API limitations
        const tempResponse = await fetch('https://data.giss.nasa.gov/gistemp/tabledata_v4/GLB.Ts+dSST.csv');
        
        if (tempResponse.ok) {
            const tempData = await tempResponse.text();
            console.log('Successfully fetched temperature data');
            processTemperatureData(tempData);
        }
    } catch (error) {
        console.log('Using simulated data as real API fetch failed:', error.message);
        // Fall back to simulated data (already implemented in charts.js)
    }
    
    // Set up periodic data refresh (every 5 minutes)
    setInterval(refreshData, 5 * 60 * 1000);
}

// Process temperature data from NASA GISS
function processTemperatureData(csvData) {
    // This is a placeholder for processing real CSV data
    // In a real application, you would parse the CSV and update your charts/UI
    console.log('Processing temperature data...');
    
    // Example of how you might process CSV data
    // const lines = csvData.split('\n');
    // const headers = lines[0].split(',');
    // const dataPoints = [];
    
    // for (let i = 1; i < lines.length; i++) {
    //     const values = lines[i].split(',');
    //     // Process each line...
    // }
}

// Refresh data periodically
function refreshData() {
    console.log('Refreshing environmental data...');
    
    // In a real application, this would make new API calls
    // For this demo, we're using the updateCharts function from charts.js
    if (window.updateCharts) {
        window.updateCharts();
    }
    
    // Show a notification to the user
    const timestamp = new Date().toLocaleTimeString();
    flashMessage(`Data refreshed at ${timestamp}`);
}

// Fetch specific environmental data by type and region
async function fetchEnvironmentalData(dataType, region = 'global') {
    // This is a placeholder for a real API fetch function
    // In a production app, this would connect to actual environmental data sources
    
    console.log(`Fetching ${dataType} data for ${region}...`);
    
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return simulated data
    switch (dataType) {
        case 'temperature':
            return simulateTemperatureData(region);
        case 'co2':
            return simulateCO2Data(region);
        case 'sea-ice':
            return simulateSeaIceData(region);
        case 'drought':
            return simulateDroughtData(region);
        default:
            throw new Error(`Unknown data type: ${dataType}`);
    }
}

// Functions that generate simulated data (these would be replaced by real API calls)

function simulateTemperatureData(region) {
    // Regional temperature anomaly baseline (°C relative to pre-industrial)
    const regionalBaselines = {
        'global': 1.2,
        'north-america': 1.4,
        'south-america': 1.1,
        'europe': 1.8,
        'africa': 1.3,
        'asia': 1.5,
        'oceania': 1.0
    };
    
    const baseline = regionalBaselines[region] || regionalBaselines.global;
    
    // Add some random variation
    const variation = (Math.random() * 0.2 - 0.1).toFixed(2);
    
    return {
        value: parseFloat(baseline) + parseFloat(variation),
        unit: '°C',
        trend: 'rising',
        region: region
    };
}

function simulateCO2Data(region) {
    // CO2 is well-mixed in the atmosphere, so regional differences are minimal
    // but we can simulate slight variations
    
    const baseValue = 418; // ppm
    const regionalVariation = {
        'global': 0,
        'north-america': 2,
        'south-america': -1,
        'europe': 3,
        'africa': -2,
        'asia': 4,
        'oceania': -3
    };
    
    const variation = regionalVariation[region] || 0;
    
    // Add some random noise
    const noise = Math.floor(Math.random() * 3 - 1);
    
    return {
        value: baseValue + variation + noise,
        unit: 'ppm',
        trend: 'rising',
        region: region
    };
}

function simulateSeaIceData(region) {
    // Sea ice is primarily in polar regions, but we can simulate regional differences
    // based on different measurements or projections
    
    let baseValue = 4.3; // million km²
    
    // In the real world, we would use region-specific data sources
    // This is just a simulation
    switch (region) {
        case 'global':
            baseValue = 4.3;
            break;
        case 'north-america':
            baseValue = 5.1; // Higher due to Arctic influence
            break;
        case 'europe':
            baseValue = 4.8;
            break;
        case 'asia':
            baseValue = 4.5;
            break;
        default:
            baseValue = 4.3;
    }
    
    // Add seasonal component - more ice in winter months (Northern Hemisphere)
    const month = new Date().getMonth();
    const seasonal = month >= 9 || month <= 2 ? 2.0 : 0;
    
    // Add some random variation
    const variation = (Math.random() * 0.4 - 0.2).toFixed(1);
    
    return {
        value: parseFloat(baseValue) + seasonal + parseFloat(variation),
        unit: 'million km²',
        trend: 'declining',
        region: region
    };
}

function simulateDroughtData(region) {
    // Drought indices can vary significantly by region
    // 0-4 scale: 0 = none, 1 = abnormally dry, 2 = moderate, 3 = severe, 4 = extreme
    
    const regionalBaselines = {
        'global': 1.0,
        'north-america': 1.2,
        'south-america': 1.5,
        'europe': 0.8,
        'africa': 2.3,
        'asia': 1.7,
        'oceania': 2.0
    };
    
    const baseline = regionalBaselines[region] || regionalBaselines.global;
    
    // Add some random variation
    const variation = (Math.random() * 0.6 - 0.3).toFixed(2);
    
    // Calculate drought level
    const value = Math.max(0, Math.min(4, parseFloat(baseline) + parseFloat(variation)));
    
    // Get text representation
    const droughtLevels = ['None', 'Abnormally Dry', 'Moderate', 'Severe', 'Extreme'];
    const textLevel = droughtLevels[Math.floor(value)];
    
    return {
        value: value,
        textLevel: textLevel,
        trend: value > 1.5 ? 'worsening' : 'stable',
        region: region
    };
}

// Helper function to display flash messages
function flashMessage(message, duration = 3000) {
    // Check if flashMessage is defined in main.js
    if (window.flashMessage) {
        window.flashMessage(message, duration);
    } else {
        // Create a simple flash message if the main one isn't available
        console.log(`Message: ${message}`);
        
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
                background-color: #333;
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
}

// Make functions available globally
window.fetchEnvironmentalData = fetchEnvironmentalData;