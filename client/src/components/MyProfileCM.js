import React, { useState } from 'react';
import './MyProfileCM.css';

const MyProfileCM = () => {
  const [showForm, setShowForm] = useState(false);
  const [postData, setPostData] = useState({
    files: [],
    caption: '',
    location: '',
    event: '',
  });

  //form
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'files') {
      const selectedFiles = Array.from(files); 
      //max media is 5
      if (selectedFiles.length > 5) {
        alert('You can upload a maximum of 5 files.');
        return;
      }
      setPostData((prev) => ({ ...prev, [name]: selectedFiles }));
    } else {
      setPostData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    /* TODO: send to backend */
    
    //reset fields
    setPostData({
      files: [],
      caption: '',
      location: '',
      event: '',
    });

    // close form
    setShowForm(false);
  };

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <h1>My Profile</h1>

      {/* Bottom bar with the Create Post button */}
      <div className="bottom-bar">
        <button className="create-post-button">Create Post</button>
        <button className="edit-profile-button">Edit Profile</button>
      </div>

      {showForm && (
        <form className="create-post-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="files">Upload up to 5 Images or Videos:</label>
            <input
              type="file"
              id="files"
              name="files"
              accept="image/*,video/*"
              multiple
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="caption">Caption:</label>
            <input
              type="text"
              id="caption"
              name="caption"
              value={postData.caption}
              onChange={handleInputChange}
              placeholder="Enter caption"
            />
          </div>

          <div>
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              name="location"
              value={postData.location}
              onChange={handleInputChange}
              placeholder="Add location"
            />
          </div>

          <div>
            <label htmlFor="event">Event:</label>
            <input
              type="text"
              id="event"
              name="event"
              value={postData.event}
              onChange={handleInputChange}
              placeholder="Event name"
            />
          </div>
          
          <button type="submit"> Post</button>
          <button type="button" onClick={() => setShowForm(false)}>
            Cancel
          </button>
        </form>
      )}

    </div>
  );
};

export default MyProfileCM;
