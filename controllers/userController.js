const dotenv = require("dotenv");
const { registerUser, loginUser, updateUser, deleteUser, infoUser } = require("../services/index");

dotenv.config();

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

const updateHandler = async (req, res) => {
    const { name, email, mobile } =  req.body;
    const userId = req.user.id;

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

        return res.status(200).json({ message: "Details Updated Successfully"});
    } catch (error) {
        console.error(error);

        if(error.status) {
            return res.status(error.status).json({ message: error.message });
        };

        return res.status(500).json({ message: "An error occured" });
    }
};

const deleteHandler = async (req, res) => {
    const userId = req.user.id;
    
    if (!req.user || !req.user.id) {
        return res.status(400).json({ message: "User ID is missing or invalid" });
    };    

    //      Try Catch block for error handling
    try {
        //  Check if the user exists in the db 
        await deleteUser(userId);

        return res.status(200).json({ message: "User deleted Successfully"});
    } catch (error) {
        console.error(error);

        if(error.status) {
            return res.status(error.status).json({ message: error.message });
        };

        return res.status(500).json({ message: "An error occured" });
    }
};

const infoHandler = async (req, res) => {
    const userId = req.user.id;

    if (!req.user || !req.user.id) {
        return res.status(400).json({ message: "User ID is missing or invalid" });
    }; 

    try {
        const result = await infoUser(userId);

        return res.status(200).json({ message: "Fetched user info.", result });
    } catch (error) {
        console.error(error);

        if(error.status) {
            return res.status(error.status).json({ message: error.message });
        };

        return res.status(500).json({ message: "An error occured" });
    }
};

module.exports = { registerHandler, loginHandler, updateHandler, deleteHandler, infoHandler };
