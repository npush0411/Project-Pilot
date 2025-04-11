const Project =require('../models/Project');
const otpGenerator = require('otp-generator');

//Create Project
exports.createProject = async (req, res) => {

    try{
        const {title, description, components, team, projectGuide} = req.body;
        const id = otpGenerator.generate(6, {
            upperCaseAlphabets: true,
            lowerCaseAlphabets: false,
            specialChars: false
        });

        //check uniquie ID 
        const result = await Project.findOne({ID:id});
        
        while(result)
        {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: true,
                lowerCaseAlphabets: false,
                specialChars: false
            });
            result = await Project.findOne({ID:id});
        }
        const prj = await Project.create({title, description, components, id,Date.now(),team, projectGuide});

    }catch(error){

    }
}
//finish project
//modify project details
//add components
//modify components 
