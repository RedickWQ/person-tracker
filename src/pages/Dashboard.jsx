import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Layout/Header';
import { Card } from '../components/Common/Card';
import { Button } from '../components/Common/Button';
import { GoalForm } from '../components/Goal/GoalForm';
import { ProgressBar } from '../components/Common/ProgressBar';
import { StatsCards } from '../components/Dashboard/StatsCards';
import { GlobalHeatmap } from '../components/Dashboard/GlobalHeatmap';
import { useGoals } from '../hooks/useGoals';
import { GoalStatus, GoalTypeConfig } from '../constants';
import { Plus, Target, Clock, CheckCircle2, TrendingUp, Calendar } from 'lucide-react';
import { formatDate, getTodayStr, calculateCurrentStreak, calculateLongestStreak, startOfWeek, startOfMonth } from '../utils/dateUtils';
import './Dashboard.css';

const API_BASE = '/api';

// CI/CD Test - Auto Deploy Test

const statusConfig = {
  [GoalStatus.NOT_STARTED]: { label: '未开始', color: '#94A3B8' },
  [GoalStatus.IN_PROGRESS]: { label: '进行中', color: '#6366F1' },
  [GoalStatus.COMPLETED]: { label: '已完成', color: '#22C55E' },
  [GoalStatus.PAUSED]: { label: '已暂停', color: '#F59E0B' }
};

