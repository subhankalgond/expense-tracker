// Supabase Edge Function: ai-insights
// Analyzes aggregated spending trends and provides suggestions
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InsightPayload {
  periodLabel: string;
  totalIncome: number;
  totalExpense: number;
  netCashFlow: number;
  categorySpending: Array<{ category: string; amount: number; percentage: number }>;
  budgetStatus: Array<{ name: string; spent: number; limit: number; percent: number }>;
  recurringTotal: number;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized access" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload: InsightPayload = await req.json();

    const openAiApiKey = Deno.env.get("OPENAI_API_KEY");
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");

    // If an external key is configured, use it
    if (geminiApiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      text: `You are a financial advisor for an editorial finance tracker called Ledger Brutalist.
Analyze this user's data for ${payload.periodLabel}:
- Income: ₹${payload.totalIncome}
- Expenses: ₹${payload.totalExpense}
- Net Cash Flow: ₹${payload.netCashFlow}
- Category Breakdown: ${JSON.stringify(payload.categorySpending)}
- Budgets: ${JSON.stringify(payload.budgetStatus)}
- Upcoming recurring commitments: ₹${payload.recurringTotal}

Provide 3 concise, brutally honest, pragmatic financial suggestions. Return a JSON array of objects with keys: "title", "observation", "suggestion", "severity" ('high', 'medium', 'low'). No markdown formatting around JSON.`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (response.ok) {
          const geminiData = await response.json();
          const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          const cleaned = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(cleaned);

          return new Response(
            JSON.stringify({
              source: "gemini_ai",
              period: payload.periodLabel,
              insights: parsed,
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
          );
        }
      } catch (err) {
        console.warn("External AI call failed, falling back to rule-based engine:", err);
      }
    }

    // Default High-Precision Rule-Based Engine (Guaranteed zero latency, deterministic, completely private)
    const insights = [];

    // Rule 1: High expense ratio
    if (payload.totalIncome > 0 && payload.totalExpense > payload.totalIncome * 0.8) {
      const burnPct = Math.round((payload.totalExpense / payload.totalIncome) * 100);
      insights.push({
        title: "High Burn Rate Detected",
        observation: `You have consumed ${burnPct}% of your total income for ${payload.periodLabel}.`,
        suggestion: "Consider postponing non-essential purchases until next cycle to protect your emergency buffer.",
        severity: burnPct > 100 ? "high" : "medium",
      });
    }

    // Rule 2: Top category dominance
    if (payload.categorySpending && payload.categorySpending.length > 0) {
      const topCat = payload.categorySpending[0];
      if (topCat.percentage >= 40) {
        insights.push({
          title: `Spending Concentrated in ${topCat.category}`,
          observation: `${topCat.category} represents ${topCat.percentage}% (₹${topCat.amount.toLocaleString('en-IN')}) of total expenditures.`,
          suggestion: `Investigate recurring spikes or one-off items in ${topCat.category} to identify specific line items to optimize.`,
          severity: "medium",
        });
      }
    }

    // Rule 3: Budget overruns
    const exceededBudgets = payload.budgetStatus.filter((b) => b.percent >= 90);
    if (exceededBudgets.length > 0) {
      const names = exceededBudgets.map((b) => b.name).join(", ");
      insights.push({
        title: "Budget Thresholds Breached",
        observation: `${names} exceeded 90% utilization for this cycle.`,
        suggestion: "Review recent transactions in these categories to prevent debt creation or unplanned dipping into savings.",
        severity: "high",
      });
    }

    // Rule 4: Healthy savings opportunity
    if (payload.netCashFlow > 0 && payload.totalIncome > 0) {
      const savingsRate = Math.round((payload.netCashFlow / payload.totalIncome) * 100);
      if (savingsRate >= 20) {
        insights.push({
          title: `Strong Cash Surplus: ${savingsRate}%`,
          observation: `You retained ₹${payload.netCashFlow.toLocaleString('en-IN')} as net positive cash flow.`,
          suggestion: "Consider allocating at least 50% of this surplus directly to your active savings goals or emergency fund.",
          severity: "low",
        });
      }
    }

    if (insights.length === 0) {
      insights.push({
        title: "Balanced Spending Pattern",
        observation: `Expenditures and cash flow are currently within standard operating variance for ${payload.periodLabel}.`,
        suggestion: "Maintain continuous transaction logging to establish a reliable 90-day baseline.",
        severity: "low",
      });
    }

    return new Response(
      JSON.stringify({
        source: "rule_based_engine",
        period: payload.periodLabel,
        insights,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
