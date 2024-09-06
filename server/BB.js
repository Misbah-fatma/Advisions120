const BBB = require('bigbluebutton-js');

BBB_URL= 'https://server-1.edduus.stream/bigbluebutton/'
BBB_SECRET= 'X2K3nGPF7erts3cUZrXUcncCVSwwwCLQjkdGkDMps'

const api = BBB.api(BBB_URL, BBB_SECRET);

const createMeeting = async (meetingID, meetingName) => {
  try {
    const query = {
      meetingID: meetingID,
      name: meetingName,
    };

    const url = api.administration.create(query);
    const response = await fetch(url);
    const data = await response.text();

    console.log('Raw Response:', data); // Log the raw response

    if (data) {
      // Generate join URLs without passwords
      const joinAsModerator = api.administration.join({
        meetingID: meetingID,
        fullName: 'Moderator Name',
      });

      const joinAsAttendee = api.administration.join({
        meetingID: meetingID,
        fullName: 'Attendee Name',
      });

      return {
        success: true,
        message: 'Meeting created successfully',
        joinAsModerator,
        joinAsAttendee,
      };
    } else {
      console.error('Failed Response Data:', data); // Log if meeting creation failed
      throw new Error('Failed to create meeting');
    }
  } catch (error) {
    console.error('Error creating meeting:', error);
    return { success: false, message: error.message };
  }
};
module.exports = {
  createMeeting,
};