const mongoose = require('mongoose');

// Define the upload schema
const UploadSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }, //postid for reference
  data: { type: Buffer, required: true }, //store file data as a binary buffer
  contentType: { type: String, required: true },   
  filename: { type: String, required: true },      
  timestamp: { type: Date, default: Date.now },    
});

// Create and export the Upload model
const fileUpload = mongoose.model('fileUpload', UploadSchema);
module.exports = fileUpload;
