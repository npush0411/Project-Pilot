const Team = require('../models/Team');
const User = require('../models/User'); // Optional: For checking user existence

exports.createTeam = async (req, res) => {
  try {
    const { teamName, teamID, members } = req.body;

    if (!teamName || !teamID || !Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ success: false, message: 'Incomplete team data.' });
    }

    // Optionally: check if teamID already exists
    const existingTeam = await Team.findOne({ teamID });
    if (existingTeam) {
      return res.status(409).json({ success: false, message: 'Team ID already exists.' });
    }

    // Optionally validate userIDs
    const validMembers = await Promise.all(members.map(async (member) => {
      const id = member.userID;
        const userExists = await User.findOne({userID: id});
        console.log(userExists);
      if (!userExists) throw new Error(`User ID ${member.userID} not found`);
      return {
        userID: userExists.userID,
        role: member.role === 'Lead' ? 'Lead' : 'Member'
      };
    }));

    const newTeam = await Team.create({
      teamName,
      teamID,
      members: validMembers
    });

    res.status(201).json({
      success: true,
      message: 'Team created successfully!',
      data: newTeam
    });

  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
  }
};
