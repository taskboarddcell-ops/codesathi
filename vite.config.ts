import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      // Make Gemini API key available in the app
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    build: {
      // Production optimizations
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production', // Remove console.logs in production
          drop_debugger: true,
        },
      },
      // Code splitting for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'supabase': ['@supabase/supabase-js'],
            'ui-icons': ['lucide-react'],
          },
        },
      },
      // Increase chunk size warning limit (default is 500kb)
      chunkSizeWarningLimit: 600,
      // Enable source maps for debugging production issues
      sourcemap: mode !== 'production',
      // Target modern browsers for smaller bundle
      target: 'es2020',
    },
    // Performance optimization
    optimizeDeps: {
      include: ['react', 'react-dom', '@supabase/supabase-js', 'lucide-react'],
    },
  };
});
