import React, { Component } from 'react';
import { Navigate, useParams } from 'react-router-dom';

class ModifyEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eventName: '',
            eventDate: '',
            eventStartTime: '',
            eventEndTime: '',
            eventZipcode: '',
            eventDescription: '',
            eventImage: null,
            eventVideo: null,
            maxCapacity: '',
            eventType: '',
            successMessage: '',
            errorMessage: '',
            zipCodeError: '',
            redirectToMyEvents: false,
        };
    }

    async componentDidMount() {
        const { id } = this.props; // Get ID from props
        const res = await fetch(`http://localhost:5010/api/events/events/${id}`);
        if (res.ok) {
            const event = await res.json();
            this.setState({
                eventName: event.name,
                eventDate: event.date,
                eventStartTime: event.eventStartTime,
                eventEndTime: event.eventEndTime,
                eventZipcode: event.eventZipcode,
                eventDescription: event.description,
                maxCapacity: event.maxCapacity,
                eventType: event.eventType,
            });
        } else {
            this.setState({ errorMessage: 'Error fetching event data' });
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, zipCodeError: '' });
    };

    handleImageChange = (e) => {
        this.setState({ eventImage: e.target.files[0] });
    };

    handleVideoChange = (e) => {
        this.setState({ eventVideo: e.target.files[0] });
    };

    validateZipcode = (zipcode) => {
        const regex = /^[0-9]{5}(?:-[0-9]{4})?$/;
        return regex.test(zipcode);
    };

    handleSubmit = async (e) => {
        e.preventDefault();

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
        formData.append('maxCapacity', this.state.maxCapacity);
        formData.append('eventType', this.state.eventType);

        if (this.state.eventImage) {
            formData.append('eventImage', this.state.eventImage);
        }
        if (this.state.eventVideo) {
            formData.append('eventVideo', this.state.eventVideo);
        }

        try {
            const res = await fetch(`http://localhost:5010/api/events/events/${this.props.id}`, {
                method: 'PUT',
                body: formData,
            });

            if (res.ok) {
                this.setState({ 
                    successMessage: 'Event modified successfully!', 
                    errorMessage: '', 
                    zipCodeError: '', 
                });
            } else {
                const errorData = await res.json();
                this.setState({ errorMessage: errorData.error || 'Error modifying event', successMessage: '' });
            }
        } catch (error) {
            this.setState({ errorMessage: 'Error modifying event', successMessage: '' });
        }
    };

    handleBackToMyEvents = () => {
        this.setState({ redirectToMyEvents: true });
    };

    render() {
        if (this.state.redirectToMyEvents) {
            return <Navigate to="/my-events" />;
        }

        return (
            <div>
                <h2>Modify Event</h2>
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
                            {/* Add more options as needed */}
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
                    <button type="submit">Submit</button>
                    <button type="button" onClick={this.handleCancel} style={{ marginLeft: '10px' }}>
                        Cancel
                    </button>
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

// Create a wrapper to provide the ID from the URL
const ModifyEventWrapper = () => {
    const { id } = useParams();
    return <ModifyEvent id={id} />;
};

export default ModifyEventWrapper;
