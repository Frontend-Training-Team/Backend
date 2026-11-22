import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";

// Upload single buffer to Cloudinary
export const uploadToCloudinary = (buffer, folder = "lamsa/products") => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image",
            },
            (error, result) => {
                if (error) return reject(error);
                resolve({
                    url: result.secure_url,
                    publicId: result.public_id,
                });
            }
        );
        Readable.from(buffer).pipe(stream);
    });
};

// Delete image from Cloudinary by publicId
export const deleteFromCloudinary = async (publicId) => {
    if (!publicId) return null;
    return await cloudinary.uploader.destroy(publicId);
};