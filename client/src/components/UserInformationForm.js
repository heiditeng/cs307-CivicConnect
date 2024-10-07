import React, { useState, useEffect } from 'react';

const UserInformationForm = () => {

    // useState hooks to store form input and any feedback messages
    const [availability, setAvailability] = useState('');
    const [location, setLocation] = useState('');
    const [occupation, setOccupation] = useState('');
    const [interests, setInterests] = useState('');
    const [hobbies, setHobbies] = useState('')
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    // fetch profile data to pre-populate form
    useEffect(() => {
      const fetchProfileData = async () => {
        try {
          const res = await fetch('http://localhost:5010/api/profiles/profile/aysu'); // currently hardcoded to aysu will change

          // if response is valid/successful
          if (res.ok) {
            const data = await res.json();
            setAvailability(data.availability);
            setLocation(data.location);
            setOccupation(data.occupation);
            setInterests(data.interests);
            setHobbies(data.hobbies);
          } else {
            setErrorMessage('Error fetching profile data');
          } 
        } catch (error) {
          setErrorMessage('Error fetching profile data');
        }
      };

      fetchProfileData();
    }, []); // [] only will run once when component initialized
    
    
    // handling form submission
    const handleSubmit = async (e) => {
        // tells browser to stop the default action action associated w event
        // i.e prevents page reload
        e.preventDefault();

        // for error and non-error messages
        setSuccessMessage('');
        setErrorMessage('');

        // try to make an API call
        try {
            const response = await fetch('http://localhost:5010/api/profiles/update-profile', {
                method: 'POST', // POST request to send data to the server
                headers: {
                    'Content-Type': 'application/json', // Informing the server that we're sending JSON
                },
                // user name should be tracked when a user has logged in
                // for now, it will be hard-coded to aysu
                body: JSON.stringify({ username: "aysu", availability, location, occupation, interests, hobbies, location }), // The data being sent
            });

            // parse the JSON response from server
            const res = await response.json();

            if (response.ok) {
                setSuccessMessage('Profile updated successfully!');
            } else {
                setErrorMessage(res.error)
            }

        } catch (error) {
            setErrorMessage('An error occurred');
        }
    }


    return (
        <div className="flex justify-center items-center h-screen">
          <div className="w-full max-w-md p-6 bg-base-200 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-center">Update Your Information!</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Availability</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  type="text"
                  value={availability} // binding the input value to availability state
                  onChange={(e) => setAvailability(e.target.value)} // update
                  placeholder="e.g., Weekdays, 9 AM - 5 PM" // placeholder 
                />
              </div>
              
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Location</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  type="text"
                  value={location} // binding input w location state
                  onChange={(e) => setLocation(e.target.value)} // update
                  placeholder="City or neighborhood" 
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Occupation</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  type="text"
                  value={occupation} 
                  onChange={(e) => setOccupation(e.target.value)} // update
                  placeholder="e.g., Student, Teacher" 
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Interests</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  type="text"
                  value={interests} 
                  onChange={(e) => setInterests(e.target.value)} // update
                  placeholder="e.g., Art, Animals" 
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Hobbies</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  type="text"
                  value={hobbies} 
                  onChange={(e) => setHobbies(e.target.value)} // update
                  placeholder="e.g., Painting, Running" 
                />
              </div>
              
              
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary w-full">
                  Update Profile
                </button>
              </div>
    
              {successMessage && (
                <div className="mt-4">
                  <p className="text-center text-sm text-success">{successMessage}</p>
                </div>
              )}

              {errorMessage && (
                <div className="mt-4">
                  <p className="text-center text-sm text-error">{errorMessage}</p>
                </div>
              )}

            </form>
          </div>
        </div>
      );

};

export default UserInformationForm;