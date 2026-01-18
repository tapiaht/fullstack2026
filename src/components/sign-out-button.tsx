'use client';

import { signOutAction } from '@/actions/auth-actions';
import { Button } from './ui/button';

export function SignOutButton() {
  return (
    <Button onClick={() => signOutAction()} variant="destructive">
      Sign Out
    </Button>
  );
}
