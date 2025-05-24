import React from "react";
import BlogList from "./BlogList";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
  DialogClose
} from "../../../components/ui/dialog";

interface BlogListModalProps {
  open: boolean;
  onClose: () => void;
}

const BlogListModal: React.FC<BlogListModalProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={(open: any) => !open && onClose()}>
      <DialogContent
        className="w-full max-w-screen-md sm:max-w-screen-lg h-[90vh] sm:h-[90vh] overflow-y-auto sm:rounded-xl p-4 sm:p-6 bg-gray-50"
      >
        <div className="flex justify-between items-center mb-4">
          <DialogTitle>Blog List</DialogTitle>
          <DialogClose />
        </div>
        <BlogList />
      </DialogContent>
    </Dialog>
  );
};

export default BlogListModal;