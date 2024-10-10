// src/components/CreateEvent.js
import React, { Component } from 'react';

class CreateEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventName: '',
      eventDate: '',
      eventStartTime: '',
      eventEndTime: '',
      eventLocation: '',
      eventDescription: '',
      eventImage: null,
      eventVideo: null,
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleImageChange = (e) => {
    this.setState({ eventImage: e.target.files[0] });
  };

  handleVideoChange = (e) => {
    this.setState({ eventVideo: e.target.files[0] });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      id: Date.now(), // or any unique ID generation logic
      name: this.state.eventName,
      date: this.state.eventDate,
      imageUrl: this.state.eventImage ? URL.createObjectURL(this.state.eventImage) : '',
      // Add more properties as needed
    };

    // Call the addEvent function passed from props
    this.props.addEvent(newEvent);

    // Reset the form
    this.setState({
      eventName: '',
      eventDate: '',
      eventStartTime: '',
      eventEndTime: '',
      eventLocation: '',
      eventDescription: '',
      eventImage: null,
      eventVideo: null,
    });
  };

  render() {
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
              required
            />
          </div>
          <div>
            <label>Event Date:</label>
            <input
              type="date"
              name="eventDate"
              value={this.state.eventDate}
              onChange={this.handleChange}
              required
            />
          </div>
          <div>
            <label>Start Time:</label>
            <input
              type="time"
              name="eventStartTime"
              value={this.state.eventStartTime}
              onChange={this.handleChange}
              required
            />
          </div>
          <div>
            <label>End Time:</label>
            <input
              type="time"
              name="eventEndTime"
              value={this.state.eventEndTime}
              onChange={this.handleChange}
              required
            />
          </div>
          <div>
            <label>Event Location:</label>
            <input
              type="text"
              name="eventLocation"
              value={this.state.eventLocation}
              onChange={this.handleChange}
              required
            />
          </div>
          <div>
            <label>Event Description:</label>
            <textarea
              name="eventDescription"
              value={this.state.eventDescription}
              onChange={this.handleChange}
              required
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
      </div>
    );
  }
}

export default CreateEvent;
