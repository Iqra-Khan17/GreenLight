import React from 'react';

export const Grain: React.FC = () => {
  return (
    <>
      <div className="film-grain" aria-hidden="true" />
      <div className="vignette-overlay" aria-hidden="true" />
      <div className="sensor-scanline" aria-hidden="true" />
    </>
  );
};
