import "server-only";

import { Pool } from "pg";

// O Scalingo injeta SCALINGO_POSTGRESQL_URL (e o alias DATABASE_URL) no app.
// O certificado do addon é assinado por uma CA própria e a URL vem com
// sslmode=prefer: a conexão é cifrada sem exigir verificação da cadeia.
function connectionString() {
  const url = process.env.SCALINGO_POSTGRESQL_URL ?? process.env.DATABASE_URL;
  if (!url) throw new Error("Catálogo indisponível: configuração ausente");
  return url;
}

declare global {
  var __saraivaPool: Pool | undefined;
}

// Um pool por processo. Sem o singleton, o hot reload do dev abriria um pool
// novo a cada recompilação até estourar o limite de conexões do addon.
function pool(): Pool {
  if (!globalThis.__saraivaPool) {
    const criado = new Pool({
      connectionString: connectionString(),
      ssl: { rejectUnauthorized: false },
      max: 5,
      keepAlive: true,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
    });

    // Sem este handler, uma conexão ociosa derrubada pelo servidor vira
    // exceção não tratada e mata o processo inteiro do Next.
    criado.on("error", (erro) => {
      console.error("Conexão ociosa do Postgres caiu", erro.message);
    });

    globalThis.__saraivaPool = criado;
  }
  return globalThis.__saraivaPool;
}

function conexaoCaiu(erro: unknown) {
  const mensagem = erro instanceof Error ? erro.message : "";
  return /Connection terminated|connection timeout|ECONNRESET|server closed/i.test(mensagem);
}

export async function sql<T>(text: string, params: unknown[] = []): Promise<T[]> {
  if (process.env.CATALOG_FORCE_FAILURE === "true") {
    throw new Error("Falha controlada do catálogo");
  }
  try {
    const result = await pool().query(text, params);
    return result.rows as T[];
  } catch (erro) {
    // Uma conexão que o servidor fechou entre duas requisições é normal.
    // Vale uma segunda tentativa antes de considerar o catálogo indisponível.
    if (!conexaoCaiu(erro)) throw erro;
    const result = await pool().query(text, params);
    return result.rows as T[];
  }
}
