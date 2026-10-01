import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'import.meta.env.VITE_FIREBASE_API_KEY': JSON.stringify(
        process.env.VITE_FIREBASE_PROJECT_ID === 'matric-mastery-pk' && process.env.VITE_FIREBASE_API_KEY
          ? process.env.VITE_FIREBASE_API_KEY
          : 'AIzaSyC4lBI1F3OUS2c-O67hstiSs-6QAApayyc'
      ),
      'import.meta.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify(
        process.env.VITE_FIREBASE_PROJECT_ID === 'matric-mastery-pk' && process.env.VITE_FIREBASE_AUTH_DOMAIN
          ? process.env.VITE_FIREBASE_AUTH_DOMAIN
          : 'matric-mastery-pk.firebaseapp.com'
      ),
      'import.meta.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify('matric-mastery-pk'),
      'import.meta.env.VITE_FIREBASE_STORAGE_BUCKET': JSON.stringify(
        process.env.VITE_FIREBASE_PROJECT_ID === 'matric-mastery-pk' && process.env.VITE_FIREBASE_STORAGE_BUCKET
          ? process.env.VITE_FIREBASE_STORAGE_BUCKET
          : 'matric-mastery-pk.firebasestorage.app'
      ),
      'import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(
        process.env.VITE_FIREBASE_PROJECT_ID === 'matric-mastery-pk' && process.env.VITE_FIREBASE_MESSAGING_SENDER_ID
          ? process.env.VITE_FIREBASE_MESSAGING_SENDER_ID
          : '263336490573'
      ),
      'import.meta.env.VITE_FIREBASE_APP_ID': JSON.stringify(
        process.env.VITE_FIREBASE_PROJECT_ID === 'matric-mastery-pk' && process.env.VITE_FIREBASE_APP_ID
          ? process.env.VITE_FIREBASE_APP_ID
          : '1:263336490573:web:3450f62d62a7c01f168e04'
      ),
      'import.meta.env.VITE_FIREBASE_MEASUREMENT_ID': JSON.stringify(
        process.env.VITE_FIREBASE_PROJECT_ID === 'matric-mastery-pk' && process.env.VITE_FIREBASE_MEASUREMENT_ID
          ? process.env.VITE_FIREBASE_MEASUREMENT_ID
          : 'G-WFW2NN13E7'
      ),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        'next/link': path.resolve(__dirname, 'components/shims/Link.tsx'),
        'next/image': path.resolve(__dirname, 'components/shims/Image.tsx'),
        'next': path.resolve(__dirname, 'components/shims/next.ts'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
