# OpenClaw: Segurança e Privacidade - Seu Assistente, Seus Dados

## Introdução

A privacidade é o núcleo do OpenClaw. Diferente de assistentes em nuvem, **todos os seus dados ficam em casa**. Mas segurança é responsabilidade compartilhada. Neste artigo, você aprenderá como proteger seu assistente de IA pessoal.

## O que Fica Local vs. O que Vai para a Nuvem

### Dados que Ficam Locais (100% Privados) ✅

```
├── Histórico de conversas
├── Arquivos e documentos processados
├── Configurações e preferências
├── Banco de dados de skills
├── Logs e metadados
├── Cache de modelos
└── Dados de automação (rotinas, agendamentos)
```

**Armazenamento:**
- SQLite em `/var/lib/openclaw/data.db`
- Arquivos em `/var/lib/openclaw/documents/`
- Logs em `/var/log/openclaw/`

### Dados que Vão para Nuvem (Somente com Permissão)

Se você usar APIs externas, esses dados sairão de casa:

```
├── [SE CONFIGURADO] Claude API - Prompts e respostas
├── [SE CONFIGURADO] OpenAI API - Prompts e respostas
├── [SE CONFIGURADO] ElevenLabs - Textos para sintetização
├── [SE CONFIGURADO] Twilio - Metadados de chamadas
└── [SE CONFIGURADO] Integração com serviços (Gmail, etc)
```

**Regra de Ouro:** Se você não configurou a chave de API, os dados não saem.

## Segurança de API Keys e Credenciais

### 1. Nunca Versione Segredos

```bash
# ❌ ERRADO - Nunca faça isso
git add .env
git commit -m "Add API keys"

# ✅ CORRETO
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Add .env to gitignore"
```

### 2. Usar Variáveis de Sistema

```bash
# Armazene chaves no sistema, não em arquivos
export ELEVENLABS_API_KEY="sk_0ab1cd2e3f4g5h6i7j8k9"
export ANTHROPIC_API_KEY="sk-proj-..."

# Carregue automaticamente ao iniciar
echo 'export ELEVENLABS_API_KEY="sk_0ab1cd2e3f4g5h6i7j8k9"' >> ~/.bashrc
source ~/.bashrc

# Verifique se carregou
echo $ELEVENLABS_API_KEY
```

### 3. Usar Secrets no Systemd

```bash
# Arquivo: /etc/systemd/system/openclaw.service
[Service]
...
Environment="ANTHROPIC_API_KEY=sk-proj-..."
Environment="ELEVENLABS_API_KEY=sk_0ab1cd2e3f4g5h6i7j8k9"
...

# Melhor: Carregar de arquivo seguro
EnvironmentFile=-/etc/openclaw/secrets.env
```

### 4. Permissões de Arquivo

```bash
# Arquivo de credenciais deve ter permissão 600 (apenas owner pode ler)
chmod 600 /etc/openclaw/secrets.env

# Verifique
ls -la /etc/openclaw/secrets.env
# -rw------- (600) é correto

# Errado
-rw-r--r-- (644) ❌
```

### 5. Rotação de Chaves

```bash
# Crie nova chave na plataforma (ElevenLabs, Anthropic, etc)
# Retire a chave antiga antes de deletar
export NEW_ANTHROPIC_API_KEY="sk-proj-novo..."

# Atualize em /etc/openclaw/secrets.env
# Teste
npm test

# Depois delete chave antiga na plataforma
```

## Sandboxing de Skills

Skills são extensões de código potencialmente perigosas. Devem rodar em sandbox.

### 1. Isolamento de Processo

