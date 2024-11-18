import React, { useState } from 'react';
import { useParams } from 'react-router-dom'; // If organizationId is part of the URL

const NewsletterSignup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("userId"); // Get userId from localStorage

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
      <h2 className="text-2xl font-bold mb-4">Sign Up for Our Newsletter</h2>
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
