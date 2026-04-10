export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const TOKEN = process.env.NOTION_TOKEN;
  const { endpoint, method, body } = req.body || {};

  if (!endpoint) return res.status(400).json({ error: "Missing endpoint" });

  try {
    const notionRes = await fetch(`https://api.notion.com/v1${endpoint}`, {
      method: method || "GET",
      headers: {
        "Authorization": `Bearer ${TOKEN}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      },
      body: body ? JSON.stringify(body) : undefined
    });
    const data = await notionRes.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
