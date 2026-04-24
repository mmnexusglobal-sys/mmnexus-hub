export type ImageProvider = "google-ai" | "pollinations";

export interface GenerateImageRequest {
  prompt: string;
  seed?: number;
  width?: number;
  height?: number;
}

export interface GenerateImageResult {
  url: string;
  provider: ImageProvider;
  warning?: string;
  seed?: number;
}
