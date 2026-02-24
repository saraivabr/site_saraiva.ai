import { createClient } from '@supabase/supabase-js';
import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = 'https://gefjcbigryytfsljgmae.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlZmpjYmlncnl5dGZzbGpnbWFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5NjQ3ODUsImV4cCI6MjA4NjU0MDc4NX0.D9dnIvCKqil1evvANMGX74U2v9HND2CdKOrZS7TsMoQ';

const supabase = createClient(supabaseUrl, supabaseKey);

// Mapear categorias markdown -> supabase
const categoryMap = {
  'tutoriais': 'tool',
  'analises': 'analysis',
  'blog': 'thought',
  'ferramentas': 'tool',
  'prompts': 'prompt',
  'pensamentos': 'thought'
};

async function migrateOpenClawContent() {
  const contentDir = path.join(__dirname, '../src/content');
  const categories = ['tutoriais', 'analises', 'blog'];
  
  let migrated = 0;
  let errors = 0;

  for (const category of categories) {
    const categoryPath = path.join(contentDir, category);
    if (!fs.existsSync(categoryPath)) continue;

    const files = fs.readdirSync(categoryPath)
      .filter(f => f.endsWith('.md') && f.includes('openclaw'));

    console.log(`\n📂 ${category}: ${files.length} arquivos OpenClaw encontrados`);

    for (const file of files) {
      try {
        const filePath = path.join(categoryPath, file);
        const raw = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(raw);

        // Mapear categoria
        const supabaseCategory = categoryMap[category] || 'thought';

        // Preparar dados
        const record = {
          title: data.title,
          description: data.description || '',
          body: content,
          category: supabaseCategory,
          tags: data.tags || [],
          featured: data.featured || false,
          published: true,
        };

        // Inserir no Supabase
        const { error } = await supabase
          .from('contents')
          .insert(record);

        if (error) {
          console.error(`❌ Erro ao migrar ${file}:`, error.message);
          errors++;
        } else {
          console.log(`✅ Migrado: ${data.title}`);
          migrated++;
        }
      } catch (err) {
        console.error(`❌ Erro ao processar ${file}:`, err.message);
        errors++;
      }
    }
  }

  console.log(`\n📊 Resumo:`);
  console.log(`   ✅ Migrados: ${migrated}`);
  console.log(`   ❌ Erros: ${errors}`);
}

migrateOpenClawContent().catch(console.error);
