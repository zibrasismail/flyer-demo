import { Product, FlyerPage } from '../types';

const API_URL = 'https://gservetech.github.io/html/html/flyer/flyer-data.json';
const IMAGE_BASE_URL = 'https://gservetech.github.io/html/html/flyer';

export interface FlyerData {
  products: Record<string, Product>;
  flyerPage: FlyerPage;
}

function prefixImageUrl(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // Remove leading ./ or / and add proper separator
  const cleanPath = url.replace(/^\.?\//, '');
  return `${IMAGE_BASE_URL}/${cleanPath}`;
}

export async function fetchFlyerData(): Promise<FlyerData> {
  const response = await fetch(API_URL, { cache: 'no-cache' });
  if (!response.ok) {
    throw new Error('Failed to fetch flyer data');
  }
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    console.error('JSON parse error. Raw response:', text);
    throw new Error('Invalid JSON response from server');
  }
  
  // Prefix image URLs
  data.flyerPage.imageUrl = prefixImageUrl(data.flyerPage.imageUrl);
  
  for (const key in data.products) {
    data.products[key].imageUrl = prefixImageUrl(data.products[key].imageUrl);
  }
  
  return data;
}
