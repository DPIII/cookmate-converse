import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Check if OPENAI_API_KEY is set
    const apiKey = Deno.env.get('OPENAI_API_KEY')
    if (!apiKey) {
      console.error('OPENAI_API_KEY is not set')
      throw new Error('OpenAI API key is not configured')
    }

    const { title, prompt } = await req.json()

    if (!title || !prompt) {
      console.error('Missing required parameters:', { title, prompt })
      throw new Error('Missing required parameters: title and prompt are required')
    }

    console.log('Generating image for:', { title })
    console.log('Using prompt:', prompt)

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1024",
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('OpenAI API error:', error)
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Successfully generated image')
    
    return new Response(
      JSON.stringify({ imageUrl: data.data[0].url }), 
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error in generate-recipe-image:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred while generating the image',
        details: error.toString()
      }), 
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})