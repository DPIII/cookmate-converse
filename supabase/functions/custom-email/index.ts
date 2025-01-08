import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

interface EmailRequest {
  user: {
    email: string;
    id: string;
  };
  template: {
    link: string;
    product_url: string;
    site_name: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user, template }: EmailRequest = await req.json();

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to AnyRecipe!</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #ffffff;
              border-radius: 8px;
              padding: 32px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .logo {
              text-align: center;
              margin-bottom: 24px;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #16a34a;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              margin: 16px 0;
            }
            .footer {
              margin-top: 32px;
              text-align: center;
              font-size: 14px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
              <h1 style="color: #16a34a;">AnyRecipe</h1>
            </div>
            <h2>Welcome to AnyRecipe! 👋</h2>
            <p>We're excited to have you join our community of food lovers and home chefs!</p>
            <p>Click the button below to verify your email address and start exploring delicious recipes:</p>
            <div style="text-align: center;">
              <a href="${template.link}" class="button">Verify Email Address</a>
            </div>
            <p>Or copy and paste this URL into your browser:</p>
            <p style="word-break: break-all; color: #666;">${template.link}</p>
            <div class="footer">
              <p>If you didn't create this account, you can safely ignore this email.</p>
              <p>© ${new Date().getFullYear()} AnyRecipe. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return new Response(JSON.stringify({ html }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      status: 400,
    });
  }
};

serve(handler);