export function Dashboard() {
  const navigate = useNavigate();
  const { goals, loading, addGoal } = useGoals();
  const [showForm, setShowForm] = useState(false);
  const [goalStats, setGoalStats] = useState({});
  const [allLogs, setAllLogs] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    currentStreak: 0,
    longestStreak: 0,
    weekLogs: 0,
    monthLogs: 0,
    completionRate: 0
  });

  useEffect(() => {
    async function loadGoalStats() {
      const stats = {};
      for (const goal of goals) {
        try {
          const res = await fetch(`${API_BASE}/goals/${goal.id}/logs`);
          const logs = await res.json();
          stats[goal.id] = {
            logs: logs.length,
            lastLogDate: logs.length > 0 ? logs[logs.length - 1].date : null
          };
        } catch (error) {
          console.error('Failed to fetch logs for goal', goal.id, error);
          stats[goal.id] = { logs: 0, lastLogDate: null };
        }
      }
      setGoalStats(stats);
    }

    async function loadAllLogs() {
      try {
        const res = await fetch(`${API_BASE}/all-logs`);
        const logs = await res.json();
        setAllLogs(logs);

        // Calculate dashboard stats
        const uniqueDates = [...new Set(logs.map(log => log.date))];
        const currentStreak = calculateCurrentStreak(uniqueDates);
        const longestStreak = calculateLongestStreak(uniqueDates);

        const today = new Date();
        const weekStart = startOfWeek(today);
        const monthStart = startOfMonth(today);

        const weekLogs = logs.filter(log => new Date(log.date) >= weekStart).length;
        const monthLogs = logs.filter(log => new Date(log.date) >= monthStart).length;

        // Calculate completion rate
        let completionRate = 0;
        if (uniqueDates.length > 0) {
          const firstDate = new Date(uniqueDates.sort()[0]);
          const totalDays = Math.ceil((today - firstDate) / (1000 * 60 * 60 * 24)) + 1;
          completionRate = Math.round((uniqueDates.length / totalDays) * 100);
        }

        setDashboardStats({
          currentStreak,
          longestStreak,
          weekLogs,
          monthLogs,
          completionRate: Math.min(100, completionRate)
        });
      } catch (error) {
        console.error('Failed to fetch all logs:', error);
      }
    }

    if (goals.length > 0) {
      loadGoalStats();
    } else {
      setGoalStats({});
    }
    loadAllLogs();
  }, [goals]);

  const statusCounts = {
    all: goals.length,
    [GoalStatus.IN_PROGRESS]: goals.filter(g => g.status === GoalStatus.IN_PROGRESS).length,
    [GoalStatus.COMPLETED]: goals.filter(g => g.status === GoalStatus.COMPLETED).length,
    [GoalStatus.PAUSED]: goals.filter(g => g.status === GoalStatus.PAUSED).length
  };

  return (
    <div className="page">
      <Header title="仪表盘" />
      <div className="page-content">
        {/* 统计概览 */}
        <div className="dashboard-overview">
          <div className="overview-card">
            <div className="overview-icon">
              <Target size={24} />
            </div>
            <div className="overview-content">
              <span className="overview-value">{statusCounts.all}</span>
              <span className="overview-label">全部目标</span>
            </div>
          </div>
          <div className="overview-card active">
            <div className="overview-icon">
              <TrendingUp size={24} />
            </div>
            <div className="overview-content">
              <span className="overview-value">{statusCounts[GoalStatus.IN_PROGRESS]}</span>
              <span className="overview-label">进行中</span>
            </div>
          </div>
          <div className="overview-card completed">
            <div className="overview-icon">
              <CheckCircle2 size={24} />
            </div>
            <div className="overview-content">
              <span className="overview-value">{statusCounts[GoalStatus.COMPLETED]}</span>
              <span className="overview-label">已完成</span>
            </div>
          </div>
          <div className="overview-card paused">
            <div className="overview-icon">
              <Clock size={24} />
            </div>
            <div className="overview-content">
              <span className="overview-value">{statusCounts[GoalStatus.PAUSED]}</span>
              <span className="overview-label">已暂停</span>
            </div>
          </div>
        </div>

        {/* 成就统计卡片 */}
        <StatsCards stats={dashboardStats} />

        {/* 活动热力图区域 */}
        <div className="dashboard-activity-section">
          <GlobalHeatmap logs={allLogs} />
        </div>

        {/* 添加目标按钮 */}
        <div className="dashboard-header">
          <div className="dashboard-header-actions">
            <Button onClick={() => setShowForm(true)}>
              <Plus size={18} /> 新建目标
            </Button>
          </div>
        </div>

        {/* 目标列表 */}
        {loading ? (
          <p className="loading-text">加载中...</p>
        ) : goals.length === 0 ? (
          <Card className="empty-card">
            <p>暂无目标，点击上方按钮创建第一个目标</p>
          </Card>
        ) : (
          <div className="goals-list">
            {goals.map((goal, index) => {
              const stats = goalStats[goal.id] || {};
              const status = statusConfig[goal.status] || statusConfig[GoalStatus.NOT_STARTED];
              const progress = goal.progress || 0;
              const colorVariants = ['variant-indigo', 'variant-green', 'variant-amber', 'variant-pink', 'variant-sky', 'variant-purple'];
              const colorClass = colorVariants[index % colorVariants.length];

              return (
                <Card
                  key={goal.id}
                  className={`goal-overview-card ${colorClass}`}
                  onClick={() => navigate(`/goals/${goal.id}`)}
                >
                  <div className="goal-overview-header">
                    <div className="goal-type-badges">
                      <span
                        className="status-badge"
                        style={{ background: status.color }}
                      >
                        {status.label}
                      </span>
                    </div>
                    <span className="goal-dates">
                      {goal.startDate || '未设置'} ~ {goal.endDate || '至今'}
                    </span>
                  </div>

                  <h3 className="goal-overview-title">{goal.title}</h3>

                  <div className="goal-overview-progress">
                    <div className="goal-progress-header">
                      <span>完成进度</span>
                      <span className="goal-progress-value">{progress}%</span>
                    </div>
                    <ProgressBar value={progress} />
                  </div>

                  <div className="goal-overview-stats">
                    <div className="goal-stat">
                      <span className="goal-stat-value">{stats.logs || 0}</span>
                      <span className="goal-stat-label">记录天数</span>
                    </div>
                  </div>

                  <div className="goal-overview-footer">
                    <Calendar size={14} />
                    <span>最后记录: {stats.lastLogDate || '暂无'}</span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <GoalForm
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={addGoal}
        />
      </div>
    </div>
  );
}
