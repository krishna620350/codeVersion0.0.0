import headerCheck from "../validation/headerCheck.js";
import userDatabase from "../database/users.js";
class UsersController {
    #id;
    #name;
    #responseHraders = {
        "content-type": "application/json", // Correct Content-Type for JSON
        "access-control-allow-origin": "*", // Example access control header
        "x-powered-by": "codeforce",
    }
    constructor(name = "name") {
        this.#name = name;
    }
    createUser = async (req, res) => {
        try {
            const headersValue = headerCheck.postHeaderCheck(req.headers);
            if (headersValue === true) {
                const { name } = req.body;
                if (!name) {
                    res.status(201).json({message: 'data is incorrect please enter correct data'});
                }
                const result = await userDatabase.addUser(name);
                res.status(200).json(result);
            } else {
                res.status(404).json({ missingHeader: headersValue });
            }
        } catch (e) { 
            res.status(400).json({ error: e });
        }
    }
    getUsers = (req, res) => {
        res.set();

        // Check the API key from request headers
        if (req.headers["x-api-key"] === 'krishna@3456789') {
            return res.status(200).json({ message: `${this.#id} -> ${this.#name}` });
        } else {
            return res.status(403).json({ error: "Invalid API key" });
        }
    }
    getUsersByid = async (req, res) => {
        try {
            const { id } = req.params;
            const authKey = req.headers["x-api-key"];

            // Log for debugging
            // console.log("Auth Key:", authKey);
            // console.log("User ID:", id);
            res.set(this.#responseHraders);
            // Step 1: Call getUserById to fetch user data
            const [success, statusCode, result] = await userDatabase.getUserById(id, authKey);

            if (!success) {
                return res.status(statusCode).json({ error: result });
            }

            // Step 2: Send the HTTP response immediately
            res.status(statusCode).json({ data: result });

        } catch (e) {
            console.error("Error in getUsersByid:", e);
            return res.status(500).json({ error: "Internal server error" });
        }
    };
}

export const userController = new UsersController(); // Named export
