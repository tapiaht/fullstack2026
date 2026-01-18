'use server';

import { signUp, signOut, signIn } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export async function signOutAction() {
    await signOut({
        headers: await headers()
    });
    redirect('/');
}

export async function registerUser(prevState: any, formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const result = await signUp({ body: { name, email, password } });

    if (result.token) {
        redirect('/login?registered=true');
    } else {
        return { error: result.error?.message || 'An unknown error occurred.' };
    }
}

export async function signInUser(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const result = await signIn({
        body: { email, password },
    });

    if (result.token) {
        redirect('/');
    } else {
        return { error: result.error?.message || 'An unknown error occurred.' };
    }
}
