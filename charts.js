// Charts handling for EarthView360
let mainChart = null;
let currentChartType = 'temperature';

document.addEventListener('DOMContentLoaded', function() {
    initCharts();
});

// Initialize the main chart
function initCharts() {
    const ctx = document.getElementById('main-chart');
    if (!ctx) return;
    
    // Create initial chart
    createTemperatureChart(ctx);
    
    // Make changeChartType function available globally
    window.changeChartType = changeChartType;
    window.updateCharts = updateCharts;
}

// Change chart type based on user selection
function changeChartType(chartType) {
    const ctx = document.getElementById('main-chart');
    if (!ctx) return;
    
    // Destroy previous chart if it exists
    if (mainChart) {
        mainChart.destroy();
    }
    
    currentChartType = chartType;
    
    // Create new chart based on selection
    switch(chartType) {
        case 'temperature':
            createTemperatureChart(ctx);
            break;
        case 'co2':
            createCO2Chart(ctx);
            break;
        case 'ice':
            createSeaIceChart(ctx);
            break;
        case 'drought':
            createDroughtChart(ctx);
            break;
        default:
            createTemperatureChart(ctx);
    }
}

// Update charts with new data (simulated)
function updateCharts() {
    if (!mainChart) return;
    
    // Add subtle random variations to last data point to simulate real-time updates
    const data = mainChart.data.datasets[0].data;
    const labels = mainChart.data.labels;
    
    if (data.length > 0) {
        const lastValue = data[data.length - 1];
        let variation = 0;
        
        switch(currentChartType) {
            case 'temperature':
                variation = Math.random() * 0.04 - 0.02;
                break;
            case 'co2':
                variation = Math.random() * 0.4 - 0.2;
                break;
            case 'ice':
                variation = Math.random() * 0.2 - 0.1;
                break;
            case 'drought':
                variation = Math.random() * 0.3 - 0.15;
                break;
            default:
                variation = 0;
        }
        
        // Update the last value with a small variation
        data[data.length - 1] = parseFloat((lastValue + variation).toFixed(2));
        
        // Update chart
        mainChart.update();
    }
}

// Create Temperature chart
function createTemperatureChart(ctx) {
    // Generate monthly data for the last 5 years
    const labels = generateMonthlyLabels(60); // 5 years * 12 months
    
    // Generate temperature anomaly data (simplified model based on real trends)
    const baseAnomaly = 0.8; // starting anomaly in °C
    const annualIncrease = 0.02; // yearly increase in °C
    const seasonalVariation = 0.2; // seasonal variation amplitude in °C
    
    const data = labels.map((label, index) => {
        const yearFraction = index / 12;
        const monthInYear = index % 12;
        // Seasonal component (northern hemisphere pattern)
        const seasonal = seasonalVariation * Math.sin((monthInYear - 2) * Math.PI / 6);
        // Trend component
        const trend = baseAnomaly + yearFraction * annualIncrease;
        // Add some noise
        const noise = (Math.random() - 0.5) * 0.1;
        
        return parseFloat((trend + seasonal + noise).toFixed(2));
    });
    
    mainChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature Anomaly (°C)',
                data: data,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 0,
                pointHitRadius: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Temperature Anomaly (°C)'
                    },
                    grid: {
                        color: 'rgba(200, 200, 200, 0.2)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    },
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxTicksLimit: 12,
                        callback: function(val, index) {
                            // Show only January of each year
                            const label = this.getLabelForValue(val);
                            return label.endsWith('Jan') ? label : '';
                        }
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Global Temperature Anomaly (Past 5 Years)',
                    font: {
                        size: 16
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Anomaly: ${context.parsed.y}°C`;
                        }
                    }
                }
            }
        }
    });
}

// Create CO2 chart
function createCO2Chart(ctx) {
    // Generate monthly data for the last 5 years
    const labels = generateMonthlyLabels(60); // 5 years * 12 months
    
    // Generate CO2 data (simplified model based on real trends)
    const baseCO2 = 410; // starting CO2 in ppm (around 2019 levels)
    const annualIncrease = 2.5; // yearly increase in ppm
    const seasonalVariation = 5; // seasonal variation amplitude in ppm
    
    const data = labels.map((label, index) => {
        const yearFraction = index / 12;
        const monthInYear = index % 12;
        // Seasonal component (northern hemisphere pattern - lower in summer)
        const seasonal = seasonalVariation * Math.sin((monthInYear - 7) * Math.PI / 6);
        // Trend component
        const trend = baseCO2 + yearFraction * annualIncrease;
        // Add some noise
        const noise = (Math.random() - 0.5) * 0.3;
        
        return parseFloat((trend + seasonal + noise).toFixed(1));
    });
    
    mainChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'CO₂ Concentration (ppm)',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 0,
                pointHitRadius: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'CO₂ Concentration (ppm)'
                    },
                    grid: {
                        color: 'rgba(200, 200, 200, 0.2)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    },
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxTicksLimit: 12,
                        callback: function(val, index) {
                            // Show only January of each year
                            const label = this.getLabelForValue(val);
                            return label.endsWith('Jan') ? label : '';
                        }
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Atmospheric CO₂ Concentration (Past 5 Years)',
                    font: {
                        size: 16
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `CO₂: ${context.parsed.y} ppm`;
                        }
                    }
                }
            }
        }
    });
}

// Create Sea Ice chart
function createSeaIceChart(ctx) {
    // Generate monthly data for the last 5 years
    const labels = generateMonthlyLabels(60); // 5 years * 12 months
    
    // Generate sea ice data (simplified model based on real trends)
    const baseIce = 5.5; // starting ice extent in million sq km
    const annualDecrease = 0.1; // yearly decrease in million sq km
    const seasonalVariation = 4.5; // seasonal variation amplitude in million sq km
    
    const data = labels.map((label, index) => {
        const yearFraction = index / 12;
        const monthInYear = index % 12;
        // Seasonal component (arctic pattern - more ice in winter)
        const seasonal = seasonalVariation * Math.cos(monthInYear * Math.PI / 6);
        // Trend component
        const trend = baseIce - yearFraction * annualDecrease;
        // Add some noise
        const noise = (Math.random() - 0.5) * 0.2;
        
        return Math.max(0, parseFloat((trend + seasonal + noise).toFixed(1)));
    });
    
    mainChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Arctic Sea Ice Extent (million km²)',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 0,
                pointHitRadius: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Sea Ice Extent (million km²)'
                    },
                    grid: {
                        color: 'rgba(200, 200, 200, 0.2)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    },
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxTicksLimit: 12,
                        callback: function(val, index) {
                            // Show only January of each year
                            const label = this.getLabelForValue(val);
                            return label.endsWith('Jan') ? label : '';
                        }
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Arctic Sea Ice Extent (Past 5 Years)',
                    font: {
                        size: 16
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Ice Extent: ${context.parsed.y} million km²`;
                        }
                    }
                }
            }
        }
    });
}

