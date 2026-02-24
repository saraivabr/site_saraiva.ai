# PWA + Offline Mode Implementation

Implementação completa de Progressive Web App (PWA) com suporte offline para SARAIVA.AI.

## 📦 Arquivos Criados

### 1. **src/sw.ts** - Service Worker TypeScript
- Estratégias de cache para diferentes tipos de recursos
- Cache-first para assets estáticos (JS, CSS, fonts)
- Network-first para navegação e API calls
- Stale-while-revalidate para imagens
- Background Sync para analytics offline
- Comunicação com clientes via postMessage

### 2. **src/lib/pwa/register.ts** - Service Worker Registration
- Registro automático do SW
- Verificação de atualizações
- Gerenciamento de ciclo de vida
- Funções para comunicação com SW
- Limpeza e estatísticas de cache

### 3. **src/lib/pwa/hooks.ts** - React Hooks para PWA
- `useOnlineStatus()` - Monitora status online/offline
- `useServiceWorker()` - Gerencia ciclo de vida do SW
- `useInstallPrompt()` - Captura beforeinstallprompt event
- `useBackgroundSync()` - Gerencia sincronização em background
- `useCacheStats()` - Monitora estatísticas de cache

### 4. **src/lib/pwa/OfflineIndicator.tsx** - Componentes UI
- `OfflineIndicator` - Indicador de status offline
- `OnlineStatusBadge` - Badge compacto de status
- `SWUpdateIndicator` - Notificação de atualização

### 5. **src/lib/pwa/index.ts** - Barrel Export
- Exporta todas as funções e componentes PWA
- Ponto único de importação

### 6. **public/manifest.json** - PWA Manifest
- Configuração de instalação como app
- Ícones para diferentes tamanhos
- Shortcuts para ações rápidas
- Metadados do app

### 7. **src/main.tsx** - Integração
- Registro automático do Service Worker no bootstrap

## 🚀 Como Usar

### Registro Automático
O Service Worker é registrado automaticamente no `main.tsx`:

```typescript
import { registerServiceWorker } from "@/lib/pwa";

registerServiceWorker().catch((error) => {
  console.error('[PWA] Failed to register:', error);
});
```

### Monitorar Status Offline

```tsx
import { useOnlineStatus, OfflineIndicator } from '@/lib/pwa';

export function MyComponent() {
  const isOnline = useOnlineStatus();
  
  return (
    <>
      <OfflineIndicator />
      <div>Você está: {isOnline ? 'online' : 'offline'}</div>
    </>
  );
}
```

### Verificar Atualizações do SW

```tsx
import { useServiceWorker, SWUpdateIndicator } from '@/lib/pwa';

export function App() {
  const { needsUpdate, update } = useServiceWorker();
  
  return (
    <>
      <SWUpdateIndicator 
        needsUpdate={needsUpdate} 
        onUpdate={update} 
      />
    </>
  );
}
```

### Capturar Install Prompt

```tsx
import { useInstallPrompt } from '@/lib/pwa';

export function InstallButton() {
  const { canInstall, prompt } = useInstallPrompt();
  
  if (!canInstall) return null;
  
  return (
    <button onClick={() => prompt()}>
      Instalar App
    </button>
  );
}
```

### Monitorar Cache

```tsx
import { useCacheStats } from '@/lib/pwa';

export function CacheInfo() {
  const { cacheCount, totalSize, clear } = useCacheStats();
  
  return (
    <div>
      <p>Caches: {cacheCount}</p>
      <p>Tamanho: {totalSize}</p>
      <button onClick={() => clear()}>Limpar</button>
    </div>
  );
}
```

## 📋 Estratégias de Cache

### Cache-First
**Usada para:** Assets estáticos (JS, CSS, fonts, images)
- Retorna do cache se disponível
- Faz fallback para rede se não encontrar
- Atualiza cache em background

### Network-First
**Usada para:** Navegação e conteúdo HTML
- Tenta buscar da rede primeiro
- Fallback para cache se offline
- Timeout de 5 segundos para API calls

### Stale-While-Revalidate
**Usada para:** Imagens e recursos não-críticos
- Retorna cache imediatamente
- Atualiza em background
- Novo conteúdo na próxima requisição

## 🔄 Background Sync

O Service Worker suporta sincronização de dados quando o usuário voltar online:

```typescript
// Registrar sync
const { triggerSync } = useBackgroundSync('sync-analytics');
await triggerSync();

// No SW, ouvir sync event:
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-analytics') {
    event.waitUntil(syncAnalytics());
  }
});
```

## 📱 Instalação como App

### Desktop (Chrome, Edge)
1. Abre https://saraiva.ai
2. Clica no ícone de instalação na barra de endereço
3. Confirma a instalação

### Mobile (Android)
1. Abre https://saraiva.ai no Chrome
2. Menu → "Instalar app"
3. Confirma a instalação

### iOS
1. Abre https://saraiva.ai no Safari
2. Compartilhar → "Adicionar à Tela de Início"
3. Confirma a instalação

## 🧪 Testes

### Testar Offline
1. Abrir Chrome DevTools (F12)
2. Ir para Network
3. Selecionar "Offline" no dropdown
4. Navegar pela página
5. O app deve funcionar normalmente com cache

### Verificar Service Worker
1. DevTools → Application → Service Workers
2. Verificar se está "activated and running"
3. Ver active routes no Network section

### Limpar Cache
```tsx
import { clearAllCaches } from '@/lib/pwa';
await clearAllCaches();
```

## ⚙️ Configuração

### Atualizar versão de cache
Edite `CACHE_NAME` em `src/sw.ts`:

```typescript
const CACHE_NAME = 'saraiva-ai-v2'; // Incrementar versão
```

### Adicionar assets pré-cacheados
Edite `STATIC_ASSETS` em `src/sw.ts`:

```typescript
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/seu-arquivo.html', // Adicione aqui
];
```

## 🐛 Debugging

### Logs do Service Worker
```bash
# Ver logs no DevTools Console
# Procure por "[SW]" prefix
```

### Inspecionar Cache Storage
```javascript
// No console do navegador
const cacheNames = await caches.keys();
console.log(cacheNames);

const cache = await caches.open('saraiva-ai-v1');
const keys = await cache.keys();
console.log(keys);
```

### Forçar Update
```typescript
import { updateServiceWorker, getServiceWorkerRegistration } from '@/lib/pwa';

const registration = await getServiceWorkerRegistration();
if (registration) {
  updateServiceWorker(registration);
}
```

## 📊 Suporte de Navegadores

| Navegador | Service Worker | PWA | Offline |
|-----------|----------------|-----|---------|
| Chrome 40+ | ✅ | ✅ | ✅ |
| Firefox 44+ | ✅ | ⚠️ | ✅ |
| Safari 16+ | ✅ | ⚠️ | ✅ |
| Edge 17+ | ✅ | ✅ | ✅ |

## 🔗 Recursos

- [MDN - Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web.dev - PWA Checklist](https://web.dev/pwa-checklist/)
- [PWA Builder](https://www.pwabuilder.com/)
- [Workbox](https://developers.google.com/web/tools/workbox)

## 🎯 Próximos Passos

- [ ] Implementar Workbox para SW mais robusto
- [ ] Adicionar notificações push
- [ ] Implementar Periodic Background Sync
- [ ] Otimizar tamanho do cache
- [ ] Adicionar analytics de offline usage
