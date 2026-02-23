export type TemplateType = "skill" | "agent" | "command" | "hook" | "mcp" | "setting";
export type TemplateCategory =
  | "development"
  | "creative-design"
  | "web-development"
  | "document-processing"
  | "enterprise-communication"
  | "productivity"
  | "ai-research"
  | "analytics"
  | "business-marketing"
  | "database"
  | "media"
  | "security"
  | "utilities"
  | "workflow-automation"
  | "video";

export interface Template {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: TemplateType;
  category: TemplateCategory;
  downloads: number;
  installCommand: string;
  featured?: boolean;
  compatibility: {
    claude: boolean;
    gemini: boolean;
    cursor: boolean;
    windsurf: boolean;
  };
}

export const typeConfig: Record<TemplateType, { emoji: string; label: string; color: string }> = {
  skill: { emoji: "🎨", label: "Skill", color: "text-orange-600" },
  agent: { emoji: "🤖", label: "Agent", color: "text-blue-600" },
  command: { emoji: "⚡", label: "Command", color: "text-amber-600" },
  hook: { emoji: "🪝", label: "Hook", color: "text-green-600" },
  mcp: { emoji: "🔌", label: "MCP", color: "text-purple-600" },
  setting: { emoji: "⚙️", label: "Setting", color: "text-gray-500" },
};

export const categoryLabels: Record<TemplateCategory, string> = {
  development: "Desenvolvimento",
  "creative-design": "Design Criativo",
  "web-development": "Web Development",
  "document-processing": "Documentos",
  "enterprise-communication": "Enterprise",
  productivity: "Produtividade",
  "ai-research": "IA & Pesquisa",
  analytics: "Analytics",
  "business-marketing": "Marketing",
  database: "Database",
  media: "Mídia",
  security: "Segurança",
  utilities: "Utilidades",
  "workflow-automation": "Automação",
  video: "Vídeo",
};

export const formatDownloads = (n: number): string => {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
};

