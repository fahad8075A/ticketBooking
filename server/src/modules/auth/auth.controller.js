import * as authService from './auth.service.js';


export const register = async (req, res) => {
  try {
    const data = await authService.registerUser(req.body);
     res.status(201).json(data);
  } catch (error) {
    res.json(error).status(400);
  
  }
};

export const login = async (req, res) => {
  try {
    const data = await authService.loginUser(req.body);
    res.status(200).json(data);
  } catch (error) {
    res.status(401);
   
  }
};