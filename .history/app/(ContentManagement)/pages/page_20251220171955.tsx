"use client";

import { useState, useRef, Suspense } from "react";
import dynamic from "next/dynamic";
import { FiEdit, FiPlus } from "react-icons/fi";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";

// Dynamically import JoditEditor with no SSR
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => <div className="h-64 flex items-center justify-center"><CircularProgress /></div>
});

/* ================= MODAL STYLE ================= */
const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "80%", md: "50rem" },
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
  maxHeight: "90vh",
  overflow: "auto",
};

/* ================= PAGE DATA ================= */
const initialPages = [
  {
    id: 1,
    name: "Privacy Policy",
    content: "<h1>Privacy Policy</h1><p>Your privacy is important to us. This privacy policy explains what personal data we collect and how we use it.</p>",
  },
  {
    id: 2,
    name: "Terms & Conditions",
    content: "<h1>Terms & Conditions</h1><p>Please read these terms and conditions carefully before using our service.</p>",
  },
  {
    id: 3,
    name: "About Us",
    content: "<h1>About Us</h1><p>We are a company dedicated to providing the best services to our customers.</p>",
  },
  {
    id: 4,
    name: "Refund Policy",
    content: "<h1>Refund Policy</h1><p>Our refund policy ensures customer satisfaction with clear guidelines for returns and refunds.</p>",
  },
  {
    id: 5,
    name: "Shipping Policy",
    content: "<h1>Shipping Policy</h1><p>Learn about our shipping methods, delivery times, and shipping costs.</p>",
  },
  {
    id: 6,
    name: "Contact Us",
    content: "<h1>Contact Us</h1><p>Get in touch with our support team for any queries or assistance.</p>",
  },
];

export default function PagesModule() {
  const editorRef = useRef(null);

  const [pages, setPages] = useState(initialPages);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentPage, setCurrentPage] = useState<any>(null);
  const [pageName, setPageName] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= ADD PAGE ================= */
  const handleAdd = () => {
    setIsEdit(false);
    setCurrentPage(null);
    setPageName("");
    setContent("");
    setOpen(true);
  };

  /* ================= EDIT PAGE ================= */
  const handleEdit = (page: any) => {
    setIsEdit(true);
    setCurrentPage(page);
    setPageName(page.name);
    setContent(page.content);
    setOpen(true);
  };

  /* ================= SAVE / UPDATE ================= */
  const handleSave = () => {
    if (!pageName.trim()) {
      alert("Please enter a page name");
      return;
    }

    if (!content.trim() || content === "<p><br></p>") {
      alert("Please enter page content");
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (isEdit) {
        setPages((prev) =>
          prev.map((p) =>
            p.id === currentPage.id
              ? { ...p, name: pageName, content }
              : p
          )
        );
      } else {
        setPages((prev) => [
          ...prev,
          {
            id: Date.now(),
            name: pageName,
            content,
          },
        ]);
      }
      setLoading(false);
      setOpen(false);
    }, 500);
  };

  /* ================= DELETE PAGE ================= */
  const handleDelete = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      setPages(pages.filter(page => page.id !== id));
    }
  };

  /* ================= PREVIEW HTML CONTENT ================= */
  const stripHtmlTags = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Pages Module
          </h1>
          <p className="text-gray-500 mt-1">
            Manage static content pages for your marketplace.
          </p>
        </div>

        {/* ADD BUTTON */}
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition-colors text-sm font-medium"
        >
          <FiPlus className="text-lg" />
          Add New Page
        </button>
      </div>

      {/* CARD */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        {/* TABLE HEADER */}
        <div className="hidden sm:grid grid-cols-3 px-6 text-sm py-4 border-b border-gray-200 bg-gray-50 text-gray-700 font-semibold">
          <div className="col-span-1">Page Name</div>
          <div className="col-span-1">Preview</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* TABLE BODY */}
        {pages.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No pages found. Click "Add New Page" to create one.
          </div>
        ) : (
          pages.map((page) => (
            <div
              key={page.id}
              className="grid grid-cols-1 sm:grid-cols-3 px-4 sm:px-6 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
            >
              {/* Page Name */}
              <div className="mb-2 sm:mb-0">
                <div className="text-gray-700 font-medium text-lg sm:text-base">
                  {page.name}
                </div>
                <div className="text-gray-500 text-xs sm:text-sm mt-1">
                  ID: {page.id}
                </div>
              </div>

              {/* Content Preview */}
              <div className="mb-3 sm:mb-0">
                <div className="text-gray-600 text-sm line-clamp-2">
                  {stripHtmlTags(page.content).substring(0, 100)}
                  {stripHtmlTags(page.content).length > 100 ? "..." : ""}
                </div>
                <div className="text-gray-400 text-xs mt-1">
                  {stripHtmlTags(page.content).length} characters
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-start sm:justify-end gap-2">
                <button
                  onClick={() => handleEdit(page)}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-blue-500 hover:bg-blue-50 text-blue-600 transition-colors"
                  title="Edit Page"
                >
                  <FiEdit className="text-lg" />
                </button>
                <button
                  onClick={() => handleDelete(page.id, page.name)}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-red-500 hover:bg-red-50 text-red-600 transition-colors"
                  title="Delete Page"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats Footer */}
      <div className="mt-6 text-sm text-gray-600">
        Showing {pages.length} page{pages.length !== 1 ? 's' : ''}
      </div>

      {/* ================= ADD / EDIT MODAL ================= */}
      <Modal open={open} onClose={() => !loading && setOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" className="mb-4 font-semibold text-gray-800">
            {isEdit ? "Edit Page" : "Add New Page"}
          </Typography>

          {/* PAGE NAME */}
          <TextField
            fullWidth
            label="Page Name"
            value={pageName}
            onChange={(e) => setPageName(e.target.value)}
            className="mb-6"
            disabled={loading}
            required
          />

          {/* JODIT EDITOR */}
          <div className="mb-6">
            <Typography variant="subtitle2" className="mb-2 text-gray-700 font-medium">
              Page Content
            </Typography>
            <Suspense fallback={<div className="h-64 flex items-center justify-center"><CircularProgress /></div>}>
              <JoditEditor
                ref={editorRef}
                value={content}
                onChange={(newContent: string) => setContent(newContent)}
                config={{
                  readonly: loading,
                  placeholder: "Start typing your page content here...",
                  height: 300,
                  toolbarAdaptive: false,
                  buttons: [
                    'bold', 'italic', 'underline', 'strikethrough',
                    'ul', 'ol', 'outdent', 'indent',
                    'font', 'fontsize', 'brush', 'paragraph',
                    'image', 'video', 'table', 'link',
                    'align', 'undo', 'redo', 'fullsize'
                  ],
                }}
              />
            </Suspense>
            <Typography variant="caption" className="text-gray-500 mt-2 block">
              Use the toolbar to format your content. Supports text formatting, images, tables, and more.
            </Typography>
          </div>

          {/* CHARACTER COUNT */}
          <div className="mb-6 text-sm text-gray-600">
            Content length: {stripHtmlTags(content).length} characters
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <Button 
              variant="outlined" 
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={loading || !pageName.trim() || !content.trim()}
              className="bg-blue-600 hover:bg-blue-700"
              startIcon={loading && <CircularProgress size={16} color="inherit" />}
            >
              {loading ? "Saving..." : isEdit ? "Update Page" : "Save Page"}
            </Button>
          </div>
        </Box>
      </Modal>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}