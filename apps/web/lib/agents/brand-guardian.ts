export interface BrandGuidelines {
  brandName: string;
  toneOfVoice: string[];
  forbiddenWords: string[];
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
  };
  typography: {
    heading: string;
    body: string;
  };
  logoPlacement?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
}

export interface ValidationResult {
  approved: boolean;
  score: number; // 0-100
  feedback: string[];
}

export class BrandGuardian {
  private guidelines: BrandGuidelines;

  constructor(guidelines: BrandGuidelines) {
    this.guidelines = guidelines;
  }

  /**
   * Evaluates text content against brand tone and forbidden words.
   */
  public evaluateCopy(text: string): ValidationResult {
    const feedback: string[] = [];
    let score = 100;

    // Check for forbidden words
    const lowerText = text.toLowerCase();
    for (const word of this.guidelines.forbiddenWords) {
      if (lowerText.includes(word.toLowerCase())) {
        feedback.push(`Forbidden word detected: "${word}"`);
        score -= 20;
      }
    }

    // A real implementation would use an LLM here to evaluate tone of voice
    if (score === 100) {
      feedback.push("Copy aligns perfectly with brand guidelines.");
    }

    return {
      approved: score >= 80,
      score: Math.max(0, score),
      feedback
    };
  }

  /**
   * Evaluates visual metadata (colors, typography) against brand guidelines.
   * In a real system, this might use Vision API or image metadata.
   */
  public evaluateDesign(metadata: any): ValidationResult {
    const feedback: string[] = [];
    let score = 100;
    
    // Example validation logic
    if (metadata.colors && !metadata.colors.includes(this.guidelines.colorPalette.primary)) {
      feedback.push("Design is missing the primary brand color.");
      score -= 30;
    }

    return {
      approved: score >= 80,
      score: Math.max(0, score),
      feedback
    };
  }
}
