import { useState } from 'react';
import { useRouter } from 'next/router';
import { registerUser } from '../lib/authenticate'; // Import your registration function

export default function Register() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleRegister(e) {
    e.preventDefault();

    try {
      await registerUser(userName, password, password2);

      // Redirect to the login page after successful registration
      router.push('/login');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
      {error && <div>{error}</div>}
    </div>
  );
}
