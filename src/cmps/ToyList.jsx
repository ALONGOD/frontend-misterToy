import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ToyPreview } from './ToyPreview';
import { Button } from '@mui/material';
import { userService } from '../services/user.service.js'; // Adjust the path as necessary

export function ToyList({ toys, onRemoveToy }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const loggedInUser = await userService.getLoggedInUser();
      console.log('Logged in user:', loggedInUser);
      setUser(loggedInUser);
    }

    fetchUser();
  }, []);

  return (
    <section className="toy-list">
      <ul>
        {toys.map(toy => (
          <li key={toy._id}>
            <ToyPreview toy={toy} />
            {user && user.isAdmin && (
              <div>
                <Button variant="contained">
                  <Link to={`/toy/edit/${toy._id}`}>Edit</Link>
                </Button>
                <Button variant="contained" onClick={() => onRemoveToy(toy._id)}>Remove</Button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}