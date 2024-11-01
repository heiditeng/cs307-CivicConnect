import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';

class CreateEvent extends Component {
    state = {
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
    };

    componentDidMount() {
        const userId = localStorage.getItem("username");
        this.setState({ userId });
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, addressError: '', zipcodeError: '' });
    };

    handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        this.setState({ 
            eventImages: files,
            thumbnailImage: files[0] || null,
        });
    };

    handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        this.setState((prevState) => ({
            thumbnailImage: file,
            eventImages: [file, ...prevState.eventImages.filter(img => img !== file)],
        }));
    };

    handleVideoChange = (e) => {
        this.setState({ eventVideo: e.target.files[0] });
    };

    validateZipcode = (zipcode) => {
        const regex = /^(?:\d{5}|\d{5}-\d{4})$/;
        return regex.test(zipcode);
    };

    handleSubmit = async (e) => {
        e.preventDefault();

        if (!this.state.address) {
            this.setState({ addressError: 'Address is required' });
            return;
        }

        if (!this.validateZipcode(this.state.zipcode)) {
            this.setState({ zipcodeError: 'Invalid Zip Code format (must be 5 or 9 digits)' });
            return;
        }

        const formData = new FormData();
        formData.append('name', this.state.eventName);
        formData.append('date', this.state.eventDate);
        formData.append('startTime', this.state.eventStartTime);
        formData.append('endTime', this.state.eventEndTime);
        formData.append('address', this.state.address);
        formData.append('zipcode', this.state.zipcode);
        formData.append('maxCapacity', Number(this.state.maxCapacity));
        formData.append('type', this.state.eventType);
        formData.append('description', this.state.eventDescription);
        formData.append('userId', this.state.userId);

        this.state.eventImages.forEach((image) => {
            formData.append('eventImages', image);
        });

        if (this.state.thumbnailImage) {
            formData.append('thumbnailImage', this.state.thumbnailImage);
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
                    addressError: '', 
                    zipcodeError: '',
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
                        <label>Address:</label>
                        <input
                            type="text"
                            name="address"
                            value={this.state.address}
                            onChange={this.handleChange}
                        />
                        {this.state.addressError && (
                            <div style={{ color: 'red' }}>{this.state.addressError}</div>
                        )}
                    </div>
                    <div>
                        <label>Zip Code:</label>
                        <input
                            type="text"
                            name="zipcode"
                            value={this.state.zipcode}
                            onChange={this.handleChange}
                        />
                        {this.state.zipcodeError && (
                            <div style={{ color: 'red' }}>{this.state.zipcodeError}</div>
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
                        <label>Event Images:</label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={this.handleImageChange}
                        />
                        {this.state.eventImages.length > 0 && (
                            <div>
                                <h4>Selected Images:</h4>
                                <ul>
                                    {this.state.eventImages.map((image, index) => (
                                        <li key={index}>{image.name}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div>
                        <label>Select Thumbnail Image:</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={this.handleThumbnailChange}
                        />
                        {this.state.thumbnailImage && (
                            <div>Thumbnail Selected: {this.state.thumbnailImage.name}</div>
                        )}
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
