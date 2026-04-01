import React, { useEffect, useRef, useState } from 'react';
import './CustomCursor.css';

const CustomCursor = () => {
  const dotRef = useRef(null);
  const trailerRef = useRef(null);

  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsMobile(true);
      return;
    }

    const onMouseMove = (e) => {
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
      if (trailerRef.current) {
        trailerRef.current.style.left = `${e.clientX}px`;
        trailerRef.current.style.top = `${e.clientY}px`;
      }
    };

    const onMouseDown = () => setClicked(true);
    const onMouseUp = () => setClicked(false);
    const onMouseLeave = () => setHidden(true);
    const onMouseEnter = () => setHidden(false);

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);

    const handleLinkHoverEvents = () => {
      document.querySelectorAll('a, button, input, textarea, select, .leaflet-interactive, [role="button"]').forEach((el) => {
        if (!el.dataset.cursorAttached) {
          el.dataset.cursorAttached = "true";
          el.addEventListener('mouseover', () => setLinkHovered(true));
          el.addEventListener('mouseout', () => setLinkHovered(false));
        }
      });
    };

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
        ref={trailerRef}
        className={`cursor-trailer ${linkHovered ? 'trailer-hover' : ''} ${clicked ? 'trailer-clicked' : ''} ${hidden ? 'cursor-hidden' : ''}`}
      >
        <div className="trailer-ring"></div>
      </div>
      <div 
        ref={dotRef}
        className={`custom-cursor ${clicked ? 'cursor-clicked' : ''} ${linkHovered ? 'cursor-hover' : ''} ${hidden ? 'cursor-hidden' : ''}`}
      >
        <div className="cursor-dot"></div>
      </div>
    </>
  );
};

export default CustomCursor;
