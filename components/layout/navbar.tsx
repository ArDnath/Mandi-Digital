"use client";

import { Button } from '../ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logout } from '../logout';
import { useSessionState } from '@/hooks/useSessionState';

function Navbar() {
  const router = useRouter();
  const { session, loading } = useSessionState();

  if (loading) {
    return (
      <div className="h-16 flex justify-between items-center px-8 border-b-2">
        <Link href='/'>
          Mandi-Digital
        </Link>
      </div>
    );
  }

  return (
    <div className="h-16 flex justify-between items-center px-8 border-b-2">
      <Link href='/'>
        Mandi-Digital
      </Link>
      {session ? (
        <Logout />
      ) : (
        <Button
          onClick={() => router.push('/sign-in')}
          className="shadow-[10px_6.5px_0px_0_rgba(0,0,0,0.3)] hover:shadow-[0_0_0_0_rgba(0,0,0,0)] transition-shadow"
          variant="outline"
          size="lg"
        >
          Login
        </Button>
      )}
    </div>
  )
}

export default Navbar