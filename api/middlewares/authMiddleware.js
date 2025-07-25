const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  // Verificar si es una API key
  const apiKey = req.headers["x-api-key"];
  if (apiKey && apiKey === process.env.PRIVATE_API_KEY) {
    req.userId = "api_access"; // ID especial para acceso vía API key
    return next();
  }

  // Si no es API key, verificar JWT
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "Token requerido" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Token inválido" });
    req.userId = decoded.id;
    next();
  });
};
