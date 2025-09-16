// api/gemini.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido" });

  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Mensagem não enviada" });

  try {
    // Chamada ao Gemini (endpoint exemplo)
    const response = await fetch("https://api.gemini.google.com/v1/complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`,
      },
      body: JSON.stringify({ prompt: message, max_tokens: 150 }),
    });

    const data = await response.json();
    // data.output_text é só um exemplo, adapte conforme a resposta real
    res.status(200).json({ reply: data.output_text || "Sem resposta" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao conectar ao Gemini" });
  }
}
