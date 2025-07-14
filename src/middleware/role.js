module.exports = function authorizeRole(...rolesAllowed){
    return(req, res, next) => {
        if (!rolesAllowed.includes(req.user.role)) 
        return res.status(403).json({ messages: 'Forbidden (role mismatch)' });
        next();
    };
};