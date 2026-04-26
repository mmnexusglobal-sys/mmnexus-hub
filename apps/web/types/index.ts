// types/index.ts
export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Message {
  id: string;
  content: string;
  userId: string;
  timestamp: Date;
}

export interface NexusData {
  // Define your nexus data structure here
  [key: string]: unknown;
}
