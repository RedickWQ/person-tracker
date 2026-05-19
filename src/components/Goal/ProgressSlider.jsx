import { useState } from 'react';
import './ProgressSlider.css';

export function ProgressSlider({ value, onChange }) {
  const [dragging, setDragging] = useState(false);

  const handleTrackClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.round((x / rect.width) * 100);
    const clampedValue = Math.min(100, Math.max(0, percentage));
    onChange(clampedValue);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
    handleTrackClick(e);
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.round((x / rect.width) * 100);
    const clampedValue = Math.min(100, Math.max(0, percentage));
    onChange(clampedValue);
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  return (
    <div className="progress-slider">
      <span className="progress-slider-label">完成进度</span>
      <div
        className="progress-slider-track"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="progress-slider-fill" style={{ width: `${value}%` }} />
        <div className="progress-slider-thumb" style={{ left: `${value}%` }} />
      </div>
      <span className="progress-slider-value">{value}%</span>
    </div>
  );
}
