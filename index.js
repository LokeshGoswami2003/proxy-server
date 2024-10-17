import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const port = 3000;

// Middleware to enable CORS
app.use(cors());

app.get("/", async (req, res) => {
    res.status(200).send("im IN");
});
// Endpoint for fetching restaurant data
app.get("/restaurants", async (req, res) => {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
        return res
            .status(400)
            .json({ error: "Latitude and Longitude are required" });
    }

    const apiUrl = `https://www.swiggy.com/dapi/restaurants/list/v5?lat=${lat}&lng=${lng}&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error fetching restaurant data:", error);
        res.status(500).json({ error: "Failed to fetch restaurant data" });
    }
});

// Endpoint for fetching menu data
app.get("/menu", async (req, res) => {
    const { lat, lng, restaurantId } = req.query;

    if (!lat || !lng || !restaurantId) {
        return res.status(400).json({
            error: "Latitude, Longitude, and Restaurant ID are required",
        });
    }

    const apiUrl = `https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=${lat}&lng=${lng}&restaurantId=${restaurantId}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error fetching menu data:", error);
        res.status(500).json({ error: "Failed to fetch menu data" });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
