import { Link } from 'react-router-dom'
import { ToyPreview } from './ToyPreview'
import { Button } from '@mui/material';


export function ToyList({ toys, onRemoveToy }) {
  return (
    <section className="toy-list">
      <ul>
        {toys.map(toy => (
          <li key={toy._id}>
            <ToyPreview toy={toy} />
            <div>
              <Button variant="contained">
                <Link to={`/toy/edit/${toy._id}`}>Edit</Link>
              </Button>
              <Button variant="contained" onClick={() => onRemoveToy(toy._id)}>Remove</Button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
