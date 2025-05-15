export interface QueryResult {
  query: string;
  answer: string;
  error?: boolean;
  sql: string;
  data: any[];
  chartType: string | null;
}