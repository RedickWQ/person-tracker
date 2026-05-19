import './ProgressSlider.css';

export function ProgressSlider({ value, onChange }) {
  return (
    <div className="progress-slider" style={{ '--value': `${value}%` }}>
      <span className="progress-slider-label">完成进度</span>
      <input
        type="range"
        className="progress-slider-range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <span className="progress-slider-value">{value}%</span>
    </div>
  );
}
