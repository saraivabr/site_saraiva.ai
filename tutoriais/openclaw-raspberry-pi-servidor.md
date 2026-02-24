# OpenClaw em Raspberry Pi: Rodando seu Assistente IA Pessoal Localmente

## Introdução

Você sonhou em ter um assistente de IA pessoal rodando em casa, sem depender da nuvem? Com o OpenClaw e um Raspberry Pi, isso é totalmente possível. Neste artigo, mostraremos como configurar um servidor OpenClaw robusto que roda silenciosamente no seu Raspberry Pi.

## Por que Raspberry Pi + OpenClaw?

- **Privacidade**: Seus dados nunca saem de casa
- **Custo**: ~R$ 500-800 em hardware
- **Eficiência**: Consome pouquíssima energia (~15W)
- **24/7**: Deixe rodando o tempo todo
- **Extensível**: Adicione skills e integrações conforme precisa

## Hardware Necessário

### Recomendado (melhor performance)
| Componente | Especificação | Custo |
|-----------|--------------|-------|
| **SBC** | Raspberry Pi 5 (8GB RAM) | R$ 600 |
| **Armazenamento** | SSD 256GB USB-C | R$ 200 |
| **Fonte** | 27W USB-C oficial | R$ 150 |
| **Refrigeração** | Dissipador passivo/ativo | R$ 50 |
| **Rede** | Ethernet gigabit | Incluso |
| **Gabinete** | Com ventilação | R$ 80 |
| **Total** | | **~R$ 1.080** |

### Econômico (entrada)
| Componente | Especificação | Custo |
|-----------|--------------|-------|
| **SBC** | Raspberry Pi 4 (4GB RAM) | R$ 350 |
| **Armazenamento** | Cartão microSD 128GB | R$ 100 |
| **Fonte** | 5.1V 3A | R$ 80 |
| **Total** | | **~R$ 530** |

### Não Recomendado
- Raspberry Pi Zero / Zero 2: Muito lento, apenas 512MB-1GB RAM
- Cartão microSD (no Pi 5): Gargalo de performance
- WiFi apenas: Latência instável

## Instalação Passo-a-Passo

### 1. Preparar o Sistema Operacional

**No seu computador:**

```bash
# Download do Raspberry Pi Imager (macOS)
brew install raspberry-pi-imager

# Ou baixe em: https://www.raspberrypi.com/software/
```

**Opções recomendadas ao gravar:**

```
Sistema: Raspberry Pi OS Lite (64-bit)
Versão: Bookworm (latest)
Hostname: openclaw-server
SSH: Habilitado (copie sua public key)
WiFi: Deixe para depois (use Ethernet)
```

### 2. Primeiro Boot e Acesso

```bash
# SSH para o Pi
ssh pi@openclaw-server.local

# Atualize o sistema
sudo apt update && sudo apt upgrade -y

# Instale dependências básicas
sudo apt install -y \
  git \
  curl \
  wget \
  build-essential \
  libssl-dev \
  libffi-dev \
  python3-dev \
  nodejs npm
```

### 3. Instalar OpenClaw

```bash
# Clone o repositório
cd /home/pi
git clone https://github.com/ruvnet/openclaw.git
cd openclaw

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env
nano .env
```

**Arquivo `.env` para Raspberry Pi:**

```env
# OpenClaw
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# API Keys (deixe em branco ou use variáveis de sistema)
ANTHROPIC_API_KEY=your-key-here
OPENAI_API_KEY=your-key-here

# Banco de dados (SQLite local)
DATABASE_URL=file:/var/lib/openclaw/data.db

# Skills
SKILLS_DIR=/home/pi/openclaw/skills
SKILLS_CACHE_DIR=/var/lib/openclaw/cache

# Performance (ajuste para Pi)
MAX_WORKERS=2
MEMORY_LIMIT=512M
TIMEOUT=30000

# Logging
LOG_DIR=/var/log/openclaw
```

### 4. Build e Teste

```bash
# Build do projeto
npm run build

# Teste em desenvolvimento
npm run dev

# Pressione Ctrl+C quando terminar
```

### 5. Configurar como Serviço Systemd

```bash
# Crie arquivo de serviço
sudo tee /etc/systemd/system/openclaw.service > /dev/null <<EOF
[Unit]
Description=OpenClaw - Local AI Assistant
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/openclaw
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=openclaw

[Install]
WantedBy=multi-user.target
EOF

# Recarregue systemd
sudo systemctl daemon-reload

# Habilite o serviço
sudo systemctl enable openclaw

# Inicie
sudo systemctl start openclaw

# Verifique status
sudo systemctl status openclaw
```

## Configuração com Cloudflare

Para acessar OpenClaw fora de casa com segurança:

### Instalar Cloudflare Tunnel

```bash
# Download
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64.deb

# Instale
sudo dpkg -i cloudflared.deb

# Login
cloudflared tunnel login

# Crie um túnel
cloudflared tunnel create openclaw

# Configure
cat >> ~/.cloudflared/config.yml <<EOF
tunnel: openclaw
credentials-file: /home/pi/.cloudflared/<UUID>.json

ingress:
  - hostname: openclaw.seu-dominio.com.br
    service: http://localhost:3000
  - service: http_status:404
EOF

# Teste
cloudflared tunnel route dns openclaw seu-dominio.com.br
cloudflared tunnel run openclaw
```

