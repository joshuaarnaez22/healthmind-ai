import Millis from '@millisai/web-sdk';
export const msClient = Millis.createClient({
  publicKey: process.env.NEXT_PUBLIC_MILLIS_KEY!,
});
