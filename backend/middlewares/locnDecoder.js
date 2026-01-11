const axios = require("axios");

let locnDecoder = async (gmap) => {
    try {
        // 1. CHECK: Does the input URL already contain the coordinates?
        // Matches: ?q=19.2101685,73.0945402
        let directMatch = gmap.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
        
        if (directMatch) {
            console.log("Direct match found:", directMatch);
            return directMatch; // Returns [full_match, lat, lng]
        }

        // 2. IF NOT: It might be a short link or redirect link, so fetch it.
        let response = await axios.get(gmap, {
            maxRedirects: 5
        });

        let url = response.request.res.responseUrl;
        
        // 3. Extract from the final redirected URL
        // Pattern 1: @lat,lng (Desktop maps)
        // Pattern 2: q=lat,lng (Mobile/Embedded maps)
        let abc = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) || url.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
        
        console.log("Redirect match found:", abc);
        return abc;

    } catch (err) {
        console.error("Error decoding location:", err.message);
        return null; // Return null so the controller handles the error gracefully
    }
}

module.exports = { locnDecoder };