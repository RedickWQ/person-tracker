import { useNavigate } from 'react-router-dom';
import { Card } from '../Common/Card';
import { ProgressBar } from '../Common/ProgressBar';
import { GoalStatus } from '../../constants';
import { Clock, Flag } from 'lucide-react';
import './GoalCard.css';

const statusConfig = {
  [GoalStatus.NOT_STARTED]: { label: '未开始', color: '#94A3B8' },
  [GoalStatus.IN_PROGRESS]: { label: '进行中', color: '#6366F1' },
  [GoalStatus.COMPLETED]: { label: '已完成', color: '#22C55E' },
  [GoalStatus.PAUSED]: { label: '已暂停', color: '#F59E0B' }
};

export function GoalCard({ goal }) {
  const navigate = useNavigate();
  const status = statusConfig[goal.status] || statusConfig[GoalStatus.NOT_STARTED];
  const progress = goal.progress || 0;

  const handleClick = () => {
    navigate(`/goals/${goal.id}`);
  };

  return (
    <Card className="goal-card clickable" onClick={handleClick}>
      <div className="goal-card-header">
        <span
          className="goal-status-badge"
          style={{ background: status.color }}
        >
          {status.label}
        </span>
      </div>
      <h3 className="goal-card-title">{goal.title}</h3>
      {goal.description && (
        <p className="goal-card-desc">{goal.description}</p>
      )}
      <div className="goal-card-progress">
        <div className="goal-card-progress-header">
          <Flag size={14} />
          <span>完成进度</span>
        </div>
        <ProgressBar value={progress} />
      </div>
      <div className="goal-card-footer">
        <Clock size={14} />
        <span>更新于 {new Date(goal.updatedAt).toLocaleDateString()}</span>
      </div>
    </Card>
  );
}
