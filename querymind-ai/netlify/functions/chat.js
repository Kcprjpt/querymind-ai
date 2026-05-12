export default async (req) => {
  const { question, type } = await req.json();

  const systemPrompt = type === "sql"
    ? `You are a senior SQL expert. Convert natural language to optimized PostgreSQL query. 
       Return ONLY the SQL with comments. Tables: orders(id, customer_id, product_id, amount, created_at, status),
       products(id, name, category, price, stock), customers(id, name, email, city, created_at).`
    : `You are QueryMind AI — an intelligent Business Intelligence assistant.
       Help users analyze business data, generate SQL queries, and surface actionable insights.
       Respond professionally. Always end with one follow-up suggestion.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "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",
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: question }]
    })
  });

  const data = await response.json();
  const reply = data.content?.[0]?.text || "Something went wrong.";

  return new Response(JSON.stringify({ reply }), {
    headers: { "Content-Type": "application/json" }
  });
};

export const config = { path: "/api/chat" };