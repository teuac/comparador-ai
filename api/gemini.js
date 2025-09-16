export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido" });

  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Mensagem não enviada" });

  try {
    const API_KEY = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    const body = { contents: [{ parts: [{ text: message }] }] };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content || "Sem resposta";

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Erro Gemini:", error);
    res.status(500).json({ error: "Erro ao conectar ao Gemini" });
  }
}