import { getStock } from './_lib/moysklad';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const productId = typeof req.query?.productId === 'string' ? req.query.productId : undefined;
  const data = await getStock(productId);
  return res.status(200).json({ data });
}