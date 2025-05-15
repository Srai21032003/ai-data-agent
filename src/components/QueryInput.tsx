import React, { useState, useRef, useEffect } from 'react';
import { Search, Clock, ArrowUp } from 'lucide-react';

interface QueryInputProps {
  onSubmit: (query: string) => void;
  loading: boolean;
  history: string[];
  onHistorySelect: (query: string) => void;
  darkMode: boolean;
}

const QueryInput: React.FC<QueryInputProps> = ({
  onSubmit,
  loading,
  history,
  onHistorySelect,
  darkMode
}) => {
  const [query, setQuery] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  // Example queries
  const exampleQueries = [
    "What were our top 5 selling products last quarter?",
    "Show me customer retention rates by region",
    "Compare revenue growth across all departments in 2023",
    "Identify outliers in marketing spend vs. ROI"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !loading) {
      onSubmit(query.trim());
      setShowHistory(false);
    }
  };

  const handleHistoryClick = (historyQuery: string) => {
    setQuery(historyQuery);
    onHistorySelect(historyQuery);
    setShowHistory(false);
  };

  const handleExampleClick = (exampleQuery: string) => {
    setQuery(exampleQuery);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle clicks outside of history dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        historyRef.current && 
        !historyRef.current.contains(event.target as Node) &&
        event.target !== document.getElementById('history-button')
      ) {
        setShowHistory(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  return (
    <div className={`mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-4">
          <div className={`flex flex-col rounded-xl shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="relative">
              <textarea
                ref={inputRef}
                value={query}
                onChange={handleTextareaChange}
                placeholder="Ask a complex analytical question..."
                className={`w-full px-4 py-4 pr-12 resize-none overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  darkMode ? 'bg-gray-800 text-white placeholder-gray-400' : 'bg-white text-gray-800 placeholder-gray-400'
                }`}
                rows={1}
                style={{ minHeight: '56px' }}
              />
              <div className="absolute right-2 bottom-2 flex space-x-2">
                <button
                  id="history-button"
                  type="button"
                  onClick={() => setShowHistory(!showHistory)}
                  className={`p-2 rounded-full ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  } transition-colors`}
                  aria-label="View query history"
                >
                  <Clock size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                </button>
                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className={`p-2 rounded-full ${
                    loading || !query.trim()
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  } transition-colors`}
                  aria-label="Submit query"
                >
                  {loading ? (
                    <div className="w-[18px] h-[18px] border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ArrowUp size={18} />
                  )}
                </button>
              </div>
            </div>
            
            {showHistory && history.length > 0 && (
              <div 
                ref={historyRef}
                className={`py-2 px-1 border-t ${
                  darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
                }`}
              >
                <h3 className={`px-3 py-1 text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Recent Queries
                </h3>
                <ul>
                  {history.map((historyItem, index) => (
                    <li key={index}>
                      <button
                        type="button"
                        onClick={() => handleHistoryClick(historyItem)}
                        className={`w-full text-left px-3 py-2 text-sm rounded ${
                          darkMode 
                            ? 'hover:bg-gray-700 text-gray-300' 
                            : 'hover:bg-gray-100 text-gray-600'
                        } transition-colors truncate`}
                      >
                        {historyItem}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-4">
            <h3 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Try asking:
            </h3>
            <div className="flex flex-wrap gap-2">
              {exampleQueries.map((example, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleExampleClick(example)}
                  className={`text-xs px-3 py-1.5 rounded-full ${
                    darkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  } transition-colors`}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default QueryInput;