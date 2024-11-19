const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const OrganizationProfile = require('./organizationProfile');

// Email transport setup
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'civicconnect075@gmail.com',
    pass: 'qsdg tgcs azwy duqa', // Make sure to use secure handling for credentials
  },
});

// Send welcome email to new subscriber
async function sendWelcomeEmail(toEmail, name, orgName) {
  const mailOptions = {
    from: `${orgName} <civicconnect075@gmail.com>`,
    to: toEmail,
    subject: 'Welcome!',
    html: `<p>Hi ${name},</p>
           <p>Thank you for signing up for our newsletter!</p>
           <p>We're happy to have you on board with <strong>${orgName}</strong>!</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${toEmail}`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw new Error('Failed to send welcome email.');
  }
}

// Route to fetch organization profile by userId
router.get('/organization/:userId', async (req, res) => {
  const { userId } = req.params;

  // Check if userId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid userId format' });
  }

  try {
    // Convert userId to ObjectId
    const objectId = new mongoose.Types.ObjectId(userId);

    // Find the organization profile by userId
    const organization = await OrganizationProfile.findOne({ userId: objectId }).populate('subscribers', 'name email');
    
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    // Return the organization profile data with subscribers
    res.status(200).json({
      userId: organization.userId,
      username: organization.username,
      bio: organization.bio,
      subscribers: organization.subscribers
    });
  } catch (error) {
    console.error('Error fetching organization:', error);
    res.status(500).json({ error: 'An error occurred while fetching the organization.' });
  }
});

// Route to update organization profile
router.post('/update-organization', async (req, res) => {
  const { userId, bio, username } = req.body;

  if (!userId || !bio || !username) {
    return res.status(400).json({ error: 'User ID, bio, and username are required' });
  }

  try {
    const updatedOrganization = await OrganizationProfile.findOneAndUpdate(
      { userId }, 
      { bio },
      { new: true, runValidators: true } 
    );

    if (!updatedOrganization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    res.status(200).json({ message: 'Organization profile updated successfully!', organization: updatedOrganization });
  } catch (error) {
    console.error('Error updating organization:', error);
    res.status(500).json({ error: 'An error occurred while updating the organization profile.' });
  }
});

// Route to add a new organization profile (on signup or creation)
router.post('/add-organization', async (req, res) => {
  const { userId, bio, username } = req.body;

  if (!userId || !username) {
    return res.status(400).json({ error: 'User ID and username are required' });
  }

  // Check if userId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid userId format' });
  }

  try {
    // Convert userId to ObjectId
    const objectId = new mongoose.Types.ObjectId(userId);

    const newOrganization = new OrganizationProfile({
      userId: objectId,
      bio: bio || null, 
      username 
    });

    await newOrganization.save();

    res.status(201).json({ message: 'Organization profile added successfully!', organization: newOrganization });
  } catch (error) {
    console.error('Error adding new organization:', error);
    res.status(500).json({ error: 'An error occurred while adding the organization.' });
  }
});

// Route to add a subscriber to an organization
router.post('/add-subscriber/:userId', async (req, res) => {
  const { userId } = req.params;
  const { name, email } = req.body;

  try {
    const organization = await OrganizationProfile.findOne({ userId });
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    // Check if the email already exists in the subscribers list
    const isAlreadySubscribed = organization.subscribers.some(subscriber => subscriber.email === email);
    if (isAlreadySubscribed) {
      return res.status(400).json({ message: 'User already subscribed to this organization.' });
    }

    // Add the new subscriber's details to the subscribers list
    organization.subscribers.push({ name, email });

    await organization.save();  // Save the updated organization

    // Send the welcome email to the new subscriber
    await sendWelcomeEmail(email, name, organization.username);

    res.status(201).json({
      message: 'Subscriber added successfully!',
      organization: {
        username: organization.username, 
        subscribers: organization.subscribers
      }
    });
  } catch (error) {
    console.error('Error adding subscriber:', error);
    res.status(500).json({ error: 'An error occurred while adding the subscriber.' });
  }
});

// Route to get all subscribers of an organization
router.get('/subscribers/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const organization = await OrganizationProfile.findOne({ userId }).populate('subscribers', 'name email');
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    res.status(200).json({
      username: organization.username,
      subscribers: organization.subscribers
    });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ error: 'An error occurred while fetching subscribers.' });
  }
});

module.exports = router;
