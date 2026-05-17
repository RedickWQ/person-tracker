import { useMemo, useRef, useEffect, useState } from 'react';
import { formatDate } from '../../utils/dateUtils';
import './GlobalHeatmap.css';

export function GlobalHeatmap({ logs }) {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(600);
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, date: '', count: 0 });

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleMouseEnter = (e, day) => {
    if (day.isPadding) return;
    setTooltip({
      show: true,
      x: e.clientX,
      y: e.clientY,
      date: day.date,
      count: day.count
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ show: false, x: 0, y: 0, date: '', count: 0 });
  };

  // Fixed 1 year date range: May 1, 2026 to May 1, 2027
  const dateRange = useMemo(() => {
    return {
      start: '2026-05-01',
      end: '2027-05-01'
    };
  }, []);

  const data = useMemo(() => {
    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);

    // Count logs per date
    const logCountMap = new Map();
    logs.forEach(log => {
      if (log.date) {
        logCountMap.set(log.date, (logCountMap.get(log.date) || 0) + 1);
      }
    });

    // Generate all days from start to end
    const days = [];
    const current = new Date(start);
    while (current <= end) {
      const dateStr = formatDate(current, 'yyyy-MM-dd');
      days.push({
        date: dateStr,
        count: logCountMap.get(dateStr) || 0,
        isPadding: false
      });
      current.setDate(current.getDate() + 1);
    }

    // Build exactly 52 weeks (364 cells) - May 1, 2026 starts on Friday
    // Friday = index 5, so first week has 2 padding days (Mon-Thu)
    const paddingBefore = new Date(start).getDay() === 0 ? 6 : new Date(start).getDay() - 1;

    // Add padding days before
    const paddingDaysBefore = [];
    for (let i = paddingBefore - 1; i >= 0; i--) {
      const d = new Date(start);
      d.setDate(d.getDate() - i - 1);
      paddingDaysBefore.push({
        date: formatDate(d, 'yyyy-MM-dd'),
        count: 0,
        isPadding: true
      });
    }

    // Add padding days after to complete exactly 52 weeks (364 cells)
    const totalCells = 364;
    const remainingCells = totalCells - paddingDaysBefore.length - days.length;
    const paddingDaysAfter = [];
    for (let i = 1; i <= remainingCells && remainingCells > 0; i++) {
      const d = new Date(end);
      d.setDate(d.getDate() + i);
      paddingDaysAfter.push({
        date: formatDate(d, 'yyyy-MM-dd'),
        count: 0,
        isPadding: true
      });
    }

    const allDays = [...paddingDaysBefore, ...days, ...paddingDaysAfter].slice(0, totalCells);

    const weeks = [];
    for (let i = 0; i < allDays.length; i += 7) {
      weeks.push(allDays.slice(i, i + 7));
    }

    // Month labels based on actual data
    const months = [];
    let lastMonth = '';
    weeks.forEach((week, weekIndex) => {
      const firstNonPadding = week.find(d => !d.isPadding);
      if (firstNonPadding) {
        const month = firstNonPadding.date.substring(0, 7);
        if (month !== lastMonth) {
          lastMonth = month;
          months.push({ month, weekIndex });
        }
      }
    });

    return { weeks, months };
  }, [logs, dateRange.start, dateRange.end]);

  // Calculate cell size for exactly 52 weeks filling the card
  const cellSize = useMemo(() => {
    const numWeeks = 52;
    const gap = 2;
    const availableWidth = containerWidth - 40;
    return Math.floor((availableWidth - (numWeeks - 1) * gap) / numWeeks);
  }, [containerWidth]);

  const gapSize = 2;

  const getLevel = (count) => {
    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count === 2) return 2;
    if (count <= 4) return 3;
    return 4;
  };

  return (
    <div className="global-heatmap" ref={containerRef}>
      <div className="global-heatmap-header">
        <span className="global-heatmap-title">执行情况</span>
        <span className="global-heatmap-range">2026.05.01 - 2027.05.01</span>
      </div>
      <div className="global-heatmap-grid-wrapper">
        <div className="global-heatmap-months">
          {data.months.map((m, i) => (
            <span
              key={i}
              className="global-heatmap-month"
              style={{ marginLeft: `${m.weekIndex * (cellSize + gapSize)}px` }}
            >
              {formatDate(new Date(m.month + '-01'), 'MM月')}
            </span>
          ))}
        </div>
        <div className="global-heatmap-grid" style={{ gap: `${gapSize}px` }}>
          {data.weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="global-heatmap-week" style={{ gap: `${gapSize}px` }}>
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`global-heatmap-day level-${getLevel(day.count)} ${day.isPadding ? 'padding' : ''}`}
                  style={{
                    width: `${cellSize}px`,
                    height: `${cellSize}px`
                  }}
                  onMouseEnter={(e) => handleMouseEnter(e, day)}
                  onMouseLeave={handleMouseLeave}
                />
              ))}
            </div>
          ))}
        </div>
        {tooltip.show && (
          <div
            className="heatmap-tooltip"
            style={{
              left: `${tooltip.x}px`,
              top: `${tooltip.y}px`
            }}
          >
            <div className="tooltip-date">{tooltip.date}</div>
            <div className="tooltip-count">{tooltip.count === 0 ? '无记录' : `${tooltip.count} 条记录`}</div>
          </div>
        )}
      </div>
      <div className="global-heatmap-legend">
        <span className="legend-label">无</span>
        <div className="global-heatmap-day level-0" />
        <div className="global-heatmap-day level-1" />
        <div className="global-heatmap-day level-2" />
        <div className="global-heatmap-day level-3" />
        <div className="global-heatmap-day level-4" />
        <span className="legend-label">密集</span>
      </div>
    </div>
  );
}
