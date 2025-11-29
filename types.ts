export interface Product {
  id: string;
  name: string;
  brand: string;
  sku: string;
  price: number;
  originalPrice?: number;
  description: string;
  imageUrl: string;
  category: string;
  rating: number;
}

export interface Hotspot {
  id: string;
  productId: string;
  // Coordinates in percentage (0-100) relative to the flyer image
  x: number; 
  y: number;
  width: number;
  height: number;
}

export interface FlyerPage {
  id: string;
  imageUrl: string;
  hotspots: Hotspot[];
}
