export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  location: string;
  type: string;
  status: "completed" | "in-progress" | "upcoming";
  image: string;
  year?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
}

export const projects: Project[] = [
  {
    id: "golden-view",
    name: "Golden View",
    tagline: "Elevated perspectives, grounded craft",
    description:
      "A mountain residence commanding panoramic views of the Central Valley. Every material choice — exposed concrete, tropical hardwood, floor-to-ceiling glass — serves both the architecture and the landscape it frames.",
    location: "Pérez Zeledón",
    type: "Mountain Residence",
    status: "completed",
    image: "/images/golden-view-1.jpg",
    year: "2024",
  },
  {
    id: "clifftop-oasis",
    name: "Clifftop Oasis",
    tagline: "Architecture at the edge",
    description:
      "A premium coastal residence where bold cantilevers meet the Pacific horizon. The design dissolves the boundary between interior and landscape through continuous sight lines and an infinity-edge pool that merges with the ocean below.",
    location: "Dominical",
    type: "Coastal Residence",
    status: "completed",
    image: "/images/clifftop-oasis.webp",
    year: "2024",
  },
  {
    id: "pura-vida-falls",
    name: "Pura Vida Falls",
    tagline: "Living within the sound of water",
    description:
      "A residential development positioned among waterfalls in one of Costa Rica's most biodiverse corridors. Each unit is oriented to maximize natural ventilation, daylight, and acoustic presence of cascading water.",
    location: "Pérez Zeledón",
    type: "Residential Development",
    status: "in-progress",
    image: "/images/gallery-9.webp",
    year: "2025",
  },
  {
    id: "la-s-estates",
    name: "La S Estates",
    tagline: "Strategic position, architectural distinction",
    description:
      "An exclusive collection of custom estates in one of the Southern Zone's most sought-after corridors. Designed for investors and residents who value both architectural quality and long-term returns.",
    location: "Uvita",
    type: "Estate Development",
    status: "in-progress",
    image: "/images/gallery-10.webp",
    year: "2025",
  },
];

export const services: Service[] = [
  {
    id: "architectural-design",
    title: "Architectural Design",
    description:
      "From initial concept through construction documents. Every project begins with the land, the light, and the way you want to live.",
  },
  {
    id: "construction",
    title: "Construction",
    description:
      "Full execution with local expertise and international standards. We manage materials, trades, timelines, and quality at every phase.",
  },
  {
    id: "project-management",
    title: "Project Management",
    description:
      "Permits, coordination, scheduling, and delivery. One point of contact from first sketch to final walkthrough.",
  },
  {
    id: "property-development",
    title: "Property Development",
    description:
      "Strategic land acquisition and development planning. We identify opportunities and convert raw land into high-value properties.",
  },
];

export const stats = {
  yearsExperience: 10,
  projectsDelivered: 25,
  countriesServed: 4,
};

export const testimonials = [
  {
    name: "Kevin Wilson",
    location: "Pasadena, California",
    text: "The project exceeded every expectation. Vista's understanding of the site, the climate, and how we wanted to live in the space was evident from the first meeting.",
  },
  {
    name: "Richard W. Bell",
    location: "California",
    text: "Top-quality design with a personal approach that made the entire process feel effortless, even from a distance. The craftsmanship is exceptional.",
  },
  {
    name: "George Geerlinks",
    location: "Ontario, Canada",
    text: "First-class design work that has built real trust. The team's precision and transparency made investing in Costa Rica feel completely natural.",
  },
];

export const contact = {
  phone: "+506 6058 9035",
  email: "info@vista3.cr",
  location: "Pérez Zeledón / Uvita, Costa Rica",
  social: {
    instagram: "https://instagram.com/vista3.cr",
    facebook: "https://facebook.com/vista3.cr",
    youtube: "https://youtube.com/@vista3cr",
  },
};

// All gallery images from the real site
export const gallery = [
  "/images/golden-view-1.jpg",
  "/images/golden-view-2.jpg",
  "/images/golden-view-3.jpg",
  "/images/clifftop-oasis.webp",
  "/images/project-hero.webp",
  "/images/gallery-1.webp",
  "/images/gallery-2.webp",
  "/images/gallery-3.webp",
  "/images/gallery-4.webp",
  "/images/gallery-5.webp",
  "/images/gallery-6.webp",
  "/images/gallery-7.webp",
  "/images/gallery-8.webp",
  "/images/gallery-9.webp",
  "/images/gallery-10.webp",
  "/images/gallery-11.webp",
  "/images/gallery-12.webp",
];
