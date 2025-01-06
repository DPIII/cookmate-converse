import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
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

    let systemPrompt = `You are a professional chef and culinary expert specializing in ${cuisineType || 'various'} cuisine. 
You MUST strictly follow these requirements:
1. The recipe MUST be for a ${mealType || 'meal'} dish only
2. If dietary restrictions are specified (${dietaryRestriction || 'none'}), they MUST be strictly followed
3. The recipe MUST be portioned for ${servings || '2'} ${servings === '1' ? 'person' : 'people'}
4. The recipe title MUST match the meal type (${mealType})
5. DO NOT generate recipes that don't match these criteria

Provide detailed, structured recipes following this format:

Title: [Recipe Name - MUST be a ${mealType} dish]
Cuisine: [${cuisineType || 'Various'} cuisine]
Prep Time: [Time]
Cook Time: [Time]
Servings: [${servings || '2'}]

Ingredients:
- [List each ingredient with precise measurements]

Instructions:
1. [Clear, numbered steps]
2. [Include cooking temperatures and times]
3. [Add helpful tips where relevant]

Chef's Notes: [Include any special tips, substitutions, or serving suggestions]`;

    let userMessage;
    if (isEdit && previousRecipe) {
      userMessage = `Here is the current recipe:\n\n${previousRecipe}\n\nPlease adjust this recipe according to these modifications: ${prompt}\n\nProvide the complete updated recipe in the same format.`;
    } else {
      userMessage = `Create a ${mealType ? mealType.toLowerCase() : ''} recipe${
        cuisineType ? ` from ${cuisineType} cuisine` : ""
      }${
        dietaryRestriction && dietaryRestriction !== "None"
          ? ` that is ${dietaryRestriction.toLowerCase()}`
          : ""
      }${servings ? ` for ${servings} ${servings === "1" ? "person" : "people"}` : ""}. Additional requirements: ${prompt}${mealType ? `. IMPORTANT: The recipe MUST be a ${mealType} dish.` : ''}`;
    }

    console.log('Sending request to OpenAI with message:', userMessage);

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