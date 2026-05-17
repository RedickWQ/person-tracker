import { useState, useEffect } from 'react';
import { Modal } from '../Common/Modal';
import { Button } from '../Common/Button';
import { GoalStatus } from '../../constants';
import { getTodayStr } from '../../utils/dateUtils';
import './GoalForm.css';

const statusOptions = [
  { value: GoalStatus.NOT_STARTED, label: '未开始' },
  { value: GoalStatus.IN_PROGRESS, label: '进行中' },
  { value: GoalStatus.COMPLETED, label: '已完成' },
  { value: GoalStatus.PAUSED, label: '已暂停' }
];

export function GoalForm({ isOpen, onClose, onSubmit, initialData }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [status, setStatus] = useState(initialData?.status || GoalStatus.IN_PROGRESS);
  const [startDate, setStartDate] = useState(initialData?.startDate || getTodayStr());
  const [endDate, setEndDate] = useState(initialData?.endDate || '');

  // 当 initialData 变化时更新表单
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setStatus(initialData.status || GoalStatus.IN_PROGRESS);
      setStartDate(initialData.startDate || getTodayStr());
      setEndDate(initialData.endDate || '');
    } else {
      setTitle('');
      setDescription('');
      setStatus(GoalStatus.IN_PROGRESS);
      setStartDate(getTodayStr());
      setEndDate('');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      status,
      startDate,
      endDate: endDate || undefined
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? '编辑目标' : '新建目标'}>
      <form className="goal-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">标题 *</label>
          <input
            type="text"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="输入目标标题"
            autoFocus
          />
        </div>
        <div className="form-group">
          <label className="form-label">描述</label>
          <textarea
            className="form-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="描述你的目标（可选）"
            rows={3}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">开始日期</label>
            <input
              type="date"
              className="form-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">结束日期</label>
            <input
              type="date"
              className="form-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="可选"
            />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">状态</label>
          <select
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="form-actions">
          <Button variant="secondary" onClick={onClose}>取消</Button>
          <Button type="submit" disabled={!title.trim()}>
            {initialData ? '保存' : '创建'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
