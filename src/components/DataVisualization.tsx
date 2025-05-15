import React, { useEffect, useRef } from 'react';
import { BarChartHorizontal, LineChart, PieChart, BarChart } from 'lucide-react';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

interface DataVisualizationProps {
  data: any[];
  chartType: string;
  darkMode: boolean;
}

const DataVisualization: React.FC<DataVisualizationProps> = ({ data, chartType, darkMode }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  // Derive column names from the first data item
  const columns = data.length > 0 ? Object.keys(data[0]) : [];
  
  // Determine if there's a time-based column for time series
  const timeColumn = columns.find(col => 
    col.toLowerCase().includes('date') || 
    col.toLowerCase().includes('time') || 
    col.toLowerCase().includes('year') ||
    col.toLowerCase().includes('month')
  );
  
  // Determine if there's a numeric column for values
  const numericColumns = columns.filter(col => {
    if (data.length === 0) return false;
    const value = data[0][col];
    return typeof value === 'number' && !isNaN(value);
  });

  // Determine if there's a category column
  const categoryColumn = columns.find(col => {
    if (numericColumns.includes(col) || col === timeColumn) return false;
    if (data.length === 0) return false;
    const values = new Set(data.map(item => item[col]));
    return values.size <= 20 && values.size > 1; // Good for categories
  });

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Default to the first numeric column if none specified
    const valueColumn = numericColumns[0] || columns[0];
    
    // Setup colors with consideration for dark mode
    const colors = darkMode
      ? ['#60A5FA', '#8B5CF6', '#34D399', '#FBBF24', '#F87171', '#2DD4BF', '#FB923C']
      : ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#14B8A6', '#F97316'];
      
    // Common chart options
    const commonOptions = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            color: darkMode ? '#D1D5DB' : '#4B5563'
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: darkMode ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          titleColor: darkMode ? '#F3F4F6' : '#111827',
          bodyColor: darkMode ? '#D1D5DB' : '#4B5563',
          borderColor: darkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(203, 213, 225, 0.5)',
          borderWidth: 1
        }
      },
      scales: {
        x: {
          grid: {
            color: darkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(203, 213, 225, 0.5)'
          },
          ticks: {
            color: darkMode ? '#D1D5DB' : '#4B5563'
          }
        },
        y: {
          grid: {
            color: darkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(203, 213, 225, 0.5)'
          },
          ticks: {
            color: darkMode ? '#D1D5DB' : '#4B5563'
          }
        }
      }
    };

    // Determine chart type and create chart
    let chartConfig;
    
    if (chartType === 'bar' || (!chartType && numericColumns.length > 0 && categoryColumn)) {
      // Bar chart
      const labels = data.map(item => item[categoryColumn || columns[0]]);
      const values = data.map(item => item[valueColumn]);
      
      chartConfig = {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: valueColumn,
            data: values,
            backgroundColor: colors[0],
            borderColor: colors[0],
            borderWidth: 1,
          }]
        },
        options: commonOptions
      };
    } else if (chartType === 'line' || (!chartType && timeColumn && numericColumns.length > 0)) {
      // Line chart (time series)
      const labels = data.map(item => item[timeColumn || columns[0]]);
      const values = data.map(item => item[valueColumn]);
      
      chartConfig = {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: valueColumn,
            data: values,
            borderColor: colors[0],
            backgroundColor: `${colors[0]}33`,
            tension: 0.3,
            fill: true,
          }]
        },
        options: commonOptions
      };
    } else if (chartType === 'pie' || (!chartType && categoryColumn && numericColumns.length > 0)) {
      // Pie chart
      const labels = data.map(item => item[categoryColumn || columns[0]]);
      const values = data.map(item => item[valueColumn]);
      
      chartConfig = {
        type: 'pie',
        data: {
          labels,
          datasets: [{
            data: values,
            backgroundColor: labels.map((_, i) => colors[i % colors.length]),
            borderColor: darkMode ? 'rgba(17, 24, 39, 0.8)' : 'white',
            borderWidth: 2,
          }]
        },
        options: {
          ...commonOptions,
          plugins: {
            ...commonOptions.plugins,
            legend: {
              ...commonOptions.plugins.legend,
              position: 'right' as const,
            }
          }
        }
      };
    } else if (chartType === 'scatter' && numericColumns.length >= 2) {
      // Scatter plot
      const xColumn = numericColumns[0];
      const yColumn = numericColumns[1];
      
      chartConfig = {
        type: 'scatter',
        data: {
          datasets: [{
            label: `${xColumn} vs ${yColumn}`,
            data: data.map(item => ({
              x: item[xColumn],
              y: item[yColumn]
            })),
            backgroundColor: colors[0],
            borderColor: colors[0],
          }]
        },
        options: commonOptions
      };
    } else {
      // Fallback to bar chart if no suitable chart type can be determined
      const labels = data.map((item, i) => categoryColumn ? item[categoryColumn] : `Item ${i+1}`);
      const values = data.map(item => numericColumns.length > 0 ? item[numericColumns[0]] : 1);
      
      chartConfig = {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: numericColumns.length > 0 ? numericColumns[0] : 'Count',
            data: values,
            backgroundColor: colors[0],
            borderColor: colors[0],
            borderWidth: 1,
          }]
        },
        options: commonOptions
      };
    }

    // Create the chart
    chartInstance.current = new Chart(
      chartRef.current,
      chartConfig as any
    );

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, chartType, darkMode]);

  const chartTypeIcon = () => {
    switch (chartType) {
      case 'bar':
        return <BarChart size={18} />;
      case 'line':
        return <LineChart size={18} />;
      case 'pie':
        return <PieChart size={18} />;
      case 'horizontal-bar':
        return <BarChartHorizontal size={18} />;
      default:
        return <BarChart size={18} />;
    }
  };

  if (data.length === 0) {
    return (
      <div className={`text-center p-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        No data available for visualization
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-2">
        {chartTypeIcon()}
        <span className={`ml-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {chartType ? chartType.charAt(0).toUpperCase() + chartType.slice(1) : 'Automatic'} Chart
        </span>
      </div>
      <div className="chart-container" style={{ position: 'relative', height: '350px', width: '100%' }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default DataVisualization;