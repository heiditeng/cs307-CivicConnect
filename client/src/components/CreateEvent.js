import React, { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';
import './CreateEvent.css';

const CreateEvent = () => {
    const [eventData, setEventData] = useState({
        eventName: '',
        eventDate: '',
        eventStartTime: '',
        eventEndTime: '',
        address: '',
        zipcode: '',
        eventDescription: '',
        eventImages: [],
        thumbnailImage: null,
        eventVideo: null,
        maxCapacity: '',
        eventType: '',
        successMessage: '',
        errorMessage: '',
        addressError: '',
        zipcodeError: '',
        redirectToMyEvents: false,
        userId: '',
    });

    const autocompleteRef = useRef(null);
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: 'AIzaSyBi4Q1s_l02slRnhUigHLzKff5UKpYAtHM',
        libraries: ['places'],
    });

    useEffect(() => {
        const userId = localStorage.getItem("username");
        setEventData((prev) => ({ ...prev, userId }));
    }, []);

    const handlePlaceSelect = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place && place.address_components) {
                const address = place.formatted_address;
                const zipcode = place.address_components.find(component =>
                    component.types.includes("postal_code")
                )?.long_name || '';
                setEventData((prev) => ({ ...prev, address, zipcode, addressError: '' }));
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData((prev) => ({ ...prev, [name]: value, addressError: '', zipcodeError: '' }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setEventData((prev) => ({
            ...prev,
            eventImages: files,
            thumbnailImage: files[0] || null,
        }));
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        setEventData((prev) => ({
            ...prev,
            thumbnailImage: file,
            eventImages: [file, ...prev.eventImages.filter(img => img !== file)],
        }));
    };

    const handleVideoChange = (e) => {
        setEventData((prev) => ({ ...prev, eventVideo: e.target.files[0] }));
    };

    const validateZipcode = (zipcode) => {
        const regex = /^(?:\d{5}|\d{5}-\d{4})$/;
        return regex.test(zipcode);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!eventData.address) {
            setEventData((prev) => ({ ...prev, addressError: 'Address is required' }));
            return;
        }

        if (!validateZipcode(eventData.zipcode)) {
            setEventData((prev) => ({ ...prev, zipcodeError: 'Invalid Zip Code format (must be 5 or 9 digits)' }));
            return;
        }

        const formData = new FormData();
        formData.append('name', eventData.eventName);
        formData.append('date', eventData.eventDate);
        formData.append('startTime', eventData.eventStartTime);
        formData.append('endTime', eventData.eventEndTime);
        formData.append('address', eventData.address);
        formData.append('zipcode', eventData.zipcode);
        formData.append('maxCapacity', Number(eventData.maxCapacity));
        formData.append('type', eventData.eventType);
        formData.append('description', eventData.eventDescription);
        formData.append('userId', eventData.userId);

        eventData.eventImages.forEach((image) => {
            formData.append('eventImages', image);
        });

        if (eventData.thumbnailImage) {
            formData.append('thumbnailImage', eventData.thumbnailImage);
        }

        if (eventData.eventVideo) {
            formData.append('eventVideo', eventData.eventVideo);
        }

        try {
            const res = await fetch('http://localhost:5010/api/events/events', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                setEventData((prev) => ({
                    ...prev,
                    successMessage: 'Event created successfully!',
                    errorMessage: '',
                    addressError: '',
                    zipcodeError: '',
                }));
            } else {
                const errorData = await res.json();
                setEventData((prev) => ({
                    ...prev,
                    errorMessage: errorData.error || 'Error creating event',
                    successMessage: '',
                }));
            }
        } catch (error) {
            setEventData((prev) => ({
                ...prev,
                errorMessage: 'Error creating event',
                successMessage: '',
            }));
        }
    };

    const handleBackToMyEvents = () => {
        setEventData((prev) => ({ ...prev, redirectToMyEvents: true }));
    };

    if (eventData.redirectToMyEvents) {
        return <Navigate to="/my-events" />;
    }

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading Maps...</div>;

    return (
        <div className="create-event-container">
            <h2>Create Event</h2>
            <form onSubmit={handleSubmit} className="event-form">
                <div className="form-group">
                    <label>Event Name:</label>
                    <input
                        type="text"
                        name="eventName"
                        value={eventData.eventName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Event Date:</label>
                    <input
                        type="date"
                        name="eventDate"
                        value={eventData.eventDate}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Start Time:</label>
                    <input
                        type="time"
                        name="eventStartTime"
                        value={eventData.eventStartTime}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>End Time:</label>
                    <input
                        type="time"
                        name="eventEndTime"
                        value={eventData.eventEndTime}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Address:</label>
                    <Autocomplete
                        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                        onPlaceChanged={handlePlaceSelect}
                    >
                        <input
                            type="text"
                            name="address"
                            value={eventData.address}
                            onChange={handleChange}
                            required
                        />
                    </Autocomplete>
                    {eventData.addressError && (
                        <div className="error-message">{eventData.addressError}</div>
                    )}
                </div>
                <div className="form-group">
                    <label>Zip Code:</label>
                    <input
                        type="text"
                        name="zipcode"
                        value={eventData.zipcode}
                        onChange={handleChange}
                        required
                    />
                    {eventData.zipcodeError && (
                        <div className="error-message">{eventData.zipcodeError}</div>
                    )}
                </div>
                <div className="form-group">
                    <label>Max Capacity:</label>
                    <input
                        type="number"
                        name="maxCapacity"
                        value={eventData.maxCapacity}
                        onChange={handleChange}
                        min="1"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Event Type:</label>
                    <select
                        name="eventType"
                        value={eventData.eventType}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select an event type</option>
                        <option value="environmental">Environmental</option>
                        <option value="education">Education</option>
                        <option value="health">Health</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Event Description:</label>
                    <textarea
                        name="eventDescription"
                        value={eventData.eventDescription}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Event Images:</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                    />
                    {eventData.eventImages.length > 0 && (
                        <div>
                            <h4>Selected Images:</h4>
                            <ul>
                                {eventData.eventImages.map((image, index) => (
                                    <li key={index}>{image.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <div className="form-group">
                    <label>Select Thumbnail Image:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                    />
                    {eventData.thumbnailImage && (
                        <div>Thumbnail Selected: {eventData.thumbnailImage.name}</div>
                    )}
                </div>
                <div className="form-group">
                    <label>Event Video:</label>
                    <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                    />
                </div>
                <button type="submit" className="submit-button">Create Event</button>
            </form>

            {eventData.successMessage && <div className="success-message">{eventData.successMessage}</div>}
            {eventData.errorMessage && <div className="error-message">{eventData.errorMessage}</div>}
            <button onClick={handleBackToMyEvents} className="back-button">Back to My Events</button>
        </div>
    );
};

export default CreateEvent;
