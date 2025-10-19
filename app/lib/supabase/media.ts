"use client";

import { createClient } from "@/app/lib/supabase/client";
import type { Media, MediaBucket } from "../types";

type UploadMediaParams = {
  file: File;
  fileName: string;
  bucket: MediaBucket;
  folderId: string; // userID or raceID
};

type UploadMediaResponse = {
  success: boolean;
  message: string;
  data: Media | null;
};

export async function uploadMedia({
  file,
  fileName,
  bucket,
  folderId,
}: UploadMediaParams): Promise<UploadMediaResponse> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(`${folderId}/${fileName}`, file);
    if (error) {
      console.error("Error uploading media:", error);
      return { success: false, message: "Error uploading media", data: null };
    }

    const publicUrl = `${
      supabase.storage.from(bucket).getPublicUrl(data.path).data.publicUrl
    }`;
    return {
      success: true,
      message: "Media uploaded successfully",
      data: { url: publicUrl, path: data.path },
    };
  } catch (error) {
    console.error("Error uploading media:", error);
    return { success: false, message: "Error uploading media", data: null };
  }
}

type DeleteMediaParams = {
  bucket: MediaBucket;
  paths: string[];
};

type DeleteMediaResponse = {
  success: boolean;
  message: string;
};

export async function deleteMedia({
  bucket,
  paths,
}: DeleteMediaParams): Promise<DeleteMediaResponse> {
  const supabase = createClient();

  try {
    const { error } = await supabase.storage.from(bucket).remove(paths);
    if (error) {
      console.error("Error deleting media:", error);
      return { success: false, message: "Error deleting media" };
    }
    return { success: true, message: "Media deleted successfully" };
  } catch (error) {
    console.error("Error deleting media:", error);
    return { success: false, message: "Error deleting media" };
  }
}
