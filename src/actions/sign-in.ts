'use server';
import * as auth from '@/auth';

export async function signIn() {
	return auth.signIn('github')
}

export async function signInAuth0() {
	return auth.signIn('auth0')
}

