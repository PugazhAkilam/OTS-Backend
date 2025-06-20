// models/adminModel.js
const { sql, poolPromise } = require('../../db');

const generateUniqueUserCode = async (prefix = 'USER') => {
  const pool = await poolPromise;
  let isUnique = false;
  let userCode;
  
  while (!isUnique) {
    // Generate a random 4-digit number
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    userCode = `${prefix}${randomNum}`;
    
    // Check if the code exists
    const result = await pool.request()
      .input('userCode', sql.VarChar, userCode)
      .query('SELECT COUNT(*) as count FROM user_Master WHERE user_Code = @userCode');
    
    isUnique = result.recordset[0].count === 0;
  }
  
  return userCode;
};

const getAllUsers = async () => {
  const pool = await poolPromise;
  const result = await pool.request()
   .query(`select 
       user_ID,
	   user_Code,
       user_Name,
	   user_Type_ID,
	   mobile_Number,
	   alter_Mobile_number,
	   email_ID,
	   active_Flag,
	   deliveryman_id,
	   company_Id,
	   created_Date

FROM user_Master order by user_ID desc`);
  return result.recordset;
};


const updateUserStatus = async (userId, isActive) => {
  const pool = await poolPromise;
  const query = `
    UPDATE user_Master 
    SET active_Flag = @isActive 
    WHERE user_ID = @userId
  `;
  
  await pool.request()
    .input('userId', sql.Int, userId)
    .input('isActive', sql.Bit, isActive)
    .query(query);
};

