// Events Listing Component
import { EventManager } from '../data/EventManager.js';

class EventsListing {
    static init() {
        const container = document.getElementById('events-container');
        if (!container) return;

        this.renderEvents();
    }

    static renderEvents() {
        const container = document.getElementById('events-container');
        if (!container) return;

        const events = EventManager.getAllEvents();
        const eventsHTML = events.map(event => this.createEventCard(event)).join('');
        container.innerHTML = eventsHTML;
    }

    static createEventCard(event) {
        let formattedDate, formattedTime;
        
        if (typeof moment !== 'undefined') {
            formattedDate = moment(event.date).format('DD [de] MMMM, YYYY');
            formattedTime = moment(event.date).format('HH:mm');
        } else {
            const eventDate = new Date(event.date);
            formattedDate = eventDate.toLocaleDateString('es-ES', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
            });
            formattedTime = eventDate.toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        }

        return `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card bg-dark text-white h-100 border-0 shadow-lg" style="backdrop-filter: blur(10px); background: rgba(13, 13, 13, 0.8);">
                    <img src="${event.image}" class="card-img-top" alt="${event.title}" style="height: 200px; object-fit: cover;">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title text-primary mb-3">${event.title}</h5>
                        
                        <div class="mb-3 flex-grow-1">
                            <div class="d-flex align-items-center mb-2">
                                <i class="fas fa-calendar me-2 text-primary"></i>
                                <small class="text-light">${formattedDate}</small>
                            </div>
                            <div class="d-flex align-items-center mb-2">
                                <i class="fas fa-clock me-2 text-primary"></i>
                                <small class="text-light">${formattedTime}</small>
                            </div>
                            <div class="d-flex align-items-center mb-2">
                                <i class="fas fa-map-marker-alt me-2 text-primary"></i>
                                <small class="text-light">${event.location}</small>
                            </div>
                            <div class="d-flex align-items-center">
                                <i class="fas fa-users me-2 text-primary"></i>
                                <small class="text-light">${event.capacity}</small>
                            </div>
                        </div>

                        <div class="d-flex justify-content-between align-items-center mt-auto">
                            <span class="text-primary fs-5 fw-bold">$${event.price}</span>
                            <button class="btn btn-primary" onclick="EventsListing.showEventDetails('${event.id}')">
                                <i class="fas fa-eye me-1"></i> Ver Detalles
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    static showEventDetails(eventId) {
        const event = EVENTS.find(e => e.id === eventId);
        if (!event) return;

        const content = `
            <img src="${event.image}" class="img-fluid rounded mb-3" alt="${event.title}">
            <p class="card-text">${event.description}</p>
            <hr>
            <div class="row g-3">
                <div class="col-md-6">
                    <div class="d-flex align-items-center mb-2">
                        <i class="fas fa-calendar me-2 text-primary"></i>
                        <small><strong>Fecha:</strong> ${typeof moment !== 'undefined' ? moment(event.date).format('DD [de] MMMM, YYYY') : new Date(event.date).toLocaleDateString('es-ES')}</small>
                    </div>
                    <div class="d-flex align-items-center mb-2">
                        <i class="fas fa-clock me-2 text-primary"></i>
                        <small><strong>Hora:</strong> ${typeof moment !== 'undefined' ? moment(event.date).format('HH:mm') : new Date(event.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</small>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="d-flex align-items-center mb-2">
                        <i class="fas fa-map-marker-alt me-2 text-primary"></i>
                        <small><strong>Ubicación:</strong> ${event.location}</small>
                    </div>
                    <div class="d-flex align-items-center mb-2">
                        <i class="fas fa-euro-sign me-2 text-success"></i>
                        <small><strong>Precio:</strong> <span class="text-success fw-bold">$${event.price}</span></small>
                    </div>
                </div>
            </div>
        `;

        const buttons = [
            { text: 'Cerrar', class: 'btn-secondary', onclick: `SimpleModal.close('eventModal')` },
            { text: '<i class="fas fa-ticket-alt me-2"></i>Registrarse', class: 'btn-primary', onclick: `EventsListing.registerForEvent('${event.id}')` }
        ];

        SimpleModal.createWithBorder('eventModal', event.title, content, buttons, 'primary');
        SimpleModal.show('eventModal');
    }

    static registerForEvent(eventId) {
        const event = EVENTS.find(e => e.id === eventId);
        if (!event) return;

        // Close current modal
        SimpleModal.close('eventModal');
        
        // Bootstrap toast notification
        const toastContainer = document.getElementById('toast-container') || (() => {
            const container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container position-fixed top-0 end-0 p-3';
            container.style.zIndex = '1055';
            document.body.appendChild(container);
            return container;
        })();
        
        const toast = document.createElement('div');
        toast.className = 'toast show';
        toast.innerHTML = `
            <div class="toast-header bg-success text-white">
                <i class="fas fa-check-circle me-2"></i>
                <strong class="me-auto">¡Registro exitoso!</strong>
                <button type="button" class="btn-close btn-close-white ms-2" onclick="this.parentElement.parentElement.remove()"></button>
            </div>
            <div class="toast-body bg-dark text-white">
                Gracias por tu interés en <strong>${event.title}</strong>. Te contactaremos pronto.
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }
}

export { EventsListing };
