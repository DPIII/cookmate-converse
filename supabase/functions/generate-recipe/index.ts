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
    // Check if OpenAI API key is configured
    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      throw new Error('OpenAI API key not configured');
    }

    const { prompt, mealType, cuisineType, dietaryRestriction, isEdit, previousRecipe, servings } = await req.json();

    console.log('Generating recipe with:', { prompt, mealType, cuisineType, dietaryRestriction, isEdit, servings });

    let systemPrompt = `You are a professional chef and culinary expert. You are an expert in specific types of cuisine according to the type of meal and origin. You use their tactics such as marinades and sauces to enhance meals. Provide cooking tips in the recipe to make great tasting meals. Provide detailed, concise, structured recipes following this format:

Title: [Recipe Name]
Cuisine: [Type of Cuisine]
Prep Time: [Time]
Cook Time: [Time]
Servings: [Number]

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
      userMessage = `${
        mealType ? `I want a ${mealType.toLowerCase()} recipe` : "I want a recipe"
      }${cuisineType ? ` from ${cuisineType} cuisine` : ""}${
        dietaryRestriction && dietaryRestriction !== "None"
          ? ` that is ${dietaryRestriction.toLowerCase()}`
          : ""
      }${servings ? ` for ${servings} ${servings === "1" ? "person" : "people"}` : ""}. ${prompt}`;
    }

    console.log('Sending request to OpenAI with message:', userMessage);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
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