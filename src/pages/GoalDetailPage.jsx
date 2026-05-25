import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Header } from '../components/Layout/Header';
import { Card } from '../components/Common/Card';
import { Button } from '../components/Common/Button';
import { GoalForm } from '../components/Goal/GoalForm';
import { MilestoneList } from '../components/Goal/MilestoneList';
import { ProgressSlider } from '../components/Goal/ProgressSlider';
import { ReadingTimer } from '../components/Goal/ReadingTimer';
import { QuoteList } from '../components/Quotes/QuoteList';
import { useGoals } from '../hooks/useGoals';
import { useGoal } from '../hooks/useGoal';
import { useMilestones } from '../hooks/useMilestones';
import { useDailyLogs } from '../hooks/useDailyLogs';
import { useQuotes } from '../hooks/useQuotes';
import { GoalStatus, GoalType, GoalTypeConfig } from '../constants';
import { ArrowLeft, Trash2, Calendar, TrendingUp, CheckCircle2, Sparkles } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';
import './GoalDetailPage.css';

const statusConfig = {
  [GoalStatus.NOT_STARTED]: { label: '未开始', color: '#94A3B8' },
  [GoalStatus.IN_PROGRESS]: { label: '进行中', color: '#6366F1' },
  [GoalStatus.COMPLETED]: { label: '已完成', color: '#22C55E' },
  [GoalStatus.PAUSED]: { label: '已暂停', color: '#F59E0B' }
};

