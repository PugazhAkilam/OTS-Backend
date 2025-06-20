// routes/adminRoutes.js
const express = require('express');
const adminController = require('../controllers/superadmin/adminController');
const upload = require('../middleware/uploadMiddleware');
const { route } = require('./admin');
const router = express.Router();




// Route to handle the creation of an admin
router.post('/create-admin', adminController.createAdmin);
router.get('/get-all-user', adminController.getAllUsers );
// ... existing routes ...
router.put('/update-user-status/:userId', adminController.updateUserStatus);
// Add this new route
router.put('/update-user/:userId', adminController.updateUser);
// ... existing routes ...

// New routes for company settings
router.put('/company-settings', upload, adminController.updateCompanySettings);
router.get('/company-settings/:companyId', adminController.getCompanySettings);
// Menu Access routes
router.post('/menu-access', adminController.createMenuAccess);
router.get('/menu-access', adminController.getMenuAccess);
router.put('/menu-access/:id', adminController.updateMenuAccess);
router.delete('/menu-access/:id', adminController.deleteMenuAccess);

//router.post('/upload-company-image', upload, adminController.uploadCompanyImage);

module.exports = router;
