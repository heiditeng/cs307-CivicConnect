import React, { useState, useEffect } from 'react';
import './MyProfileCM.css';
import { useNavigate } from 'react-router-dom';

// Setting username 
const username = localStorage.getItem('username');

const fetchPosts = async (user) => {
  const response = await fetch(`http://localhost:5010/api/PostRoutes/myposts?username=${user}`);
  const data = await response.json();
  return data;
};

const MyProfileCM = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  // Fetch posts 
  useEffect(() => {
    fetchPosts(username).then(data => setPosts(data));
  }, []);

  // Navigate to comments page for a specific post
  const openComments = (postId) => {
    navigate(`/comments/${postId}`);
  };

  return (
    <div className="myposts">
      {/* Profile Header */}
      <h1>My Posts</h1>

      {/* Bottom bar with the Create Post button */}
      <div className="bottom-bar">    
        <button 
          className="create-post-button" 
          onClick={() => navigate('/create-post')}
        >
          New Post
        </button>
      </div>

      {/* Display posts */}
      <div className="posts-section">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto max-h-[600px]">
            {posts.map((post) => (
              <div key={post._id} className="post-card card bg-base-100 aspect-square flex flex-col justify-between relative">
                {/* Post Media */}
                <div className="post-media">
                  {post.files && post.files.map((file, index) => (
                    <img key={index} src={`http://localhost:5010${file}`} alt="Post media" className="post-image object-cover w-full h-32 rounded-t-lg" />
                  ))}
                </div>

                {/* Post Details */}
                <div className="post-details card-body p-4">
                  <p className="post-caption text-lg font-semibold text-gray-800">{post.caption}</p>
                  <p className="text-sm text-gray-600"><strong>Location:</strong> {post.location}</p>
                  <p className="text-sm text-gray-600"><strong>Event:</strong> {post.event}</p>
                </div>

                {/* Like and Comment Actions */}
                <div className="card-actions justify-end p-4">
                  {/* Uncomment and implement handleLike if you want like functionality */}
                  {/* <button
                    className={`like-button btn btn-outline btn-sm ${post.likes && post.likes.includes(username) ? 'text-red-500' : 'text-gray-500'}`}
                    onClick={() => handleLike(post._id)}
                    aria-label="Like"
                  >
                    {post.likes && post.likes.includes(username) ? 'Unlike' : 'Like'} ({post.likes ? post.likes.length : 0})
                  </button> */}
                  <button
                    className="comments-button btn btn-outline btn-sm ml-2"
                    onClick={() => openComments(post._id)}
                    aria-label="Comments"
                  >
                    Comments
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No posts available</p>
        )}
      </div>
    </div>
  );
};

export default MyProfileCM;
