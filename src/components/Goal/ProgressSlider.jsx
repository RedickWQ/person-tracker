import { useState, useRef, useEffect } from 'react';
import './ProgressSlider.css';

export function ProgressSlider({ value, onChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      updateValue(e);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    updateValue(e);
  };

  const updateValue = (e) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.round((x / rect.width) * 100);
    const clampedValue = Math.min(100, Math.max(0, percentage));
    onChange(clampedValue);
  };

  return (
    <div className="progress-slider">
      <span className="progress-slider-label">完成进度</span>
      <div
        ref={sliderRef}
        className="progress-slider-track"
        onMouseDown={handleMouseDown}
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