// Create Drought chart
function createDroughtChart(ctx) {
    // Generate monthly data for the last 5 years
    const labels = generateMonthlyLabels(60); // 5 years * 12 months
    
    // Generate drought index data (simplified model)
    // Higher values indicate more severe drought conditions
    const baseDrought = 1.0; // starting drought index
    const annualIncrease = 0.05; // yearly increase in drought severity
    const seasonalVariation = 0.5; // seasonal variation amplitude
    
    const data = labels.map((label, index) => {
        const yearFraction = index / 12;
        const monthInYear = index % 12;
        // Seasonal component (more drought in summer months)
        const seasonal = seasonalVariation * Math.sin((monthInYear - 1) * Math.PI / 6);
        // Trend component
        const trend = baseDrought + yearFraction * annualIncrease;
        // Add some noise
        const noise = (Math.random() - 0.5) * 0.2;
        
        return parseFloat((trend + seasonal + noise).toFixed(2));
    });
    
    mainChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Global Drought Index',
                data: data,
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 0,
                pointHitRadius: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Drought Index (0-4)'
                    },
                    grid: {
                        color: 'rgba(200, 200, 200, 0.2)'
                    },
                    ticks: {
                        callback: function(value) {
                            const labels = ['None', 'Abnormally Dry', 'Moderate', 'Severe', 'Extreme'];
                            if (value >= 0 && value <= 4) {
                                return `${value.toFixed(1)} - ${labels[Math.floor(value)]}`;
                            }
                            return value;
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    },
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxTicksLimit: 12,
                        callback: function(val, index) {
                            // Show only January of each year
                            const label = this.getLabelForValue(val);
                            return label.endsWith('Jan') ? label : '';
                        }
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Global Drought Index (Past 5 Years)',
                    font: {
                        size: 16
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.y;
                            const labels = ['None', 'Abnormally Dry', 'Moderate', 'Severe', 'Extreme'];
                            const severity = labels[Math.min(Math.floor(value), 4)];
                            return `Drought Index: ${value.toFixed(2)} (${severity})`;
                        }
                    }
                }
            }
        }
    });
}

// Helper function to generate monthly labels for past years
function generateMonthlyLabels(numMonths) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const today = new Date();
    
    const labels = [];
    for (let i = numMonths - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setMonth(today.getMonth() - i);
        const year = date.getFullYear();
        const month = months[date.getMonth()];
        labels.push(`${year} ${month}`);
    }
    
    return labels;
}