import React, { useState } from 'react';
import { Github, Moon, Sun } from 'lucide-react';
import QueryInput from './components/QueryInput';
import ResultsDisplay from './components/ResultsDisplay';
import Header from './components/Header';
import { QueryResult } from './types';
import { processQuery } from './services/queryService';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [queryResults, setQueryResults] = useState<QueryResult | null>(null);
  const [queryHistory, setQueryHistory] = useState<string[]>([]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleQuerySubmit = async (query: string) => {
    setLoading(true);
    try {
      // Add to history
      setQueryHistory(prev => [query, ...prev.slice(0, 9)]);
      
      // Process query
      const results = await processQuery(query);
      setQueryResults(results);
    } catch (error) {
      console.error("Error processing query:", error);
      setQueryResults({
        query,
        answer: "I encountered an error while processing your query. Please try rephrasing or ask a different question.",
        error: true,
        sql: "",
        data: [],
        chartType: null
      });
    } finally {
      setLoading(false);
    }
  };

  const handleHistorySelect = (query: string) => {
    handleQuerySubmit(query);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Header darkMode={darkMode} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <button 
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'} transition-all duration-300`}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <QueryInput 
          onSubmit={handleQuerySubmit} 
          loading={loading}
          history={queryHistory}
          onHistorySelect={handleHistorySelect}
          darkMode={darkMode}
        />
        
        {queryResults && (
          <ResultsDisplay 
            result={queryResults} 
            loading={loading}
            darkMode={darkMode} 
          />
        )}
      </main>

      <footer className={`py-6 ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm mb-2 md:mb-0">
            © 2025 AI Data Agent - Built with React & Node.js
          </p>
          <div className="flex items-center space-x-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition-colors"
              aria-label="GitHub repository"
            >
              <Github size={20} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;