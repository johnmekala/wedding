export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
}

export function getCloudinaryCloudName(): string {
  return (import.meta.env["VITE_CLOUDINARY_CLOUD_NAME"] || "zoeojmrn").trim();
}

export function getCloudinaryUploadPreset(): string {
  return (import.meta.env["VITE_CLOUDINARY_UPLOAD_PRESET"] || "ml_default").trim();
}

export function getCloudinaryApiKey(): string {
  return (import.meta.env["VITE_CLOUDINARY_API_KEY"] || "").trim();
}

export function getCloudinaryApiSecret(): string {
  return (import.meta.env["VITE_CLOUDINARY_API_SECRET"] || import.meta.env["CLOUDINARY_API_SECRET"] || "").trim();
}

/** @deprecated Legacy export for compatibility */
export const CLOUDINARY_CLOUD_NAME = getCloudinaryCloudName();
/** @deprecated Legacy export for compatibility */
export const CLOUDINARY_UPLOAD_PRESET = getCloudinaryUploadPreset();

async function generateSha1(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-1", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Uploads a media file (image, video, audio) directly to Cloudinary.
 * Uses Signed Upload (with API Key & Secret) so no preset configuration is needed in Cloudinary.
 * Fallbacks to Unsigned Upload if API Secret is not available.
 */
export async function uploadToCloudinary(
  file: File,
  folder = "wedding",
  onProgress?: (progress: number) => void,
): Promise<CloudinaryUploadResponse> {
  const cloudName = getCloudinaryCloudName();
  const apiKey = getCloudinaryApiKey();
  const apiSecret = getCloudinaryApiSecret();
  const uploadPreset = getCloudinaryUploadPreset();

  if (!cloudName) {
    throw new Error(
      "Cloudinary cloud name is missing. Please set VITE_CLOUDINARY_CLOUD_NAME in your .env file.",
    );
  }

  const resourceType = file.type.startsWith("video") || file.type.startsWith("audio") ? "video" : "auto";
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  const formData = new FormData();
  formData.append("file", file);

  if (apiKey && apiSecret) {
    // Signed Upload - does not require an unsigned upload preset in Cloudinary!
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const paramsToSign = folder ? `folder=${folder}&timestamp=${timestamp}` : `timestamp=${timestamp}`;
    const signature = await generateSha1(paramsToSign + apiSecret);

    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    if (folder) formData.append("folder", folder);
    formData.append("signature", signature);
  } else {
    // Unsigned Upload fallback
    formData.append("upload_preset", uploadPreset);
    if (folder) formData.append("folder", folder);
  }

  return new Promise<CloudinaryUploadResponse>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          const secureUrl = response.secure_url || response.url;

          if (!secureUrl || secureUrl.startsWith("blob:") || secureUrl.startsWith("file:")) {
            reject(new Error("Cloudinary returned an invalid or temporary URL. Upload aborted."));
            return;
          }

          resolve({
            secure_url: secureUrl,
            public_id: response.public_id || "",
            width: response.width || 0,
            height: response.height || 0,
            format: response.format || file.name.split(".").pop() || "",
            resource_type: response.resource_type || resourceType,
            created_at: response.created_at || new Date().toISOString(),
          });
        } catch (err) {
          reject(new Error("Failed to parse Cloudinary API response."));
        }
      } else {
        try {
          const errRes = JSON.parse(xhr.responseText);
          let errMsg = errRes.error?.message || `Cloudinary upload failed with HTTP status ${xhr.status}.`;
          if (errMsg.includes("Upload preset not found")) {
            errMsg += " Signed upload signature will bypass preset requirements.";
          }
          reject(new Error(errMsg));
        } catch {
          reject(new Error(`Cloudinary upload failed with HTTP status ${xhr.status}.`));
        }
      }
    };

    xhr.onerror = () =>
      reject(new Error("Network error during Cloudinary upload. Please check your internet connection."));

    xhr.ontimeout = () => reject(new Error("Cloudinary upload request timed out. Please try again."));

    xhr.send(formData);
  });
}



