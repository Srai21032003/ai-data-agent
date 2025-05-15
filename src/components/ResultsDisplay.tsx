import React, { useState } from 'react';
import { Download, HelpCircle, Code, AlertCircle } from 'lucide-react';
import { QueryResult } from '../types';
import DataVisualization from './DataVisualization';
import DataTable from './DataTable';

interface ResultsDisplayProps {
  result: QueryResult;
  loading: boolean;
  darkMode: boolean;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, loading, darkMode }) => {
  const [showSql, setShowSql] = useState(false);
  
  if (loading) {
    return (
      <div className={`p-8 rounded-xl shadow-lg text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="animate-pulse flex flex-col items-center">
          <div className={`h-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded w-3/4 mb-4`}></div>
          <div className={`h-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded w-1/2 mb-8`}></div>
          <div className={`h-40 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded w-full mb-4`}></div>
          <div className={`h-24 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded w-full`}></div>
        </div>
      </div>
    );
  }

  const handleExport = () => {
    // Create a blob with the data
    const data = {
      query: result.query,
      answer: result.answer,
      sql: result.sql,
      data: result.data
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create a link and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = `query-result-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`rounded-xl shadow-lg overflow-hidden scale-in ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      {/* Header with query summary */}
      <div className={`p-6 ${darkMode ? 'border-b border-gray-700' : 'border-b'}`}>
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold">Results</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowSql(!showSql)}
              className={`p-2 rounded-full ${
                darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              } transition-colors`}
              aria-label="Toggle SQL query"
            >
              <Code size={20} />
            </button>
            <button
              onClick={handleExport}
              className={`p-2 rounded-full ${
                darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              } transition-colors`}
              aria-label="Export results"
            >
              <Download size={20} />
            </button>
          </div>
        </div>
        
        <div className={`rounded-lg p-4 mb-4 ${
          result.error 
            ? darkMode ? 'bg-red-900/20 text-red-200' : 'bg-red-50 text-red-800'
            : darkMode ? 'bg-blue-900/20 text-blue-200' : 'bg-blue-50 text-blue-800'
        }`}>
          <div className="flex items-start">
            {result.error ? (
              <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-1" />
            ) : (
              <HelpCircle size={20} className="mr-2 flex-shrink-0 mt-1" />
            )}
            <p className="text-sm"><strong>Query:</strong> {result.query}</p>
          </div>
        </div>
        
        {showSql && result.sql && (
          <div className={`rounded-lg p-4 mb-4 font-mono text-sm overflow-x-auto ${
            darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-800'
          }`}>
            <p className="mb-2 text-xs uppercase font-semibold text-gray-500">Generated SQL:</p>
            <pre>{result.sql}</pre>
          </div>
        )}
        
        <div className="prose max-w-none">
          <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
            {result.answer}
          </p>
        </div>
      </div>
      
      {/* Visualization section */}
      {!result.error && result.data && result.data.length > 0 && (
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">Data Visualization</h3>
          
          {result.chartType && (
            <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <DataVisualization 
                data={result.data} 
                chartType={result.chartType}
                darkMode={darkMode}
              />
            </div>
          )}
          
          <div className="overflow-x-auto">
            <DataTable data={result.data} darkMode={darkMode} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;