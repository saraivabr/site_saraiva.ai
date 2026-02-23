import type { Env, GeneratedArticle } from './types';

export async function publishToSupabase(
  article: GeneratedArticle,
  imageUrl: string | null,
  env: Env
): Promise<boolean> {
  try {
    const supabaseUrl = env.SUPABASE_URL;
    const supabaseKey = env.SUPABASE_SERVICE_KEY;

    // Insert into the "contents" table
    const payload = {
      title: article.title,
      description: article.description,
      body: article.body,
      category: article.category,
      tags: article.tags,
      featured: article.featured ?? false,
      published: true,
      image_url: imageUrl || article.image_url || null,
      pricing: article.pricing || null,
      website_url: article.sourceUrl || null,
    };

    const response = await fetch(`${supabaseUrl}/rest/v1/contents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Supabase insert failed:', response.status, errorText);
      return false;
    }

    console.log(`Published to Supabase: ${article.category}/${article.title}`);
    return true;
  } catch (err) {
    console.error('Supabase publish failed:', err);
    return false;
  }
}

export async function uploadImageToSupabase(
  imageData: ArrayBuffer,
  slug: string,
  env: Env
): Promise<string | null> {
  try {
    const supabaseUrl = env.SUPABASE_URL;
    const supabaseKey = env.SUPABASE_SERVICE_KEY;
    const filePath = `content/${slug}.webp`;

    const response = await fetch(
      `${supabaseUrl}/storage/v1/object/images/${filePath}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'image/webp',
          'x-upsert': 'true',
        },
        body: imageData,
      }
    );

    if (!response.ok) {
      console.warn('Image upload failed:', response.status);
      return null;
    }

    // Return the public URL
    return `${supabaseUrl}/storage/v1/object/public/images/${filePath}`;
  } catch (err) {
    console.warn('Image upload error:', err);
    return null;
  }
}
