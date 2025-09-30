// require("dotenv").config({ quiet: true });
// const cloudinary = require("./config/cloudinary");
//
// (async () => {
//     try {
//         // Method 1: Upload from URL (correct syntax)
//         const result = await cloudinary.uploader.upload(
//             "https://picsum.photos/200/300", // Specific dimensions work better
//             {
//                 resource_type: "image"
//             }
//         );
//         console.log("✅ Cloudinary upload successful:", result.secure_url);
//     } catch (err) {
//         console.error("❌ Cloudinary upload failed:", err.message);
//         console.error("Full error:", err);
//     }
// })();