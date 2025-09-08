// Event Countdown Component
import { EventManager } from '../data/EventManager.js';
import { EVENT_CONFIG } from '../data/events.js';

class EventCountdown {
    constructor(config = {}) {
        const nextEvent = EventManager.getNextEvent();
        const featuredEvent = EventManager.getFeaturedEvent();
        const selectedEvent = nextEvent || featuredEvent;
        
        if (!selectedEvent) {
            console.warn('No se encontró ningún evento próximo o destacado');
            this.showNoEventMessage();
            return;
        }

        this.config = {
            eventDate: selectedEvent.date,
            eventTitle: selectedEvent.title,
            eventDescription: selectedEvent.description,
            eventLocation: selectedEvent.location,
            eventCapacity: selectedEvent.capacity,
            eventImage: selectedEvent.image,
            eventId: selectedEvent.id,
            ...config
        };
        
        this.countdownInterval = null;
        this.eventStarted = false;
        this.currentEvent = selectedEvent;
        
        if (typeof moment !== 'undefined') {
            moment.locale('es');
        }
        
        this.init();
    }
    
    init() {
        this.updateEventDetails();
        this.updateBackgroundImage();
        this.startCountdown();
        this.bindEvents();
    }
    
    updateBackgroundImage() {
        const heroBackground = document.getElementById('hero-background');
        if (heroBackground && this.config.eventImage) {
            heroBackground.style.backgroundImage = `url('${this.config.eventImage}')`;
        }
    }
    
