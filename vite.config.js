import { defineConfig } from 'vite';
import compression from 'compression';
import { resolve } from 'path';
import { connect } from 'connect';
import serveStatic from 'serve-static';

export default defineConfig({
  // Other Vite configuration options...

  server: {
    middleware: [
      connect().use(compression()), // Enable compression
      connect().use(serveStatic(resolve(__dirname, 'public'), { maxAge: '1d' })) // Serve static files with caching headers
    ]
  }
});
