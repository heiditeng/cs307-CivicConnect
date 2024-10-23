import React, { useState, useRef, useCallback } from 'react';
import { useLoadScript, GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';
import './CreatePost.css';  

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 40.43057607697865,  // default location
  lng: -86.93598751743909,
};

const CreatePost = () => {  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyC23dj5ms0zwq9ImWCrrWGalNrgiGL1OvQ',
    libraries: ['places'], // Ensure 'places' library is loaded
  });

  const [postData, setPostData] = useState({
    files: [],
    caption: '',
    location: '',
    event: '',
  });

  const [error, setError] = useState('');
  const [locationError, setLocationError] = useState(''); // Location error state
  const [mapVisible, setMapVisible] = useState(false); // State to control map modal visibility
  const [selectedLocation, setSelectedLocation] = useState(null); // Selected location from the map
  const [showPreview, setShowPreview] = useState(false); // State to control post preview visibility
  const [currentSlide, setCurrentSlide] = useState(0); // Track the current image in the slideshow
  const autocompleteRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, files } = e.target;

    if (name === 'files') {
      const selectedFiles = Array.from(files);
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'video/mp4',
        'video/quicktime',
      ];

      const invalidFiles = selectedFiles.filter((file) => !allowedTypes.includes(file.type));

      if (invalidFiles.length > 0) {
        setError('Only image and video files are allowed.');
        return;
      }

      if (selectedFiles.length > 5) {
        setError('You can upload a maximum of 5 files.');
        return;
      }

      setError('');
      setPostData((prev) => ({ ...prev, [name]: selectedFiles }));
    }
  };

  //getting username from localStorage
  const username = localStorage.getItem('username'); 
  //logging for debugging
  console.log('Username from localStorage:', username);

  const handleLocationInputChange = (e) => {
    const { value } = e.target;
    setPostData((prev) => ({ ...prev, location: value }));
    setLocationError(''); // Clear any previous location error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

  /*if (postData.files.length === 0) {
    setError('Please upload at least one image or video.');
    return;
  }*/ //media not sent to backend for now

  const postId = Date.now().toString(); //unique id using timestamp
  const timestamp = new Date().toISOString(); //current time as timestamp

  const formData = new FormData();
  formData.append('postId', postId);
  formData.append('username', username);
  formData.append('caption', postData.caption);
  formData.append('location', postData.location);
  formData.append('event', postData.event);
  formData.append('timestamp', timestamp);

  /*postData.files.forEach((file, index) => {
    formData.append('files', file);  // Append each file to the FormData object
  });*/

  //logging for debugging
  console.log([...formData.entries()]);

  try {
    const response = await fetch('/api/PostRoutes/create', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const createdPost = await response.json();
    alert('Post created successfully!');

    //clear form after submission
    setPostData({
      files: [],
      caption: '',
      location: '',
      event: '',
    });
    setError('');
  } catch (error) {
    console.error('Error creating post:', error);
    setError('Error creating post');
  }    
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place && place.geometry) {
        setPostData((prev) => ({
          ...prev,
          location: place.formatted_address,
        }));
        setLocationError(''); //clear location error
      } else {
        setLocationError('Location not found. Please select a valid address.'); //set location error
      }
    }
  };

  const onMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setSelectedLocation({ lat, lng });
    reverseGeocodeLocation(lat, lng); //reverse geocoding
  }, []);

  const toggleMapVisibility = () => {
    setMapVisible((prevVisible) => !prevVisible);
  };

  const reverseGeocodeLocation = (lat, lng) => {
    const geocoder = new window.google.maps.Geocoder();
    const latLng = { lat, lng };

    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          const address = results[0].formatted_address;
          setPostData((prev) => ({
            ...prev,
            location: address, 
          }));
          setLocationError(''); //clear location error
        } else {
          setLocationError('Location not found. Please try again.'); 
        }
      } else {
        setLocationError('Geocoder failed. Please try again later.'); 
      }
    });
  };

  const togglePreview = () => {
    setShowPreview((prev) => !prev); //toggle preview
    setCurrentSlide(0); 
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % postData.files.length); 
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + postData.files.length) % postData.files.length); 
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div>
      <form className="create-post-form" onSubmit={handleSubmit}>
        {locationError && <p className="error-message">{locationError}</p>}
        {error && <p className="error-message">{error}</p>}

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
            onChange={(e) => setPostData({ ...postData, caption: e.target.value })}
            placeholder="Enter caption"
          />
        </div>

        <div>
          <label htmlFor="location">Location:</label>
          <Autocomplete
            onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
            onPlaceChanged={onPlaceChanged}
          >
            <input
              type="text"
              id="location"
              name="location"
              value={postData.location}
              onChange={handleLocationInputChange} 
              placeholder="Search for a location or type one"
            />
          </Autocomplete>
          <button type="button" onClick={toggleMapVisibility}>
            Select Location on Map
          </button>
        </div>

        {mapVisible && (
          <div className="map-container">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={10}
              center={selectedLocation || defaultCenter}
              onClick={onMapClick}
            >
              {selectedLocation && <Marker position={selectedLocation} />}
            </GoogleMap>
          </div>
        )}

        <div>
          <label htmlFor="event">Event:</label>
          <input
            type="text"
            id="event"
            name="event"
            value={postData.event}
            onChange={(e) => setPostData({ ...postData, event: e.target.value })}
            placeholder="Event name"
          />
        </div>

        <button type="submit">Post</button>
        <button
          type="button"
          onClick={() => setPostData({ files: [], caption: '', location: '', event: '' })}
          className="cancel-button"
        >
          Cancel
        </button>

        <button type="button" onClick={togglePreview}>
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </button>
      </form>

      {showPreview && (
        <div className="post-preview-modal">
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="slideshow-container">
              {postData.files.length > 0 ? (
                <div>
                  {postData.files[currentSlide].type.startsWith('image') && (
                    <img
                      src={URL.createObjectURL(postData.files[currentSlide])}
                      alt={`slide-${currentSlide}`}
                      className="thumbnail-image"
                    />
                  )}
                  {postData.files[currentSlide].type.startsWith('video') && (
                    <video
                      controls
                      src={URL.createObjectURL(postData.files[currentSlide])}
                      className="thumbnail-image"
                    />
                  )}
                  <button onClick={prevSlide} className="nav-button nav-button-left">◀</button>
                  <button onClick={nextSlide} className="nav-button nav-button-right">▶</button>
                </div>
              ) : (
                <p>No files uploaded</p>
              )}
            </div>
          </div>

          {/* Display the caption */}
          <div>
            <p>{postData.caption || 'No caption provided'}</p>
          </div>

          {/* Display location */}
          <div>
            <p><strong>Location:</strong> {postData.location || 'No location provided'}</p>
          </div>

          {/* Display event */}
          <div>
            <p><strong>Event:</strong> {postData.event || 'No event provided'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
