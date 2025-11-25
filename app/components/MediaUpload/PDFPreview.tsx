"use client";

import { Box } from "@mantine/core";
import type { Media } from "@/app/lib/types";

interface PDFPreviewProps {
  media: Media;
  height?: string | number;
}

export default function PDFPreview({ media, height = 600 }: PDFPreviewProps) {
  return (
    <Box
      style={{
        border: "1px solid var(--mantine-color-gray-3)",
        borderRadius: "var(--mantine-radius-md)",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <iframe
        src={`${media.url}#toolbar=0`}
        width="100%"
        height={height}
        style={{
          border: "none",
          display: "block",
        }}
        title="PDF Document"
      />
    </Box>
  );
}
