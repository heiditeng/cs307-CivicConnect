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
            userId: null,
        };
    }

    async componentDidMount() {
        const { id } = this.props;

        // Retrieve userId from local storage
        const userId = localStorage.getItem('username');
        if (userId) {
            this.setState({ userId });
        } else {
            this.setState({ errorMessage: 'User not logged in.' });
            return;
        }

        const res = await fetch(`http://localhost:5010/api/events/events/${id}`);
        if (res.ok) {
            const event = await res.json();
            this.setState({
                eventName: event.name,
                eventDate: event.date,
                eventStartTime: event.startTime,
                eventEndTime: event.endTime,
                address: event.address,
                zipcode: event.zipcode,
                eventDescription: event.description,
                maxCapacity: event.maxCapacity,
                eventType: event.type,
                eventImages: event.image || [],
                thumbnailImage: event.thumbnailImage || null,
                eventVideo: event.video || null,
            });
        } else {
            this.setState({ errorMessage: 'Error fetching event data' });
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, addressError: '', zipcodeError: '' });
    };

    handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        this.setState((prevState) => {
            const updatedImages = [...prevState.eventImages, ...files];
            const newThumbnail = prevState.thumbnailImage || (files.length > 0 ? files[0] : null);
            return {
                eventImages: updatedImages,
                thumbnailImage: newThumbnail,
            };
        });
    };
    
    handleThumbnailChange = (e) => {
        const thumbnail = e.target.files[0];
        if (thumbnail) {
            this.setState((prevState) => {
                const updatedImages = prevState.eventImages.filter(image => image !== prevState.thumbnailImage);
                updatedImages.unshift(thumbnail);
                return {
                    thumbnailImage: thumbnail,
                    eventImages: updatedImages,
                };
            });
        }
    };
    
    handleVideoChange = (e) => {
        this.setState({ eventVideo: e.target.files[0] });
    };

    handleDeleteImage = (index) => {
        const updatedImages = this.state.eventImages.filter((_, i) => i !== index);
        this.setState({ eventImages: updatedImages });
    };

    handleDeleteThumbnail = () => {
        this.setState({ thumbnailImage: null });
    };
    
    handleDeleteVideo = () => {
        this.setState({ eventVideo: null });
    };

    validateAddress = (address) => {
        return address.trim() !== '';
    };

    validateZipcode = (zipcode) => {
        const regex = /^(?:\d{5}|\d{5}-\d{4})$/;
        return regex.test(zipcode);
    };

    handleSubmit = async (e) => {
        e.preventDefault();

        if (!this.validateAddress(this.state.address)) {
            this.setState({ addressError: 'Invalid Address' });
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
        formData.append('description', this.state.eventDescription);
        formData.append('maxCapacity', this.state.maxCapacity);
        formData.append('type', this.state.eventType);
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
            const res = await fetch(`http://localhost:5010/api/events/events/${this.props.id}`, {
                method: 'PUT',
                body: formData,
            });

            if (res.ok) {
                this.setState({
                    successMessage: 'Event modified successfully!',
                    errorMessage: '',
                    addressError: '',
                    zipcodeError: '',
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

    formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
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
                        <p>Current Date: {this.formatDate(this.state.eventDate)}</p>
                        <label>New Event Date:</label>
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

                    {/* Displaying Images and Videos */}
                    <div>
                        <h3 className="text-lg font-semibold">Current Images:</h3>
                        {this.state.eventImages.length > 0 ? (
                            <ul className="mb-4">
                                {this.state.eventImages.map((image, index) => (
                                    <li key={index} className="flex items-center justify-between mb-2">
                                        <span>{image.name || image}</span>
                                        <button type="button" onClick={() => this.handleDeleteImage(index)} className="text-red-600 ml-2">Delete</button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No images uploaded.</p>
                        )}
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold">Current Thumbnail Image:</h3>
                        {this.state.thumbnailImage ? (
                            <div className="flex items-center justify-between mb-4">
                                <span>{this.state.thumbnailImage.name || this.state.thumbnailImage}</span>
                                <button type="button" onClick={this.handleDeleteThumbnail} className="text-red-600 ml-2">Delete</button>
                            </div>
                        ) : (
                            <p>No thumbnail image uploaded.</p>
                        )}
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold">Current Event Video:</h3>
                        {this.state.eventVideo ? (
                            <div className="flex items-center justify-between mb-4">
                                <span>{this.state.eventVideo}</span>
                                <button type="button" onClick={this.handleDeleteVideo} className="text-red-600 ml-2">Delete</button>
                            </div>
                        ) : (
                            <p>No video uploaded.</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-2">Upload Images:</label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={this.handleImageChange}
                            className="border rounded p-2"
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Upload Thumbnail Image:</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={this.handleThumbnailChange}
                            className="border rounded p-2"
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Upload Video:</label>
                        <input
                            type="file"
                            accept="video/*"
                            onChange={this.handleVideoChange}
                            className="border rounded p-2"
                        />
                    </div>
                    <button type="submit">Submit</button>
                    <button type="button" onClick={this.handleBackToMyEvents} style={{ marginLeft: '10px' }}>
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

const ModifyEventWrapper = () => {
    const { id } = useParams();
    return <ModifyEvent id={id} />;
};

export default ModifyEventWrapper;
