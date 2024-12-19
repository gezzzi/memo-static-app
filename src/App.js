import { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './App.css';

function App() {
  const [memos, setMemos] = useState(() => {
    // ローカルストレージからメモを読み込む
    const savedMemos = localStorage.getItem('memos');
    return savedMemos ? JSON.parse(savedMemos) : [];
  });
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  // メモが更新されたらローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('memos', JSON.stringify(memos));
  }, [memos]);

  // 日付をフォーマットする関数
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const addMemo = () => {
    if (input.trim() !== '') {
      setMemos([...memos, { 
        id: Date.now(),
        text: input,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }]);
      setInput('');
    }
  };

  const startEditing = (memo) => {
    setEditingId(memo.id);
    setEditText(memo.text);
  };

  const saveEdit = (id) => {
    if (editText.trim() !== '') {
      setMemos(memos.map(memo => 
        memo.id === id 
          ? { 
              ...memo, 
              text: editText,
              updatedAt: Date.now() // 更新日時を設定
            } 
          : memo
      ));
      setEditingId(null);
      setEditText('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const deleteMemo = (id) => {
    if (window.confirm('このメモを削除してもよろしいですか？')) {
      setMemos(memos.filter(memo => memo.id !== id));
    }
  };

  return (
    <div className="App">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">メモアプリ</h1>
        
        {/* 入力フォーム */}
        <div className="mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                addMemo();
              }
            }}
            className="border p-2 mr-2 rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
            placeholder="メモを入力..."
          />
          <button
            onClick={addMemo}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            追加
          </button>
        </div>

        {/* メモ一覧 */}
        <div className="space-y-2">
          <TransitionGroup>
            {memos.map(memo => (
              <CSSTransition
                key={memo.id}
                timeout={300}
                classNames="memo"
              >
                <div className="flex flex-col bg-gray-50 dark:bg-gray-800 p-3 rounded shadow-sm">
                  {editingId === memo.id ? (
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            saveEdit(memo.id);
                          } else if (e.key === 'Escape') {
                            cancelEdit();
                          }
                        }}
                        className="flex-1 border p-1 rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                        autoFocus
                      />
                      <button
                        onClick={() => saveEdit(memo.id)}
                        className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                      >
                        保存
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        キャンセル
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 flex items-center gap-2">
                        <span className="text-gray-800 dark:text-gray-200">{memo.text}</span>
                        <button
                          onClick={() => startEditing(memo)}
                          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => deleteMemo(memo.id)}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          削除
                        </button>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        作成: {formatDate(memo.createdAt)}
                        {memo.updatedAt !== memo.createdAt && 
                          ` / 更新: ${formatDate(memo.updatedAt)}`}
                      </div>
                    </>
                  )}
                </div>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </div>
      </div>
    </div>
  );
}

// index.htmlのbase hrefを動的に設定
const baseUrl = document.getElementsByTagName('base')[0]?.getAttribute('href') || '/';
document.getElementsByTagName('base')[0]?.setAttribute('href', process.env.PUBLIC_URL || baseUrl);

export default App;
