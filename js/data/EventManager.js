// Event Management Utilities
import { EVENTS } from './events.js';

const EventManager = {
    getAllEvents: () => EVENTS,
    getEventById: (id) => EVENTS.find(event => event.id === id),
    getFeaturedEvent: () => EVENTS.find(event => event.featured && event.status === 'upcoming'),
    getNextEvent: () => {
        const now = new Date();
        const upcomingEvents = EVENTS
            .filter(event => event.status === 'upcoming' && new Date(event.date) > now)
            .sort((a, b) => new Date(a.date) - new Date(b.date));
        return upcomingEvents[0] || null;
    },
    getEventsByTag: (tag) => EVENTS.filter(event => 
        event.tags.some(eventTag => eventTag.toLowerCase().includes(tag.toLowerCase()))
    ),
    getEventsByStatus: (status) => EVENTS.filter(event => event.status === status),
    searchEvents: (query) => {
        const searchTerm = query.toLowerCase();
        return EVENTS.filter(event => 
            event.title.toLowerCase().includes(searchTerm) ||
            event.description.toLowerCase().includes(searchTerm) ||
            event.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    },
    getUpcomingEvents: (limit = 5) => {
        const now = new Date();
        return EVENTS
            .filter(event => event.status === 'upcoming' && new Date(event.date) > now)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, limit);
    }
};

export { EventManager };
