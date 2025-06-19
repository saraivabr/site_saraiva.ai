# 🚀 Deploy no Vercel - Guia Completo

## ⚡ Método 1: Deploy Automático via GitHub (RECOMENDADO)

### Passo 1: Preparar o Repositório
1. Certifique-se de que o código está em um repositório GitHub
2. Faça commit de todas as alterações:
   ```bash
   git add .
   git commit -m "Site Saraiva.AI com cabeçalho melhorado"
   git push origin main
   ```

### Passo 2: Deploy no Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Faça login com GitHub, Google ou email
3. Clique em **"New Project"**
4. Selecione seu repositório GitHub
5. Configure o projeto:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. Clique em **"Deploy"**

### Passo 3: Configuração Automática
O Vercel detectará automaticamente:
- ✅ Arquivo `vercel.json` (já configurado)
- ✅ Comando de build
- ✅ Pasta de output
- ✅ Redirects para SPA

**🎉 Seu site estará online em 2-3 minutos!**

---

## ⚡ Método 2: Deploy Manual (Drag & Drop)

### Passo 1: Gerar Build
```bash
npm run build
```

### Passo 2: Deploy Manual
1. Acesse [vercel.com](https://vercel.com)
2. Faça login
3. Arraste a pasta `dist` para a área de deploy
4. Aguarde o upload e processamento

**🎉 Site online em 30 segundos!**

---

## 🔧 Configurações Já Incluídas

### vercel.json
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Funcionalidades Configuradas
- ✅ Build automático
- ✅ SPA routing (todas as rotas redirecionam para index.html)
- ✅ Otimizações de performance
- ✅ HTTPS automático
- ✅ CDN global
- ✅ Deploy automático a cada push

---

## 🌐 Após o Deploy

### URL do Site
Após o deploy, você receberá:
- **URL de produção**: `https://seu-projeto.vercel.app`
- **URL personalizada**: Configure um domínio próprio (opcional)

### Atualizações Automáticas
- Cada push para `main` = novo deploy automático
- Preview deployments para outras branches
- Rollback instantâneo se necessário

### Monitoramento
- Analytics integrado
- Logs de build e runtime
- Métricas de performance

---

## 🎯 Checklist Final

Antes do deploy, verifique:
- ✅ `npm run build` executa sem erros
- ✅ `npm run preview` mostra o site funcionando
- ✅ Menu mobile funciona corretamente
- ✅ Navegação entre seções funciona
- ✅ Links do WhatsApp estão corretos
- ✅ Responsividade testada

---

## 🆘 Solução de Problemas

### Build Falha
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Site não carrega
- Verifique se a pasta `dist` foi gerada
- Confirme se o `vercel.json` está na raiz
- Verifique logs no dashboard do Vercel

### Rotas não funcionam
- O arquivo `vercel.json` já está configurado para SPA
- Todas as rotas redirecionam para `index.html`

---

## 🎉 Pronto!

Seu site **Saraiva.AI** estará online com:
- ✅ Cabeçalho responsivo melhorado
- ✅ Menu mobile funcional
- ✅ Performance otimizada
- ✅ HTTPS e CDN global
- ✅ Deploy automático

**URL final**: Será fornecida após o deploy no Vercel!
