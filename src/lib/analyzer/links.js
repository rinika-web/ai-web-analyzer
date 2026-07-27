export function getLinks($) {

    let internal = 0
    let external = 0

    $("a").each((_, link) => {

        const href = $(link).attr("href")

        if (!href) return

        if (
            href.startsWith("/") ||
            href.startsWith("#")
        ) {
            internal++
        } else {
            external++
        }

    })

    return {
        internal,
        external
    }

}