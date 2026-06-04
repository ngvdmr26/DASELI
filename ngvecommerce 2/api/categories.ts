import { getCategories } from './_lib/moysklad';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const data = await getCategories();
  return res.status(200).json({ data });
}