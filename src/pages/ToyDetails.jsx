import { useEffect, useState } from 'react';
import { Loader } from '../cmps/Loader';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service';
import { toyService } from '../services/toy.service';
import { userService } from '../services/user.service';

export function ToyDetails() {
  const [toy, setToy] = useState(null);
  const [message, setMessage] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const { toyId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadToy();
    loadLoggedInUser();
  }, [toyId]);

  function loadToy() {
    toyService.getById(toyId)
      .then(toy => setToy(toy))
      .catch(err => {
        console.log('Had issues in toy details', err);
        showErrorMsg('Cannot load toy');
        navigate('/toy');
      });
  }

  function loadLoggedInUser() {
    userService.getLoggedInUser()
      .then(user => setLoggedInUser(user))
      .catch(err => {
        console.log('Failed to fetch logged-in user', err);
        showErrorMsg('Cannot fetch user');
      });
  }

  function handleChange(event) {
    setMessage(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!message.trim()) {
      showErrorMsg('Message cannot be empty');
      return;
    }
    if (!loggedInUser) {
      showErrorMsg('You must be logged in to add a message');
      return;
    }

    const newMessage = {
      txt: message
    };

    toyService.addMessage(toyId, newMessage)
      .then(updatedToy => {
        const lastMessage = updatedToy.msgs && updatedToy.msgs.length ? updatedToy.msgs[updatedToy.msgs.length - 1] : null;
        const updatedMessage = {
          ...newMessage,
          by: {
            _id: loggedInUser._id,
            fullname: loggedInUser.fullname
          },
          createdAt: Date.now(),
          id: lastMessage ? lastMessage.id : Date.now() // Use Date.now() as a fallback if lastMessage is not available
        };
        setToy(prevToy => ({
          ...prevToy,
          msgs: [...(prevToy.msgs || []), updatedMessage]
        }));
        setMessage('');
        showSuccessMsg('Message added successfully');
      })
      .catch(err => {
        console.log('Failed to add message', err);
        showErrorMsg('Failed to add message');
      });
  }

  if (!toy) return <Loader />;

  return (
    <section className="toy-details" style={{ textAlign: 'center' }}>
      <h1>
        Toy name: <span>{toy.name}</span>
      </h1>
      <h1>
        Toy price: <span>${toy.price}</span>
      </h1>
      <h1>
        Labels: <span>{(toy.labels || []).join(', ')}</span>
      </h1>
      <h1 className={toy.inStock ? 'green' : 'red'}>
        {toy.inStock ? 'In stock' : 'Not in stock'}
      </h1>

      <section className="toy-messages">
        <h2>Messages:</h2>
        {toy.msgs && toy.msgs.length > 0 ? (
          <ul>
            {toy.msgs.map(msg => (
              <li key={msg.id}>
                <p><strong>Message:</strong> {msg.txt}</p>
                <p><strong>Sent by:</strong> {msg.by.fullname}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No messages</p>
        )}
      </section>

      <form onSubmit={handleSubmit} className="message-form">
        <textarea
          name="message"
          value={message}
          onChange={handleChange}
          placeholder="Add a message"
          required
        />
        <button type="submit">Add Message</button>
      </form>

      <button>
        <Link to="/toy">Back</Link>
      </button>
    </section>
  );
}
