const AdminActivityLog = require('../models/AdminActivityLog');

const logActivity = async (req, action, module, details = '') => {
  try {
    const adminId = req.admin ? req.admin._id : null;
    const adminName = req.admin ? req.admin.fullName || req.admin.username : 'System';
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    await AdminActivityLog.create({
      admin: adminId,
      adminName,
      action,
      module,
      details,
      ipAddress,
    });
  } catch (err) {
    console.error('[ActivityLogger Error]', err.message);
  }
};

module.exports = { logActivity };
