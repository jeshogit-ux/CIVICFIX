import React, { useEffect, useState } from 'react';
import './CustomCursor.css';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device uses touch (no cursor needed)
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsMobile(true);
      return;
    }

    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const onMouseDown = () => setClicked(true);
    const onMouseUp = () => setClicked(false);
    const onMouseLeave = () => setHidden(true);
    const onMouseEnter = () => setHidden(false);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);

    const handleLinkHoverEvents = () => {
      document.querySelectorAll('a, button, input, textarea, select, .leaflet-interactive, [role="button"]').forEach((el) => {
        // Prevent adding multiple listeners
        if (!el.dataset.cursorAttached) {
          el.dataset.cursorAttached = "true";
          el.addEventListener('mouseover', () => setLinkHovered(true));
          el.addEventListener('mouseout', () => setLinkHovered(false));
        }
      });
    };

    // Quick polling to attach to new DOM elements like routing changes
    const interval = setInterval(handleLinkHoverEvents, 500);
    handleLinkHoverEvents();

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      clearInterval(interval);
    };
  }, []);

  if (isMobile) return null;

  return (
    <>
      <div 
        className={`cursor-trailer ${linkHovered ? 'trailer-hover' : ''} ${clicked ? 'trailer-clicked' : ''} ${hidden ? 'cursor-hidden' : ''}`}
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      >
        <div className="trailer-ring"></div>
      </div>
      <div 
        className={`custom-cursor ${clicked ? 'cursor-clicked' : ''} ${linkHovered ? 'cursor-hover' : ''} ${hidden ? 'cursor-hidden' : ''}`}
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      >
        <div className="cursor-dot"></div>
      </div>
    </>
  );
};

export default CustomCursor;
