export default async (req) => {
  try {
    const { question, type } = await req.json();

    const systemPrompt = type === "sql"
      ? `You are a senior SQL expert. Convert natural language to optimized PostgreSQL.
Return ONLY the SQL query with inline comments. No explanation outside the query.
Tables available:
- orders(id, customer_id, product_id, amount, created_at, status)
- products(id, name, category, price, stock)
- customers(id, name, email, city, created_at)
- transactions(id, order_id, payment_method, amount, created_at)`
      : `You are QueryMind AI — an intelligent Business Intelligence assistant for SMBs.
Help users analyze business data, generate SQL queries, and surface actionable insights.
Respond professionally and concisely. When generating SQL, use a code block.
Always end with one helpful follow-up suggestion.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: "user", content: question }],
      }),
    });

    const data = await response.json();

    if (data.error) {
      return new Response(
        JSON.stringify({ error: data.error.message }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const reply = data.content?.[0]?.text || "No response received.";
    return new Response(
      JSON.stringify({ reply }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const config = { path: "/api/chat" };
