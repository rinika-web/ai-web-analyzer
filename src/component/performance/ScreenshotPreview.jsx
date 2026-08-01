import Image from "next/image"

export default function ScreenshotPreview({ screenshot }) {
  return (
    <div className="
      bg-[#292929]
      rounded-2xl
      p-6
      max-w-5xl
      mx-auto
    ">
        

      <Image
        src={screenshot}
        alt="Website Screenshot"
        width={1200}
        height={800}
        className="
          w-full
          max-h-[600]
          object-contain
          rounded-xl
        "
        priority
      />

    </div>
  )
}