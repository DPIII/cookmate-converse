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

    const { message, mealType, cuisineType, dietaryRestriction, isEdit, previousRecipe, servings } = await req.json();

    console.log('Generating recipe with:', { message, mealType, cuisineType, dietaryRestriction, isEdit, servings });

    let systemPrompt = `You are a professional chef and culinary expert. Create detailed, precise recipes following these requirements:

1. Recipe MUST be for the specified meal type if provided
2. Recipe MUST strictly follow any dietary restrictions
3. Recipe MUST be portioned for the exact number of servings specified
4. Include precise measurements and clear, numbered instructions
5. When modifying recipes, maintain core characteristics while incorporating requested changes

Format your response exactly as follows:

Title: [Recipe Name]
Cuisine: [Cuisine Type]
Prep Time: [Time]
Cook Time: [Time]
Servings: [Number]

Ingredients:
[List with precise measurements]

Instructions:
1. [Clear, numbered steps]
2. [Include temperatures and times]

Chef's Notes: [Include tips, substitutions, or serving suggestions]`;

    let userMessage = isEdit && previousRecipe 
      ? `Current recipe:\n\n${previousRecipe}\n\nModify according to: ${message}`
      : `Create a recipe for: ${message}${
          mealType ? `. This must be a ${mealType} recipe.` : ''
        }${
          cuisineType ? ` Use ${cuisineType} cuisine style.` : ''
        }${
          dietaryRestriction ? ` Must be ${dietaryRestriction}.` : ''
        }${
          servings ? ` Portion for exactly ${servings} ${servings === "1" ? "person" : "people"}.` : ''
        }`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to generate recipe');
    }

    const data = await response.json();
    console.log('Recipe generated successfully');

    return new Response(JSON.stringify({ recipe: data.choices[0].message.content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-recipe function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred while generating the recipe',
        details: error.toString()
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});