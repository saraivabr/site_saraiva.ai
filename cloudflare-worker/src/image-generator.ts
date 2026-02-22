import type { Env } from './types';

const HF_API_URL = 'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev';

export async function generateImage(
  title: string,
  slug: string,
  env: Env
): Promise<{ imageData: ArrayBuffer; filename: string } | null> {
  try {
    const prompt = buildImagePrompt(title);

    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          width: 1024,
          height: 576,
          num_inference_steps: 20,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('HF image generation failed:', response.status, errorText);

      if (response.status === 503) {
        console.log('Model is loading, skipping image generation');
      }
      return null;
    }

    const imageData = await response.arrayBuffer();
    const filename = `${slug}.webp`;

    return { imageData, filename };
  } catch (err) {
    console.error('Image generation error:', err);
    return null;
  }
}

function buildImagePrompt(title: string): string {
  const cleanTitle = title
    .replace(/['"]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .trim();

  return `Minimalist tech illustration for an article about "${cleanTitle}". Clean geometric design, black and white with subtle gradients, modern tech aesthetic, abstract representation, professional blog header image. No text, no letters, no words.`;
}
