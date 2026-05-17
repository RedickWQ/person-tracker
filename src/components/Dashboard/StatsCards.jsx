import { Flame, Trophy, CalendarDays, CalendarRange, Target } from 'lucide-react';
import './StatsCards.css';

export function StatsCards({ stats }) {
  const {
    currentStreak = 0,
    longestStreak = 0,
    weekLogs = 0,
    monthLogs = 0,
    completionRate = 0
  } = stats;

  const cards = [
    {
      icon: Flame,
      value: currentStreak,
      label: '当前连续',
      color: '#F59E0B',
      bgColor: '#FEF3C7'
    },
    {
      icon: Trophy,
      value: longestStreak,
      label: '最长连续',
      color: '#D97706',
      bgColor: '#FDE68A'
    },
    {
      icon: CalendarDays,
      value: weekLogs,
      label: '本周记录',
      color: '#6366F1',
      bgColor: '#EEF2FF'
    },
    {
      icon: CalendarRange,
      value: monthLogs,
      label: '本月记录',
      color: '#8B5CF6',
      bgColor: '#F3E8FF'
    },
    {
      icon: Target,
      value: `${completionRate}%`,
      label: '完成率',
      color: '#22C55E',
      bgColor: '#DCFCE7'
    }
  ];

  return (
    <div className="stats-cards">
      {cards.map((card, index) => (
        <div key={index} className="stat-card">
          <div
            className="stat-card-icon"
            style={{ backgroundColor: card.bgColor, color: card.color }}
          >
            <card.icon size={20} />
          </div>
          <div className="stat-card-content">
            <span className="stat-card-value">{card.value}</span>
            <span className="stat-card-label">{card.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
