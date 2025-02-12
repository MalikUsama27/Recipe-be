import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  try {
    console.log("Received request body:", req.body); // Debugging step

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      console.log("Missing fields:", { name, email, password });
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate password length
    if (password.length < 6 || password.length > 10) {
      return res.status(400).json({ message: "Password must be 6-10 characters long" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Send user data along with a token
    res.json({ 
      _id: user.id, 
      name: user.name, 
      email: user.email, 
      token: generateToken(user.id) 
    });

  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