    showNoEventMessage() {
        const heroSection = document.querySelector('.bg-primary');
        if (heroSection) {
            heroSection.innerHTML = `
                <div class="container">
                    <div class="row justify-content-center text-center py-5">
                        <div class="col-md-8">
                            <i class="fas fa-calendar-times display-1 text-warning mb-4"></i>
                            <h1 class="display-4 fw-bold mb-4">No hay eventos próximos</h1>
                            <p class="lead mb-4">
                                Actualmente no tenemos eventos programados. 
                                ¡Mantente atento a nuestras próximas convocatorias!
                            </p>
                            <button class="btn btn-primary btn-lg me-3">
                                <i class="fas fa-bell me-2"></i>Notificarme
                            </button>
                            <button class="btn btn-outline-light btn-lg">
                                <i class="fas fa-calendar-plus me-2"></i>Proponer evento
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    }
    
    updateEventDetails() {
        this.safeUpdateContent('event-title', this.config.eventTitle);
        this.safeUpdateContent('event-description', this.config.eventDescription);
        
        if (typeof moment !== 'undefined') {
            this.safeUpdateContent('event-date', moment(this.config.eventDate).format('DD [de] MMMM, YYYY'));
        }
        
        this.safeUpdateContent('event-location', this.config.eventLocation);
        this.safeUpdateContent('event-capacity', this.config.eventCapacity);
    }
    
    safeUpdateContent(elementId, content) {
        const element = document.getElementById(elementId);
        if (element && content) {
            element.textContent = content;
        }
    }
    
    startCountdown() {
        this.updateCountdown();
        this.countdownInterval = setInterval(() => {
            this.updateCountdown();
        }, 1000);
    }
    
    updateCountdown() {
        const now = new Date();
        const eventDate = new Date(this.config.eventDate);
        const diff = eventDate.getTime() - now.getTime();
        
        if (diff <= 0) {
            this.handleEventStarted();
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        this.updateCountdownElement('days', days);
        this.updateCountdownElement('hours', hours);
        this.updateCountdownElement('minutes', minutes);
        this.updateCountdownElement('seconds', seconds);
        
        if (seconds !== this.lastSeconds) {
            this.animateCountdownItem('seconds');
            this.lastSeconds = seconds;
        }
    }
    
    updateCountdownElement(elementId, value) {
        const element = document.getElementById(elementId);
        const formattedValue = value.toString().padStart(2, '0');
        
        if (element && element.textContent !== formattedValue) {
            element.textContent = formattedValue;
        }
    }
    
    animateCountdownItem(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            const item = element.parentElement;
            item.style.animation = 'none';
            item.offsetHeight;
            item.style.animation = 'pulse 0.3s ease-in-out';
            
            setTimeout(() => {
                item.style.animation = '';
            }, 300);
        }
    }
    
    handleEventStarted() {
        if (!this.eventStarted) {
            this.eventStarted = true;
            clearInterval(this.countdownInterval);
            
            const countdown = document.getElementById('countdown');
            const eventStarted = document.getElementById('event-started');
            
            if (countdown) countdown.classList.add('d-none');
            if (eventStarted) eventStarted.classList.remove('d-none');
            
            console.log('🎉 ¡El evento ha comenzado!');
        }
    }
    
    bindEvents() {
        const viewDetailsBtn = document.getElementById('view-details-btn');
        const registerBtn = document.getElementById('register-btn');
        
        if (viewDetailsBtn) {
            viewDetailsBtn.addEventListener('click', () => {
                console.log('Mostrando detalles del evento...');
                this.showEventDetails();
            });
        }
        
        if (registerBtn) {
            registerBtn.addEventListener('click', () => {
                console.log('Abriendo formulario de registro...');
                this.showRegistrationForm();
            });
        }
    }
    
    showEventDetails() {
        const content = `
            <img src="${this.config.eventImage}" class="img-fluid rounded mb-3" alt="${this.config.eventTitle}">
            <p class="card-text">${this.config.eventDescription}</p>
            <hr>
            <div class="row g-3">
                <div class="col-md-6">
                    <div class="d-flex align-items-center mb-2">
                        <i class="fas fa-calendar me-2 text-primary"></i>
                        <small><strong>Fecha:</strong> ${typeof moment !== 'undefined' ? moment(this.config.eventDate).format('DD [de] MMMM, YYYY') : new Date(this.config.eventDate).toLocaleDateString('es-ES')}</small>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="d-flex align-items-center mb-2">
                        <i class="fas fa-map-marker-alt me-2 text-primary"></i>
                        <small><strong>Ubicación:</strong> ${this.config.eventLocation}</small>
                    </div>
                </div>
                <div class="col-12">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-users me-2 text-primary"></i>
                        <small><strong>Capacidad:</strong> ${this.config.eventCapacity}</small>
                    </div>
                </div>
            </div>
        `;

        const buttons = [
            { text: 'Cerrar', class: 'btn-secondary', onclick: `SimpleModal.close('eventDetailsModal')` },
            { text: 'Registrarse', class: 'btn-primary', onclick: `SimpleModal.close('eventDetailsModal'); window.eventCountdown.showRegistrationForm()` }
        ];

        SimpleModal.createWithBorder('eventDetailsModal', this.config.eventTitle, content, buttons, 'primary');
        SimpleModal.show('eventDetailsModal');
    }
    
    showRegistrationForm() {
        const content = `
            <p class="card-text mb-3">Completa el formulario para registrarte en este evento:</p>
            <form class="row g-3">
                <div class="col-12">
                    <label class="form-label">Nombre completo</label>
                    <input type="text" class="form-control" required placeholder="Tu nombre completo">
                </div>
                <div class="col-12">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" required placeholder="tu@email.com">
                </div>
                <div class="col-12">
                    <label class="form-label">Empresa/Organización <small class="text-muted">(opcional)</small></label>
                    <input type="text" class="form-control" placeholder="Tu empresa u organización">
                </div>
            </form>
        `;

        const buttons = [
            { text: 'Cancelar', class: 'btn-secondary', onclick: `SimpleModal.close('registrationModal')` },
            { text: '<i class="fas fa-user-plus me-2"></i>Registrarse', class: 'btn-primary', onclick: `SimpleModal.close('registrationModal'); EventsListing.registerForEvent('${this.config.eventId}')` }
        ];

        SimpleModal.createWithBorder('registrationModal', `Registro - ${this.config.eventTitle}`, content, buttons, 'primary');
        SimpleModal.show('registrationModal');
    }
}

export { EventCountdown };
