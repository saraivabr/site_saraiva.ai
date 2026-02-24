import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mapear categorias markdown -> supabase
const categoryMap = {
  'tutoriais': 'tool',
  'analises': 'analysis',
  'blog': 'thought',
  'ferramentas': 'tool',
  'prompts': 'prompt',
  'pensamentos': 'thought'
};

function escapeSQL(str) {
  if (!str) return 'NULL';
  return `'${str.replace(/'/g, "''").replace(/\\/g, '\\\\')}'`;
}

function generateSQLInserts() {
  const contentDir = path.join(__dirname, '../src/content');
  const categories = ['tutoriais', 'analises', 'blog'];
  
  let sql = `-- Inserir artigos OpenClaw no Supabase\n`;
  sql += `-- Execute este SQL no Supabase SQL Editor\n\n`;

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

        const supabaseCategory = categoryMap[category] || 'thought';
        const tags = Array.isArray(data.tags) ? data.tags : [];
        const tagsSQL = tags.length > 0 
          ? `ARRAY[${tags.map(t => escapeSQL(t)).join(', ')}]`
          : 'ARRAY[]::text[]';

        sql += `INSERT INTO public.contents (title, description, body, category, tags, featured, published)\n`;
        sql += `VALUES (\n`;
        sql += `  ${escapeSQL(data.title)},\n`;
        sql += `  ${escapeSQL(data.description)},\n`;
        sql += `  ${escapeSQL(content)},\n`;
        sql += `  '${supabaseCategory}',\n`;
        sql += `  ${tagsSQL},\n`;
        sql += `  ${data.featured ? 'true' : 'false'},\n`;
        sql += `  true\n`;
        sql += `);\n\n`;

        console.log(`✅ Gerado SQL: ${data.title}`);
      } catch (err) {
        console.error(`❌ Erro ao processar ${file}:`, err.message);
      }
    }
  }

  // Salvar SQL
  const outputPath = path.join(__dirname, '../openclaw-inserts.sql');
  fs.writeFileSync(outputPath, sql);
  console.log(`\n📄 SQL gerado em: ${outputPath}`);
  console.log(`\n👉 Execute este arquivo no Supabase SQL Editor para inserir os artigos!`);
}

generateSQLInserts();