export function GoalDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateGoal, deleteGoal } = useGoals();
  const { goal, loading: goalLoading, error } = useGoal(id);
  const { milestones, addMilestone, toggleMilestone, deleteMilestone } = useMilestones(Number(id));
  const { logs, addLog, deleteLog } = useDailyLogs(Number(id));

  const [showEditForm, setShowEditForm] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);
  const [completedItems, setCompletedItems] = useState('');
  const [output, setOutput] = useState('');
  const [logPage, setLogPage] = useState(1);
  const [localProgress, setLocalProgress] = useState(null);
  const [localReadingTime, setLocalReadingTime] = useState(0);
  const [localTotalReadingTime, setLocalTotalReadingTime] = useState(600);
  const PAGE_SIZE = 5;

  const { quotes, addQuote, deleteQuote, updateQuote } = useQuotes(Number(id));

  // 当 goal 加载完成时，初始化本地进度和阅读时长
  useEffect(() => {
    if (goal) {
      setLocalReadingTime(goal.readingTime || 0);
      setLocalTotalReadingTime(goal.totalReadingTime || 600);
      // 阅读类型目标：根据阅读时长计算进度
      if (goal.goalType === GoalType.READING && goal.totalReadingTime) {
        const calculatedProgress = Math.min(100, Math.round((goal.readingTime / goal.totalReadingTime) * 100));
        setLocalProgress(calculatedProgress);
      } else {
        setLocalProgress(goal.progress || 0);
      }
    }
  }, [goal]);

  const handleDelete = async () => {
    if (window.confirm('确定要删除这个目标吗？相关的里程碑和日志也会被删除。')) {
      await deleteGoal(Number(id));
      navigate('/');
    }
  };

  const handleAddLog = () => {
    if (!completedItems.trim()) return;
    addLog({
      completedItems: completedItems.trim(),
      output: output.trim()
    });
    setCompletedItems('');
    setOutput('');
    setShowLogForm(false);
    setLogPage(1);
  };

  const handleProgressChange = (newProgress) => {
    // 立即更新本地状态，UI 立刻响应
    setLocalProgress(newProgress);
    // 后台同步到 API
    updateGoal(Number(id), { progress: newProgress });
  };

  // 分页数据 - 倒序排列，最新日期在前
  const sortedLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date));
  const totalPages = Math.ceil(sortedLogs.length / PAGE_SIZE);
  const paginatedLogs = sortedLogs.slice((logPage - 1) * PAGE_SIZE, logPage * PAGE_SIZE);

  // 显示加载状态或错误
  if (goalLoading) {
    return (
      <div className="page">
        <Header title="目标详情" />
        <div className="page-content">
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  // 如果目标不存在，显示提示
  if (error || !goal) {
    return (
      <div className="page">
        <Header title="目标详情" />
        <div className="page-content">
          <p>目标不存在或已被删除</p>
          <Button onClick={() => navigate('/')}>返回仪表盘</Button>
        </div>
      </div>
    );
  }

  const status = statusConfig[goal.status] || statusConfig[GoalStatus.NOT_STARTED];
  const completedMilestones = milestones.filter(m => m.completed).length;

  return (
    <div className="page">
      <Header title="目标详情" />
      <div className="page-content">
        <div className="goal-detail-header">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft size={18} /> 返回
          </Button>
          <div className="goal-detail-actions">
            <Button variant="secondary" onClick={() => setShowEditForm(true)}>
              编辑
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              <Trash2 size={16} />
            </Button>
          </div>
        </div>

        {/* 目标概览 */}
        <Card className="goal-overview">
          <div className="overview-header">
            <div className="overview-info">
              <span className="status-badge" style={{ background: status.color }}>
                {status.label}
              </span>
              <h1 className="goal-title">{goal.title}</h1>
              {goal.description && (
                <p className="goal-desc">{goal.description}</p>
              )}
            </div>
          </div>

          <div className="overview-stats">
            <div className="stat-card">
              <div className="stat-icon">
                <Calendar size={20} />
              </div>
              <div className="stat-content">
                <span className="stat-label">记录天数</span>
                <span className="stat-value">{logs.length} 天</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <CheckCircle2 size={20} />
              </div>
              <div className="stat-content">
                <span className="stat-label">里程碑</span>
                <span className="stat-value">{completedMilestones}/{milestones.length}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <TrendingUp size={20} />
              </div>
              <div className="stat-content">
                <span className="stat-label">目标状态</span>
                <span className="stat-value">{status.label}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* 完成进度 - 非阅读目标显示进度条 */}
        {goal.goalType !== GoalType.READING && (
          <Card className="goal-progress-card">
            <ProgressSlider
              value={localProgress || 0}
              onChange={handleProgressChange}
            />
          </Card>
        )}

        {/* 阅读计时器 */}
        {goal.goalType === GoalType.READING && (
          <Card className="reading-timer-card">
            <ReadingTimer
              totalMinutes={localTotalReadingTime}
              completedMinutes={localReadingTime}
              onSave={async (newTotalMinutes) => {
                const calculatedProgress = Math.min(100, Math.round((newTotalMinutes / localTotalReadingTime) * 100));
                setLocalReadingTime(newTotalMinutes);
                setLocalProgress(calculatedProgress);
                await updateGoal(Number(id), {
                  readingTime: newTotalMinutes,
                  progress: calculatedProgress
                });
              }}
              onComplete={() => {
                setLocalProgress(100);
                updateGoal(Number(id), { progress: 100, readingTime: localTotalReadingTime });
              }}
            />
            <div className="reading-time-manual">
              <label>手动调整阅读时长（分钟）：</label>
              <input
                type="number"
                className="reading-time-input"
                value={localReadingTime}
                onChange={(e) => {
                  const newTime = Number(e.target.value) || 0;
                  setLocalReadingTime(newTime);
                  const calculatedProgress = Math.min(100, Math.round((newTime / localTotalReadingTime) * 100));
                  setLocalProgress(calculatedProgress);
                }}
                min="0"
              />
              <Button
                size="sm"
                onClick={async () => {
                  const calculatedProgress = Math.min(100, Math.round((localReadingTime / localTotalReadingTime) * 100));
                  await updateGoal(Number(id), {
                    readingTime: localReadingTime,
                    progress: calculatedProgress
                  });
                }}
              >
                保存
              </Button>
            </div>
          </Card>
        )}

        {/* 激励语录 */}
        <Card className="quotes-card">
          <div className="section-header">
            <h2><Sparkles size={18} /> 激励语录</h2>
          </div>
          <QuoteList
            quotes={quotes}
            onAdd={addQuote}
            onDelete={deleteQuote}
            onUpdate={updateQuote}
          />
        </Card>

        {/* 每日记录 */}
        <div className="detail-sections">
          <div className="section-logs">
            <div className="section-header">
              <h2>每日记录</h2>
              <Button size="sm" onClick={() => setShowLogForm(true)}>
                + 添加记录
              </Button>
            </div>

            {showLogForm && (
              <Card className="log-form">
                <div className="log-form-field">
                  <label>当天完结事项 *</label>
                  <textarea
                    value={completedItems}
                    onChange={(e) => setCompletedItems(e.target.value)}
                    placeholder="今天完成了哪些事项？"
                    rows={3}
                  />
                </div>
                <div className="log-form-field">
                  <label>成果</label>
                  <textarea
                    value={output}
                    onChange={(e) => setOutput(e.target.value)}
                    placeholder="产出/成果（可选）"
                    rows={2}
                  />
                </div>
                <div className="log-form-actions">
                  <Button onClick={handleAddLog}>保存</Button>
                  <Button variant="ghost" onClick={() => setShowLogForm(false)}>取消</Button>
                </div>
              </Card>
            )}

            {logs.length === 0 ? (
              <div className="empty-logs">
                <p>暂无记录，点击上方按钮添加</p>
              </div>
            ) : (
              <>
                <div className="logs-timeline">
                  {paginatedLogs.map((log) => (
                    <div key={log.id} className="log-item">
                      <div className="log-item-header">
                        <span className="log-date">{formatDate(log.date)}</span>
                      </div>
                      <div className="log-item-content">
                        <div className="log-field">
                          <span className="log-label">完结事项：</span>
                          <span className="log-value markdown-content"><ReactMarkdown>{log.completedItems}</ReactMarkdown></span>
                        </div>
                      </div>
                      <button className="log-delete" onClick={() => deleteLog(log.id)}>
                        删除
                      </button>
                    </div>
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="pagination">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={logPage === 1}
                      onClick={() => setLogPage(p => p - 1)}
                    >
                      上一页
                    </Button>
                    <span className="page-info">{logPage} / {totalPages}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={logPage === totalPages}
                      onClick={() => setLogPage(p => p + 1)}
                    >
                      下一页
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* 里程碑 */}
          <div className="section-milestones">
            <div className="section-header">
              <h2>里程碑</h2>
            </div>
            <Card className="milestones-card">
              <MilestoneList
                milestones={milestones}
                onAdd={addMilestone}
                onToggle={toggleMilestone}
                onDelete={deleteMilestone}
              />
            </Card>
          </div>
        </div>

        <GoalForm
          isOpen={showEditForm}
          onClose={() => setShowEditForm(false)}
          onSubmit={async (updates) => {
            await updateGoal(Number(id), updates);
            setShowEditForm(false);
          }}
          initialData={goal}
        />
      </div>
    </div>
  );
}
