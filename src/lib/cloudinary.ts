import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: 'dvk4qxbor',
  api_key: '589887883667768',
  api_secret: 'ljXNbcsaXDfUbofjm644Ne7zVNE',
})

export async function uploadBase64Image(base64DataUri: string): Promise<string> {
  const result = await cloudinary.uploader.upload(base64DataUri, {
    folder: 'waqoudk/driver-permits',
  })
  return result.secure_url
}

export default cloudinary
