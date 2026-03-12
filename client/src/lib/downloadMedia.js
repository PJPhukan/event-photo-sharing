const getFileExtension = (url = "", resourceType = "image") => {
  const sanitizedUrl = url.split("?")[0];
  const parts = sanitizedUrl.split(".");
  const extension = parts.length > 1 ? parts.pop() : "";

  if (extension) {
    return extension;
  }

  if (resourceType === "video") {
    return "mp4";
  }

  return "jpg";
};

const sanitizeFilename = (value = "download") =>
  value.replace(/[<>:"/\\|?*\x00-\x1F]/g, "").trim() || "download";

const downloadMedia = async ({ url, filename, resourceType }) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to download file");
  }

  const blob = await response.blob();
  const blobUrl = window.URL.createObjectURL(blob);
  const extension = getFileExtension(url, resourceType);
  const link = document.createElement("a");

  link.href = blobUrl;
  link.download = `${sanitizeFilename(filename)}.${extension}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.URL.revokeObjectURL(blobUrl);
};

export { downloadMedia };
