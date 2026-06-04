import { checkMoySkladConnection } from './_lib/moysklad';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const data = await checkMoySkladConnection();
    return res.status(200).json({ data });
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'MoySklad check failed' });
  }
}