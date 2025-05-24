import React from "react"
import { LuImageUp } from "react-icons/lu"
import { X } from "lucide-react"

interface ImageUploadProps {
  file: File | null
  onChange: (file: File | null) => void
  error?: string
  label?: string
}

const ImageUpload: React.FC<ImageUploadProps> = ({ file, onChange, error, label }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0])
    }
  }

  return (
    <div className="flex flex-col items-center space-y-2 relative">
      {file && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="absolute -top-2 -right-2 bg-white z-20 rounded-full shadow-md p-1 hover:bg-red-500 hover:text-white transition-all overflow-visible"
          title="Remove image"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <label htmlFor="image-upload" className="cursor-pointer">
        <div className="relative w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
          {file ? (
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <LuImageUp className="w-6 h-6 text-gray-400" />
          )}
        </div>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {label && (
        <span className="text-sm text-blue-600 font-medium">
          {label} <span className="text-red-500">*</span>
        </span>
      )}

      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  )
}

export default ImageUpload
