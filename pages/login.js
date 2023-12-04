import { useState } from 'react';
import { useRouter } from 'next/router';
import { authenticateUser } from '../lib/authenticate'; // Import your authentication function
import { getFavourites, getHistory } from '../lib/userData'; // Import functions for user data
import { useAtom } from 'jotai'; // Import useAtom hook
import { favouritesAtom, searchHistoryAtom } from '../store'; // Import your atoms

export default function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  async function updateAtoms() {
    setFavouritesList(await getFavourites());
    setSearchHistory(await getHistory());
  }

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const isAuthenticated = await authenticateUser(userName, password);
      if (isAuthenticated) {
        const token = localStorage.getItem('access_token'); 
        console.log('Generated token:', token);
        console.log("logged in")
        await updateAtoms();
        router.push('/');
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
      {error && <div>{error}</div>}
    </div>
  );
}
