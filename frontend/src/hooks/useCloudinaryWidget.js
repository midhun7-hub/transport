import React, { useEffect } from 'react';

// Simplified Hook to use Cloudinary Widget
const useCloudinaryWidget = (onUploadSuccess) => {
    useEffect(() => {
        // Just checking if it loaded
        if (!window.cloudinary) {
            console.error("Cloudinary widget script not loaded");
        }
    }, []);

    const openWidget = () => {
        if (window.cloudinary) {
            const widget = window.cloudinary.createUploadWidget(
                {
                    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
                    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET, // Ensure this exists as unsigned in your Cloudinary account
                    sources: ['local', 'url', 'camera'],
                    multiple: false,
                    maxFiles: 1
                },
                (error, result) => {
                    if (!error && result && result.event === "success") {
                        onUploadSuccess(result.info.secure_url);
                    }
                }
            );
            widget.open();
        }
    };

    return openWidget;
};

export default useCloudinaryWidget;
