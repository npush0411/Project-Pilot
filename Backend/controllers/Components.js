const Component = require('../models/Component');

// GET: Retrieve all components
exports.getAllComponents = async (req, res) => {
    try {
        const data = await Component.find();
        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch components',
            error: error.message
        });
    }
};

// POST: Create a new component
exports.createComponent = async (req, res) => {
  try {
    console.log("Inside Create Component !");
    const { name, cID, description, price, quantity } = req.body;

    // Check if a component with the same ID already exists
    const existingComponent = await Component.findOne({ cID });

    if (existingComponent) {
      return res.status(400).json({
        success: false,
        message: "Component ID isn't available! Please try again."
      });
    }

    // Create and save new component
    const newComponent = new Component({
      title:name,
      cID,
      description,
      qnty:quantity,
      price
    });
    console.log(newComponent);
    const savedComponent = await newComponent.save();

    res.status(201).json({
      success: true,
      data: savedComponent
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create component",
      error: error.message
    });
  }
};



// GET: Get a single component by ID
exports.getComponent = async (req, res) => {
    try {
        const { cID } = req.params;
        const component = await Component.findOne({ cID });

        if (!component) {
            return res.status(404).json({
                success: false,
                message: "Component not found"
            });
        }

        res.status(200).json({
            success: true,
            data: component
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch component",
            error: error.message
        });
    }
};

// PUT: Update a component by ID
exports.updateComponent = async (req, res) => {
    try {
        const { cID } = req.params;
        const updatedComponent = await Component.findOneAndUpdate(
            { cID },
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedComponent) {
            return res.status(404).json({
                success: false,
                message: "Component not found"
            });
        }

        res.status(200).json({
            success: true,
            data: updatedComponent
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to update component",
            error: error.message
        });
    }
};

// DELETE: Delete a component by ID
exports.deleteComponent = async (req, res) => {
    try {
        const { cID } = req.params;
        const deletedComponent = await Component.findOneAndDelete({ cID });

        if (!deletedComponent) {
            return res.status(404).json({
                success: false,
                message: "Component not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Component deleted successfully",
            data: deletedComponent
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete component",
            error: error.message
        });
    }
};


//PUT: Make Available !
exports.makeAvailable = async (req, res) => {
    try {
        const { quantity, loc } = req.body;
        const { cID } = req.params;

        const user = await Component.findOneAndUpdate(
            { cID },
            {
                available: true,
                qnty: quantity,
                loc: loc,
            },
            { new: true }
        );
        // if(user){}
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No matching Component!"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Updated Successfully!",
            data: user
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Cannot Update Component!"
        });
    }
};
