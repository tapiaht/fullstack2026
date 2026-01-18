import { auth } from '@/lib/auth';
import { handleAuth } from 'better-auth/nextjs';

export const GET = handleAuth(auth);
export const POST = handleAuth(auth);
