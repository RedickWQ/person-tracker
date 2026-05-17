import { useState } from 'react';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { Button } from '../Common/Button';
import { ProgressBar } from '../Common/ProgressBar';
import { formatDate, getTodayStr } from '../../utils/dateUtils';
import './DailyLogList.css';

export function DailyLogList({ logs, onAdd, onDelete }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newDate, setNewDate] = useState(getTodayStr());
  const [newProgress, setNewProgress] = useState(0);
  const [newResult, setNewResult] = useState('');
  const [newOutput, setNewOutput] = useState('');

  const handleAdd = () => {
    if (!newResult.trim()) return;
    onAdd({
      date: newDate,
      progress: newProgress,
      result: newResult.trim(),
      output: newOutput.trim()
    });
    setNewResult('');
    setNewOutput('');
    setNewProgress(0);
    setShowAdd(false);
  };

  return (
    <div className="daily-log-list">
      <div className="daily-log-header">
        <h3>每日记录</h3>
        <Button variant="ghost" size="sm" onClick={() => setShowAdd(true)}>
          <Plus size={16} /> 添加
        </Button>
      </div>

      {showAdd && (
        <div className="daily-log-add">
          <div className="daily-log-add-row">
            <div className="daily-log-add-field">
              <label>日期</label>
              <input
                type="date"
                className="daily-log-input"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </div>
            <div className="daily-log-add-field">
              <label>进度 ({newProgress}%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={newProgress}
                onChange={(e) => setNewProgress(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="daily-log-add-field">
            <label>结果 *</label>
            <textarea
              className="daily-log-textarea"
              value={newResult}
              onChange={(e) => setNewResult(e.target.value)}
              placeholder="今天完成了什么？"
              rows={2}
              autoFocus
            />
          </div>
          <div className="daily-log-add-field">
            <label>成果</label>
            <textarea
              className="daily-log-textarea"
              value={newOutput}
              onChange={(e) => setNewOutput(e.target.value)}
              placeholder="产出/成果（可选）"
              rows={2}
            />
          </div>
          <div className="daily-log-add-actions">
            <Button onClick={handleAdd}>保存</Button>
            <Button variant="ghost" onClick={() => { setShowAdd(false); setNewResult(''); setNewOutput(''); }}>
              取消
            </Button>
          </div>
        </div>
      )}

      <div className="daily-log-items">
        {logs.length === 0 && !showAdd && (
          <p className="daily-log-empty">暂无记录</p>
        )}
        {logs.map((log) => (
          <div key={log.id} className="daily-log-item">
            <div className="daily-log-meta">
              <div className="daily-log-date">
                <Calendar size={14} />
                <span>{formatDate(log.date)}</span>
              </div>
              <ProgressBar value={log.progress} showLabel />
            </div>
            <div className="daily-log-content">
              <div className="daily-log-field">
                <span className="daily-log-label">结果：</span>
                <span className="daily-log-value">{log.result}</span>
              </div>
              {log.output && (
                <div className="daily-log-field">
                  <span className="daily-log-label">成果：</span>
                  <span className="daily-log-value">{log.output}</span>
                </div>
              )}
            </div>
            <button className="daily-log-delete" onClick={() => onDelete(log.id)}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
