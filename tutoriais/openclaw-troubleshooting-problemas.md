# OpenClaw: Troubleshooting e Resolução de Problemas

## Introdução

Até o melhor software tem bugs. Este guia ajudará você a diagnosticar e resolver problemas comuns com OpenClaw, desde conexão até performance.

## Diagnóstico Rápido

### 1. Verificar Status do Serviço

```bash
# Status geral
sudo systemctl status openclaw

# Saída esperada:
# ● openclaw.service - OpenClaw - Local AI Assistant
#   Loaded: loaded
#   Active: active (running)

# Se estiver inativo
sudo systemctl start openclaw

# Se tiver erro ao iniciar
sudo journalctl -u openclaw -n 50 --no-pager
```

### 2. Verificar Conectividade

```bash
# Teste local
curl http://localhost:3000

# Teste de API
curl http://localhost:3000/api/health

# Resposta esperada:
# {"status":"ok","uptime":"2h 34m","services":["claude","elevenlabs"]}

# Se receber "Connection refused"
# OpenClaw não está rodando
sudo systemctl restart openclaw
sleep 5
curl http://localhost:3000
```

### 3. Verificar Logs

```bash
# Últimas 50 linhas
sudo journalctl -u openclaw -n 50

# Em tempo real
sudo journalctl -u openclaw -f

# Log de erro
grep ERROR /var/log/openclaw/main.log

# Buscar padrão específico
grep "TTS\|skill\|API" /var/log/openclaw/main.log
```

## Problemas Comuns e Soluções

### Problema: "Connection Refused" (Porta 3000)

```bash
# Causa possível: OpenClaw não está rodando
sudo systemctl status openclaw

# Solução 1: Reinicie
sudo systemctl restart openclaw

# Solução 2: Verifique logs
sudo journalctl -u openclaw -n 100

# Solução 3: Porta já está em uso
lsof -i :3000

# Matar processo que está usando porta 3000
kill -9 <PID>

# Solução 4: Mudar porta
# Edite .env
nano /home/pi/openclaw/.env
# PORT=3001
# Restart
sudo systemctl restart openclaw
```

### Problema: "API Key Invalid" ou "Unauthorized"

```bash
# Verifique se chave está configurada
echo $ANTHROPIC_API_KEY
echo $ELEVENLABS_API_KEY

# Se vazio, configure
export ANTHROPIC_API_KEY="sk-proj-..."
export ELEVENLABS_API_KEY="sk_..."

# Ou em arquivo de secrets
cat /etc/openclaw/secrets.env | grep API_KEY

# Teste chave com curl
curl -X GET https://api.anthropic.com/v1/models \
  -H "x-api-key: $ANTHROPIC_API_KEY"

# Se retornar erro de autenticação:
# 1. Verifique se copiou corretamente
# 2. Verifique se não expirou
# 3. Regere a chave na plataforma
# 4. Atualize em /etc/openclaw/secrets.env
```

### Problema: "Timeout" ou Requisição Lenta

```bash
# Verifique processamento
top

# Procure por processo OpenClaw usando 100% CPU
# Se %CPU > 80%, há gargalo

# Soluções:
# 1. Reduza MAX_WORKERS em .env
nano /home/pi/openclaw/.env
# MAX_WORKERS=1

# 2. Aumente timeout
# TIMEOUT=60000 (60 segundos em vez de 30)

# 3. Reinicie
sudo systemctl restart openclaw

# 4. Se problema persistir, pode ser I/O
# Verifique disco
iostat -x 1 10

# Se %util > 80%, disco é gargalo
# Use SSD em vez de cartão SD (veja artigo Raspberry Pi)
```

### Problema: "Out of Memory"

```bash
# Verifique memória
free -h

# Saída esperada (Pi 4GB):
# total       used       free
# 3.7Gi      2.1Gi      1.6Gi

# Se livre < 500MB, há problema
# Verifique processo
ps aux | grep node

# Mate processo se usar 80%+ RAM
# Edite .env e reduza
MEMORY_LIMIT=256M

# Restart
sudo systemctl restart openclaw

# Se problema persistir:
# 1. Há memory leak em skill?
# 2. Rode sem skills por um tempo
# 3. Veja em qual skill aumenta memória
```

### Problema: "Skill Not Found" ou "Skill Load Error"

