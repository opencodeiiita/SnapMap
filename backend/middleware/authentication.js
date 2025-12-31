import { verifyToken } from "@clerk/clerk-sdk-node";

async function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const decoded = await verifyToken(token);
    req.userId = decoded.sub;
    console.log(req.userId);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

export default authMiddleware;
