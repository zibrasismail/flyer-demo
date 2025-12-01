import { FlyerPage, Product } from './types';

export const MOCK_PRODUCTS: Record<string, Product> = {
  'p1': {
    id: 'p1',
    name: 'Prelit Noble Pine Tree',
    brand: 'DANSON DECOR',
    sku: '5656-776',
    price: 49.97,
    originalPrice: 99.99,
    description: '300 warm white lights. 48" x 6-1/2". Easy assembly with hinged branches. Includes sturdy metal stand. A classic addition to your holiday decor.',
    imageUrl: 'https://images.unsplash.com/photo-1544062329-3733a1cc0cc5?q=80&w=800&auto=format&fit=crop',
    category: 'Christmas',
    rating: 4.5
  },
  'p2': {
    id: 'p2',
    name: 'Tool Chest & Cabinet',
    brand: 'BENCHMARK',
    sku: '1112-525',
    price: 169.97,
    originalPrice: 249.99,
    description: '6 drawers with 2 locking casters. 220 lb weight capacity. 24-1/4" x 42-3/4". Heavy-duty steel construction for professional garage storage.',
    imageUrl: 'https://images.unsplash.com/photo-1595054371968-3e406368d447?q=80&w=800&auto=format&fit=crop',
    category: 'Tools',
    rating: 4.8
  },
  'p3': {
    id: 'p3',
    name: 'Wet/Dry Vacuum',
    brand: 'BENCHMARK',
    sku: '1277-023',
    price: 57.97,
    originalPrice: 129.99,
    description: 'Accessories included. 5.2 gal./20 L capacity. Powerful motor for home and workshop cleanup. Features blower port and onboard storage.',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1678223631980-60b643039d91?q=80&w=800&auto=format&fit=crop',
    category: 'Tools',
    rating: 4.2
  },
  'p4': {
    id: 'p4',
    name: '3 Pc. Non-Stick Cookie Sheet Set',
    brand: 'MYKITCHEN',
    sku: '4020-018',
    price: 9.97,
    originalPrice: 27.99,
    description: 'Carbon steel with durable non-stick coating. Includes small, medium, and large sheets. Warp-resistant construction.',
    imageUrl: 'https://images.unsplash.com/photo-1598155523122-38423ab4d62b?q=80&w=800&auto=format&fit=crop',
    category: 'Kitchen',
    rating: 3.9
  },
  'p5': {
    id: 'p5',
    name: 'Barbecue',
    brand: 'Dyna-Glo',
    sku: '6421-161',
    price: 169.97,
    originalPrice: 249.99,
    description: 'Porcelain coated cast iron cooking grates with warming rack. 35,000 BTU. 3 Burners providing even heat distribution.',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop',
    category: 'Outdoor',
    rating: 4.6
  }
};

// This represents the single flyer page image and where the products are located on it.
export const CURRENT_FLYER_PAGE: FlyerPage = {
  id: 'page-1',
  // In a real scenario, this would be the URL of the provided flyer image.
  // Using a placeholder that represents the "Black Friday Sale" flyer.
  imageUrl: '/catalogue.jpg', 
  hotspots: [
    // Left Column - Tree (approx)
    { id: 'h1', productId: 'p1', x: 5, y: 45, width: 28, height: 50 },
    // Middle Top - Tool Chest
    { id: 'h2', productId: 'p2', x: 35, y: 45, width: 30, height: 25 },
    // Right Top - Vacuum
    { id: 'h3', productId: 'p3', x: 67, y: 45, width: 30, height: 25 },
    // Middle Bottom - Barbecue
    { id: 'h4', productId: 'p5', x: 35, y: 72, width: 30, height: 23 },
    // Right Bottom - Cookie Sheet
    { id: 'h5', productId: 'p4', x: 67, y: 72, width: 30, height: 23 }
  ]
};