```typescript
// arquivo: src/services/skill-sandbox.ts
import { spawn } from "child_process";
import { Worker } from "worker_threads";

export class SkillSandbox {
  /**
   * Executa skill em processo separado (seguro)
   */
  static async executeInProcess(
    skillCode: string,
    input: any,
    timeout = 5000
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const worker = new Worker(
        `
        const { parentPort } = require('worker_threads');
        parentPort.on('message', async (msg) => {
          try {
            const fn = new Function('input', '${skillCode}');
            const result = await fn(msg);
            parentPort.postMessage({ success: true, result });
          } catch (err) {
            parentPort.postMessage({ success: false, error: err.message });
          }
        });
        `,
        { eval: true }
      );

      const timer = setTimeout(() => {
        worker.terminate();
        reject(new Error("Skill timeout"));
      }, timeout);

      worker.on("message", (msg) => {
        clearTimeout(timer);
        worker.terminate();
        if (msg.success) resolve(msg.result);
        else reject(new Error(msg.error));
      });

      worker.postMessage(input);
    });
  }

  /**
   * Executa skill com limite de recursos (CPU, memória)
   */
  static async executeWithLimits(
    skillPath: string,
    input: any,
    limits = { cpuPercent: 50, memoryMB: 256, timeoutMs: 5000 }
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const process = spawn("node", [skillPath], {
        stdio: ["pipe", "pipe", "pipe"],
        // Limite memória
        maxBuffer: limits.memoryMB * 1024 * 1024,
      });

      let output = "";
      let errorOutput = "";

      process.stdout.on("data", (data) => {
        output += data.toString();
      });

      process.stderr.on("data", (data) => {
        errorOutput += data.toString();
      });

      const timer = setTimeout(() => {
        process.kill("SIGTERM");
        reject(new Error("Skill timeout"));
      }, limits.timeoutMs);

      process.on("close", (code) => {
        clearTimeout(timer);
        if (code === 0) {
          resolve(JSON.parse(output));
        } else {
          reject(new Error(`Skill error: ${errorOutput}`));
        }
      });

      process.stdin.write(JSON.stringify(input));
      process.stdin.end();
    });
  }
}
```

### 2. Whitelist de Permissões

```typescript
// arquivo: src/config/skill-permissions.ts
export const SKILL_PERMISSIONS = {
  "skill-read-email": {
    permissions: ["read:email"],
    allowedAPIs: ["gmail"],
    maxRequests: 100,
    rateLimitPerHour: 1000,
  },
  "skill-send-sms": {
    permissions: ["write:sms"],
    allowedAPIs: ["twilio"],
    maxRequests: 50,
    rateLimitPerHour: 500,
  },
  "skill-get-weather": {
    permissions: ["read:public"],
    allowedAPIs: ["openweather"],
    maxRequests: 1000,
    rateLimitPerHour: 10000,
  },
};

// Validação antes de executar skill
function validateSkillPermission(skillName: string, action: string): boolean {
  const perms = SKILL_PERMISSIONS[skillName as keyof typeof SKILL_PERMISSIONS];
  if (!perms) return false;
  return perms.permissions.includes(action);
}
```

### 3. Audit de Skills

```bash
# Analise um skill antes de instalar
npm install @snyk/cli

npx snyk test skills/my-new-skill/

# Resultado:
# ✓ No vulnerabilities found
# ou
# ✗ 2 vulnerabilities found
```

## Backups Criptografados

### 1. Backup Automático

```bash
# arquivo: /home/pi/openclaw/scripts/backup.sh
#!/bin/bash

BACKUP_DIR="/var/lib/openclaw/backups"
DATA_DIR="/var/lib/openclaw/data.db"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Encrypt with GPG
gpg --symmetric \
  --cipher-algo AES256 \
  --output "$BACKUP_DIR/openclaw_$DATE.db.gpg" \
  "$DATA_DIR"

# Ou com openssl
openssl enc -aes-256-cbc \
  -salt \
  -in "$DATA_DIR" \
  -out "$BACKUP_DIR/openclaw_$DATE.db.enc" \
  -k "sua-senha-forte"

# Manter apenas últimos 30 dias
find $BACKUP_DIR -mtime +30 -delete

echo "Backup criado: $BACKUP_DIR/openclaw_$DATE.db.gpg"
```

### 2. Agendar Backup

```bash
# Cron diário às 2 da manhã
crontab -e

# Adicione:
0 2 * * * /home/pi/openclaw/scripts/backup.sh >> /var/log/openclaw/backup.log 2>&1
```

### 3. Restaurar de Backup

```bash
# Descriptografar
gpg --decrypt \
  --output restored.db \
  /var/lib/openclaw/backups/openclaw_20240101_020000.db.gpg

# Ou com openssl
openssl enc -d -aes-256-cbc \
  -in restored.db.enc \
  -out restored.db \
  -k "sua-senha-forte"

# Parar serviço
sudo systemctl stop openclaw

# Restaurar
cp restored.db /var/lib/openclaw/data.db

# Iniciar
sudo systemctl start openclaw
```

## Best Practices de Segurança

### 1. Firewall

