const mongoose = require("mongoose");
const Project = require("../models/Project");
const User = require("../models/User");
const Component = require("../models/Component");

// Controller to Create a New Project
exports.createProject = async (req, res) => {
    try {
        const { title, ID, description, components, team, projectGuide } = req.body;

        // Validate required fields
        if (!title || !ID || !projectGuide) {
            return res.status(400).json({ message: "Title, ID, and project guide are required." });
        }

        // Get all team members from the database
        const teamDocs = await User.find({ userID: { $in: team } });

        // Validate all team members exist
        if (teamDocs.length !== team.length) {
            return res.status(400).json({ message: "Some team member IDs are invalid." });
        }

        // Validate all team members are students
        const nonStudent = teamDocs.find(user => user.accountType !== "Student");
        if (nonStudent) {
            return res.status(400).json({ message: `User ${nonStudent.userID} is not a Student.` });
        }

        const teamIds = teamDocs.map(user => user._id);

        // Find and validate the project guide
        const guideDoc = await User.findOne({ userID: projectGuide });
        if (!guideDoc) {
            return res.status(400).json({ message: "Invalid project guide ID." });
        }
        if (guideDoc.accountType !== "Instructor") {
            return res.status(400).json({ message: "Project guide must be an Instructor." });
        }

        // Convert component IDs to ObjectIds only if available in stock
        const componentDocs = await Component.find({
            cID: { $in: components },
            available: true
        });

        if (componentDocs.length !== components.length) {
            return res.status(400).json({
                message: "Some component IDs are invalid or out of stock. Please request them in the Component Request section."
            });
        }

        const componentIds = componentDocs.map(comp => comp._id);

        // Create and save the new project
        const newProject = new Project({
            title,
            ID,
            description,
            components: componentIds,
            team: teamIds,
            projectGuide: guideDoc._id
        });

        const savedProject = await newProject.save();

        // Add project to all student users
        await User.updateMany(
            { _id: { $in: teamIds } },
            { $addToSet: { projects: savedProject._id } }
        );

        // Add project to guide
        await User.findByIdAndUpdate(
            guideDoc._id,
            { $addToSet: { projects: savedProject._id } }
        );

        return res.status(201).json({
            message: "Project created successfully",
            project: savedProject
        });

    } catch (error) {
        console.error("Error creating project:", error);

        if (error.code === 11000) {
            return res.status(409).json({ message: "Project ID already exists." });
        }

        return res.status(500).json({ message: "Server error while creating project." });
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
