import { useEffect, useState } from 'react';
import { useRequest } from '../../hooks/useRequest';
import { useRouter } from 'next/router';

function signout() {
  const router = useRouter();
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => router.push('/'),
  });

  useEffect(function () {
    doRequest();
  }, []);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <div>Signing out...</div>
    </div>
  );
}

export default signout;
