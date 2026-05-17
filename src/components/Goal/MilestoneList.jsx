import { useState } from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';
import { Button } from '../Common/Button';
import './MilestoneList.css';

export function MilestoneList({ milestones, onAdd, onToggle, onDelete }) {
  const [newTitle, setNewTitle] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    onAdd({ title: newTitle.trim() });
    setNewTitle('');
    setShowAdd(false);
  };

  return (
    <div className="milestone-list">
      <div className="milestone-header">
        <h3>里程碑</h3>
        <Button size="sm" onClick={() => setShowAdd(true)}>
          + 添加
        </Button>
      </div>

      {showAdd && (
        <div className="milestone-add">
          <input
            type="text"
            className="milestone-input"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="输入里程碑标题"
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            autoFocus
          />
          <Button size="sm" onClick={handleAdd}>添加</Button>
          <Button variant="ghost" size="sm" onClick={() => { setShowAdd(false); setNewTitle(''); }}>
            取消
          </Button>
        </div>
      )}

      <div className="milestone-items">
        {milestones.length === 0 && !showAdd && (
          <p className="milestone-empty">暂无里程碑</p>
        )}
        {milestones.map((milestone) => (
          <div key={milestone.id} className="milestone-item">
            <button
              className={`milestone-check ${milestone.completed ? 'checked' : ''}`}
              onClick={() => onToggle(milestone.id, !milestone.completed)}
            >
              {milestone.completed && <Check size={14} />}
            </button>
            <span className={`milestone-title ${milestone.completed ? 'completed' : ''}`}>
              {milestone.title}
            </span>
            <button className="milestone-delete" onClick={() => onDelete(milestone.id)}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
