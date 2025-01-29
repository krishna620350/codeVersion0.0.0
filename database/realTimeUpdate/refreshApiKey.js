import { v4 as uuidv4 } from "uuid";
import { database, collections } from "../../configuration/fireBaseConfig.js";
import { ref, get, update } from "firebase/database";

class RefreshApiKey {
    /**
     * Generate a UUID without hyphens
     * @returns {string} A unique 32-character string
     */
    generateUUID() {
        return uuidv4().replace(/-/g, ""); // Corrected regex replacement
    }

    /**
     * Updates all API keys in the Realtime Database under the users collection.
     */
    async updateApiKeys() {
        try {
            console.log("Updating API keys in Realtime Database...");

            // Reference to the "users" collection in Realtime Database
            const usersRef = ref(database, collections.apiKeys);

            // Fetch all user data
            const snapshot = await get(usersRef);
            if (!snapshot.exists()) {
                console.log("No users found in Realtime Database.");
                return { message: "No users to update." };
            }

            // Prepare the updated data
            const updates = {};
            snapshot.forEach((childSnapshot) => {
                const userId = childSnapshot.key; // Get the user's ID
                const newApiKey = this.generateUUID(); // Generate a new API key
                updates[`${userId}/key`] = newApiKey; // Update the `key` field
            });

            // console.log("Prepared updates:", updates);

            // Perform batch update
            await update(usersRef, updates);

            console.log("All API keys updated successfully in Realtime Database.");
            return { message: "API keys updated successfully for all users." };
        } catch (error) {
            console.error("Error updating API keys:", error);
            throw new Error("Failed to update API keys: " + error.message);
        }
    }

    /**
     * Schedules the API key update process to run every 24 hours.
     */
    scheduleApiKeyRefresh() {
        setInterval(() => {
            this.updateApiKeys().catch((error) => {
                console.error("Error during scheduled API key refresh:", error);
            });
        }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
        console.log("Scheduled API key refresh every 24 hours for Realtime Database.");
    }
}

export default new RefreshApiKey();
