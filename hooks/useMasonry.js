import { useEffect, useRef } from 'react';

const useMasonry = (items, columns = 4) => {
  const containerRef = useRef(null);

  const resizeGridItem = (item) => {
    const grid = containerRef.current;
    if (!grid) return;

    const rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
    const rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
    const itemContent = item.querySelector('.item');
    
    if (itemContent) {
      const itemHeight = itemContent.getBoundingClientRect().height;
      const rowSpan = Math.ceil((itemHeight + rowGap) / (rowHeight + rowGap));
      item.style.gridRowEnd = `span ${rowSpan}`;
    }
  };

  const resizeAllGridItems = () => {
    const grid = containerRef.current;
    if (!grid) return;

    const allItems = grid.querySelectorAll('.masonry-item');
    allItems.forEach(resizeGridItem);
  };

  const updateColumns = () => {
    const grid = containerRef.current;
    if (!grid) return;

    const width = window.innerWidth;
    let cols = columns;
    
    if (width <= 480) cols = 1;
    else if (width <= 768) cols = 2;
    else if (width <= 1200) cols = 3;
    else cols = 4;

    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  };

  useEffect(() => {
    const handleResize = () => {
      updateColumns();
      setTimeout(resizeAllGridItems, 100);
    };

    const handleLoad = () => {
      updateColumns();
      setTimeout(resizeAllGridItems, 100);
    };

    // Initialize
    handleLoad();

    // Set up event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('load', handleLoad);

    // Resize items when images load
    const grid = containerRef.current;
    if (grid) {
      const images = grid.querySelectorAll('img');
      images.forEach(img => {
        if (img.complete) {
          setTimeout(resizeAllGridItems, 100);
        } else {
          img.addEventListener('load', () => {
            setTimeout(resizeAllGridItems, 100);
          });
        }
      });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', handleLoad);
    };
  }, [items, columns]);

  return { containerRef, resizeAllGridItems };
};

export default useMasonry;
