import { QueryResult } from '../types';
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini API
const ai = new GoogleGenAI(import.meta.env.VITE_GEMINI_API_KEY);
export const processQuery = async (query: string): Promise<QueryResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `You are an expert business analyst. Analyze this business question and provide detailed insights with specific numbers and metrics: ${query}

// Please format your response to include:
// 1. A clear, direct answer
// 2. Key metrics and trends
// 3. Specific numbers and percentages
// 4. Business implications`,
    });
    console.log(response.text);
//     // Get the generative model
//     const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

//     const prompt = `You are an expert business analyst. Analyze this business question and provide detailed insights with specific numbers and metrics: ${query}

// Please format your response to include:
// 1. A clear, direct answer
// 2. Key metrics and trends
// 3. Specific numbers and percentages
// 4. Business implications`;

//     // Generate content
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const answer = response.text();
    
//     // Extract data points from Gemini's response for visualization
//     const data = extractDataPoints(answer);
    
//     // Determine best chart type based on data structure
//     const chartType = determineChartType(data);

    return {
      query,
      answer,
      sql: "", // Gemini handles the SQL internally
      data,
      chartType
    };
  } catch (error) {
    console.error("Error processing query:", error);
    return {
      query,
      answer: "I encountered an error while processing your query. Please try again.",
      error: true,
      sql: "",
      data: [],
      chartType: null
    };
  }
};

// Helper function to extract structured data from Gemini's response
function extractDataPoints(answer: string): any[] {
  // Extract numbers and associated labels using regex
  const dataPoints: any[] = [];
  
  // Match patterns like "45%" or "$1.2M" or "1,234"
  const numberPattern = /\$?(\d{1,3}(,\d{3})*(\.\d+)?)(K|M|B|%)?/g;
  const matches = answer.matchAll(numberPattern);
  
  for (const match of matches) {
    let value = parseFloat(match[1].replace(/,/g, ''));
    
    // Handle suffixes
    if (match[4]) {
      switch (match[4]) {
        case 'K':
          value *= 1000;
          break;
        case 'M':
          value *= 1000000;
          break;
        case 'B':
          value *= 1000000000;
          break;
        case '%':
          // Keep percentage as is
          break;
      }
    }
    
    // Try to find a label in the text before the number
    const precedingText = answer.substring(Math.max(0, answer.indexOf(match[0]) - 50), answer.indexOf(match[0]));
    const label = precedingText.match(/([A-Za-z\s]+):?\s*$/)?.[1]?.trim() || `Metric ${dataPoints.length + 1}`;
    
    dataPoints.push({
      label,
      value
    });
  }
  
  return dataPoints;
}

// Helper function to determine appropriate chart type
function determineChartType(data: any[]): string {
  if (data.length === 0) return null;
  
  // Check if the data contains percentages
  const hasPercentages = data.some(point => point.value <= 100 && point.label.toLowerCase().includes('rate'));
  if (hasPercentages) return 'pie';
  
  // Check if the data points are time-based
  const hasTimeLabels = data.some(point => 
    point.label.toLowerCase().includes('year') ||
    point.label.toLowerCase().includes('month') ||
    point.label.toLowerCase().includes('quarter')
  );
  if (hasTimeLabels) return 'line';
  
  // Default to bar chart for comparisons
  return 'bar';
}