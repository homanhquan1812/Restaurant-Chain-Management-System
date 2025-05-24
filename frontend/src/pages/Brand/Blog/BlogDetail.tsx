import React from "react";
import type { BlogCardItem } from "../../../types/BlogCardItem";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../../components/ui/carousel";

interface BlogDetailProps {
  blog: BlogCardItem;
  onClose: () => void;
}
const BlogDetail: React.FC<BlogDetailProps> = ({ blog, onClose }) => {
  const formattedDate = blog.date
    ? new Date(blog.date).toLocaleString()
    : "No date provided";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl relative">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">
              Blog Detail -{" "}
              <span className="text-red-600">{blog.title}</span>
            </h2>
            <p className="text-sm text-gray-400">Date: {formattedDate}</p>
          </div>

          {/* Trạng thái */}
          <div className="flex items-center gap-2">
            <span
              className={`text-white text-sm px-3 py-1 rounded-full ${
                blog.status === "active"
                  ? "bg-green-600"
                  : "bg-red-500"
              }`}
            >
              {blog.status === "active" ? "Active" : "Inactive"}
            </span>

            {/* Nút Close */}
            <button
              className="text-gray-500 hover:text-black text-xl"
              onClick={onClose}
            >
              &times;
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {blog.photoUrl && blog.photoUrl.length > 0 && (
            <Carousel>
              <CarouselContent>
                {blog.photoUrl.map((url, index) => (
                  <CarouselItem key={index}>
                    <img
                      src={url}
                      alt={`Detail image ${index + 1}`}
                      className="w-full object-contain rounded max-h-[400px]"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          )}


          <div
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center gap-3 p-4 border-t">
          <button className="px-4 py-1 border border-red-500 text-red-500 rounded hover:bg-red-50">
            Delete
          </button>
          <button className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600">
            Inactive
          </button>
          <button className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
