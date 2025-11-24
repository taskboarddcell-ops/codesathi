<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/temp/1

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in [.env.local](.env.local):
   
   **Required:**
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous/public API key
   - `VITE_OPENROUTER_API_KEY`: Your OpenRouter API key for AI features
   
   **Optional:**
   - `GEMINI_API_KEY`: Your Gemini API key (if using Gemini services)
   
   See [.env.example](.env.example) for the template.

3. Run the app:
   ```bash
   npm run dev
   ```

## Environment Variables

This application requires the following environment variables to be configured:

### Supabase Configuration
- **`VITE_SUPABASE_URL`**: The URL of your Supabase project (e.g., `https://your-project.supabase.co`)
- **`VITE_SUPABASE_ANON_KEY`**: The anonymous/public API key from your Supabase project settings

### OpenRouter Configuration
- **`VITE_OPENROUTER_API_KEY`**: API key for OpenRouter to enable AI tutoring features

### Optional Configuration
- **`GEMINI_API_KEY`**: Google Gemini API key for additional AI features

For deployment on platforms like Vercel or GitHub Actions, ensure these environment variables are configured in your deployment settings.
