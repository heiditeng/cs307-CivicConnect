import React, { useState, useEffect } from 'react';
import './MyProfileCM.css';
import { useNavigate } from 'react-router-dom';

// Fetch mock posts from the server
const fetchPosts = async () => {
  const response = await fetch('/posts/myposts');  // Fetch from `/posts/myposts` route
  const data = await response.json();
  return data;
};

const MyProfileCM = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({}); // Track which posts are liked

  // Fetch posts when the component mounts
  useEffect(() => {
    fetchPosts().then(data => setPosts(data));
  }, []);

  // Handle the like button toggle
  const toggleLike = (postId) => {
    setLikedPosts((prevLikedPosts) => ({
      ...prevLikedPosts,
      [postId]: !prevLikedPosts[postId]  // Toggle the liked state for this post
    }));
  };

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <h1>My Profile</h1>

      {/* Bottom bar with the Create Post button */}
      <div className="bottom-bar">
        <button 
          className="create-post-button" 
          onClick={() => navigate('/create-post')}
        >
          Create Post
        </button>
        <button className="edit-profile-button">Edit Profile</button>
      </div>

      {/* Display posts */}
      <div className="posts-section">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-media">
                {post.files.map((file, index) => (
                  <img key={index} src={file} alt="Post media" className="post-image" />
                ))}
              </div>
              <div className="post-details">
                <p>{post.caption}</p>
                <p><strong>Location:</strong> {post.location}</p>
                <p><strong>Event:</strong> {post.event}</p>
                <p><strong>Reactions:</strong> {post.reactions}</p>
              </div>
              
              {/* Like button */}
              <button
                className={`like-button ${likedPosts[post.id] ? 'liked' : ''}`}
                onClick={() => toggleLike(post.id)}
              >
                {likedPosts[post.id] ? 'Unlike' : 'Like'}
              </button>
            </div>
          ))
        ) : (
          <p>No posts available</p>
        )}
      </div>
    </div>
  );
};

export default MyProfileCM;