const updateUser = async (userId, userData) => {
  try {
    const pool = await poolPromise;
    
    // Check if email exists for other users
    const emailCheck = await pool.request()
      .input('email', sql.NVarChar, userData.email_ID)
      .input('userId', sql.Int, userId)
      .query(`
        SELECT COUNT(*) as count 
        FROM user_Master 
        WHERE email_ID = @email 
        AND user_ID != @userId
      `);

    if (emailCheck.recordset[0].count > 0) {
      throw new Error('Email already exists');
    }

    const query = `
      UPDATE user_Master
      SET 
        user_Name = @user_Name,
        email_ID = @email_ID,
        mobile_Number = @mobile_Number,
        alter_Mobile_number = @alter_Mobile_number,
        modified_Date = GETDATE()
      WHERE user_ID = @userId
    `;

    await pool.request()
      .input('userId', sql.Int, userId)
      .input('user_Name', sql.NVarChar, userData.user_Name)
      .input('email_ID', sql.NVarChar, userData.email_ID)
      .input('mobile_Number', sql.NVarChar, userData.mobile_Number)
      .input('alter_Mobile_number', sql.NVarChar, userData.alter_Mobile_number)
      .query(query);

    return { success: true };
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// 
// Insert into company_Master and return company_Id
const addCompany = async (companyName, email, mobileId,mobile) => {
   
    const pool = await poolPromise;
  const result = await pool.request()
    .input('companyName', sql.VarChar, companyName || "ots2.0")
    .input('email', sql.VarChar, email)
    .input('mobileId', sql.VarChar, mobileId || mobile)
    .query(`
      INSERT INTO company_Master (company_Name, email, mobile_No)
      OUTPUT inserted.company_Id
      VALUES (@companyName, @email, @mobileId)
    `);

  return result.recordset[0].company_Id;
};

// Insert into user_Master
const addUser = async (username,  company_Id, mobileId, email, name, role, mobile) => {
  const pool = await poolPromise;
  
  // Generate unique user code if not provided
  const finalUserCode =  await generateUniqueUserCode(role === 1 ? 'ADM' : 
                                                                role === 2 ? 'OWN' : 
                                                                role === 3 ? 'DEL' : 'CUS');
  
  await pool.request()
    .input('username', sql.VarChar, username || name)
    .input('usercode', sql.VarChar, finalUserCode)
    .input('usertypeId', sql.Numeric, role)
    .input('company_Id', sql.Numeric, company_Id)
    .input('email', sql.VarChar, email)
    .input('mobileId', sql.VarChar, mobileId || mobile)
    .query(`
      INSERT INTO user_Master (user_Name, user_Code, user_Type_ID, company_Id, email_ID, mobile_Number)
      VALUES (@username, @usercode, @usertypeId, @company_Id, @email, @mobileId)
    `);
    
  return finalUserCode;
};

const updateCompanySettings = async (companyId, companyData) => {
  const pool = await poolPromise;
  console.log(companyData);
  await pool.request()
    .input('companyId', sql.Int, companyId)
    .input('companyName', sql.VarChar, companyData.name)
    .input('email', sql.VarChar, companyData.email)
    .query(`
      UPDATE company_Master 
      SET company_Name = @companyName,
          email = @email
      WHERE company_Id = @companyId
    `);
    
  // Insert or update in company_settings table which has the additional fields
  await pool.request()
    .input('companyId', sql.Int, companyId)
    .input('companyName', sql.VarChar, companyData.name)
    .input('logoUrl', sql.VarChar, companyData.logo || null)
    .input('frontPageImageUrl', sql.VarChar, companyData.frontPageImage || null)
    .input('description', sql.VarChar, companyData.description || null)
    .input('address', sql.VarChar, companyData.address || null)
    .input('email', sql.VarChar, companyData.email)
    .input('phone', sql.VarChar, companyData.phone || null)
    .input('website', sql.VarChar, companyData.website || null)
    .input('currentDate', sql.DateTime, new Date())
    .query(`
      IF EXISTS (SELECT 1 FROM company_settings WHERE id = @companyId)
      BEGIN
        UPDATE company_settings 
        SET company_name = @companyName,
            logo_url = @logoUrl,
            front_page_image_url = @frontPageImageUrl,
            description = @description,
            address = @address,
            email = @email,
            phone = @phone,
            website = @website,
            updated_at = @currentDate
      END
      ELSE
      BEGIN
        INSERT INTO company_settings (id, company_name, logo_url, front_page_image_url, description, address, email, phone, website, created_at, updated_at)
        VALUES (@companyId, @companyName, @logoUrl, @frontPageImageUrl, @description, @address, @email, @phone, @website, @currentDate, @currentDate)
      END
    `);
};


const getCompanySettings = async (companyId) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('companyId', sql.Int, companyId)
    .query(`
    SELECT 
        id,
        company_name as name,
        logo_url as logo,
        front_page_image_url as frontPageImage,
        description,
        address,
        email,
        phone,
        website,
        created_at,
        updated_at
      FROM company_settings
      WHERE id = @companyId
    `);

  return result.recordset[0];
};

const createMenuAccess = async (menuItems) => {
  const pool = await poolPromise;
  const table = new sql.Table('menu_access');
  
  table.columns.add('title', sql.VarChar(100));
  table.columns.add('menu', sql.VarChar(50));
  table.columns.add('submenu', sql.VarChar(50));
  table.columns.add('list', sql.VarChar(100));
  table.columns.add('admin', sql.Bit);
  table.columns.add('owner', sql.Bit);
  table.columns.add('anchor', sql.Bit);
  table.columns.add('customer', sql.Bit);

  menuItems.forEach(item => {
    table.rows.add(
      item.title,
      item.menu,
      item.submenu,
      item.list,
      item.admin,
      item.owner,
      item.anchor,
      item.customer
    );
  });

  await pool.request().bulk(table);
};

const getMenuAccess = async () => {
  const pool = await poolPromise;
  const result = await pool.request()
    .query('SELECT * FROM menu_access');
  return result.recordset;
};

const updateMenuAccess = async (id, role, value) => {
  const pool = await poolPromise;
  await pool.request()
    .input('id', sql.Int, id)
    .input('value', sql.Bit, value)
    .query(`UPDATE menu_access SET ${role} = @value WHERE id = @id`);
};

const deleteMenuAccess = async (id) => {
  const pool = await poolPromise;
  await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM menu_access WHERE id = @id');
};

module.exports = { 
  addCompany, 
  getAllUsers,
  addUser, 
  updateCompanySettings, 
  getCompanySettings,
  createMenuAccess,
  getMenuAccess,
  updateMenuAccess,
  deleteMenuAccess,updateUser, updateUserStatus,
};
