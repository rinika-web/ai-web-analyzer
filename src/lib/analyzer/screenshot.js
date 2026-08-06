import fs from "fs/promises"
import path from "path"

export async function takeScreenshot(page) {

    const publicDir = path.join(process.cwd(), "public")

    const files = await fs.readdir(publicDir)

    for (const file of files) {

        if (file.startsWith("website-")) {

            try {

                await fs.unlink(
                    path.join(publicDir, file)
                )

            } catch (error) {

                console.log(
                    "Could not delete screenshot:",
                    file
                )

            }

        }
    }


    const fileName = `website-${Date.now()}.png`


    await page.screenshot({

        path: path.join(publicDir, fileName),

        fullPage: false

    })


    return `/${fileName}`

}