// controllers/adminController.js
const adminModel = require('../../models/superadmin/adminModel');
//const db = require('../../config/database');

// Create Admin
const createAdmin = async (req, res) => {
  const { username, usercode,  companyName, mobileId, email } = req.body;

  try {
    // Insert company details and get company_Id
    const company_Id = await adminModel.addCompany(companyName, email, mobileId);

    // Insert user details with the company_Id
    await adminModel.addUser(username, usercode,  company_Id,mobileId,email);

    // Success response
    res.status(200).json({ message: 'Admin created successfully',company_Id });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ error: 'An error occurred while creating the admin' });
  }
};

const updateCompanySettings = async (req, res) => {
  try {
    const companyId = 1;
    const companyData = req.body;
    
    // Handle file uploads from multer middleware
    if (req.files) {
      // Handle logo upload
      if (req.files.logo && req.files.logo.length > 0) {
        companyData.logo = req.files.logo[0].filename;
      }
      
      // Handle frontPageImage upload
      if (req.files.frontPageImage && req.files.frontPageImage.length > 0) {
        companyData.frontPageImage = req.files.frontPageImage[0].filename;
      }
    }

    await adminModel.updateCompanySettings(companyId, companyData);
    res.status(200).json({ message: 'Company settings updated successfully' });
  } catch (error) {
    console.error('Error updating company settings:', error);
    res.status(500).json({ error: 'Failed to update company settings' });
  }
};

const getCompanySettings = async (req, res) => {
  try {
    const { companyId } = req.params;
    const settings = await adminModel.getCompanySettings(companyId);
    res.status(200).json(settings);
  } catch (error) {
    console.error('Error fetching company settings:', error);
    res.status(500).json({ error: 'Failed to fetch company settings' });
  }
};



// Update the menu access functions to use the model
const createMenuAccess = async (req, res) => {
    try {
        await adminModel.createMenuAccess(req.body);
        res.status(201).json({
            success: true,
            message: 'Menu access created successfully'
        });
    } catch (error) {
        console.error('Error creating menu access:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create menu access'
        });
    }
};

const getMenuAccess = async (req, res) => {
    try {
        const rows = await adminModel.getMenuAccess();
        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching menu access:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch menu access'
        });
    }
};

const updateMenuAccess = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, value } = req.body;
        await adminModel.updateMenuAccess(id, role, value);
        res.status(200).json({
            success: true,
            message: 'Menu access updated successfully'
        });
    } catch (error) {
        console.error('Error updating menu access:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update menu access'
        });
    }
};

const deleteMenuAccess = async (req, res) => {
    try {
        const { id } = req.params;
        await adminModel.deleteMenuAccess(id);
        res.status(200).json({
            success: true,
            message: 'Menu access deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting menu access:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete menu access'
        });
    }
};


// Update the exports section
module.exports = { 
  createAdmin, 
  updateCompanySettings, 
  getCompanySettings,
  createMenuAccess,
  getMenuAccess,
  updateMenuAccess,
  deleteMenuAccess
};