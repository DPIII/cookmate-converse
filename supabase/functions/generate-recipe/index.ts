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
      console.error('OpenAI API key not configured');
      throw new Error('OpenAI API key not configured');
    }

    const { prompt, mealType, cuisineType, dietaryRestriction, isEdit, previousRecipe, servings } = await req.json();

    console.log('Generating recipe with:', { prompt, mealType, cuisineType, dietaryRestriction, isEdit, servings });

    let systemPrompt = `You are a professional chef and culinary expert. 
When creating or modifying recipes, follow these guidelines:
1. If meal type is specified, the recipe MUST be for that type only
2. If dietary restrictions are specified, they MUST be strictly followed
3. The recipe should be portioned appropriately for the specified number of servings
4. Include precise measurements and clear instructions
5. When modifying an existing recipe, maintain its core characteristics
6. If working from an image analysis, use the identified ingredients and style as inspiration

Format your response as follows:

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

    let userMessage;
    if (isEdit && previousRecipe) {
      userMessage = `Current recipe:\n\n${previousRecipe}\n\nModify according to: ${prompt}`;
    } else {
      userMessage = `Create a recipe with these requirements: ${prompt}${
        mealType ? `. This should be a ${mealType} dish.` : ''
      }${
        cuisineType ? ` Use ${cuisineType} cuisine style.` : ''
      }${
        dietaryRestriction ? ` Must be ${dietaryRestriction}.` : ''
      }${
        servings ? ` Portion for ${servings} ${servings === "1" ? "person" : "people"}.` : ''
      }`;
    }

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