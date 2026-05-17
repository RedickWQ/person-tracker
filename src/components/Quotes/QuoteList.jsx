import { useState } from 'react';
import { Plus, Trash2, X, Check, Sparkles } from 'lucide-react';
import './QuoteList.css';

export function QuoteList({ quotes, onAdd, onDelete, onUpdate }) {
  const [newQuote, setNewQuote] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState('');

  const handleAdd = () => {
    if (!newQuote.trim()) return;
    onAdd(newQuote);
    setNewQuote('');
  };

  const handleStartEdit = (quote) => {
    setEditingId(quote.id);
    setEditingContent(quote.content);
  };

  const handleSaveEdit = (id) => {
    if (!editingContent.trim()) return;
    onUpdate(id, editingContent);
    setEditingId(null);
    setEditingContent('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingContent('');
  };

  if (quotes.length === 0 && !newQuote) {
    return (
      <div className="quote-list-empty">
        <div className="quote-list-input-row">
          <input
            type="text"
            value={newQuote}
            onChange={(e) => setNewQuote(e.target.value)}
            placeholder="添加激励自己的话..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAdd();
              }
            }}
          />
          <button className="quote-add-btn" onClick={handleAdd} disabled={!newQuote.trim()}>
            <Plus size={18} />
          </button>
        </div>
        <p className="quote-list-hint">为目标添加激励语录，帮助你保持动力</p>
      </div>
    );
  }

  return (
    <div className="quote-list">
      <div className="quote-list-input-row">
        <input
          type="text"
          value={newQuote}
          onChange={(e) => setNewQuote(e.target.value)}
          placeholder="添加激励自己的话..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAdd();
            }
          }}
        />
        <button className="quote-add-btn" onClick={handleAdd} disabled={!newQuote.trim()}>
          <Plus size={18} />
        </button>
      </div>

      <div className="quote-items">
        {quotes.map((quote) => (
          <div key={quote.id} className="quote-item">
            {editingId === quote.id ? (
              <div className="quote-edit-row">
                <input
                  type="text"
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit(quote.id);
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                />
                <div className="quote-edit-actions">
                  <button className="quote-action-btn save" onClick={() => handleSaveEdit(quote.id)}>
                    <Check size={14} />
                  </button>
                  <button className="quote-action-btn cancel" onClick={handleCancelEdit}>
                    <X size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="quote-item-content">
                  <Sparkles size={14} className="quote-sparkle" />
                  <span>{quote.content}</span>
                </div>
                <div className="quote-item-actions">
                  <button
                    className="quote-action-btn danger"
                    onClick={() => onDelete(quote.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
