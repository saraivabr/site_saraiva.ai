const AIRTABLE_BASE_ID = process.env.AIRTABLE_OFFERS_BASE_ID ?? "appuljnt9Q1h2ae18";
const AIRTABLE_TABLE_ID = process.env.AIRTABLE_OFFERS_TABLE_ID ?? "tbll1rx8926j7o4dI";
const AIRTABLE_VIEW_ID = process.env.AIRTABLE_OFFERS_VIEW_ID ?? "viwLOmms7vrzIvkzs";
const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const SUPABASE_URL = process.env.SUPABASE_APP_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const fields = {
  name: "fldXiHWvZp1D1salY",
  offerType: "fld7jBRi4pyK22ClC",
  buyer: "fldw6Tk795NXCTb7p",
  problem: "fldQ2at43YTCRQxST",
  delivery: "fldBBezNjPemC3BbJ",
  status: "fldWhWw3zrnxarB2J",
  publish: "fldc6H7ABT5chh4mr",
};

if (!AIRTABLE_TOKEN || !SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Defina AIRTABLE_TOKEN, SUPABASE_APP_URL e SUPABASE_SERVICE_ROLE_KEY");
}

function selectedName(value) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && typeof value.name === "string") return value.name;
  return "";
}

function slugify(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function publicStatus(status) {
  if (status === "Pronto para vender") return "Disponível";
  if (status === "Prototipar" || status === "Em construção") return "Em construção";
  return "Em validação";
}

async function getAirtableRecords() {
  const records = [];
  let offset;
  do {
    const url = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`);
    url.searchParams.set("pageSize", "100");
    url.searchParams.set("view", AIRTABLE_VIEW_ID);
    url.searchParams.set("filterByFormula", "{Publicar no site}=1");
    url.searchParams.set("returnFieldsByFieldId", "true");
    Object.values(fields).forEach((fieldId) => url.searchParams.append("fields[]", fieldId));
    if (offset) url.searchParams.set("offset", offset);

    const response = await fetch(url, { headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` } });
    if (!response.ok) throw new Error(`Airtable indisponível (${response.status})`);
    const page = await response.json();
    records.push(...page.records);
    offset = page.offset;
  } while (offset);
  return records;
}

function sanitize(record) {
  const value = record.fields;
  const name = String(value[fields.name] ?? "").trim();
  return {
    source_record_id: record.id,
    slug: slugify(name),
    name,
    offer_type: selectedName(value[fields.offerType]),
    buyer: String(value[fields.buyer] ?? "").trim(),
    problem: String(value[fields.problem] ?? "").trim(),
    delivery: String(value[fields.delivery] ?? "").trim(),
    public_status: publicStatus(selectedName(value[fields.status])),
  };
}

async function reconcile(rows) {
  const response = await fetch(`${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/rpc/sync_editorial_offers`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ p_rows: rows }),
  });
  if (!response.ok) throw new Error(`Reconciliação Supabase indisponível (${response.status}): ${await response.text()}`);
  return response.json();
}

const records = await getAirtableRecords();
if (!records.length && process.env.AIRTABLE_OFFERS_ALLOW_EMPTY !== "true") {
  throw new Error("O gate retornou zero registros; defina AIRTABLE_OFFERS_ALLOW_EMPTY=true somente para despublicar todos de forma intencional");
}
const rows = records.map(sanitize).filter((row) => row.name && row.slug && row.problem && row.buyer && row.delivery);
if (rows.length !== records.length) throw new Error("Há registros marcados para publicação sem campos públicos obrigatórios");
const result = await reconcile(rows);
console.log(JSON.stringify({ source: `${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`, selected: records.length, published: rows.length, reconciliation: result[0] }, null, 2));
