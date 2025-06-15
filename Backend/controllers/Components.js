const Component = require('../models/Component');
const MidOrder = require('../models/MidOrder');
const Project = require('../models/Project');

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
    console.log("Inside Create Component!");

    const {
      title,
      cID,
      description,
      qnty,
      price,
      loc,
      image,
      available,
      minPurchase
    } = req.body;

    // Check for duplicate cID
    const existingComponent = await Component.findOne({ cID });
    if (existingComponent) {
      return res.status(400).json({
        success: false,
        message: "Component ID already exists. Please try again with a new one.",
      });
    }

    const newComponent = new Component({
      title,
      cID,
      description,
      qnty,
      price,
      loc,
      image,
      available,
      minPurchace: minPurchase, // Note: match schema spelling!
    });

    const savedComponent = await newComponent.save();

    res.status(201).json({
      success: true,
      message: "Component created successfully.",
      data: savedComponent,
    });

  } catch (error) {
    console.error("Create Component Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create component.",
      error: error.message,
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

const getRequiredOrder = async () => {
    try {
        // Step 1: Map to accumulate total required quantities
        const reqMap = new Map(); // key: component ID, value: { name, totalQty }

        const approvedProjects = await Project.find({
            approved: true,
            isCompleted: false,
        });

        for (const project of approvedProjects) {
            for (const cmp of project.components) {
                if (cmp.accepted) {
                    const existing = reqMap.get(cmp.id);
                    if (existing) {
                        existing.reqty += cmp.quantity;
                    } else {
                        reqMap.set(cmp.id, {
                            name: cmp.name,
                            reqty: cmp.quantity,
                        });
                    }
                }
            }
        }

        // Step 2: Delete existing MidOrders
        await MidOrder.deleteMany({});

        // Step 3: Create new MidOrders based on accumulated data
        for (const [id, data] of reqMap.entries()) {
            const com = await Component.findOne({ cID: id });
            const available = com?.qnty || 0;
            const toOrder = Math.max(data.reqty - available, 0);

            const newEntry = new MidOrder({
                ID: id,
                name: data.name,
                reqty: data.reqty,
                available,
                toOrder,
            });

            await newEntry.save();
        }

        const allMidOrders = await MidOrder.find();

        return {
            success: true,
            message: "MidOrder updated successfully.",
            midOrders: allMidOrders,
        };
    } catch (error) {
        console.error("Error in getRequiredOrder:", error);
        return {
            success: false,
            message: "Internal Server Error",
            error: error.message,
        };
    }
};

exports.getMidOrder = async () => {
    try {
        const result = await getRequiredOrder();

        
    } catch (error) {
        console.error("Error in getMidOrder:", error);
        
    }
};


exports.generateOrder = async (req, res) => {
    try {
        // Step 1: First, clear any existing MidOrders
        await MidOrder.deleteMany({});

        // Step 2: Generate new MidOrder data
        const result = await getRequiredOrder();

        // Step 3: Check if the generation was successful
        if (!result.success) {
            return res.status(500).json({
                success: false,
                message: result.message,
                error: result.error
            });
        }

        // Step 4: Extract only required fields to send
        const filteredMidOrders = result.midOrders.map(order => ({
            ID: order.ID,
            name: order.name,
            reqty: order.reqty
        }));

        // Step 6: Send the response
        return res.status(200).json({
            success: true,
            message: "Order data generated successfully.",
            orders: filteredMidOrders
        });

    } catch (error) {
        console.error("Error in generateOrder:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error in generateOrder",
            error: error.message
        });
    }
};

const Order = require('../models/Order');

function generateTEMCode() {
  const randomNumber = Math.floor(1000 + Math.random() * 9000); // More combinations
  return "ORD" + randomNumber;
}

exports.createOrder = async (req, res) => {
  try {
    const { orderDetails, invoicePDF } = req.body;

    if (!orderDetails || !Array.isArray(orderDetails) || orderDetails.length === 0) {
      return res.status(400).json({ success: false, message: "Order details are required." });
    }

    const currentOrderID = generateTEMCode(); // ✅ Move here!

    const newOrder = new Order({
      orderID: currentOrderID,
      orderDetails,
      invoiceGenerated: true,
      invoicePDF: invoicePDF ? Buffer.from(invoicePDF, 'base64') : undefined,
    });

    await newOrder.save();

    return res.status(201).json({
      success: true,
      message: "Order created successfully with invoice.",
      orderID: newOrder.orderID,
    });

  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

exports.fetchMidOrder = async (req, res) => {
    try{
        const midOrder = await MidOrder.find({});
        return res.status(200).json({
            succes:true,
            data:midOrder
        });
    }catch(error){
        console.log(error);
        return res.status(401).json({
            succes:false,
            message:error
        })
    }
};


exports.updateMidOrder = async (req, res) => {
  try {
    const { updatedReqs } = req.body;

    if (!updatedReqs || !Array.isArray(updatedReqs)) {
      return res.status(400).json({ success: false, message: 'Invalid or missing updatedReqs array' });
    }

    // Extract valid IDs from frontend
    const incomingIds = updatedReqs
      .filter(item => item._id) // only items with _id
      .map(item => item._id.toString());

    // Step 1: Get all existing mid orders
    const existingDocs = await MidOrder.find({});
    const existingIds = existingDocs.map(doc => doc._id.toString());

    // Step 2: Determine which IDs to delete (present in DB, but not in frontend)
    const idsToDelete = existingIds.filter(id => !incomingIds.includes(id));
    await MidOrder.deleteMany({ _id: { $in: idsToDelete } });

    // Step 3: Update existing and insert new ones
    const upsertedDocs = [];

    for (const item of updatedReqs) {
      if (item._id) {
        // Try updating existing document
        const updated = await MidOrder.findByIdAndUpdate(
          item._id,
          {
            ID: item.ID,
            name: item.name,
            reqty: item.reqty,
            available: item.available,
            toOrder: item.toOrder
          },
          { new: true }
        );
        if (updated) {
          upsertedDocs.push(updated);
        } else {
          // In case _id is invalid, create new
          const created = await MidOrder.create(item);
          upsertedDocs.push(created);
        }
      } else {
        // No _id: insert as new
        const created = await MidOrder.create(item);
        upsertedDocs.push(created);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'MidOrders synced successfully',
      data: upsertedDocs
    });

  } catch (error) {
    console.error('Error updating mid orders:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
