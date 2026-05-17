import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Layout/Header';
import { GoalCard } from '../components/Goal/GoalCard';
import { GoalForm } from '../components/Goal/GoalForm';
import { Button } from '../components/Common/Button';
import { useGoals } from '../hooks/useGoals';
import { GoalStatus } from '../constants';
import { Plus } from 'lucide-react';
import './Dashboard.css';

export function GoalsPage() {
  const navigate = useNavigate();
  const { goals, loading, addGoal } = useGoals();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');

  const filteredGoals = goals.filter(goal => {
    if (filter === 'all') return true;
    if (filter === 'in_progress') return goal.status === GoalStatus.IN_PROGRESS;
    if (filter === 'completed') return goal.status === GoalStatus.COMPLETED;
    return true;
  });

  const statusCounts = {
    all: goals.length,
    in_progress: goals.filter(g => g.status === GoalStatus.IN_PROGRESS).length,
    completed: goals.filter(g => g.status === GoalStatus.COMPLETED).length
  };

  return (
    <div className="page">
      <Header title="目标管理" />
      <div className="page-content">
        <div className="dashboard-header">
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              全部 ({statusCounts.all})
            </button>
            <button
              className={`filter-tab ${filter === 'in_progress' ? 'active' : ''}`}
              onClick={() => setFilter('in_progress')}
            >
              进行中 ({statusCounts.in_progress})
            </button>
            <button
              className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              已完成 ({statusCounts.completed})
            </button>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus size={18} /> 新建目标
          </Button>
        </div>

        {loading ? (
          <p className="loading-text">加载中...</p>
        ) : filteredGoals.length === 0 ? (
          <p className="empty-text">暂无目标，点击上方按钮创建</p>
        ) : (
          <div className="goals-grid">
            {filteredGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
              />
            ))}
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
