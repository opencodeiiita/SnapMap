import User from "../models/User.js";

const registerUser = async(req,res) => {
    try {
        const clerkUserId = req.userId

        const{name, email, collegeName, phoneNumber, year, gender} = req.body

        if(!name || !email || !collegeName) 
            return res.status(400).json({message: "Please fill in all required fields"})

        const existingUser = await User.findOne({clerkUserId})

        if(existingUser)
            return res.status(400).json({message: "User already exists"})

        const user = await User.create({
        clerkUserId,
        name,
        collegeName,
        phoneNumber,
        year,
        gender,
        })

        return res.status(201).json({message: "User registered successfully",user,});

        
    } catch (error) {
    console.error("REGISTER USER ERROR", error);
    return res.status(500).json({message: "Internal server error" })

    }
}

export { registerUser };