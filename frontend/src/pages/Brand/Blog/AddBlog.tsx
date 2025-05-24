import React, { useState } from "react";
import type { BrandItem } from "../../../types/BrandItem";
import { Editor } from "@tinymce/tinymce-react";
import { Box, Typography } from "@mui/material";

interface AddBlogProps {
  brand: BrandItem;
  onClose: () => void;
}

const AddBlog: React.FC<AddBlogProps> = ({ brand, onClose }) => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  const handleSubmit = () => {
    const blog = {
      title,
      summary,
      description,
      imageUrl: imageFile ? URL.createObjectURL(imageFile) : "",
      authorImageUrl: brand.logo,
      date: new Date().toISOString(),
      status: "active",
    };

    console.log("New Blog:", blog);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-md relative">
        <div className="text-lg font-semibold mb-4">Create Blog</div>

        {/* Title + Type */}
        <div className="flex space-x-4 mb-4">
          <div className="w-2/3">
            <label className="text-sm font-medium text-red-500">* Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter product name"
              className="border border-neutral-300 mt-1 px-4 py-2 rounded w-full"
            />
          </div>
          <div className="w-1/3">
            <label className="text-sm font-medium">Type</label>
            <input
              type="text"
              value={brand.name}
              disabled
              className="border border-neutral-300 mt-1 px-4 py-2 rounded w-full bg-gray-100 text-gray-500"
            />
          </div>
        </div>

        {/* Summary + Upload */}
        <div className="flex space-x-4 mb-4">
          <div className="w-1/2">
            <label className="text-sm font-medium text-red-500">* Summary</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="border border-neutral-300 mt-1 px-4 py-2 rounded w-full"
              rows={4}
              placeholder="Enter summary"
            />
          </div>

          <div className="w-1/2">
            <Typography fontSize={14} fontWeight={500} color="error">
              * Default Image (Just 1 image)
            </Typography>
            <Box
              mt={1}
              height={108}
              border="1px dashed #ccc"
              borderRadius={1}
              display="flex"
              justifyContent="center"
              alignItems="center"
              position="relative"
              sx={{ cursor: "pointer", overflow: "hidden" }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{
                  opacity: 0,
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  cursor: "pointer",
                }}
              />
              {imageFile ? (
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                />
              ) : (
                <Box textAlign="center" color="gray">
                  + Upload
                  <Typography fontSize={11}>640×640, &lt; 2MB</Typography>
                </Box>
              )}
            </Box>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="text-sm font-medium text-red-500">* Description</label>
          <div className="border border-neutral-300 mt-1 rounded">
            <Editor
              apiKey="no-api-key"
              value={description}
              onEditorChange={(content) => setDescription(content)}
              init={{
                height: 200,
                menubar: false,
                plugins: ["link", "lists", "image", "code"],
                toolbar: "bold italic underline | bullist numlist | image | undo redo",
                branding: false,
              }}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="border border-red-500 text-red-500 px-4 py-1 rounded hover:bg-red-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBlog;
