import puppeteer from "puppeteer";

export async function GET(req, { params }) {

    let browser;

    try {
const authHeader = req.headers.get("authorization");

if (!authHeader) {
    return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
    );
}

const token = authHeader.split(" ")[1];

const user = verifyToken(token);

if (!user) {
    return Response.json(
        { error: "Invalid token" },
        { status: 401 }
    );
}
        const { id } = await params;

        browser = await puppeteer.launch({
            headless: true,
        });

        const page = await browser.newPage();

        await page.goto(
            `http://localhost:3000/report/${id}`,
            {
                waitUntil: "networkidle0",
            }
        );

        const pdf = await page.pdf({
            format: "A4",
            printBackground: true,
        });

        return new Response(pdf, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="report-${id}.pdf"`,
            },
        });

        if (analysis.userId !== user.userId) {
    return Response.json(
        { error: "Access denied" },
        { status: 403 }
    );
}


if (analysis.userId !== user.userId) {
    return Response.json(
        { error: "Access denied" },
        { status: 403 }
    );
}


    } catch (error) {

        return Response.json(
            {
                error: error.message,
            },
            {
                status: 500,
            }
        );

    } finally {

        if (browser) {
            await browser.close();
        }

    }

}