import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { checkMoySkladConnection, createCustomerOrder, getCategories, getProducts, getStock, runSetup } from './api/_lib/moysklad';

dotenv.config({ path: '.env.local' });
dotenv.config();

const port = Number(process.env.PORT ?? 3000);

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '1mb' }));

  app.get('/api/products', async (req, res) => {
    res.json({ data: await getProducts(typeof req.query.category === 'string' ? req.query.category : undefined) });
  });

  app.get('/api/categories', async (_req, res) => {
    res.json({ data: await getCategories() });
  });

  app.get('/api/stock', async (req, res) => {
    res.json({ data: await getStock(typeof req.query.productId === 'string' ? req.query.productId : undefined) });
  });

  app.post('/api/order', async (req, res) => {
    const result = await createCustomerOrder(req.body);
    res.status(result.success ? 200 : 400).json({ data: result, error: result.success ? undefined : result.error });
  });

  app.post('/api/setup', async (_req, res) => {
    try {
      res.json({ data: await runSetup() });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Setup failed' });
    }
  });

  app.get('/api/health', async (_req, res) => {
    try {
      res.json({ data: await checkMoySkladConnection() });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'MoySklad check failed' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
      root: __dirname,
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`DESELI server running at http://localhost:${port} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer().catch((err) => {
  console.error('Server failed to start:', err);
});
