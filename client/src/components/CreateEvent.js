import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';

class CreateEvent extends Component {
    state = {
        eventName: '',
        eventDate: '',
        eventStartTime: '',
        eventEndTime: '',
        eventZipcode: '',
        eventDescription: '',
        eventImage: null,
        eventVideo: null,
        successMessage: '',
        errorMessage: '',
        zipCodeError: '',
        redirectToMyEvents: false, // Added state for redirection
    };

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, zipCodeError: '' }); // Reset zip code error on change
    };

    handleImageChange = (e) => {
        this.setState({ eventImage: e.target.files[0] });
    };

    handleVideoChange = (e) => {
        this.setState({ eventVideo: e.target.files[0] });
    };

    validateZipcode = (zipcode) => {
        const regex = /^[0-9]{5}(?:-[0-9]{4})?$/; // Basic US zip code validation
        return regex.test(zipcode);
    };

    handleSubmit = async (e) => {
        e.preventDefault();

        // Validate zip code
        if (!this.validateZipcode(this.state.eventZipcode)) {
            this.setState({ zipCodeError: 'Invalid Zip Code' });
            return;
        }

        const formData = new FormData();
        formData.append('name', this.state.eventName);
        formData.append('date', this.state.eventDate);
        formData.append('eventStartTime', this.state.eventStartTime);
        formData.append('eventEndTime', this.state.eventEndTime);
        formData.append('eventZipcode', this.state.eventZipcode);
        formData.append('description', this.state.eventDescription);

        // Only append files if they exist
        if (this.state.eventImage) {
            formData.append('eventImage', this.state.eventImage);
        }
        if (this.state.eventVideo) {
            formData.append('eventVideo', this.state.eventVideo);
        }

        try {
            const res = await fetch('http://localhost:5010/api/events/events', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                this.setState({ 
                    successMessage: 'Event created successfully!', 
                    errorMessage: '', 
                    zipCodeError: '', 
                });
            } else {
                const errorData = await res.json();
                this.setState({ errorMessage: errorData.error || 'Error creating event', successMessage: '' });
            }
        } catch (error) {
            this.setState({ errorMessage: 'Error creating event', successMessage: '' });
        }
    };

    handleBackToMyEvents = () => {
        this.setState({ redirectToMyEvents: true });
    };

    render() {
        // Check if redirect flag is true, then redirect to /my-events
        if (this.state.redirectToMyEvents) {
            return <Navigate to="/my-events" />;
        }

        return (
            <div>
                <h2>Create Event</h2>
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <label>Event Name:</label>
                        <input
                            type="text"
                            name="eventName"
                            value={this.state.eventName}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div>
                        <label>Event Date:</label>
                        <input
                            type="date"
                            name="eventDate"
                            value={this.state.eventDate}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div>
                        <label>Start Time:</label>
                        <input
                            type="time"
                            name="eventStartTime"
                            value={this.state.eventStartTime}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div>
                        <label>End Time:</label>
                        <input
                            type="time"
                            name="eventEndTime"
                            value={this.state.eventEndTime}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div>
                        <label>Event Zip Code:</label>
                        <input
                            type="text"
                            name="eventZipcode"
                            value={this.state.eventZipcode}
                            onChange={this.handleChange}
                        />
                        {this.state.zipCodeError && (
                            <div style={{ color: 'red' }}>{this.state.zipCodeError}</div>
                        )}
                    </div>
                    <div>
                        <label>Event Description:</label>
                        <textarea
                            name="eventDescription"
                            value={this.state.eventDescription}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div>
                        <label>Event Image:</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={this.handleImageChange}
                        />
                    </div>
                    <div>
                        <label>Event Video:</label>
                        <input
                            type="file"
                            accept="video/*"
                            onChange={this.handleVideoChange}
                        />
                    </div>
                    <button type="submit">Create Event</button>
                </form>

                {this.state.successMessage && (
                    <div style={{ marginTop: '20px', color: 'green' }}>
                        {this.state.successMessage}
                        <button onClick={this.handleBackToMyEvents} style={{ marginLeft: '10px' }}>
                            Back to My Events
                        </button>
                    </div>
                )}
                {this.state.errorMessage && (
                    <div style={{ marginTop: '20px', color: 'red' }}>
                        {this.state.errorMessage}
                    </div>
                )}
            </div>
        );
    }
}

export default CreateEvent;
