'use client';

import * as actions from '@/actions';
import { Spinner } from '@nextui-org/react';

export default async function Logout() {
  const logout = async () => {
    await actions.signOut();
  };
  logout();
  return (
    <div className='flex flex-col'>
      <h1>Logging out</h1>
      <Spinner />
    </div>
  );
}
