"use client";

import type React from "react";
import { useState, useRef } from "react";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  onUpload: (base64Image: string) => void;
}

const resizeImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const size = 150;
      canvas.width = size;
      canvas.height = size;

      if (!ctx) {
        URL.revokeObjectURL(img.src);
        return reject(new Error("Could not get canvas context"));
      }

      const scale = Math.max(size / img.width, size / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;

      const x = (size - scaledWidth) / 2;
      const y = (size - scaledHeight) / 2;

      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, size, size);

      ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

      const base64 = canvas.toDataURL("image/jpeg", 0.8);
      URL.revokeObjectURL(img.src);
      resolve(base64);
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error("Failed to load image"));
    };
  });
};

export default function ImageUploader({ onUpload }: ImageUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setError(null);
      setIsLoading(true);

      const resizedImage = await resizeImage(file);
      onUpload(resizedImage);
    } catch (err) {
      setError("Failed to process image. Please try again.");
      console.error("Error processing image:", err);
    } finally {
      setIsLoading(false);
      if (e.target) {
        e.target.value = "";
      }
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="fileInput"
      />

      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
      >
        <Edit className="mr-2 h-4 w-4" />
        {isLoading ? "Processing..." : "Upload Profile Picture"}
      </Button>

      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  );
}
