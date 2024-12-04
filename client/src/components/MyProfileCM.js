import React, { useState, useEffect } from 'react';
import './MyProfileCM.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const userId = localStorage.getItem('userId');

const fetchPosts = async (userId) => {
  const response = await fetch(`http://localhost:5010/api/posts/myposts?userId=${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  const data = await response.json();
  return data;
};

const toggleLike = async (postId) => {
  const response = await fetch(`http://localhost:5010/api/posts/like/${postId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    throw new Error('Failed to like/unlike post');
  }

  return response.json();
};

const MyProfileCM = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts(userId)
      .then((data) => setPosts(data))
      .catch((err) => setError('Failed to fetch posts. Please try again later.'));
  }, []);

  const handleLike = (postId) => {
    toggleLike(postId)
      .then((updatedPost) => {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === updatedPost.postId
              ? { ...post, likeCount: updatedPost.likeCount, likedByCurrentUser: updatedPost.likedByCurrentUser }
              : post
          )
        );
      })
      .catch((err) => setError('Failed to like/unlike post.'));
  };

  // Navigate to the comments page for a specific post
  const openComments = (postId) => {
    navigate(`/comments/${postId}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-8 bg-gray-50">
      <div className="flex flex-col w-full max-w-5xl gap-6">
        <h2 className="text-3xl font-bold text-center mb-6 text-primary">
          My Posts
        </h2> 

        {/* Bottom bar with the Create Post button */}
      <div className="bottom-bar center">    
        <button 
          className="create-post-button" 
          onClick={() => navigate('/create-post')}
        >
          New Post
        </button>
      </div>

        {error && (
          <p className="text-red-500 text-center font-semibold">{error}</p>
        )}

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto max-h-[600px]">
            {posts.map((post) => (
              <div
                key={post._id}
                className="card bg-base-100 aspect-square flex flex-col justify-between relative"
              >
                {/* Like Button */}
                <button
                  className={`absolute bottom-2 left-2 ${
                    //likedPosts.includes(post._id)
                      //? "text-red-500"
                      /*:*/ "text-gray-500"
                  } hover:text-primary focus:outline-none`}
                  onClick={() => handleLike(post._id)}
                  aria-label="Like"
                >
                  <FontAwesomeIcon icon={faHeart} size="lg" />
                </button>

                {/* Post Details */}
                <div className="card-body p-4">
                  <h3 className="card-title text-lg font-semibold text-gray-800">
                    {post.caption}
                  </h3>
                  <p className="text-sm text-gray-600">
                    <strong>Location:</strong> {post.location || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Event:</strong> {post.event || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Likes:</strong> {post.likeCount || 0}
                  </p>
                </div>

                {/* Post Image */}
                {post.files && post.files.map((file, index) => {
                  console.log(file);
                  return (
                  <figure className="h-32 w-full overflow-hidden rounded-t-lg">
                    <img
                      key={index}
                      src={file.data}
                      //src={`data:${post.files[0].contentType};base64,${post.files[0].data}`}
                      alt="Post media"
                      className="object-cover w-full h-full"
                    />
                  </figure>
                  );
                })}

                {/* Actions */}
                <div className="card-actions justify-end p-4">
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => navigate(`/comments/${post._id}`)}
                  >
                    Comments
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No posts available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfileCM;
