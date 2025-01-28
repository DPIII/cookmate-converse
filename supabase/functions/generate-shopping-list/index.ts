import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { recipe } = await req.json();

    console.log('Generating shopping list for recipe:', recipe);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant that generates organized shopping lists from recipes. 
            Extract all ingredients from the recipe and create a categorized shopping list.
            Format the list by categories (e.g., Produce, Meat, Dairy, Pantry, etc.).
            Include quantities in standard measurements.
            Focus only on the ingredients needed, not the full recipe.`
          },
          {
            role: 'user',
            content: `Generate a categorized shopping list for this recipe: ${recipe}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to generate shopping list');
    }

    const data = await response.json();
    console.log('Shopping list generated successfully');

    return new Response(JSON.stringify({ shoppingList: data.choices[0].message.content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-shopping-list function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate shopping list' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});