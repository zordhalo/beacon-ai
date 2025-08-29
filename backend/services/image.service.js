import ImageKit from "imagekit";

class ImageService {
  constructor() {
    this.imagekit = null;
  }

  _getImageKitClient() {
    if (!this.imagekit) {
      if (!process.env.IMAGEKIT_ENDPOINT || !process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY) {
        throw new Error("ImageKit environment variables (IMAGEKIT_ENDPOINT, IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY) are required");
      }
      
      this.imagekit = new ImageKit({
        urlEndpoint: process.env.IMAGEKIT_ENDPOINT,
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      });
    }
    return this.imagekit;
  }

  // Get authentication parameters for image upload
  getAuthenticationParameters() {
    try {
      const imagekit = this._getImageKitClient();
      return imagekit.getAuthenticationParameters();
    } catch (error) {
      console.error("ImageKit authentication error:", error);
      throw new Error("Failed to get image upload authentication parameters");
    }
  }

  // Additional methods for image management can be added here
  // For example: uploadImage, deleteImage, getImageUrl, etc.
}

// Export singleton instance
const imageService = new ImageService();
export default imageService;