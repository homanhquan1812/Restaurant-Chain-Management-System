import React from "react";
import type { BlogCardItem } from "../../../types/BlogCardItem";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../../components/ui/carousel";

interface BlogCardProps {
  post: BlogCardItem;
  onReadMore: (post: BlogCardItem) => void;
  onDelete: (id: string) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, onReadMore, onDelete }) => {
  console.log("post.photoUrl", post.photoUrl)

  return (
    <div
      className={`flex flex-col bg-white rounded-xl shadow-md overflow-hidden w-full transition-transform duration-300 ${
        post.status === "inactive" ? "opacity-50" : "hover:scale-105"
      }`}
    >
      {/* Image */}

      <div className="pt-4 px-4 pb-2">
        <Carousel>
          <CarouselContent>
            {post.photoUrl.map((url, index) => (
              <CarouselItem key={index}>
                <img
                  loading="lazy"
                  src={url}
                  alt={`Blog image ${index + 1}`}
                  className="w-full h-52 object-cover rounded-md"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-gray-900">{post.title}</h3>
        <p className="text-gray-600 mt-2 line-clamp-3">{post.content}</p>
        <span className="text-sm text-gray-400 mt-2">Date: {post.date}</span>

        <div className="mt-auto flex justify-between items-center gap-2 pt-3">
          <button
            className="text-blue-500 border border-blue-500 px-3 py-1 rounded-md hover:bg-blue-100"
            onClick={() => onReadMore(post)}
          >
            READ MORE
          </button>
          <button
            className="text-red-500 border border-red-500 px-3 py-1 rounded-md hover:bg-red-100"
            onClick={() => onDelete(post.id)}
          >
            DELETE
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
