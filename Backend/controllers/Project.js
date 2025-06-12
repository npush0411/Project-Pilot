const mongoose = require("mongoose");
const Project = require("../models/Project");
const User = require("../models/User");
const Component = require("../models/Component");
const Team = require("../models/Team");

exports.createProject = async (req, res) => {
  try {
    const { ID, type, title, description, components, teamID, guideID } = req.body;

    // Step 1: Validate required fields
    if (!title || !ID || !teamID || !components || !guideID) {
      return res.status(400).json({ message: "Some fields are missing!" });
    }

    // Step 2: Check if project already exists
    const existingProject = await Project.findOne({ ID });
    if (existingProject) {
      return res.status(409).json({ message: "Project ID already exists." });
    }

    // Step 3: Fetch Team document
    const teamDoc = await Team.findOne({ teamID: teamID });
    if (!teamDoc) {
      return res.status(400).json({ message: "Invalid team ID." });
    }

    const memberUserIDs = teamDoc.members.map(member => member.userID); // These are Numbers

    // Step 4: Fetch User documents for team members
    const teamUsers = await User.find({ userID: { $in: memberUserIDs } });
    if (teamUsers.length !== memberUserIDs.length) {
      return res.status(400).json({ message: "Some team members are invalid." });
    }

    // Step 5: Validate all team members are Students
    const nonStudent = teamUsers.find(user => user.accountType !== "Student");
    if (nonStudent) {
      return res.status(400).json({
        message: `User ${nonStudent.userID} is not a Student.`
      });
    }

    // Step 6: Ensure all team members have completed their existing projects
    for (const user of teamUsers) {
    const userProjects = await Project.find({
        _id: { $in: user.projects },
        isCompleted:false
    });

    if (userProjects.length > 0) {
            return res.status(400).json({
            message: `User ${user.userID} is already part of an ongoing project and must finish it before starting a new one.`
          });
        }
    }   

    const teamUserObjectIds = teamUsers.map(user => user._id); // Needed for Project.team field

    // Step 6: Validate project guide
    const guideDoc = await User.findOne({ userID: guideID });
    if (!guideDoc) {
      return res.status(400).json({ message: "Invalid guide ID." });
    }
    if (guideDoc.accountType !== "Instructor") {
      return res.status(400).json({ message: "Guide must be an Instructor." });
    }

    // Step 7: Validate Components availability
    // const componentDocs = await Component.find({
    //   cID: { $in: components },
    //   // available: true
    // });

    // if (componentDocs.length !== components.length) {
    //   return res.status(400).json({
    //     message: "Some components are invalid or unavailable. Please review and try again."
    //   });
    // }

    // const componentObjectIds = componentDocs.map(comp => comp._id);

    // Step 8: Create Project
    const newProject = new Project({
      title,
      ID,
      type,
      description,
      components,
      teamID:teamDoc._id, 
      guideID:guideDoc._id
    });

    const savedProject = await newProject.save();

   
    return res.status(201).json({
      message: "Project created successfully.",
      project: savedProject
    });

  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({ message: "Server error while creating project.", error});
  }
};


// Controller to Fetch All Projects
exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find({});
        if (!projects || projects.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No projects found!"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Fetched all projects successfully!",
            data: projects
        });
    } catch (error) {
        console.error("Error fetching projects:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// Controller to Fetch All Users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve users"
        });
    }
};

// const User = require('../models/User');
// const Project = require('../models/Project');

exports.getUserProjects = async (req, res) => {
  try {
    const userId = req.user.userId; // Extracted from JWT
    console.log('User ID:', userId);

    // Fetch user with projects
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch only the projects listed in user's "projects" array
   const projects = await Project.find({ _id: { $in: user.projects } })
  .populate('guideID', 'firstName lastName userID')
  .lean(); // ✅ This is the KEY fix!

    console.log(projects);
    console.log("--------------------------------------------");
    // Format the project data
    const formattedProjects = projects.map(p => ({
      title: p.title,
      ID: p.ID,
      description: p.description,
      components: p.components,
      team: p.team,
      projectGuide: {
        guideID: p.projectGuide?.userID?.toString() || 'N/A',
        name: p.projectGuide ? `${p.projectGuide.firstName} ${p.projectGuide.lastName}` : 'Unknown'
      },
      createdAt: p.createdAt
    }));
    console.log(formattedProjects);
    res.status(200).json(formattedProjects);
  } catch (error) {
    console.error('Error fetching user projects:', error);
    res.status(500).json({ message: 'Server error fetching user projects' });
  }
};