```bash
# Verifique diretório de skills
ls -la /home/pi/openclaw/skills/

# Deve haver subdiretórios como:
# drwxr-xr-x  pi  say-hello/
# drwxr-xr-x  pi  send-email/

# Se vazio, faltam skills
# Clone skills
git clone https://github.com/ruvnet/openclaw-skills.git \
  /home/pi/openclaw/skills

# Se skill específica falha, verifique
cat /home/pi/openclaw/skills/my-skill/package.json

# Se falta dependências
cd /home/pi/openclaw/skills/my-skill
npm install

# Teste manualmente
npm test

# Se passar no teste mas falhar em OpenClaw:
# Verifique logs
sudo journalctl -u openclaw -f
# Procure por erro ao carregar skill
```

### Problema: "TTS Audio Não Toca"

```bash
# Verifique se ALSA está funcionando
speaker-test -t wav -c 2 -l 1

# Se sem som:
# 1. Verifique volume
alsamixer

# Suba volume com setas do teclado
# Pressione ESC para sair

# 2. Verifique dispositivo de áudio
aplay -l

# Deve listar dispositivos como:
# **** List of PLAYBACK Hardware Devices ****
# card 0: HifiBerry [HifiBerry DAC+]

# 3. Se nenhum dispositivo, instale driver
# Para HifiBerry DAC+
curl https://raw.githubusercontent.com/HifiBerryOS/HifiBerry-Installer/master/install.sh | bash

# 4. Se mpv não funciona
sudo apt install -y mpv

# 5. Teste TTS diretamente
curl -X POST http://localhost:3000/api/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"Olá mundo"}'

# Se erro, verifique ELEVENLABS_API_KEY
```

### Problema: "Database Locked" ou "Disk Full"

```bash
# Verifique espaço em disco
df -h /

# Se uso > 90%
# Cleanup logs
sudo journalctl --vacuum=500M

# Delete cache
rm -rf /var/lib/openclaw/cache/*

# Delete backups antigos
find /var/lib/openclaw/backups -mtime +30 -delete

# Se problema persistir:
# Expanda partição (em SSD)
# Ou mude DATABASE_URL para outra partição
```

### Problema: "Network Timeout" com APIs Externas

```bash
# Teste conectividade
ping google.com

# Se timeout, problema de rede
# 1. Verifique router
sudo route -n

# 2. Teste DNS
nslookup api.anthropic.com

# 3. Se lento, use outro DNS
# Edite /etc/resolv.conf
sudo nano /etc/resolv.conf

# Adicione:
nameserver 8.8.8.8      # Google DNS
nameserver 1.1.1.1      # Cloudflare DNS

# 4. Se Cloudflare tunnel está lento
cloudflared tunnel diag

# Ver status
cloudflared tunnel route list
```

## Logs e Debugging

### 1. Estrutura de Logs

```bash
# Logs principais
/var/log/openclaw/main.log       # Geral
/var/log/openclaw/tts.log        # Text-to-Speech
/var/log/openclaw/skills.log     # Execução de skills
/var/log/openclaw/api.log        # Requisições HTTP
/var/log/openclaw/audit.log      # Segurança
/var/log/openclaw/error.log      # Apenas erros
```

### 2. Análise de Logs

```bash
# Veja últimas linhas de erro
tail -50 /var/log/openclaw/error.log

# Busque por padrão
grep "ERROR" /var/log/openclaw/main.log | tail -20

# Conte quantidade de erros
grep -c "ERROR" /var/log/openclaw/main.log

# Veja erros por hora
grep "ERROR" /var/log/openclaw/main.log | cut -d' ' -f1 | sort | uniq -c

# Análise com jq (se JSON)
cat /var/log/openclaw/audit.log | jq 'select(.status=="failure")'
```

### 3. Habilitar Debug Mode

```bash
# No .env
LOG_LEVEL=debug

# Restart
sudo systemctl restart openclaw

# Agora mais detalhes aparecerão
sudo journalctl -u openclaw -f

# Desabilite depois (usa mais espaço)
LOG_LEVEL=info
```

## Rate Limits e Throttling

### Problema: "429 Too Many Requests"

```bash
# APIs externas têm limites
# Veja limite atual
curl -i https://api.anthropic.com/v1/models \
  -H "x-api-key: $ANTHROPIC_API_KEY" | grep -i ratelimit

# Se receber 429:
# 1. Aguarde alguns minutos
# 2. Reduza requisições simultâneas
# 3. Aumente delay entre requisições

# Configure em .env
REQUEST_DELAY=1000        # 1 segundo entre requisições
MAX_CONCURRENT_REQUESTS=2 # máximo 2 simultâneas

# Restart
sudo systemctl restart openclaw
```

### Problema: Rate Limit de ElevenLabs

