import { useState } from 'react';
import { useRequest } from '../../hooks/useRequest';
import { useRouter } from 'next/router';

function signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { doRequest, isLoading, errors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: {
      email,
      password,
    },
    onSuccess: () => router.push('/'),
  });

  async function handleSubmit(e) {
    e.preventDefault();

    doRequest();

    setEmail('');
    setPassword('');
  }

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <h1 className="text-light mb-5">Start Exploring</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-info bg-opacity-25 py-4 px-5 w-25 rounded-2"
      >
        <h2 className="text-info text-center mb-3">Sign In</h2>
        <div className="form-group mb-3">
          <label htmlFor="user-email" className="text-light">
            Email Address
          </label>
          <input
            className="form-control"
            disabled={isLoading}
            type="email"
            id="user-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="user-password" className="text-light">
            Password
          </label>
          <input
            className="form-control"
            disabled={isLoading}
            type="password"
            id="user-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {errors}
        <button className="btn btn-info text-light fw-semibold">Sign In</button>
      </form>
    </div>
  );
}

export default signin;
