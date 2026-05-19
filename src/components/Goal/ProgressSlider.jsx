import { useState, useRef, useCallback } from 'react';
import './ProgressSlider.css';

export function ProgressSlider({ value, onChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);

  const updateValue = useCallback((clientX) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.round((x / rect.width) * 100);
    const clampedValue = Math.min(100, Math.max(0, percentage));
    onChange(clampedValue);
  }, [onChange]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    updateValue(e.clientX);
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    updateValue(e.clientX);
  }, [isDragging, updateValue]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div className="progress-slider">
      <span className="progress-slider-label">完成进度</span>
      <div
        ref={sliderRef}
        className="progress-slider-track"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="progress-slider-fill"
          style={{ width: `${value}%` }}
        />
        <div
          className="progress-slider-thumb"
          style={{ left: `${value}%` }}
        />
      </div>
      <span className="progress-slider-value">{value}%</span>
    </div>
  );
}
