'use client';

import { useState, useEffect } from 'react';

// --- SVG Icons ---
const ArrowDownIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M12 5V19 M12 19l-4-4 M12 19l4-4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ArrowUpIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M12 19V5 M12 5l-4 4 M12 5l4 4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);


export function ScrollButton() {
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Show the "scroll to top" arrow if user has scrolled down more than 100px
      if (window.scrollY > 100) {
        setIsAtTop(false);
      } else {
        setIsAtTop(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Clean up the event listener when the component unmounts
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <button
      onClick={isAtTop ? scrollToBottom : scrollToTop}
      className="fixed bottom-10 right-10 z-50 border border-white/50 rounded-full p-2 text-white bg-black/50 backdrop-blur-sm transition-opacity duration-300 hover:bg-white/20"
      aria-label={isAtTop ? "Scroll to bottom" : "Scroll to top"}
    >
      {isAtTop ? <ArrowDownIcon /> : <ArrowUpIcon />}
    </button>
  );
}
