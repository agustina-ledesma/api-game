const validateToken = (req, res, next) => {
    const token = req.headers['authorization']; // Obtener el token
  
    if (!token) {
      return res.status(403).json({ message: 'No token provided.' });
    }
  
    // Eliminar "Bearer " si es necesario
    const cleanedToken = token.startsWith('Bearer ') ? token.slice(7) : token;
  
    try {
      const decodedData = JSON.parse(atob(cleanedToken)); // Decodificar el token
      req.user = decodedData; // Guardar la información decodificada
      next(); // Continuar a la siguiente función o ruta
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token!' });
    }
  };
  
export default validateToken;
  