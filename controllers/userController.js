const dotenv = require("dotenv");
const { registerUser, loginUser, updateUser, deleteUser, infoUser } = require("../services/user.service");

dotenv.config();

//          register handler
const registerHandler = async (req, res) => {
    const { name, email, mobile, password } =  req.body;

    try {
        //  Check if the user exists in the db 
        const result = await registerUser(name, email, mobile, password);

        return res.status(201).json({ message: "Registered Successfully"});
    } catch (error) {
        console.error(error);

        if(error.status) {
            return res.status(error.status).json({ message: error.message });
        };

        return res.status(500).json({ message: "An error occured" });
    }
};

//          login handler
const loginHandler = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await loginUser(email, password);

        return res.status(200).json({ message: "Logged in Successfully", result });
    } catch (error) {
        console.error(error);
        
        if(error.status) {
            return res.status(error.status).json({ message: error.message });
        };

        return res.status(500).json({ message: "An Error Occured" });
    }
};

//          user update handler
const updateHandler = async (req, res) => {
    const { name, email, mobile } =  req.body;
    const { userId } = req.params;

    if (!name && !email && !mobile) {
        return res.status(400).json({ message: "No valid fields to update" });
    };

    if (!userId) {
        return res.status(400).json({ message: "User ID is missing or invalid" });
    };
    
    //      Try Catch block for error handling
    try {
        //  Check if the user exists in the db 
        const result = await updateUser(name, email, mobile, userId);

        return res.status(201).json({ message: "Details Updated Successfully"});
    } catch (error) {
        console.error(error);

        if(error.status) {
            return res.status(error.status).json({ message: error.message });
        };

        return res.status(500).json({ message: "An error occured" });
    }
};

//          user delete handler
const deleteHandler = async (req, res) => {
    const { userId } = req.params;
    
    if (!userId) {
        return res.status(400).json({ message: "User ID is missing or invalid" });
    };    

    //      Try Catch block for error handling
    try {
        //  Check if the user exists in the db 
        await deleteUser(userId);

        console.log("User deleted successfully"); // Debugging log
        return res.status(200).json({ message: "User deleted Successfully"});
    } catch (error) {
        console.error(error);

        if(error.status) {
            return res.status(error.status).json({ message: error.message });
        };

        return res.status(500).json({ message: "An error occured" });
    }
};

//          user info handler
const infoHandler = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: "User ID is missing or invalid" });
    }; 

    try {
        const userInfo = await infoUser(userId);

        // Extract the required fields from the userInfo object
        const filteredUserInfo = {
        name: userInfo.name,
        email: userInfo.email,
        mobile: userInfo.mobile,
        _id: userInfo._id,
        };

        return res.status(200).json({ message: "Fetched user info.", result: filteredUserInfo });
    } catch (error) {
        console.error(error);

        if(error.status) {
            return res.status(error.status).json({ message: error.message });
        };

        return res.status(500).json({ message: "An error occured" });
    }
};

module.exports = { registerHandler, loginHandler, updateHandler, deleteHandler, infoHandler };
