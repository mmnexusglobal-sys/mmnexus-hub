export interface PollinationsImageResult {
  url: string;
  seed: number;
}

export async function generatePollinationsImage(prompt: string, seed?: number, width: number = 1024, height: number = 1024): Promise<PollinationsImageResult> {
  const finalSeed = seed || Math.floor(Math.random() * 1000000);
  const encodedPrompt = encodeURIComponent(prompt);
  
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${finalSeed}&width=${width}&height=${height}&nologo=true`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "User-Agent": "MMNexus-Hub/1.0"
    }
  });

  if (!response.ok) {
    throw new Error(`Pollinations API failed with status ${response.status}`);
  }

  // Pollinations devuelve la imagen directamente
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64Image = buffer.toString('base64');
  
  return {
    url: `data:image/jpeg;base64,${base64Image}`,
    seed: finalSeed
  };
}
