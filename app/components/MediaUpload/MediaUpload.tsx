"use client";

import { Box, Button, Group, Image, Text } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import { useState } from "react";
import { deleteMedia, uploadMedia } from "@/app/lib/supabase/media";
import type { Media, MediaBucket } from "@/app/lib/types";

interface MediaUploadProps {
  currentMedia?: Media | null;
  onMediaChange: (media: Media | null) => void;
  bucket: MediaBucket;
  folderId: string;
  label: string;
  description?: string;
  accept?: string;
  maxSize?: number; // in MB
}

export default function MediaUpload({
  currentMedia,
  onMediaChange,
  bucket,
  folderId,
  label,
  description,
  accept = "image/*",
  maxSize = 5, // 5MB default
}: MediaUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    if (accept && !file.type.match(accept.replace("*", ".*"))) {
      setError("Invalid file type");
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const fileName = `${Date.now()}-${file.name}`;
      const result = await uploadMedia({
        file,
        fileName,
        bucket,
        folderId,
      });

      if (result.success && result.data) {
        onMediaChange(result.data);
      } else {
        setError(result.message || "Upload failed");
      }
    } catch (err) {
      setError("Upload failed. Please try again.");
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentMedia) return;

    setError(null);
    setIsUploading(true);

    try {
      const result = await deleteMedia({
        bucket,
        paths: [currentMedia.path],
      });

      if (result.success) {
        onMediaChange(null);
      } else {
        setError(result.message || "Delete failed");
      }
    } catch (err) {
      setError("Delete failed. Please try again.");
      console.error("Delete error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box>
      <Text size="sm" fw={500} mb="xs">
        {label}
      </Text>
      {description && (
        <Text size="xs" c="dimmed" mb="md">
          {description}
        </Text>
      )}

      {currentMedia ? (
        <Box>
          <Group justify="space-between" align="flex-start" mb="sm">
            <Text size="sm" c="dimmed">
              Current {label.toLowerCase()}:
            </Text>
            <Button
              size="xs"
              variant="subtle"
              color="red"
              leftSection={<X size={14} />}
              onClick={handleDelete}
              loading={isUploading}
              disabled={isUploading}
            >
              Remove
            </Button>
          </Group>
          <Box
            style={{
              border: "1px solid var(--mantine-color-gray-3)",
              borderRadius: "var(--mantine-radius-md)",
              overflow: "hidden",
            }}
          >
            <Image
              src={currentMedia.url}
              alt={label}
              style={{ maxHeight: 200, objectFit: "contain" }}
            />
          </Box>
        </Box>
      ) : (
        <Dropzone
          onDrop={handleFileSelect}
          onReject={(files) => {
            const error = files[0]?.errors[0];
            if (error?.code === "file-too-large") {
              setError(`File size must be less than ${maxSize}MB`);
            } else if (error?.code === "file-invalid-type") {
              setError("Invalid file type");
            } else {
              setError(error?.message || "File rejected");
            }
          }}
          maxSize={maxSize * 1024 * 1024}
          accept={accept === "image/*" ? IMAGE_MIME_TYPE : { [accept]: [] }}
          multiple={false}
          disabled={isUploading}
        >
          <Group
            justify="center"
            gap="xl"
            mih={120}
            style={{ pointerEvents: "none" }}
          >
            <Dropzone.Accept>
              <Upload size={48} color="var(--mantine-color-blue-6)" />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <X size={48} color="var(--mantine-color-red-6)" />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <ImageIcon size={48} color="var(--mantine-color-gray-5)" />
            </Dropzone.Idle>

            <div>
              <Text size="xl" inline>
                Drag {label.toLowerCase()} here or click to select
              </Text>
              <Text size="sm" c="dimmed" inline mt={7}>
                Max size: {maxSize}MB • {accept}
              </Text>
            </div>
          </Group>
        </Dropzone>
      )}

      {error && (
        <Text size="xs" c="red" mt="xs">
          {error}
        </Text>
      )}
    </Box>
  );
}
