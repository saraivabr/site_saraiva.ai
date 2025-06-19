# Saraiva.AI - Landing Page

Site profissional para transformar IA em dinheiro, tempo e liberdade.

## ✨ Melhorias Implementadas no Cabeçalho

### 🚀 Funcionalidades Adicionadas:
- **Menu Mobile Responsivo**: Menu hambúrguer funcional para dispositivos móveis
- **Scroll Spy**: Indicador visual da seção ativa durante navegação
- **Navegação Suave**: Scroll suave entre seções com feedback visual
- **Acessibilidade Aprimorada**: ARIA labels e navegação por teclado
- **Animações Fluidas**: Transições suaves e efeitos hover melhorados
- **Auto-fechamento**: Menu mobile fecha automaticamente ao clicar em links ou fora do menu

### 🎨 Melhorias de Design:
- **Responsividade Total**: Funciona perfeitamente em todos os dispositivos
- **Estados Visuais**: Feedback claro para hover, focus e seção ativa
- **Tipografia Otimizada**: Tamanhos adaptativos para diferentes telas
- **Espaçamento Inteligente**: Layout otimizado para mobile e desktop

## 🛠️ Tecnologias Utilizadas

- **React 18** - Framework principal
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **Vite** - Build tool moderna
- **Lucide React** - Ícones modernos
- **Shadcn/ui** - Componentes de UI

## 🚀 Como Executar Localmente

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 🌐 Hospedagem

### Opção 1: Netlify (Recomendado - Gratuito)

1. **Deploy Automático via Git:**
   - Acesse [netlify.com](https://netlify.com)
   - Conecte seu repositório GitHub
   - Configure:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Deploy automático a cada push

2. **Deploy Manual:**
   - Execute `npm run build`
   - Arraste a pasta `dist` para [netlify.com/drop](https://netlify.com/drop)

### Opção 2: Vercel (Gratuito)

1. Acesse [vercel.com](https://vercel.com)
2. Conecte seu repositório
3. Deploy automático configurado

### Opção 3: GitHub Pages

1. Execute `npm run build`
2. Faça push da pasta `dist` para branch `gh-pages`
3. Configure GitHub Pages nas configurações do repositório

## 📱 Compatibilidade

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers
- ✅ Tablets
- ✅ Desktop

## 🔧 Configurações de Build

O projeto está configurado com:
- **Vite** para build otimizado
- **PostCSS** para processamento CSS
- **Tailwind CSS** para estilização
- **TypeScript** para tipagem
- **ESLint** para qualidade de código

## 📄 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── Header.tsx      # Cabeçalho melhorado
│   ├── Hero.tsx        # Seção principal
│   ├── About.tsx       # Sobre
│   ├── Products.tsx    # Produtos
│   ├── Mentoria.tsx    # Mentoria
│   ├── Testimonials.tsx # Depoimentos
│   ├── CTA.tsx         # Call to Action
│   ├── Footer.tsx      # Rodapé
│   └── ui/             # Componentes UI base
├── pages/              # Páginas
├── lib/                # Utilitários
└── hooks/              # Hooks customizados
```

## 🎯 Funcionalidades do Site

- **Landing Page Profissional**: Design moderno e conversivo
- **Responsivo**: Funciona em todos os dispositivos
- **Performance Otimizada**: Build otimizado com Vite
- **SEO Friendly**: Meta tags e estrutura semântica
- **Acessível**: Padrões de acessibilidade implementados

## 🚀 Deploy Rápido

### ⚡ DEPLOY NO VERCEL (RECOMENDADO)

**Opção 1: Deploy Automático via GitHub (Mais Fácil)**
1. Faça push do código para um repositório GitHub
2. Acesse [vercel.com](https://vercel.com) e faça login
3. Clique em "New Project"
4. Conecte seu repositório GitHub
5. Configure:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Clique em "Deploy"

**Opção 2: Deploy Manual**
1. Execute o build:
   ```bash
   npm run build
   ```
2. Acesse [vercel.com](https://vercel.com) e faça login
3. Arraste a pasta `dist` para a área de deploy
4. Seu site estará online em segundos!

### 🌐 Outras Opções de Deploy

1. **Netlify Drop:**
   ```bash
   npm run build
   # Arraste a pasta 'dist' para netlify.com/drop
   ```

2. **Vercel CLI (se tiver conta):**
   ```bash
   npm i -g vercel
   vercel login
   npm run build
   vercel --prod
   ```

## 📞 Suporte

Para dúvidas ou suporte, entre em contato através do WhatsApp configurado no site.

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/c3cc1299-a30a-4ce1-9816-600cd83f2ca5) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