export const templates: Template[] = [
  // === SKILLS ===
  {
    id: "s1", name: "Skill Creator", slug: "skill-creator",
    description: "Guia para criar skills eficazes. Use quando quiser criar ou atualizar um skill personalizado.",
    type: "skill", category: "development", downloads: 5600, featured: true,
    installCommand: "npx claude-code-templates@latest --skill=development/skill-creator --yes",
    compatibility: { claude: true, gemini: true, cursor: true, windsurf: true },
  },
  {
    id: "s2", name: "Frontend Design", slug: "frontend-design",
    description: "Crie interfaces frontend distintas e de alta qualidade com design production-grade.",
    type: "skill", category: "creative-design", downloads: 3900, featured: true,
    installCommand: "npx claude-code-templates@latest --skill=creative-design/frontend-design --yes",
    compatibility: { claude: true, gemini: true, cursor: true, windsurf: true },
  },
  {
    id: "s3", name: "Webapp Testing", slug: "webapp-testing",
    description: "Toolkit para interagir e testar aplicações web locais usando Playwright.",
    type: "skill", category: "development", downloads: 3000,
    installCommand: "npx claude-code-templates@latest --skill=development/webapp-testing --yes",
    compatibility: { claude: true, gemini: false, cursor: true, windsurf: false },
  },
  {
    id: "s4", name: "Senior Frontend", slug: "senior-frontend",
    description: "Skill de desenvolvimento frontend completo com ReactJS, NextJS, TypeScript e mais.",
    type: "skill", category: "development", downloads: 2900, featured: true,
    installCommand: "npx claude-code-templates@latest --skill=development/senior-frontend --yes",
    compatibility: { claude: true, gemini: true, cursor: true, windsurf: true },
  },
  {
    id: "s5", name: "React Best Practices", slug: "react-best-practices",
    description: "Guia de otimização de performance React e Next.js com 40+ regras para eliminar waterfalls.",
    type: "skill", category: "web-development", downloads: 2800,
    installCommand: "npx claude-code-templates@latest --skill=web-development/react-best-practices --yes",
    compatibility: { claude: true, gemini: true, cursor: true, windsurf: true },
  },
  {
    id: "s6", name: "Senior Architect", slug: "senior-architect",
    description: "Skill de arquitetura de software para projetar sistemas escaláveis e mantidos.",
    type: "skill", category: "development", downloads: 2600,
    installCommand: "npx claude-code-templates@latest --skill=development/senior-architect --yes",
    compatibility: { claude: true, gemini: true, cursor: true, windsurf: true },
  },
  {
    id: "s7", name: "Senior Backend", slug: "senior-backend",
    description: "Desenvolvimento backend completo com NodeJS, Express, Go, Python, PostgreSQL.",
    type: "skill", category: "development", downloads: 2500,
    installCommand: "npx claude-code-templates@latest --skill=development/senior-backend --yes",
    compatibility: { claude: true, gemini: true, cursor: true, windsurf: true },
  },
  {
    id: "s8", name: "Git Commit Helper", slug: "git-commit-helper",
    description: "Gere mensagens de commit descritivas analisando git diffs automaticamente.",
    type: "skill", category: "development", downloads: 2400,
    installCommand: "npx claude-code-templates@latest --skill=development/git-commit-helper --yes",
    compatibility: { claude: true, gemini: true, cursor: true, windsurf: true },
  },
  {
    id: "s9", name: "Code Reviewer", slug: "code-reviewer",
    description: "Revisão de código para TypeScript, JavaScript, Python, Swift, Kotlin, Go.",
    type: "skill", category: "development", downloads: 2300,
    installCommand: "npx claude-code-templates@latest --skill=development/code-reviewer --yes",
    compatibility: { claude: true, gemini: true, cursor: true, windsurf: true },
  },
  {
    id: "s10", name: "Docx", slug: "docx",
    description: "Criação, edição e análise de documentos com tracked changes, comments e formatação.",
    type: "skill", category: "document-processing", downloads: 1900,
    installCommand: "npx claude-code-templates@latest --skill=document-processing/docx --yes",
    compatibility: { claude: true, gemini: false, cursor: true, windsurf: false },
  },
  {
    id: "s11", name: "PDF Processing Pro", slug: "pdf-processing-pro",
    description: "Processamento PDF production-ready com forms, tabelas, OCR e operações em batch.",
    type: "skill", category: "document-processing", downloads: 1800,
    installCommand: "npx claude-code-templates@latest --skill=document-processing/pdf-processing-pro --yes",
    compatibility: { claude: true, gemini: false, cursor: true, windsurf: false },
  },
  {
    id: "s12", name: "Canvas Design", slug: "canvas-design",
    description: "Crie arte visual em .png e .pdf usando filosofia de design.",
    type: "skill", category: "creative-design", downloads: 1700,
    installCommand: "npx claude-code-templates@latest --skill=creative-design/canvas-design --yes",
    compatibility: { claude: true, gemini: false, cursor: false, windsurf: false },
  },
  {
    id: "s13", name: "UI Design System", slug: "ui-design-system",
    description: "Toolkit de design system incluindo design tokens, documentação de componentes e responsividade.",
    type: "skill", category: "creative-design", downloads: 1600,
    installCommand: "npx claude-code-templates@latest --skill=creative-design/ui-design-system --yes",
    compatibility: { claude: true, gemini: true, cursor: true, windsurf: true },
  },
  {
    id: "s14", name: "MCP Builder", slug: "mcp-builder",
    description: "Guia para criar MCP servers de alta qualidade que conectam LLMs a serviços externos.",
    type: "skill", category: "development", downloads: 1600,
    installCommand: "npx claude-code-templates@latest --skill=development/mcp-builder --yes",
    compatibility: { claude: true, gemini: false, cursor: false, windsurf: false },
  },
  {
    id: "s15", name: "XLSX", slug: "xlsx",
    description: "Criação, edição e análise de planilhas com fórmulas, formatação e data analysis.",
    type: "skill", category: "document-processing", downloads: 1600,
    installCommand: "npx claude-code-templates@latest --skill=document-processing/xlsx --yes",
    compatibility: { claude: true, gemini: false, cursor: true, windsurf: false },
  },
  {
    id: "s16", name: "PPTX", slug: "pptx",
    description: "Criação, edição e análise de apresentações .pptx com slides profissionais.",
    type: "skill", category: "document-processing", downloads: 1600,
    installCommand: "npx claude-code-templates@latest --skill=document-processing/pptx --yes",
    compatibility: { claude: true, gemini: false, cursor: true, windsurf: false },
  },
  {
    id: "s17", name: "Excel Analysis", slug: "excel-analysis",
    description: "Analise planilhas Excel, crie pivot tables, gere gráficos e data analysis.",
    type: "skill", category: "enterprise-communication", downloads: 1200,
    installCommand: "npx claude-code-templates@latest --skill=enterprise-communication/excel-analysis --yes",
    compatibility: { claude: true, gemini: false, cursor: true, windsurf: false },
  },
  {
    id: "s18", name: "Senior Fullstack", slug: "senior-fullstack",
    description: "Desenvolvimento fullstack completo com React, Next.js, Node.js, GraphQL e mais.",
    type: "skill", category: "development", downloads: 1100, featured: true,
    installCommand: "npx claude-code-templates@latest --skill=development/senior-fullstack --yes",
    compatibility: { claude: true, gemini: true, cursor: true, windsurf: true },
  },
  {
    id: "s19", name: "File Organizer", slug: "file-organizer",
    description: "Organiza arquivos e pastas de forma inteligente, encontra duplicatas e sugere melhor organização.",
    type: "skill", category: "productivity", downloads: 1000,
    installCommand: "npx claude-code-templates@latest --skill=productivity/file-organizer --yes",
    compatibility: { claude: true, gemini: true, cursor: true, windsurf: true },
  },
  {
    id: "s20", name: "Theme Factory", slug: "theme-factory",
    description: "Toolkit para estilizar artefatos com temas — slides, docs, reports, landing pages.",
    type: "skill", category: "creative-design", downloads: 1000,
    installCommand: "npx claude-code-templates@latest --skill=creative-design/theme-factory --yes",
    compatibility: { claude: true, gemini: false, cursor: true, windsurf: false },
  },
  {
    id: "s21", name: "Senior Prompt Engineer", slug: "senior-prompt-engineer",
    description: "Engenharia de prompts world-class para otimização de LLM, patterns e outputs estruturados.",
    type: "skill", category: "development", downloads: 1000,
    installCommand: "npx claude-code-templates@latest --skill=development/senior-prompt-engineer --yes",
    compatibility: { claude: true, gemini: true, cursor: true, windsurf: true },
  },
  {
    id: "s22", name: "Artifacts Builder", slug: "artifacts-builder",
    description: "Suite de ferramentas para criar artefatos HTML multi-componente usando tecnologias frontend modernas.",
    type: "skill", category: "development", downloads: 1000,
    installCommand: "npx claude-code-templates@latest --skill=development/artifacts-builder --yes",
    compatibility: { claude: true, gemini: false, cursor: false, windsurf: false },
  },
  // === AGENTS ===
  {
    id: "a1", name: "Task Planner", slug: "task-planner",
    description: "Agente que decompõe tarefas complexas em subtarefas gerenciáveis com priorização.",
    type: "agent", category: "productivity", downloads: 3200, featured: true,
    installCommand: "npx claude-code-templates@latest --agent=productivity/task-planner --yes",
    compatibility: { claude: true, gemini: false, cursor: false, windsurf: false },
  },
  {
    id: "a2", name: "Research Agent", slug: "research-agent",
    description: "Pesquisa autônoma na web com síntese de informações e citação de fontes.",
    type: "agent", category: "ai-research", downloads: 2800,
    installCommand: "npx claude-code-templates@latest --agent=ai-research/research-agent --yes",
    compatibility: { claude: true, gemini: false, cursor: false, windsurf: false },
  },
  {
    id: "a3", name: "PR Reviewer", slug: "pr-reviewer",
    description: "Revisa Pull Requests automaticamente com feedback detalhado e sugestões de melhoria.",
    type: "agent", category: "development", downloads: 2400,
    installCommand: "npx claude-code-templates@latest --agent=development/pr-reviewer --yes",
    compatibility: { claude: true, gemini: false, cursor: false, windsurf: false },
  },
  {
    id: "a4", name: "Migration Agent", slug: "migration-agent",
    description: "Automatiza migração de código entre frameworks, linguagens e versões.",
    type: "agent", category: "development", downloads: 1900,
    installCommand: "npx claude-code-templates@latest --agent=development/migration-agent --yes",
    compatibility: { claude: true, gemini: false, cursor: false, windsurf: false },
  },
  {
    id: "a5", name: "API Designer", slug: "api-designer",
    description: "Projeta APIs RESTful e GraphQL seguindo melhores práticas com documentação OpenAPI.",
    type: "agent", category: "development", downloads: 1600,
    installCommand: "npx claude-code-templates@latest --agent=development/api-designer --yes",
    compatibility: { claude: true, gemini: false, cursor: false, windsurf: false },
  },
  // === COMMANDS ===
  {
    id: "c1", name: "Quick Fix", slug: "quick-fix",
    description: "Encontra e corrige bugs rapidamente com análise contextual do código.",
    type: "command", category: "development", downloads: 4100, featured: true,
    installCommand: "npx claude-code-templates@latest --command=development/quick-fix --yes",
    compatibility: { claude: true, gemini: false, cursor: false, windsurf: false },
  },
  {
    id: "c2", name: "Generate Tests", slug: "generate-tests",
    description: "Gera testes unitários e de integração automaticamente para o código selecionado.",
    type: "command", category: "development", downloads: 3500,
    installCommand: "npx claude-code-templates@latest --command=development/generate-tests --yes",
    compatibility: { claude: true, gemini: false, cursor: false, windsurf: false },
  },
  {
    id: "c3", name: "Refactor", slug: "refactor",
    description: "Refatora código selecionado seguindo clean code, SOLID e design patterns.",
    type: "command", category: "development", downloads: 3100,
    installCommand: "npx claude-code-templates@latest --command=development/refactor --yes",
    compatibility: { claude: true, gemini: false, cursor: false, windsurf: false },
  },
  {
    id: "c4", name: "Explain Code", slug: "explain-code",
    description: "Explica código complexo em linguagem simples com diagramas e exemplos.",
    type: "command", category: "development", downloads: 2700,
    installCommand: "npx claude-code-templates@latest --command=development/explain-code --yes",
    compatibility: { claude: true, gemini: true, cursor: true, windsurf: true },
  },
  {
    id: "c5", name: "Document Code", slug: "document-code",
    description: "Gera documentação JSDoc/TSDoc/Docstring automaticamente para funções e classes.",
    type: "command", category: "development", downloads: 2200,
    installCommand: "npx claude-code-templates@latest --command=development/document-code --yes",
    compatibility: { claude: true, gemini: true, cursor: true, windsurf: true },
  },
  // === HOOKS ===
  {
    id: "h1", name: "Pre-Commit Lint", slug: "pre-commit-lint",
    description: "Roda linting e formatação automaticamente antes de cada commit.",
    type: "hook", category: "development", downloads: 1800,
    installCommand: "npx claude-code-templates@latest --hook=development/pre-commit-lint --yes",
    compatibility: { claude: true, gemini: false, cursor: false, windsurf: false },
  },
  {
    id: "h2", name: "Auto Test", slug: "auto-test",
    description: "Executa testes relacionados automaticamente quando arquivos são modificados.",
    type: "hook", category: "development", downloads: 1500,
    installCommand: "npx claude-code-templates@latest --hook=development/auto-test --yes",
    compatibility: { claude: true, gemini: false, cursor: false, windsurf: false },
  },
  // === MCPs ===
  {
    id: "m1", name: "GitHub MCP", slug: "github-mcp",
    description: "Conecta Claude ao GitHub para gerenciar repos, issues, PRs e Actions.",
    type: "mcp", category: "development", downloads: 4500, featured: true,
    installCommand: "npx claude-code-templates@latest --mcp=development/github --yes",
    compatibility: { claude: true, gemini: false, cursor: false, windsurf: false },
  },
  {
    id: "m2", name: "Slack MCP", slug: "slack-mcp",
    description: "Integra Claude ao Slack para enviar mensagens, ler canais e gerenciar workspace.",
    type: "mcp", category: "enterprise-communication", downloads: 3200,
    installCommand: "npx claude-code-templates@latest --mcp=enterprise-communication/slack --yes",
    compatibility: { claude: true, gemini: false, cursor: false, windsurf: false },
  },
  {
    id: "m3", name: "Notion MCP", slug: "notion-mcp",
    description: "Conecta Claude ao Notion para ler e editar páginas, databases e blocos.",
    type: "mcp", category: "productivity", downloads: 2900,
    installCommand: "npx claude-code-templates@latest --mcp=productivity/notion --yes",
    compatibility: { claude: true, gemini: false, cursor: false, windsurf: false },
  },
  {
    id: "m4", name: "PostgreSQL MCP", slug: "postgresql-mcp",
    description: "Conecta Claude diretamente ao PostgreSQL para queries, migrations e análise.",
    type: "mcp", category: "database", downloads: 2600,
    installCommand: "npx claude-code-templates@latest --mcp=database/postgresql --yes",
    compatibility: { claude: true, gemini: false, cursor: false, windsurf: false },
  },
  {
    id: "m5", name: "Figma MCP", slug: "figma-mcp",
    description: "Conecta Claude ao Figma para extrair designs, componentes e design tokens.",
    type: "mcp", category: "creative-design", downloads: 2100,
    installCommand: "npx claude-code-templates@latest --mcp=creative-design/figma --yes",
    compatibility: { claude: true, gemini: false, cursor: false, windsurf: false },
  },
];
