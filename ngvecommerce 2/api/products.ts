import { getProducts } from './_lib/moysklad';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const category = typeof req.query?.category === 'string' ? req.query.category : undefined;
  const data = await getProducts(category);
  return res.status(200).json({ data });
}