```bash
# Verifique cota
curl -X GET https://api.elevenlabs.io/v1/user \
  -H "xi-api-key: $ELEVENLABS_API_KEY" | jq '.subscription.character_limit'

# Se exceder, fila requisições
# No .env
ELEVENLABS_QUEUE_ENABLED=true
ELEVENLABS_QUEUE_DELAY=2000

# Ou use cache
ELEVENLABS_CACHE_TTL=86400  # cache 24h
```

## Performance

### 1. Medir Performance

```bash
# Benchmark simples
time curl http://localhost:3000/api/test

# Teste de carga (instale ab)
sudo apt install -y apache2-utils

# 100 requisições, 10 simultâneas
ab -n 100 -c 10 http://localhost:3000/

# Resultado:
# Requests per second: 12.45 [#/sec]
# Time per request: 80.43 [ms]
```

### 2. Identificar Gargalos

```bash
# CPU
top -b -n 1 | head -20

# Memória
free -h

# Disco
iostat -x 1 5

# Rede
nethogs

# Se CPU alto
# Reduzir workers ou modelos maiores

# Se Memória alta
# Memory leak? Monitore por horas
watch -n 1 free -h

# Se Disco lento
# Mude para SSD
```

### 3. Otimizar Performance

```bash
# 1. Cache agressivo
CACHE_TTL=3600         # 1 hora
REDIS_ENABLED=true     # se tiver Redis

# 2. Compressão
COMPRESSION=gzip
COMPRESSION_LEVEL=6    # 1-9, maior = mais lento

# 3. Clustering
CLUSTER_MODE=true
WORKERS=4

# 4. Índices de banco
npm run db:migrate

# Restart
sudo systemctl restart openclaw
```

## Monitoramento Contínuo

### 1. Setup Prometheus (Métrica)

```bash
# Instale Prometheus
sudo apt install -y prometheus

# Configure /etc/prometheus/prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'openclaw'
    static_configs:
      - targets: ['localhost:9090']

# Inicie
sudo systemctl restart prometheus
```

### 2. Alerta de Problemas

```bash
# Script de health check
cat > /home/pi/openclaw/scripts/health-check.sh << 'EOF'
#!/bin/bash

HEALTH=$(curl -s http://localhost:3000/api/health)

if echo $HEALTH | grep -q '"status":"ok"'; then
  echo "OK"
  exit 0
else
  echo "ERROR: OpenClaw is down"
  # Restart automaticamente
  sudo systemctl restart openclaw
  exit 1
fi
EOF

chmod +x /home/pi/openclaw/scripts/health-check.sh

# Cron a cada 5 minutos
crontab -e
# */5 * * * * /home/pi/openclaw/scripts/health-check.sh >> /var/log/openclaw/health-check.log 2>&1
```

## Onde Buscar Ajuda

### 1. Comunidade OpenClaw

- **Discord**: https://discord.gg/openclaw
- **GitHub Issues**: https://github.com/ruvnet/openclaw/issues
- **Reddit**: r/OpenClaw

### 2. Logs Preparados para Pedir Ajuda

Quando pedir ajuda, forneça:

```bash
# Collect diagnostic info
{
  echo "=== System Info ==="
  uname -a
  
  echo "=== Memory ==="
  free -h
  
  echo "=== Disk ==="
  df -h
  
  echo "=== OpenClaw Status ==="
  sudo systemctl status openclaw
  
  echo "=== Last Errors ==="
  tail -50 /var/log/openclaw/error.log
  
  echo "=== Running Processes ==="
  ps aux | grep node
} > diagnostic.txt

# Compartilhe
cat diagnostic.txt
```

### 3. Abrindo Issue no GitHub

```markdown
## Descrição
Descrição breve do problema

## Passos para Reproduzir
1. Passo 1
2. Passo 2

## Comportamento Esperado
O que deveria acontecer

## Comportamento Atual
O que realmente acontece

## Logs
[Cole o erro]

## Sistema
- Pi: 4/5
- RAM: 4GB/8GB
- Storage: SD/SSD
- OpenClaw version: X.X.X
```

## Checklist de Troubleshooting

- [ ] Verifique status: `sudo systemctl status openclaw`
- [ ] Verifique logs: `sudo journalctl -u openclaw -f`
- [ ] Teste API local: `curl http://localhost:3000`
- [ ] Verifique variáveis de ambiente: `env | grep -i api`
- [ ] Teste conectividade: `ping google.com`
- [ ] Verifique memória/disco: `free -h && df -h`
- [ ] Procure por erro específico nos logs
- [ ] Teste manualmente o componente que falha
- [ ] Restart do serviço: `sudo systemctl restart openclaw`
- [ ] Se nada funcionar, reporte no Discord

---

**Próximo artigo:** Visão de Futuro do OpenClaw
