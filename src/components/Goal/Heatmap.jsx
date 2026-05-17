import { useMemo, useRef, useEffect, useState } from 'react';
import { formatDate, getTodayStr } from '../../utils/dateUtils';
import './Heatmap.css';

export function Heatmap({ logs, startDate, endDate }) {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(800);

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

  const defaultStart = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 6);
    return formatDate(d, 'yyyy-MM-dd');
  }, []);

  const defaultEnd = getTodayStr();
  const rangeStart = startDate || defaultStart;
  const rangeEnd = endDate || defaultEnd;

  const data = useMemo(() => {
    const start = new Date(rangeStart);
    const end = new Date(rangeEnd);

    const logMap = new Map();
    logs.forEach(log => {
      if (log.date) {
        logMap.set(log.date, log);
      }
    });

    const days = [];
    const current = new Date(start);

    while (current <= end) {
      const dateStr = formatDate(current, 'yyyy-MM-dd');
      days.push({
        date: dateStr,
        log: logMap.get(dateStr) || null,
        isToday: dateStr === getTodayStr()
      });
      current.setDate(current.getDate() + 1);
    }

    // 补齐前后周
    const firstDay = days[0];
    const paddingBefore = firstDay ? new Date(start).getDay() : 0;
    const paddingDays = [];
    for (let i = paddingBefore - 1; i >= 0; i--) {
      const d = new Date(start);
      d.setDate(d.getDate() - i - 1);
      paddingDays.push({
        date: formatDate(d, 'yyyy-MM-dd'),
        log: null,
        isToday: false,
        isPadding: true
      });
    }

    const lastDay = days[days.length - 1];
    const paddingAfter = lastDay ? 6 - new Date(rangeEnd).getDay() : 0;
    const paddingDaysAfter = [];
    for (let i = 1; i <= paddingAfter; i++) {
      const d = new Date(end);
      d.setDate(d.getDate() + i);
      paddingDaysAfter.push({
        date: formatDate(d, 'yyyy-MM-dd'),
        log: null,
        isToday: false,
        isPadding: true
      });
    }

    const allDays = [...paddingDays, ...days, ...paddingDaysAfter];

    const weeks = [];
    for (let i = 0; i < allDays.length; i += 7) {
      weeks.push(allDays.slice(i, i + 7));
    }

    const months = [];
    let currentMonth = '';
    weeks.forEach((week) => {
      week.forEach(day => {
        const month = day.date.substring(0, 7);
        if (month !== currentMonth) {
          currentMonth = month;
          months.push(month);
        }
      });
    });

    return { weeks, months };
  }, [logs, rangeStart, rangeEnd]);

  const cellSize = useMemo(() => {
    const numWeeks = data.weeks.length;
    if (numWeeks === 0) return 20;
    const gap = 4;
    const availableWidth = containerWidth - 20;
    const calculatedSize = Math.floor((availableWidth - (numWeeks * gap)) / numWeeks);
    return Math.max(16, Math.min(32, calculatedSize));
  }, [data.weeks.length, containerWidth]);

  const gap = Math.max(2, Math.floor(cellSize / 6));

  return (
    <div className="heatmap" ref={containerRef}>
      <div className="heatmap-months">
        {data.months.map((month, i) => (
          <span key={i} className="heatmap-month">
            {formatDate(new Date(month + '-01'), 'yyyy年MM月')}
          </span>
        ))}
      </div>
      <div className="heatmap-grid-wrapper">
        <div className="heatmap-grid" style={{ gap: `${gap}px` }}>
          {data.weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="heatmap-week" style={{ gap: `${gap}px` }}>
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`heatmap-day ${day.log && !day.isPadding ? 'has-log' : ''} ${day.isPadding ? 'padding' : ''} ${day.isToday ? 'today' : ''}`}
                  style={{
                    width: `${cellSize}px`,
                    height: `${cellSize}px`
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="heatmap-legend">
          <span className="legend-label">无记录</span>
          <div className="heatmap-day" style={{ width: '12px', height: '12px' }} />
          <div className="heatmap-day has-log" style={{ width: '12px', height: '12px' }} />
          <span className="legend-label">有记录</span>
        </div>
      </div>
    </div>
  );
}
