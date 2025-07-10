import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const moneyMakingMethods = [
  'Crypto Arbitrage', 'Stock Micro-trading', 'NFT Flipping', 'Ad-Revenue Farming', 'E-commerce Automation',
  'Lead Generation', 'Content Creation', 'Data Annotation', 'Bug Bounty Hunting', 'Affiliate Marketing'
];

serve(async (req) => {
  // Handle CORS for frontend calls
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    const { agentId } = await req.json();

    const amount = Math.random() * 2 + 0.01; // $0.01 to $2.00
    const method = moneyMakingMethods[Math.floor(Math.random() * moneyMakingMethods.length)];

    const transaction = {
      amount: Math.round(amount * 100) / 100,
      source: method,
      agent_id: agentId,
      type: 'earning',
      created_at: new Date().toISOString(),
    };

    return new Response(JSON.stringify(transaction), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      status: 400,
    });
  }
});
