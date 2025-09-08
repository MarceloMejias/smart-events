// Main Application Entry Point
import { EVENTS, EVENT_CONFIG } from './data/events.js';
import { EventManager } from './data/EventManager.js';
import { ComponentLoader } from './utils/ComponentLoader.js';
import { SimpleModal } from './components/SimpleModal.js';
import { EventCountdown } from './components/EventCountdown.js';
import { EventsListing } from './components/EventsListing.js';
import { CommunityComments } from './components/CommunityComments.js';

// Application Initialization
class SmartEventsApp {
    constructor() {
        this.componentLoader = new ComponentLoader();
    }

    async init() {
        console.log('📅 Smart Events App iniciando...');
        
        try {
            // Load UI components first
            await this.loadComponents();
            
            // Initialize page-specific functionality
            this.initializePageFeatures();
            
            console.log('✅ Smart Events App cargado correctamente');
        } catch (error) {
            console.error('❌ Error inicializando Smart Events App:', error);
        }
    }

    async loadComponents() {
        await this.componentLoader.loadMultipleComponents([
            { elementId: 'navbar-placeholder', componentPath: 'static/components/navbar.html' },
            { elementId: 'footer-placeholder', componentPath: 'static/components/footer.html' }
        ]);
    }

    initializePageFeatures() {
        // Initialize countdown on index page
        if (document.getElementById('days')) {
            window.eventCountdown = new EventCountdown();
        }
        
        // Initialize events listing on events page
        if (document.getElementById('events-container')) {
            EventsListing.init();
        }
        
        // Initialize community comments on community page
        if (document.getElementById('comments-container')) {
            window.communityComments = new CommunityComments();
        }
    }
}

// Global Exports (for backward compatibility with onclick handlers)
window.EVENTS = EVENTS;
window.EVENT_CONFIG = EVENT_CONFIG;
window.EventManager = EventManager;
window.ComponentLoader = ComponentLoader;
window.SimpleModal = SimpleModal;
window.EventsListing = EventsListing;
window.CommunityComments = CommunityComments;

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    const app = new SmartEventsApp();
    app.init();
});

// Add minimal CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    @keyframes celebration {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
    }
`;
document.head.appendChild(style);
