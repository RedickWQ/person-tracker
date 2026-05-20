import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '../Common/Button';
import './ReadingTimer.css';

export function ReadingTimer({ totalMinutes, completedMinutes, onSave, onComplete }) {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  const totalSeconds = totalMinutes * 60;
  const completedSeconds = completedMinutes * 60 + sessionSeconds;
  const progress = Math.min(100, (completedSeconds / totalSeconds) * 100);

  // 圆形进度计算
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - elapsedSeconds * 1000;
      intervalRef.current = setInterval(() => {
        const current = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setElapsedSeconds(current);
        setSessionSeconds(current);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, elapsedSeconds]);

  // 检查是否完成
  useEffect(() => {
    if (completedSeconds >= totalSeconds && onComplete) {
      onComplete();
    }
  }, [completedSeconds, totalSeconds, onComplete]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleSave = () => {
    if (onSave && sessionSeconds > 0) {
      onSave(completedMinutes + Math.floor(sessionSeconds / 60));
    }
    setSessionSeconds(0);
    setElapsedSeconds(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="reading-timer">
      <div className="timer-circle-container">
        <svg className="timer-circle" width="180" height="180" viewBox="0 0 180 180">
          {/* 背景圆 - 灰色 */}
          <circle
            className="timer-circle-bg"
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="12"
          />
          {/* 进度圆 - 绿色 */}
          <circle
            className="timer-circle-progress"
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="#10B981"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 90 90)"
          />
        </svg>
        <div className="timer-display">
          <span className="timer-time">{formatTime(completedSeconds)}</span>
          <span className="timer-total">/ {totalMinutes} 分钟</span>
        </div>
      </div>

      <div className="timer-controls">
        {!isRunning ? (
          <Button onClick={handleStart} className="timer-btn-start">
            ▶ 开始计时
          </Button>
        ) : (
          <Button onClick={handleStop} variant="secondary" className="timer-btn-stop">
            ⏸ 暂停
          </Button>
        )}
        {sessionSeconds > 0 && !isRunning && (
          <Button onClick={handleSave} variant="primary" className="timer-btn-save">
            💾 保存本次 ({Math.floor(sessionSeconds / 60)} 分钟)
          </Button>
        )}
      </div>

      <div className="timer-status">
        {progress >= 100 ? (
          <span className="status-complete">🎉 目标完成！</span>
        ) : isRunning ? (
          <span className="status-running">计时中...</span>
        ) : sessionSeconds > 0 ? (
          <span className="status-paused">已暂停，点击保存或继续计时</span>
        ) : (
          <span className="status-ready">点击开始计时</span>
        )}
      </div>
    </div>
  );
}
