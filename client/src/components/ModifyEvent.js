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
                console.log("Event modification successful, email trigger should be sent.");
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
            <div className="flex justify-center items-center min-h-screen p-4 bg-gray-100">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
                    <h2 className="text-2xl font-bold mb-4">Modify Event</h2>
                    <form onSubmit={this.handleSubmit}>
                        <div className="mb-4">
                            <label className="block font-semibold">Event Name:</label>
                            <input
                                type="text"
                                name="eventName"
                                value={this.state.eventName}
                                onChange={this.handleChange}
                                className="border rounded w-full p-2"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <p>Current Date: {this.formatDate(this.state.eventDate)}</p>
                            <label className="block font-semibold">New Event Date:</label>
                            <input
                                type="date"
                                name="eventDate"
                                value={this.state.eventDate}
                                onChange={this.handleChange}
                                className="border rounded w-full p-2"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block font-semibold">Start Time:</label>
                            <input
                                type="time"
                                name="eventStartTime"
                                value={this.state.eventStartTime}
                                onChange={this.handleChange}
                                className="border rounded w-full p-2"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block font-semibold">End Time:</label>
                            <input
                                type="time"
                                name="eventEndTime"
                                value={this.state.eventEndTime}
                                onChange={this.handleChange}
                                className="border rounded w-full p-2"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block font-semibold">Address:</label>
                            <input
                                type="text"
                                name="address"
                                value={this.state.address}
                                onChange={this.handleChange}
                                className="border rounded w-full p-2"
                                required
                            />
                            {this.state.addressError && (
                                <div className="text-red-600">{this.state.addressError}</div>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="block font-semibold">Zip Code:</label>
                            <input
                                type="text"
                                name="zipcode"
                                value={this.state.zipcode}
                                onChange={this.handleChange}
                                className="border rounded w-full p-2"
                                required
                            />
                            {this.state.zipcodeError && (
                                <div className="text-red-600">{this.state.zipcodeError}</div>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="block font-semibold">Max Capacity:</label>
                            <input
                                type="number"
                                name="maxCapacity"
                                value={this.state.maxCapacity}
                                onChange={this.handleChange}
                                min="1"
                                className="border rounded w-full p-2"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block font-semibold">Event Type:</label>
                            <select
                                name="eventType"
                                value={this.state.eventType}
                                onChange={this.handleChange}
                                className="border rounded w-full p-2"
                                required
                            >
                                <option value="">Select an event type</option>
                                <option value="environmental">Environmental</option>
                                <option value="education">Education</option>
                                <option value="health">Health</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block font-semibold">Event Description:</label>
                            <textarea
                                name="eventDescription"
                                value={this.state.eventDescription}
                                onChange={this.handleChange}
                                className="border rounded w-full p-2"
                                rows="4"
                                required
                            />
                        </div>

                        {/* Displaying Images and Videos */}
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold">Current Images:</h3>
                            {this.state.eventImages.length > 0 ? (
                                <ul className="mb-2">
                                    {this.state.eventImages.map((image, index) => (
                                        <li key={index} className="flex items-center justify-between mb-2">
                                            <span>{image.name || image}</span>
                                            <button type="button" onClick={() => this.handleDeleteImage(index)} className="text-red-600">Delete</button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No images uploaded.</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <h3 className="text-lg font-semibold">Current Thumbnail Image:</h3>
                            {this.state.thumbnailImage ? (
                                <div className="flex items-center justify-between mb-2">
                                    <span>{this.state.thumbnailImage.name || this.state.thumbnailImage}</span>
                                    <button type="button" onClick={this.handleDeleteThumbnail} className="text-red-600">Delete</button>
                                </div>
                            ) : (
                                <p>No thumbnail image uploaded.</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <h3 className="text-lg font-semibold">Current Event Video:</h3>
                            {this.state.eventVideo ? (
                                <div className="flex items-center justify-between mb-2">
                                    <span>{this.state.eventVideo.name || this.state.eventVideo}</span>
                                    <button type="button" onClick={this.handleDeleteVideo} className="text-red-600">Delete</button>
                                </div>
                            ) : (
                                <p>No video uploaded.</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block font-semibold">Upload Images:</label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={this.handleImageChange}
                                className="border rounded w-full p-2"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block font-semibold">Upload Thumbnail Image:</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={this.handleThumbnailChange}
                                className="border rounded w-full p-2"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block font-semibold">Upload Video:</label>
                            <input
                                type="file"
                                accept="video/*"
                                onChange={this.handleVideoChange}
                                className="border rounded w-full p-2"
                            />
                        </div>
                        <div className="flex justify-between mt-6">
                            <button type="submit" className="btn btn-primary">Submit</button>
                            <button type="button" onClick={this.handleBackToMyEvents} className="btn btn-secondary">Cancel</button>
                        </div>
                    </form>

                    {this.state.successMessage && (
                        <div className="mt-6 text-green-600">
                            {this.state.successMessage}
                            <button onClick={this.handleBackToMyEvents} className="ml-2 underline">Back to My Events</button>
                        </div>
                    )}
                    {this.state.errorMessage && (
                        <div className="mt-6 text-red-600">
                            {this.state.errorMessage}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

const ModifyEventWrapper = () => {
    const { id } = useParams();
    return <ModifyEvent id={id} />;
};

export default ModifyEventWrapper;
