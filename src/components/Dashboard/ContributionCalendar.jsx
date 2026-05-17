import { useMemo } from 'react';
import { format, subDays, startOfWeek, addDays } from 'date-fns';
import './ContributionCalendar.css';

export function ContributionCalendar({ logs }) {
  const { weeks, monthLabels } = useMemo(() => {
    const today = new Date();
    const oneYearAgo = subDays(today, 364);

    // Build a map of date -> log count
    const dateMap = new Map();
    logs.forEach(log => {
      const count = dateMap.get(log.date) || 0;
      dateMap.set(log.date, count + 1);
    });

    // Generate 52 weeks of data
    const weeksData = [];
    const monthLabelsData = [];

    // Start from the Sunday of the week containing oneYearAgo
    let currentDate = startOfWeek(oneYearAgo, { weekStartsOn: 0 });

    // Group by weeks
    let currentWeek = [];
    let currentMonth = -1;

    for (let i = 0; i <= 370; i++) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const dayOfWeek = currentDate.getDay();

      // Track month changes for labels
      const month = currentDate.getMonth();
      if (month !== currentMonth && dayOfWeek === 0) {
        monthLabelsData.push({
          month: format(currentDate, 'MMM'),
          weekIndex: weeksData.length
        });
        currentMonth = month;
      }

      // Get activity level (0-4)
      let level = 0;
      if (dateMap.has(dateStr)) {
        const count = dateMap.get(dateStr);
        if (count >= 4) level = 4;
        else if (count >= 3) level = 3;
        else if (count >= 2) level = 2;
        else level = 1;
      }

      currentWeek.push({
        date: dateStr,
        level,
        isToday: dateStr === format(today, 'yyyy-MM-dd')
      });

      if (dayOfWeek === 6) {
        weeksData.push(currentWeek);
        currentWeek = [];
      }

      currentDate = addDays(currentDate, 1);

      // Stop after we have enough weeks
      if (weeksData.length >= 53 && dayOfWeek === 6) break;
    }

    if (currentWeek.length > 0) {
      weeksData.push(currentWeek);
    }

    return { weeks: weeksData, monthLabels: monthLabelsData };
  }, [logs]);

  const dayLabels = ['', '一', '', '三', '', '五', ''];

  return (
    <div className="contribution-calendar">
      <div className="calendar-header">
        <span className="calendar-title">活动贡献</span>
        <span className="calendar-subtitle">过去一年</span>
      </div>

      <div className="calendar-body">
        <div className="calendar-day-labels">
          {dayLabels.map((label, i) => (
            <span key={i} className="day-label">{label}</span>
          ))}
        </div>

        <div className="calendar-grid-wrapper">
          <div className="calendar-month-labels">
            {monthLabels.map((m, i) => (
              <span
                key={i}
                className="month-label"
                style={{ left: `${m.weekIndex * 14}px` }}
              >
                {m.month}
              </span>
            ))}
          </div>

          <div className="calendar-grid">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="calendar-week">
                {week.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`calendar-day level-${day.level} ${day.isToday ? 'today' : ''}`}
                    title={`${day.date}: ${day.level === 0 ? '无活动' : `${day.level} 条记录`}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="calendar-legend">
        <span className="legend-label">少</span>
        <div className="legend-day level-0" />
        <div className="legend-day level-1" />
        <div className="legend-day level-2" />
        <div className="legend-day level-3" />
        <div className="legend-day level-4" />
        <span className="legend-label">多</span>
      </div>
    </div>
  );
}
