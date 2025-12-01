export interface DetectedHotspot {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const detectHotspotsFromImage = (
  imageElement: HTMLImageElement,
  gridSize: number = 10,
  threshold: number = 20
): DetectedHotspot[] => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];

  const width = imageElement.naturalWidth;
  const height = imageElement.naturalHeight;
  
  // Downscale for performance if needed, but let's stick to 1:1 mapping for accuracy first
  // or strictly process a grid.
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(imageElement, 0, 0);

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // 1. Sample background color (assume top-left corner is background)
  const bgR = data[0];
  const bgG = data[1];
  const bgB = data[2];

  // Helper to check if a pixel is "different enough" from background
  const isForeground = (r: number, g: number, b: number) => {
    return Math.abs(r - bgR) > threshold || 
           Math.abs(g - bgG) > threshold || 
           Math.abs(b - bgB) > threshold;
  };

  // 2. Build a grid of "active" cells
  // We divide the image into cells of size `gridSize`.
  // If a cell has enough foreground pixels, it's "active".
  const cols = Math.ceil(width / gridSize);
  const rows = Math.ceil(height / gridSize);
  const grid = new Uint8Array(cols * rows); // 0 = empty, 1 = active, 2 = visited

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const startX = c * gridSize;
      const startY = r * gridSize;
      
      // Check center pixel of the cell (fastest) or average? 
      // Let's check a few points to be robust (center and corners)
      // Optimization: just check center first
      const cx = Math.min(startX + gridSize / 2, width - 1);
      const cy = Math.min(startY + gridSize / 2, height - 1);
      const idx = (Math.floor(cy) * width + Math.floor(cx)) * 4;
      
      if (isForeground(data[idx], data[idx+1], data[idx+2])) {
        grid[r * cols + c] = 1;
      } else {
        // Fallback: if center is background, check 4 corners? 
        // Maybe too slow. Let's stick to center for "sparse" scan, 
        // or scan a diagonal line across the cell.
        // Let's scan the diagonal.
        let hasForeground = false;
        for (let i = 0; i < gridSize; i+=2) { // step 2
            const dx = Math.min(startX + i, width - 1);
            const dy = Math.min(startY + i, height - 1);
            const pIdx = (Math.floor(dy) * width + Math.floor(dx)) * 4;
            if (isForeground(data[pIdx], data[pIdx+1], data[pIdx+2])) {
                hasForeground = true;
                break;
            }
        }
        if (hasForeground) grid[r * cols + c] = 1;
      }
    }
  }

  // 3. Group connected cells (Connected Components)
  const hotspots: DetectedHotspot[] = [];
  let hotspotCount = 0;

  const getGridIdx = (r: number, c: number) => r * cols + c;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[getGridIdx(r, c)] === 1) {
        // Start a new fill
        hotspotCount++;
        let minC = c, maxC = c, minR = r, maxR = r;
        const stack = [[r, c]];
        grid[getGridIdx(r, c)] = 2; // Mark visited

        while (stack.length > 0) {
          const [curR, curC] = stack.pop()!;
          
          // Update bounding box
          if (curC < minC) minC = curC;
          if (curC > maxC) maxC = curC;
          if (curR < minR) minR = curR;
          if (curR > maxR) maxR = curR;

          // Check neighbors (4-connectivity)
          const neighbors = [
            [curR - 1, curC], [curR + 1, curC], 
            [curR, curC - 1], [curR, curC + 1]
          ];

          for (const [nR, nC] of neighbors) {
            if (nR >= 0 && nR < rows && nC >= 0 && nC < cols) {
              if (grid[getGridIdx(nR, nC)] === 1) {
                grid[getGridIdx(nR, nC)] = 2;
                stack.push([nR, nC]);
              }
            }
          }
        }

        // Convert grid coords to image percentages
        // Add some padding (1 cell)
        const finalX = Math.max(0, minC * gridSize);
        const finalY = Math.max(0, minR * gridSize);
        const finalW = Math.min(width, (maxC - minC + 1) * gridSize);
        const finalH = Math.min(height, (maxR - minR + 1) * gridSize);

        // Filter out very small noise (e.g. less than 2x2 grid cells area)
        if ((maxC - minC) > 1 && (maxR - minR) > 1) {
             hotspots.push({
                id: `auto-${hotspotCount}`,
                x: (finalX / width) * 100,
                y: (finalY / height) * 100,
                width: (finalW / width) * 100,
                height: (finalH / height) * 100
            });
        }
      }
    }
  }

  return hotspots;
};
