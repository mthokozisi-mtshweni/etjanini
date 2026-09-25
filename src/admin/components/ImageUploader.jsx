import { useState } from "react";
import {
  FiCheck,
  FiImage,
  FiLoader,
  FiUploadCloud,
  FiX,
} from "react-icons/fi";

const CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const UPLOAD_URL =
  `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

const MAX_FILE_SIZE = 10 * 1024 * 1024;
// const MIN_WIDTH = 800;
// const MIN_HEIGHT = 500;

function ImageUploader({
  value = "",
  onChange,
  label = "Image",
}) {
  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const validateImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
      const image = new Image();

      const objectUrl =
        URL.createObjectURL(file);

      image.onload = () => {
        const { width, height } = image;

        URL.revokeObjectURL(objectUrl);

        if (
          width < MIN_WIDTH ||
          height < MIN_HEIGHT
        ) {
          reject(
  new Error(
    `Image is too small (${width} × ${height}px). Minimum required is ${MIN_WIDTH} × ${MIN_HEIGHT}px.`
  )
);

          return;
        }

        resolve({
          width,
          height,
        });
      };

      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);

        reject(
          new Error(
            "Unable to read this image."
          )
        );
      };

      image.src = objectUrl;
    });
  };

  const handleUpload = async (event) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    setError("");
    setSuccess("");

    /*
     * FILE TYPE
     */

    if (!file.type.startsWith("image/")) {
      setError(
        "Please select a valid image file."
      );

      event.target.value = "";

      return;
    }

    /*
     * FILE SIZE
     */

    if (file.size > MAX_FILE_SIZE) {
      setError(
        "Image must be smaller than 10 MB."
      );

      event.target.value = "";

      return;
    }

    /*
     * CLOUDINARY CONFIGURATION
     */

    if (
      !CLOUD_NAME ||
      !UPLOAD_PRESET
    ) {
      setError(
        "Cloudinary configuration is missing."
      );

      console.error(
        "Missing VITE_CLOUDINARY_CLOUD_NAME or VITE_CLOUDINARY_UPLOAD_PRESET."
      );

      event.target.value = "";

      return;
    }

    try {
      setUploading(true);

      /*
       * IMAGE DIMENSIONS
       */

      //await validateImageDimensions(file);

      /*
       * CLOUDINARY UPLOAD
       */

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      formData.append(
        "upload_preset",
        UPLOAD_PRESET
      );

      const response =
        await fetch(
          UPLOAD_URL,
          {
            method: "POST",
            body: formData,
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error?.message ||
            "Image upload failed."
        );
      }

      /*
       * SAVE CLOUDINARY URL
       */

      onChange(
        data.secure_url
      );

      setSuccess(
        "Image uploaded successfully."
      );
    } catch (err) {
      console.error(
        "Cloudinary upload error:",
        err
      );

      setError(
        err.message ||
          "Unable to upload image."
      );
    } finally {
      setUploading(false);

      event.target.value = "";
    }
  };

  const removeImage = () => {
    onChange("");

    setError("");
    setSuccess("");
  };

  return (
    <div className="admin-image-uploader">

      <label className="admin-image-uploader-label">
        {label}
      </label>

      {value ? (
        <div className="admin-uploaded-image">

          <img
            src={value}
            alt="Uploaded preview"
          />

          <div className="admin-uploaded-image-overlay">

            <span>
              <FiCheck />
              Image uploaded
            </span>

            <button
              type="button"
              onClick={removeImage}
              disabled={uploading}
            >
              <FiX />
              Remove
            </button>

          </div>

        </div>
      ) : (
        <label className="admin-image-upload-box">

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleUpload}
            disabled={uploading}
          />

          {uploading ? (
            <>
              <FiLoader className="admin-upload-spinner" />

              <strong>
                Uploading image...
              </strong>

              <span>
                Please wait
              </span>
            </>
          ) : (
            <>
              <div className="admin-upload-icon">
                <FiUploadCloud />
              </div>

              <strong>
                Upload an image
              </strong>

              <span>
                Click to choose an image
              </span>

              <small>
  JPG, PNG or WEBP • Minimum 800 × 500px • Max 10 MB
</small>
            </>
          )}

        </label>
      )}

      {!value &&
        !uploading && (
          <div className="admin-image-upload-hint">
            <FiImage />

           Recommended: high-quality landscape image
Minimum: 800 × 500px
          </div>
        )}

      {success && (
        <div className="admin-upload-success">
          <FiCheck />
          {success}
        </div>
      )}

      {error && (
        <div className="admin-upload-error">
          <FiX />
          {error}
        </div>
      )}

    </div>
  );
}

export default ImageUploader;