import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import { Autocomplete } from '@react-google-maps/api';

class CreateEvent extends Component {
    state = {
        eventName: '',
        eventDate: '',
        eventStartTime: '',
        eventEndTime: '',
        location: '',
        eventDescription: '',
        eventImage: null,
        eventVideo: null,
        maxCapacity: '',
        eventType: '',
        successMessage: '',
        errorMessage: '',
        locationError: '',
        redirectToMyEvents: false,
        userId: '',
    };

    componentDidMount() {
        const userId = localStorage.getItem("username");
        this.setState({ userId });
        // this.loadGooglePlacesScript();
    }

    // loadGooglePlacesScript = () => {
    //     const script = document.createElement('script');
    //     script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBi4Q1s_l02slRnhUigHLzKff5UKpYAtHM&libraries=places`;
    //     script.async = true;
    //     script.onload = () => {
    //         // Initialize Google Places API if needed
    //     };
    //     document.body.appendChild(script);
    // };

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, locationError: '' });
    };

    handleImageChange = (e) => {
        this.setState({ eventImage: e.target.files[0] });
    };

    handleVideoChange = (e) => {
        this.setState({ eventVideo: e.target.files[0] });
    };

    handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!this.state.location) {
            this.setState({ locationError: 'Location is required' });
            return;
        }

        const formData = new FormData();
        formData.append('name', this.state.eventName);
        formData.append('date', this.state.eventDate);
        formData.append('startTime', this.state.eventStartTime);
        formData.append('endTime', this.state.eventEndTime);
        formData.append('location', this.state.location);
        formData.append('maxCapacity', Number(this.state.maxCapacity));
        formData.append('type', this.state.eventType);
        formData.append('description', this.state.eventDescription);
        formData.append('userId', this.state.userId);

        // Append files only if they exist
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
                    locationError: '', 
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
                        <label>Location:</label>
                        {/* <Autocomplete
                            onPlaceChanged={() => {
                                const place = this.autocomplete.getPlace();
                                this.setState({ location: place.formatted_address });
                            }}
                        >
                            <input
                                type="text"
                                name="location"
                                value={this.state.location}
                                onChange={this.handleChange}
                                ref={el => this.autocomplete = el}
                            />
                        </Autocomplete> */}
                        <input
                            type="text"
                            name="location"
                            value={this.state.location}
                            onChange={this.handleChange}
                        />
                        {this.state.locationError && (
                            <div style={{ color: 'red' }}>{this.state.locationError}</div>
                        )}
                    </div>
                    <div>
                        <label>Max Capacity:</label>
                        <input
                            type="number"
                            name="maxCapacity"
                            value={this.state.maxCapacity}
                            onChange={this.handleChange}
                            min="1"
                        />
                    </div>
                    <div>
                        <label>Event Type:</label>
                        <select
                            name="eventType"
                            value={this.state.eventType}
                            onChange={this.handleChange}
                        >
                            <option value="">Select an event type</option>
                            <option value="environmental">Environmental</option>
                            <option value="education">Education</option>
                            <option value="health">Health</option>
                        </select>
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
