import { useEffect, useState } from 'react';
import { reviewService } from '../services/review.service';
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service';
import { userService } from '../services/user.service.js';

export function ToyReview({ toy }) {
    const [reviews, setReviews] = useState([]);
    const [reviewText, setReviewText] = useState('');
    const [loading, setLoading] = useState(true);
    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
        loadReviews();
        loadLoggedInUser();
    }, [toy._id]);

    function loadReviews() {
        reviewService.query({ toy })
            .then(reviews => {
                setReviews(reviews);
                setLoading(false);
            })
            .catch(err => {
                console.log('Failed to load reviews', err);
                showErrorMsg('Cannot load reviews');
                setLoading(false);
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

    function handleReviewChange(event) {
        setReviewText(event.target.value);
    }

    function handleReviewSubmit(event) {
        event.preventDefault();
        if (!reviewText.trim()) {
            showErrorMsg('Review cannot be empty');
            return;
        }
        if (!loggedInUser) {
            showErrorMsg('You must be logged in to add a review');
            return;
        }

        const newReview = {
            txt: reviewText,
            aboutUserId: loggedInUser._id,
            toyId: toy._id
        };

        reviewService.add(newReview)
            .then(addedReview => {
                setReviews(prevReviews => [...prevReviews, addedReview]);
                setReviewText('');
                showSuccessMsg('Review added successfully');
            })
            .catch(err => {
                console.log('Failed to add review', err);
                showErrorMsg('Failed to add review');
            });
    }

    if (loading) return <div>Loading reviews...</div>;

    return (
        <section className="toy-reviews">
            <h2>Reviews for {toy.name}</h2>
            {reviews.length > 0 ? (
                <ul>
                    {reviews.map(review => (
                        <li key={review._id}>
                            <p><strong>Review:</strong> {review.txt}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No reviews yet</p>
            )}

            <form onSubmit={handleReviewSubmit} className="review-form">
                <textarea
                    name="review"
                    value={reviewText}
                    onChange={handleReviewChange}
                    placeholder="Add a review"
                    required
                />
                <button type="submit">Add Review</button>
            </form>
        </section>
    );
}
