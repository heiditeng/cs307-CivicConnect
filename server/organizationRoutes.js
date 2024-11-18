const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const OrganizationProfile = require('./organizationProfile');

// // Email transport setup
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
async function sendWelcomeEmail(toEmail, name) {
  const mailOptions = {
    from: '"Community Helpers" <civicconnect075@gmail.com>', // Hardcoded for now but can be dynamic
    to: toEmail,
    subject: 'Welcome!',
    html: `<p>Hi ${name},</p><p>Thank you for signing up for our newsletter!</p>`,
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

  try {
    // Find the organization profile by userId
    const organization = await OrganizationProfile.findOne({ userId }).populate('subscribers', 'name email');
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    // Return the organization profile data with subscribers
    res.status(200).json(organization);
  } catch (error) {
    console.error('Error fetching organization:', error);
    res.status(500).json({ error: 'An error occurred while fetching the organization.' });
  }
});

// Route to update organization profile
router.post('/update-organization', async (req, res) => {
  const { userId, bio } = req.body; // The body must contain userId and bio

  // Validate request data
  if (!userId || !bio) {
    return res.status(400).json({ error: 'User ID and bio are required' });
  }

  try {
    // Find the organization profile by userId and update it
    const updatedOrganization = await OrganizationProfile.findOneAndUpdate(
      { userId }, // Find by userId
      { bio }, // Update bio
      { new: true, runValidators: true } // Return updated profile and validate the data
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
  const { userId, bio } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Create a new organization profile with the provided data
    const newOrganization = new OrganizationProfile({
      userId,
      bio: null
    });

    await newOrganization.save();

    return res.status(201).json({ message: 'Organization profile added successfully!', organization: newOrganization });
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
    const organization = await OrganizationProfile.findOne({ userId });  // Find organization by userId
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
    await sendWelcomeEmail(email, name);

    res.status(201).json({ message: 'Subscriber added successfully!', organization });
  } catch (error) {
    console.error('Error adding subscriber:', error);
    res.status(500).json({ error: 'An error occurred while adding the subscriber.' });
  }
});

// Route to get all subscribers of an organization
router.get('/subscribers/:organizationId', async (req, res) => {
  const { organizationId } = req.params;

  try {
    const organization = await OrganizationProfile.findById(organizationId).populate('subscribers', 'name email');
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    res.status(200).json({ subscribers: organization.subscribers });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ error: 'An error occurred while fetching subscribers.' });
  }
});

module.exports = router;
