// Events Data Configuration
const EVENTS = [
    {
        id: 'tech-innovation-2025',
        title: 'Conferencia Tech Innovation',
        description: 'Únete a los líderes tecnológicos más influyentes del mundo en una experiencia única de aprendizaje e innovación. Descubre las últimas tendencias en IA, blockchain y desarrollo sostenible.',
        date: '2025-10-15T09:00:00',
        location: 'Centro de Convenciones, Santiago',
        capacity: '500+ Asistentes esperados',
        image: 'assets/tech.png',
        featured: true,
        status: 'upcoming',
        tags: ['IA', 'Blockchain', 'Innovación', 'Tecnología'],
        price: 150000
    },
    {
        id: 'startup-summit-2025',
        title: 'Startup Summit Santiago',
        description: 'El evento más importante para emprendedores, inversores y startups en España. Networking, pitch sessions y conferencias magistrales.',
        date: '2025-11-20T10:00:00',
        location: 'Banco Santander, Santiago',
        capacity: '800+ Asistentes esperados',
        image: 'assets/startup.webp',
        featured: false,
        status: 'upcoming',
        tags: ['Startups', 'Inversión', 'Emprendimiento', 'Networking'],
        price: 200000
    },
    {
        id: 'digital-marketing-expo-2025',
        title: 'Digital Marketing Expo',
        description: 'Las últimas tendencias en marketing digital, SEO, SEM, redes sociales y e-commerce. Workshops prácticos y casos de éxito.',
        date: '2025-09-08T16:23:24',
        location: 'Universidad Técnica Federico Santa María, Valparaíso',
        capacity: '1200+ Asistentes esperados',
        image: 'assets/digitalmarketing.webp',
        featured: false,
        status: 'upcoming',
        tags: ['Marketing Digital', 'SEO', 'SEM', 'E-commerce'],
        price: 120000
    },
    {
        id: 'design-conference-2025',
        title: 'DEX Digital Experience',
        description: 'Conferencia sobre diseño de experiencia de usuario y interfaces. Talleres hands-on, design thinking y las últimas herramientas.',
        date: '2025-12-10T09:00:00',
        location: 'Centro de Convenciones, Santiago',
        capacity: '300+ Asistentes esperados',
        image: 'assets/uiux.jpg',
        featured: true,
        status: 'upcoming',
        tags: ['UX', 'UI', 'Design Thinking', 'Prototipado'],
        price: 180000
    },
    {
        id: 'fintech-revolution',
        title: 'FinTech Revolution',
        description: 'El futuro de las finanzas digitales: DeFi, pagos digitales y regulaciones. Expertos internacionales y casos reales.',
        date: '2025-11-05T14:00:00',
        location: 'Hotel W, Providencia',
        capacity: '250+ Asistentes esperados',
        image: 'assets/fintech.png',
        featured: false,
        status: 'upcoming',
        tags: ['FinTech', 'Criptomonedas', 'DeFi', 'Pagos Digitales'],
        price: 300000
    }
];

const EVENT_CONFIG = {
    defaultEventTitle: 'Próximo Evento Smart Events',
    defaultEventDate: '2025-10-15T09:00:00',
    defaultEventLocation: 'Centro de Convenciones, Santiago',
    defaultEventCapacity: '500+ Asistentes esperados',
    defaultEventDescription: 'Un evento increíble está por venir. Mantente atento a las actualizaciones y regístrate para no perderte esta oportunidad única.',
    defaultEventImage: 'https://dummyimage.com/600x400/667eea/ffffff&text=Smart+Events'
};

export { EVENTS, EVENT_CONFIG };
