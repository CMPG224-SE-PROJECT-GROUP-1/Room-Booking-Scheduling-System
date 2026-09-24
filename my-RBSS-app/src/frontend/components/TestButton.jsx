import { useState } from 'react';

const COLORS = ['#f87171', '#60a5fa', '#34d399', '#fbbf24', '#a78bfa'];

export default function ClickableBox({ text }) {
  const [colorIndex, setColorIndex] = useState(0);

  const handleClick = () => {
    // Moves to the next color, loops back to the start when reaching the end
    setColorIndex((prevIndex) => (prevIndex + 1) % COLORS.length);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{
        backgroundColor: COLORS[colorIndex],
        border: '1px solid #333',
        padding: '24px',
        borderRadius: '8px',
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'background-color 0.2s ease', // Smooth color change
      }}
    >
      {text}
    </div>
  );
}