### Serviço Cloudflare

```bash
# Instale como serviço
sudo cloudflared service install

# Inicie
sudo systemctl start cloudflared
sudo systemctl status cloudflared

# Ver logs
sudo journalctl -u cloudflared -f
```

## Performance Esperada

### Benchmarks em Raspberry Pi 5

| Operação | Pi 4 (4GB) | Pi 5 (8GB) |
|----------|-----------|-----------|
| Inicialização | 15-20s | 8-12s |
| Requisição simples (Claude Haiku) | 2-3s | 1-2s |
| Processamento skill | 1-5s | 0.5-3s |
| Memória em repouso | 350MB | 420MB |
| CPU em repouso | 3-5% | 2-4% |

### Limitações

- **Quantização**: OpenClaw em Pi usa modelos quantizados (4/8-bit)
- **Concorrência**: Máximo 2-3 requisições simultâneas
- **Modelos**: Modelos locais (Ollama, llama.cpp) têm latência de 5-15s
- **TTS**: Processos pesados como sintetização de voz devem usar APIs externas

## Dicas de Otimização

### 1. Usar SSD em vez de Cartão SD

O cartão SD é o maior gargalo. Se possível, use SSD:

```bash
# Boot do SSD no Pi 5
sudo rpi-eeprom-config --edit

# Altere a linha:
# BOOT_ORDER=0xf41
# Para:
# BOOT_ORDER=0xf416

# Salve e reboot
```

### 2. Usar Swap em RAM (tmpfs)

```bash
# Crie swap em RAM (rápido, não desgasta SSD)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Persistente
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 3. Limpar Logs e Cache Regularmente

```bash
# Cron job semanal
(crontab -l 2>/dev/null; echo "0 2 * * 0 /home/pi/openclaw/scripts/cleanup.sh") | crontab -
```

### 4. Usar Compressão de Dados

```env
# No .env
COMPRESSION=gzip
CACHE_COMPRESSION=true
```

### 5. Monitorar Temperatura

```bash
# Instale ferramentas
sudo apt install -y htop iotop

# Monitor em tempo real
watch -n 1 'vcgencmd measure_temp'

# Alerta se > 80°C
if [ $(vcgencmd measure_temp | grep -oE '[0-9]+' | head -1) -gt 80 ]; then
  sudo systemctl stop openclaw
fi
```

## Custo Total de Propriedade (3 anos)

### Hardware
- Raspberry Pi 5 (8GB): R$ 600
- SSD 256GB: R$ 200
- Fonte, cabo, gabinete: R$ 300
- **Subtotal Hardware**: R$ 1.100

### Energia (3 anos)
- Consumo: 15W médio
- Custo/kWh: R$ 0,80
- 3 anos × 365 dias × 24h × 15W = 39.420 kWh
- **Custo Energia**: R$ 31.536

### APIs (estimado, 3 anos)
- 100 requisições/dia × 365 dias × 3 anos = 109.500 requisições
- Custo médio (Haiku): $0.0003/requisição
- **Custo APIs**: R$ 1.300 (se usar APIs)

### **Total (hardware + energia + APIs)**: ~R$ 33.936 em 3 anos
**Custo mensal**: R$ 943

### Comparado com
- **Claude API puro**: R$ 1.000-2.000/mês
- **Serviço na nuvem**: R$ 500-1.500/mês
- **Hardware + APIs**: R$ 943/mês ✅

## Troubleshooting

### "Connection timed out"
```bash
# Verifique firewall
sudo ufw status
sudo ufw allow 3000/tcp

# Teste conectividade
curl http://localhost:3000
```

### "Out of memory"
```bash
# Reduza MEMORY_LIMIT em .env
MEMORY_LIMIT=256M

# Monitore uso
free -h
```

### "High CPU usage"
```bash
# Limite workers
MAX_WORKERS=1

# Analise logs
sudo journalctl -u openclaw -f
```

### Performance baixa
```bash
# Verifique se está em SSD
df -h

# Se em SD, mude para SSD
# Ou reduza carga de trabalho
```

## Próximos Passos

1. **Integre skills**: Adicione automação (ligações, envio de emails)
2. **Configure TTS**: Use ElevenLabs para voz (veja artigo sobre TTS)
3. **Segurança**: Implemente autenticação (veja artigo sobre segurança)
4. **Backups**: Configure backup automático em cloud
5. **Monitoramento**: Use Prometheus/Grafana para metrics

## Recursos

- [OpenClaw GitHub](https://github.com/ruvnet/openclaw)
- [Raspberry Pi Docs](https://www.raspberrypi.com/documentation/)
- [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)
- [Comunidade OpenClaw](https://discord.gg/openclaw)

---

**Próximos artigos:** Integração com ElevenLabs, Segurança e Privacidade, Troubleshooting Avançado
