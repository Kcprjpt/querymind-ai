export default async (req) => {
  const { question, type } = await req.json();

  const systemPrompt = type === "sql"
    ? `You are a SQL expert. Convert to PostgreSQL query only. Return ONLY SQL with comments.
       Tables: orders(id,customer_id,product_id,amount,created_at,status),
       products(id,name,category,price,stock), customers(id,name,email,city,created_at).`
    : `You are QueryMind AI — a Business Intelligence assistant for SMBs.
       Help analyze data, generate SQL, surface insights. Be concise and professional.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.querymindai_ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: question }]
    })
  });

  const data = await response.json();
  return new Response(
    JSON.stringify({ reply: data.content?.[0]?.text || "Error" }),
    { headers: { "Content-Type": "application/json" } }
  );
};

export const config = { path: "/api/chat" };