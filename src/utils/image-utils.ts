import imageCompression from "browser-image-compression"

export const compressAndUploadImages = async (files: File[]): Promise<string[]> => {
  const maxSize = 5 * 1024 * 1024

  const validFiles = await Promise.all(
    files.map(async (file) => {
      if (file.size > maxSize || !file.type.startsWith("image/")) {
        alert(`${file.name} no es válido. Solo imágenes (PNG/JPG) hasta 5MB.`)
        return null
      }

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      }

      try {
        const compressedFile = await imageCompression(file, options)
        return compressedFile
      } catch (error) {
        console.error("Error al comprimir:", error)
        alert(`Error al comprimir ${file.name}.`)
        return null
      }
    }),
  ).then((results) => results.filter((file) => file !== null) as File[])

  if (validFiles.length === 0) return []

  const uploadPromises = validFiles.map(async (file) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "vehicle-upload")

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData },
    )

    if (!res.ok) throw new Error(await res.text())
    const data = await res.json()
    return data.secure_url
  })

  return await Promise.all(uploadPromises)
}
