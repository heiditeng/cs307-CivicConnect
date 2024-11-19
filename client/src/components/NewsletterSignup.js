import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const NewsletterSignup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orgUsername, setOrgUsername] = useState(''); // State to store organization username

  const { userId } = useParams(); // Get userId from URL
  const userUserId = localStorage.getItem("userId"); // Get userId for user signing up from localStorage

  // Fetch organization details on component mount
  useEffect(() => {
    const fetchOrganizationDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5010/api/organizations/organization/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch organization data');
        }

        console.log("userid for org: ", userId);
        console.log("userUserId from localStorage:", userUserId);

        const data = await response.json();
        setOrgUsername(data.username);
      } catch (error) {
        setMessage('Error fetching organization details');
        console.error('Error fetching organization data:', error);
      }
    };

    fetchOrganizationDetails();
  }, [userId]); // Re-run if userId changes

  const handleSignup = async (e) => {
    e.preventDefault();

    // Ensure the user confirmed the checkbox
    if (!isConfirmed) {
      setMessage("You must agree to share your details with the organization.");
      return;
    }

    // Prepare the data to be sent to the server
    const subscriberData = { name, email };

    // Start loading state
    setLoading(true);

    try {
      // Send the subscription data to the backend
      const response = await fetch(`http://localhost:5010/api/organizations/add-subscriber/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscriberData),
      });

      if (!response.ok) {
        throw new Error('Failed to sign up');
      }

      const data = await response.json();
      console.log('Subscriber added:', data);

      // Once the subscriber is added, update their profile with the organization subscription
      const subscriptionData = {
        subscription: orgUsername,
      };
      
      console.log('sub:', subscriptionData);

      const subscriptionResponse = await fetch(`http://localhost:5010/api/profiles/add-subscription/${userUserId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscriptionData),
      });

      if (!subscriptionResponse.ok) {
        throw new Error('Failed to add subscription to user profile');
      }

      const subscriptionDataResponse = await subscriptionResponse.json();
      console.log('Subscription added to user profile:', subscriptionDataResponse);

      setMessage("Thank you for signing up for our newsletter!");
      setIsSubmitted(true);
      setName('');
      setEmail('');
      setIsConfirmed(false);
    } catch (error) {
      setMessage("There was an error signing up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-base-200 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Sign Up for {orgUsername}'s Newsletter</h2>
      {isSubmitted ? (
        <p className="text-center text-green-600">{message}</p>
      ) : (
        <form onSubmit={handleSignup} className="flex flex-col">
          <label className="mb-1">
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              className="p-2 mb-4 border rounded"
            />
          </label>
          <label className="mb-1">
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="p-2 mb-4 border rounded"
            />
          </label>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              required
              className="mr-2"
            />
            <label>
              I agree to share my account details (name and email) with the organization.
            </label>
          </div>
          <button
            type="submit"
            className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
      )}
      {message && !isSubmitted && <p className="mt-4 text-center text-red-600">{message}</p>}
    </div>
  );
};

export default NewsletterSignup;
