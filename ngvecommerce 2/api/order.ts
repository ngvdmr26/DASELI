import { createCustomerOrder } from './_lib/moysklad';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const result = await createCustomerOrder(req.body);
  return res.status(result.success ? 200 : 400).json({ data: result, error: result.success ? undefined : result.error });
}