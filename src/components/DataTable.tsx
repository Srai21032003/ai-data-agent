import React, { useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface DataTableProps {
  data: any[];
  darkMode: boolean;
}

const DataTable: React.FC<DataTableProps> = ({ data, darkMode }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const rowsPerPage = 10;

  if (!data || data.length === 0) {
    return (
      <div className={`text-center p-4 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-500'}`}>
        No data available
      </div>
    );
  }

  // Get column headers
  const columns = Object.keys(data[0]);

  // Sort data
  const sortedData = [...data].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    const aString = String(aValue).toLowerCase();
    const bString = String(bValue).toLowerCase();
    
    if (sortDirection === 'asc') {
      return aString.localeCompare(bString);
    } else {
      return bString.localeCompare(aString);
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + rowsPerPage);

  const handleSort = (column: string) => {
    if (sortField === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(column);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (column !== sortField) return <ArrowUpDown size={14} className="opacity-30" />;
    return sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };

  return (
    <div>
      <div className={`rounded-lg overflow-hidden shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                {columns.map(column => (
                  <th
                    key={column}
                    onClick={() => handleSort(column)}
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    } ${sortField === column ? 'bg-opacity-20 bg-blue-500' : ''}`}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column}</span>
                      <SortIcon column={column} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {paginatedData.map((row, rowIndex) => (
                <tr 
                  key={rowIndex}
                  className={`${
                    darkMode 
                      ? rowIndex % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750' 
                      : rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } hover:bg-opacity-80 transition-colors`}
                >
                  {columns.map(column => (
                    <td 
                      key={column} 
                      className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      {formatCellValue(row[column])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={`flex items-center justify-between px-4 py-3 ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} mt-4 rounded-b-lg`}>
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-400'
                  : darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'
              } border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                currentPage === totalPages
                  ? darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-400'
                  : darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'
              } border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(startIndex + rowsPerPage, sortedData.length)}
                </span>{' '}
                of <span className="font-medium">{sortedData.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${darkMode ? 'border-gray-600' : 'border-gray-300'} ${
                    currentPage === 1
                      ? darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-400'
                      : darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">First Page</span>
                  <ChevronsLeft size={16} />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 border ${darkMode ? 'border-gray-600' : 'border-gray-300'} ${
                    currentPage === 1
                      ? darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-400'
                      : darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft size={16} />
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  // Show pages around current page
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border ${
                        darkMode ? 'border-gray-600' : 'border-gray-300'
                      } ${
                        currentPage === pageNum
                          ? darkMode 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-blue-50 border-blue-500 text-blue-600'
                          : darkMode 
                            ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 border ${darkMode ? 'border-gray-600' : 'border-gray-300'} ${
                    currentPage === totalPages
                      ? darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-400'
                      : darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight size={16} />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${darkMode ? 'border-gray-600' : 'border-gray-300'} ${
                    currentPage === totalPages
                      ? darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-400'
                      : darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Last Page</span>
                  <ChevronsRight size={16} />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to format cell values
const formatCellValue = (value: any): string => {
  if (value === null || value === undefined) return '—';
  
  if (typeof value === 'number') {
    // Format numbers with commas for thousands
    return value % 1 === 0 
      ? value.toLocaleString() 
      : value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  
  return String(value);
};

export default DataTable;