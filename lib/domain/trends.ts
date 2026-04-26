export interface ExtractTrendsRequest {
  reportText: string;
}

export interface TrendReport {
  topic: string;
  score: number;
  summary: string;
  keywords: string[];
}