```bash
# Instale UFW
sudo apt install -y ufw

# Configure padrão (negar tudo)
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Permita apenas SSH e HTTP/HTTPS
sudo ufw allow ssh
sudo ufw allow 3000/tcp        # OpenClaw
sudo ufw allow 443/tcp         # HTTPS
sudo ufw allow 80/tcp          # HTTP (redireciona para HTTPS)

# Habilite
sudo ufw enable

# Verifique
sudo ufw status verbose
```

### 2. Certificados SSL/TLS

```bash
# Use Cloudflare para HTTPS automático
cloudflared tunnel route dns openclaw seu-dominio.com.br

# Ou use Let's Encrypt
sudo apt install -y certbot python3-certbot-nginx

certbot certonly --standalone \
  -d openclaw.seu-dominio.com.br

# Renova automaticamente
sudo systemctl enable certbot.timer
```

### 3. Autenticação Local

```typescript
// arquivo: src/middleware/auth.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthService {
  /**
   * Hash de senha
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  /**
   * Verifica senha
   */
  static async verifyPassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Gera token JWT
   */
  static generateToken(userId: string): string {
    return jwt.sign(
      { userId, iat: Date.now() },
      process.env.JWT_SECRET || "change-me",
      { expiresIn: "24h" }
    );
  }

  /**
   * Verifica token
   */
  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || "change-me");
    } catch {
      return null;
    }
  }
}

// Middleware Express
export const requireAuth = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  const verified = AuthService.verifyToken(token);

  if (!verified) {
    return res.status(401).json({ error: "Invalid token" });
  }

  req.userId = verified.userId;
  next();
};
```

### 4. Rate Limiting

```typescript
// arquivo: src/middleware/rate-limit.ts
import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requisições
  message: "Muitas requisições, tente depois",
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // máximo 5 tentativas de login
  message: "Muitas tentativas de login",
  skipSuccessfulRequests: true,
});

// Uso no Express
app.use("/api/", apiLimiter);
app.post("/login", authLimiter, loginHandler);
```

## Auditoria e Logs

### 1. Audit Log

```typescript
// arquivo: src/services/audit-log.ts
import * as fs from "fs";

export class AuditLog {
  static log(
    action: string,
    user: string,
    resource: string,
    status: "success" | "failure",
    details?: any
  ) {
    const entry = {
      timestamp: new Date().toISOString(),
      action,
      user,
      resource,
      status,
      details,
      ip: "", // adicione IP do request se disponível
    };

    fs.appendFileSync(
      "/var/log/openclaw/audit.log",
      JSON.stringify(entry) + "\n"
    );
  }
}

// Uso
AuditLog.log(
  "SKILL_EXECUTED",
  "user@home",
  "skill-send-email",
  "success",
  { recipient: "friend@email.com" }
);

AuditLog.log(
  "API_KEY_ACCESSED",
  "admin",
  "elevenlabs",
  "failure",
  { reason: "Invalid token" }
);
```

### 2. Logs Estruturados

```bash
# Veja logs com estrutura JSON
tail -f /var/log/openclaw/audit.log | jq .

# Filtrar por ação
cat /var/log/openclaw/audit.log | jq 'select(.action=="SKILL_EXECUTED")'

# Alertas de falhas
cat /var/log/openclaw/audit.log | jq 'select(.status=="failure")'
```

### 3. Monitoramento de Acessos

```bash
# Veja quem acessou OpenClaw e quando
tail -f /var/log/openclaw/access.log

# Análise de segurança
grep "401" /var/log/openclaw/access.log | wc -l  # Tentativas falhadas
```

## Checklist de Segurança

- [ ] Defina senha forte do Pi (não `pi:raspberry`)
- [ ] Atualize sistema: `sudo apt update && sudo apt upgrade`
- [ ] Configure SSH key authentication (desabilite password)
- [ ] Habilite firewall: `sudo ufw enable`
- [ ] Oculte variáveis de ambiente em `/etc/openclaw/secrets.env`
- [ ] Configure backup automático com criptografia
- [ ] Gere chave JWT secreta: `openssl rand -base64 32`
- [ ] Implemente rate limiting em APIs
- [ ] Configure logging e auditoria
- [ ] Use HTTPS com Let's Encrypt
- [ ] Revise permissões de skills antes de instalar
- [ ] Monitore logs regularmente

## Recursos

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Let's Encrypt](https://letsencrypt.org/)
- [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/)
- [JWT Introduction](https://jwt.io/introduction)
- [Linux Security Hardening](https://ubuntu.com/security)

---

**Próximos artigos:** Troubleshooting Avançado, Visão de Futuro do OpenClaw
