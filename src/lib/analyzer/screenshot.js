import cloudinary from "@/lib/cloudinary";

export async function takeScreenshot(page) {
    try {
        const screenshotBuffer = await page.screenshot({
            fullPage: false,
            type: "png",
        });

        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "ai-website-analyzer/screenshots",
                    resource_type: "image",
                },
                (error, result) => {
                    if (error) {
                        console.error("CLOUDINARY UPLOAD ERROR:", error);
                        reject(error);
                    } else {
                        resolve(result);
                    }                         
                }
            );

            uploadStream.end(screenshotBuffer);
        });

        console.log("CLOUDINARY RESULT:", result);

        return result.secure_url;

    } catch (error) {
        console.error("CLOUDINARY SCREENSHOT ERROR:", error);
        throw error;
    }
}