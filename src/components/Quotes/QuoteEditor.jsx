import { useState } from 'react';
import { Card } from '../Common/Card';
import { Button } from '../Common/Button';
import { useQuotes } from '../../hooks/useQuotes';
import { Trash2, Plus, Edit2, X, Check } from 'lucide-react';
import './QuoteEditor.css';

export function QuoteEditor({ isOpen, onClose }) {
  const { quotes, addQuote, deleteQuote, updateQuote } = useQuotes();
  const [newQuote, setNewQuote] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState('');

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!newQuote.trim()) return;
    addQuote(newQuote);
    setNewQuote('');
  };

  const handleStartEdit = (quote) => {
    setEditingId(quote.id);
    setEditingContent(quote.content);
  };

  const handleSaveEdit = (id) => {
    if (!editingContent.trim()) return;
    updateQuote(id, editingContent);
    setEditingId(null);
    setEditingContent('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingContent('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content quote-editor-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>我的励志语录</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>

        <div className="quote-editor-body">
          <div className="quote-input-row">
            <textarea
              value={newQuote}
              onChange={(e) => setNewQuote(e.target.value)}
              placeholder="写下激励自己的话..."
              rows={2}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAdd();
                }
              }}
            />
            <Button onClick={handleAdd} disabled={!newQuote.trim()}>
              <Plus size={18} />
            </Button>
          </div>

          <div className="quote-list">
            {quotes.length === 0 ? (
              <p className="empty-quotes">暂无语录，添加第一条吧</p>
            ) : (
              quotes.map((quote) => (
                <div key={quote.id} className="quote-item">
                  {editingId === quote.id ? (
                    <div className="quote-edit-row">
                      <textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        rows={2}
                        autoFocus
                      />
                      <div className="quote-edit-actions">
                        <Button variant="ghost" size="sm" onClick={() => handleSaveEdit(quote.id)}>
                          <Check size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                          <X size={16} />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="quote-content">{quote.content}</p>
                      <div className="quote-actions">
                        <button
                          className="quote-action-btn"
                          onClick={() => handleStartEdit(quote)}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="quote-action-btn danger"
                          onClick={() => deleteQuote(quote.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
