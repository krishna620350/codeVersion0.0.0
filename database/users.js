import { db, database, collections } from "../configuration/fireBaseConfig.js";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, set, get } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import wss from "../configuration/wenshocket.js";
import WebSocket from "ws";

class UserDatabase {
    async generateUUID() {
        return uuidv4().replace('/-/g', ''); // Example: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
    }
    async addUser(name) {
        try {
            // Add user to Firestore
            const id = await this.generateUUID();
            await setDoc(doc(db, collections.users, id), { name });

            // Add user to Realtime Database
            await set(ref(database, `${collections.users}/${id}`), { name });

            // Run a background task
            this.logBackgroundActivity(id, name);

            return { message: 'User added successfully' };
        } catch (e) {
            console.error("Error adding user:", e);
            throw new Error("Failed to add user: " + e.message);
        }
    }

    checkAuthKey = async (id, authKey) => {
        try {
            // Validate if `authKey` is present
            if (!authKey) {
                return [false, 400, "Missing auth key in headers"];
            }

            // Match the authKey in Firebase Realtime Database
            const authRef = ref(database, `${collections.apiKeys}/${id}/key`);
            const authSnapshot = await get(authRef);

            if (!authSnapshot.exists()) {
                return [false, 401, "Invalid auth key or user not found"];
            }

            const storedAuthKey = authSnapshot.val();
            if (storedAuthKey !== authKey) {
                return [false, 403, "Unauthorized access: Invalid auth key"];
            }

            // Fetch user data from Realtime Database
            const userSnapshot = await get(ref(database, `${collections.users}/${id}`));
            if (!userSnapshot.exists()) {
                return [false, 404, "User not found in Realtime Database"];
            }

            const user = userSnapshot.val();
            return [true, 200, user]; // Success: return user data
        } catch (e) {
            console.error("Error during auth check:", e);
            return [false, 500, "Internal server error"];
        }
    };


    getUserById = async (id, authKey) => {
        try {
            // Step 1: Authenticate the user with Realtime Database
            const user = await this.checkAuthKey(id, authKey);
            if (!user[0]) {
                return user; // Return immediately if auth fails
            }

            // Step 2: Return Realtime Database data immediately
            const realtimeData = user[2];

            // Step 3: Start fetching Firestore data in the background
            (async () => {
                try {
                    const userDoc = await getDoc(doc(db, collections.users, id));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();

                        // Merge Firestore data with Realtime Database data
                        const mergedData = { ...realtimeData, ...userData};

                        // Log the updated data for debugging
                        console.log("Merged user data:", mergedData);
                        // Step 3: Send WebSocket message asynchronously after the HTTP response is sent
                        // Loop through WebSocket clients and send the message
                        wss.clients.forEach((client) => {
                            if (client.readyState === WebSocket.OPEN) {
                                client.send(JSON.stringify({ data: mergedData }));
                            }
                        });
                        console.log("WebSocket message sent to clients.");
                    }
                } catch (e) {
                    console.error("Error fetching Firestore data:", e);
                }
            })();

            // Return the Realtime Database data immediately
            return [true, 200, realtimeData];
        } catch (e) {
            console.error("Error during auth check:", e);
            return [false, 500, "Internal server error"];
        }
    };


    // Background task function
    logBackgroundActivity(id, name) {
        (async () => {
            try {
                console.log(`Background task started for user ID: ${id}`);
                // Simulate a time-consuming task
                const key = (await this.generateUUID()).toString().replace(/-/g, "");
                // Add user to Realtime Database
                await set(ref(database, `${collections.apiKeys}/${id}`), { key });
                console.log(`Background task completed for user ${name}`);
                // Perform additional operations (e.g., logging, analytics, etc.)
            } catch (e) {
                console.error("Error in background task:", e);
            }
        })();
    }
}

export default new UserDatabase();
