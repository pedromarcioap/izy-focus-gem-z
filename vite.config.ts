import path from 'path';
import { defineConfig, loadEnv } from 'vite';
// Removed tailwindcss and autoprefixer imports

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      // Removed define for GEMINI_API_KEY
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          input: {
            popup: path.resolve(__dirname, 'index.html'),
            background: path.resolve(__dirname, 'background.ts'),
            blocked: path.resolve(__dirname, 'blocked.html'),
          },
          output: {
            entryFileNames: `[name].js`,
            chunkFileNames: `[name].js`,
            assetFileNames: `[name].[ext]`
          }
        }
      }
    };
});
