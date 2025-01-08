import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      throw new Error('Image URL is required');
    }

    const openAiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAiKey) {
      throw new Error('OpenAI API key not found');
    }

    console.log('Analyzing wine list from image:', imageUrl);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a wine expert. Analyze the wine list in the image and provide detailed descriptions. 
            For each wine, include:
            - Name and producer
            - Region and country of origin
            - Type of wine (red, white, rosé, sparkling)
            - Grape varieties
            - Taste profile (dry, sweet, etc.)
            - Suggested food pairings
            Format the response in a clear, bulleted list.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please analyze this wine list and provide detailed information about each wine.'
              },
              {
                type: 'image_url',
                image_url: imageUrl
              }
            ]
          }
        ],
        max_tokens: 1500,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error('Failed to analyze wine list');
    }

    const data = await response.json();
    console.log('Successfully analyzed wine list');

    return new Response(
      JSON.stringify({ analysis: data.choices[0].message.content }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in analyze-wine-list function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to analyze wine list',
        details: error.toString()
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});