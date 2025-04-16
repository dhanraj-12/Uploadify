const jwt = require('jsonwebtoken');
const User = require('../Models/user_mode');

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Check if token exists in headers (Bearer Token)
    const token = req.headers.authorization; // "Bearer <token>"
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Unauthorized: No token provided" 
      });
    }

    // 2. Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find user in database (ensure they still exist)
    const user = await User.findById(decoded._id);
    console.log(user);
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "Unauthorized: User not found" 
      });
    }

    // 4. Attach user to the request for later use
    req.userId = user._id; // Or attach the whole user: req.user = user

    next(); // Proceed to the next middleware/controller
  } catch (err) {
    console.error("Auth middleware error:", err);

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ 
        success: false,
        message: "Unauthorized: Invalid token" 
      });
    }

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ 
        success: false,
        message: "Unauthorized: Token expired" 
      });
    }

    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};

module.exports = authMiddleware;