const hasRole = (requiredRoles) => {
  return (req, res, next) => {

    const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    if (rolesArray.includes(req.userInfo.role)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: `Access denied! ${requiredRoles} role required.`,
    });
  };
};

module.exports = hasRole;