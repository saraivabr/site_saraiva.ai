# OpenClaw + ElevenLabs: Assistente de IA com Voz em Português

## Introdução

Transforme seu OpenClaw em um verdadeiro assistente pessoal que **fala com você**. Neste artigo, vamos integrar text-to-speech de alta qualidade, permitindo chamadas telefônicas, assistente por voz, e muito mais.

## Por que ElevenLabs?

| Feature | Google Cloud | Amazon Polly | Azure | ElevenLabs |
|---------|--------------|--------------|-------|-----------|
| Qualidade de voz | Boa | Muito Boa | Muito Boa | **Excelente** ✅ |
| Latência | 1-2s | 2-3s | 1-2s | **0.5-1s** ✅ |
| Português BR | ✅ | ✅ | ✅ | **✅ Nativo** ✅ |
| Vozes naturais | 5-10 | 10-20 | 15+ | **500+** ✅ |
| Streaming audio | ✅ | ✅ | ✅ | **✅ Real-time** ✅ |
| Custo/1k chars | $0.020 | $0.015 | $0.015 | **$0.030** |
| Fone de ouvido | Não ideal | Não ideal | Não ideal | **Excelente** ✅ |

## Configuração Inicial

### 1. Criar Conta ElevenLabs

1. Acesse [elevenlabs.io](https://elevenlabs.io)
2. Crie conta (free tier: 10k caracteres/mês)
3. Vá para **Account → API Key**
4. Copie sua API Key

### 2. Instalar Dependências

```bash
cd /home/pi/openclaw  # ou seu diretório

# Instale o SDK ElevenLabs
npm install elevenlabs

# Instale player de áudio
sudo apt install -y mpv alsa-utils

# Teste áudio
speaker-test -t wav -c 2 -l 1
```

### 3. Configurar Variáveis de Ambiente

```bash
# Edite .env
nano .env

# Adicione:
ELEVENLABS_API_KEY=sk_0ab1cd2e3f4g5h6i7j8k9
ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL  # Bella (voz feminina em português)
ELEVENLABS_MODEL=eleven_multilingual_v2  # Modelo multilíngue
ELEVENLABS_STABILITY=0.65  # 0-1, maior = mais consistente
ELEVENLABS_SIMILARITY=0.75  # 0-1, maior = mais similar à voz original
TTS_ENABLED=true
```

### 4. Criar Serviço TTS em OpenClaw

**arquivo: `src/services/tts-service.ts`**

```typescript
import { ElevenLabsClient } from "elevenlabs";
import * as fs from "fs";
import * as path from "path";
import { spawn } from "child_process";

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

interface TTSOptions {
  voiceId?: string;
  modelId?: string;
  stability?: number;
  similarityBoost?: number;
  outputPath?: string;
  autoPlay?: boolean;
}

export class TTSService {
  private voiceId: string;
  private modelId: string;

  constructor() {
    this.voiceId = process.env.ELEVENLABS_VOICE_ID || "EXAVITQu4vr4xnSDxMaL";
    this.modelId = process.env.ELEVENLABS_MODEL || "eleven_multilingual_v2";
  }

  /**
   * Converte texto em fala
   */
  async textToSpeech(
    text: string,
    options: TTSOptions = {}
  ): Promise<Buffer> {
    try {
      const audio = await client.generate({
        text,
        voice: options.voiceId || this.voiceId,
        model_id: options.modelId || this.modelId,
        voice_settings: {
          stability: options.stability ?? 0.65,
          similarity_boost: options.similarityBoost ?? 0.75,
        },
      });

      // audio é um Readable stream
      const chunks: Buffer[] = [];

      return new Promise((resolve, reject) => {
        audio.on("data", (chunk: Buffer) => chunks.push(chunk));
        audio.on("end", () => resolve(Buffer.concat(chunks)));
        audio.on("error", reject);
      });
    } catch (error) {
      console.error("TTS Error:", error);
      throw error;
    }
  }

  /**
   * Salva áudio em arquivo
   */
  async save(text: string, filePath: string, options?: TTSOptions): Promise<string> {
    const audio = await this.textToSpeech(text, options);
    fs.writeFileSync(filePath, audio);
    return filePath;
  }

  /**
   * Reproduz áudio imediatamente
   */
  async play(text: string, options?: TTSOptions): Promise<void> {
    const tmpFile = `/tmp/openclaw-tts-${Date.now()}.mp3`;
    await this.save(text, tmpFile, options);

    return new Promise((resolve, reject) => {
      const player = spawn("mpv", [
        "--volume=100",
        "--no-terminal",
        tmpFile,
      ]);

      player.on("close", () => {
        fs.unlinkSync(tmpFile);
        resolve();
      });

      player.on("error", reject);
    });
  }

  /**
   * Stream de áudio em tempo real (para APIs)
   */
  async *streamAudio(text: string, options?: TTSOptions) {
    const audio = await client.generate({
      text,
      voice: options?.voiceId || this.voiceId,
      model_id: options?.modelId || this.modelId,
      voice_settings: {
        stability: options?.stability ?? 0.65,
        similarity_boost: options?.similarityBoost ?? 0.75,
      },
    });

    for await (const chunk of audio) {
      yield chunk;
    }
  }

  /**
   * Lista vozes disponíveis
   */
  async listVoices() {
    const voices = await client.voices.getAll();
    return voices.map((v) => ({
      id: v.voice_id,
      name: v.name,
      category: v.category,
      language: v.labels?.language || "unknown",
    }));
  }

  /**
   * Obter informações de uma voz
   */
  async getVoice(voiceId: string) {
    return await client.voices.get(voiceId);
  }
}

export const ttsService = new TTSService();
```

## Integração com Skills

### 1. Skill: "Diga Olá"

**arquivo: `skills/say-hello/index.ts`**

```typescript
import { ttsService } from "../../src/services/tts-service";

export const sayHello = {
  name: "say-hello",
  description: "Diz uma mensagem em voz alta",

  async execute(input: { message: string }) {
    console.log(`Dizendo: ${input.message}`);
    
    await ttsService.play(input.message, {
      voiceId: "EXAVITQu4vr4xnSDxMaL", // Bella
      stability: 0.75,
      similarityBoost: 0.8,
    });

    return {
      success: true,
      message: input.message,
      duration: "~2-3s",
    };
  },
};
```

### 2. Skill: "Resumo de Notícias com Voz"

```typescript
import { ttsService } from "../../src/services/tts-service";
import { newsAPI } from "../../src/services/news-api";

export const newsSummaryVoice = {
  name: "news-summary-voice",
  description: "Lê as principais notícias em voz",

  async execute(input: { category?: string }) {
    const news = await newsAPI.getTopNews(input.category || "general");
    
    let summary = `Aqui estão as principais notícias. `;
    summary += news.articles
      .slice(0, 3)
      .map((n: any) => `${n.title}. `)
      .join("");

    await ttsService.play(summary, {
      voiceId: "EXAVITQu4vr4xnSDxMaL",
      stability: 0.7,
    });

    return {
      articlesRead: 3,
      totalWords: summary.split(" ").length,
    };
  },
};
```

## Integração com Ligações Telefônicas

### Usar com Twilio para Chamadas

```typescript
// arquivo: src/services/phone-service.ts
import twilio from "twilio";
import { ttsService } from "./tts-service";

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const phoneService = {
  async makeCall(phoneNumber: string, message: string) {
    // Gera áudio
    const audioFile = await ttsService.save(
      message,
      `/var/lib/openclaw/audio/call-${Date.now()}.mp3`
    );

    // Faz chamada via Twilio
    const call = await twilioClient.calls.create({
      url: `${process.env.TWILIO_WEBHOOK_URL}/twiml?audioFile=${audioFile}`,
      to: phoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER,
    });

    return {
      callSid: call.sid,
      status: call.status,
      duration: "~5-10s",
    };
  },

  async sendVoiceSMS(phoneNumber: string, message: string) {
    // Usa TTS + SMS
    const audioUrl = await ttsService.save(
      message,
      `/var/lib/openclaw/audio/sms-${Date.now()}.mp3`
    );

    return {
      to: phoneNumber,
      message,
      audioUrl,
    };
  },
};
```

## Assistente por Voz Interativo

### Skill: "Assistente Contínuo"

```typescript
import { ttsService } from "../../src/services/tts-service";
import * as readline from "readline";

export const voiceAssistant = {
  name: "voice-assistant",
  description: "Assistente de IA que fala com você continuamente",

  async execute() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // Saudação inicial
    await ttsService.play("Olá, sou seu assistente de IA. Como posso ajudar?");

    const askQuestion = () => {
      rl.question("Você: ", async (userInput) => {
        if (userInput.toLowerCase() === "sair") {
          await ttsService.play("Até logo!");
          rl.close();
          return;
        }

        // Processa com Claude
        const response = await processWithClaude(userInput);

        // Responde em voz
        await ttsService.play(response, {
          stability: 0.7,
          similarityBoost: 0.75,
        });

        askQuestion(); // Próxima pergunta
      });
    };

    askQuestion();
  },
};

async function processWithClaude(input: string) {
  // Chamada ao Claude via Anthropic API
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: input,
        },
      ],
    }),
  });

  const data = (await response.json()) as any;
  return data.content[0].text;
}
```

## Configurar Atalho de Voz

### No Raspberry Pi

```bash
# Instale assistente de voz
sudo apt install -y pocketsphinx pocketsphinx-en

# Crie script: /home/pi/openclaw/scripts/voice-trigger.sh
#!/bin/bash

while true; do
  # Espera por "Hey OpenClaw" (ou customizar)
  result=$(pocketsphinx_continuous -hmm en_US/hub4wsj_sc_8k \
    -dict test.dic \
    -lm test.lm \
    2>/dev/null)

  if [[ $result == *"openclaw"* ]]; then
    # Ativa OpenClaw via API
    curl -X POST http://localhost:3000/api/voice/activate
  fi
done
```

## Múltiplas Vozes em Português

### Vozes Recomendadas para PT-BR

```typescript
export const PORTUGUESE_VOICES = {
  bella: {
    id: "EXAVITQu4vr4xnSDxMaL",
    name: "Bella",
    gender: "female",
    description: "Voz jovem, amigável e natural",
  },
  matilda: {
    id: "XrExE9yKIg1WjnnlVkGf",
    name: "Matilda",
    gender: "female",
    description: "Voz profissional e confiante",
  },
  adam: {
    id: "pNInz6obpgDQGcFmaJgB",
    name: "Adam",
    gender: "male",
    description: "Voz grave e clara",
  },
  arnold: {
    id: "jsCqWAovK2LkecY7zXl4",
    name: "Arnold",
    gender: "male",
    description: "Voz profissional e formal",
  },
};

// Uso
await ttsService.play("Olá!", {
  voiceId: PORTUGUESE_VOICES.bella.id,
});
```

## Custos e Alternativas

### Comparação de Custos (1000 caracteres)

| Serviço | Preço/1k chars | Latência | Qualidade |
|---------|----------------|----------|-----------|
| ElevenLabs Free | R$ 0 (10k/mês) | 0.5-1s | ⭐⭐⭐⭐⭐ |
| ElevenLabs Pro | R$ 0.15 | 0.5-1s | ⭐⭐⭐⭐⭐ |
| Google Cloud TTS | R$ 0.10 | 1-2s | ⭐⭐⭐⭐ |
| Azure TTS | R$ 0.10 | 1-2s | ⭐⭐⭐⭐ |
| Ollama Local | R$ 0 | 10-30s | ⭐⭐⭐ |

### Alternativa: Local com piper-tts

```bash
# Instalação
pip install piper-tts

# Download do modelo PT-BR
piper --download pt_BR

# Uso
echo "Olá mundo" | piper \
  --model pt_BR-tugão-medium.onnx \
  --output_file output.wav

# Reproduz
mpv output.wav
```

**Vantagens:**
- Gratuito, roda localmente
- Privacidade total
- Sem latência de API

**Desvantagens:**
- Qualidade inferior ao ElevenLabs
- Requer mais processamento
- Modelos menores disponíveis

## Monitoramento e Logs

```bash
# Log de uso TTS
tail -f /var/log/openclaw/tts.log

# Estatísticas de uso
grep "TTS:" /var/log/openclaw/main.log | \
  awk '{sum+=$NF} END {print "Total chars:", sum}'

# Alerta se uso exceder cota
crontab -e
# Adicione:
# 0 * * * * /home/pi/openclaw/scripts/check-tts-quota.sh
```

## Troubleshooting

### "API key invalid"
```bash
# Verifique API key
echo $ELEVENLABS_API_KEY

# Teste com curl
curl -X GET https://api.elevenlabs.io/v1/voices \
  -H "xi-api-key: $ELEVENLABS_API_KEY"
```

### "No audio device"
```bash
# Instale ALSA
sudo apt install -y alsa-utils

# Configure som
alsamixer

# Teste som
speaker-test -t wav -c 2 -l 1
```

### "Latência alta"
```bash
# Use streaming em vez de gerar arquivo completo
for await (const chunk of ttsService.streamAudio(text)) {
  await playChunk(chunk);
}
```

## Próximos Passos

1. **Adicione detecção de fala** (speech-to-text)
2. **Crie rotinas automáticas** (lembre-me de...)
3. **Integre com smart home** (controle Philips Hue por voz)
4. **Implemente emoções** (voz mudar com sentimento)
5. **Treine voz customizada** (voz única para seu assistente)

## Recursos

- [ElevenLabs API Docs](https://elevenlabs.io/docs)
- [Twilio Voice](https://www.twilio.com/voice)
- [piper-tts GitHub](https://github.com/rhasspy/piper)
- [Comunidade OpenClaw](https://discord.gg/openclaw)

---

**Próximos artigos:** Segurança e Privacidade, Troubleshooting Avançado, Visão de Futuro
