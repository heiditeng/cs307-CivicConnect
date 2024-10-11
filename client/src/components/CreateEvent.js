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
    const formData = new FormData();
    formData.append('eventName', this.state.eventName);
    formData.append('eventDate', this.state.eventDate);
    formData.append('eventStartTime', this.state.eventStartTime);
    formData.append('eventEndTime', this.state.eventEndTime);
    formData.append('eventLocation', this.state.eventLocation);
    if (this.state.eventImage) {
      formData.append('eventImage', this.state.eventImage);
    }
    if (this.state.eventVideo) {
      formData.append('eventVideo', this.state.eventVideo);
    }
    
    // Log or send formData to your backend here
    console.log("Event Details: ", formData);
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
