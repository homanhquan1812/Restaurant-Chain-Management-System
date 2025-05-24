import React, { useEffect, useState, useMemo } from "react";
import BlogCard from "./BlogCard";
import BlogDetail from "./BlogDetail";
import CustomPagination from "../../../components/CustomPagination/CustomPagination";
import FilterBarBlog from "./FilterBarBlog";
import AddBlog from "./AddBlog";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { fetchBlogs } from "../../../redux/slices/blogSlice";
import type { RootState } from "../../../redux/store";
import type { BlogCardItem } from "../../../types/BlogCardItem";
import type {BrandItem} from "../../../types/BrandItem";
import { useTranslation } from "react-i18next";

const BlogList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: rawBlogs, loading, error } = useAppSelector(
    (state: RootState) => state.blogs
  );

  const [selectedBlog, setSelectedBlog] = useState<BlogCardItem | null>(null);
  const [showAddBlog, setShowAddBlog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const blogs = useMemo(
    () =>
      rawBlogs.map((b) => ({
        id: b.id,
        title: b.title,
        content: b.content,
        photoUrl: Array.isArray(b.photo) ? b.photo : [b.photo],
        authorId: b.staff_id,
        status: b.status || "active",
        date: new Date(b.date_added).toLocaleDateString(),
      })),
    [rawBlogs]
  );


  const totalPages = Math.ceil(blogs.length / itemsPerPage);
  const paginatedBlogs = blogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);
  const mockBrand: BrandItem = {
    id: "demo-id",
    displayId: "000001",
    name: "Demo Brand",
    logo: "/default.png",
    link: "https://demo-brand.com",
    description: "This is a demo brand used for blog creation.",
    status: "Active",
    opening_hours: "08:00",
    closed_hours: "22:00",
    date_added: new Date().toISOString(),
  };
  
  return (
    <div className="mt-4 space-y-6">
      {/* Header with Filter and Add Button */}
      <div className="flex flex-row md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <FilterBarBlog />
        </div>
        <div className="text-right">
          <button
            onClick={() => setShowAddBlog(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 "
          >
            Add New Blog
          </button>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {paginatedBlogs.map((post) => (
          <BlogCard
            key={post.id}
            post={post}
            onReadMore={setSelectedBlog}
            onDelete={() => console.log("Delete blog", post.id)}
          />
        ))}
      </div>

      {/* Pagination */}
      {blogs.length > itemsPerPage && (
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={blogs.length}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}

      {/* Loading/Error */}
      {loading && (
        <p className="text-center text-sm text-gray-500 mt-4">Loading blogs...</p>
      )}
      {error && (
        <p className="text-center text-red-500 mt-4">{error}</p>
      )}

      {/* Modals */}
      {selectedBlog && (
        <BlogDetail blog={selectedBlog} onClose={() => setSelectedBlog(null)} />
      )}
      {showAddBlog && (
        <AddBlog brand={mockBrand} onClose={() => setShowAddBlog(false)} />
      )}
    </div>
  );
};

export default BlogList;
