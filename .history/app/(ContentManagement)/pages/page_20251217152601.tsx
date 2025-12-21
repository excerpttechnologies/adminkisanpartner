"use client";

import { useState, useRef } from "react";
import { FiEdit, FiPlus } from "react-icons/fi";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import JoditEditor from "jodit-react";

/* ================= MODAL STYLE ================= */
const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30rem",
  bgcolor: "background.paper",
  borderRadius: 1,
  boxShadow: 24,
  p: 2,
};

/* ================= PAGE DATA ================= */
const initialPages = [
  {
    id: 1,
    name: "Privacy Policy",
    content: "<p>Privacy policy content goes here...</p>",
  },
  {
    id: 2,
    name: "Terms & Conditions",
    content: "<p>Terms & conditions content goes here...</p>",
  },
  {
    id: 3,
    name: "About Us",
    content: "<p>About us content goes here...</p>",
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
    setOpen(false);
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="mb-6 flex justify-between items-center">
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
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          <FiPlus />
          Add Page
        </button>
      </div>

      {/* CARD */}
      <div className="bg-white rounded shadow border border-zinc-200">
        {/* TABLE HEADER */}
        <div className="grid grid-cols-2 px-6 text-sm py-3 border-b border-zinc-400 text-gray-700 font-semibold">
          <div>Page Name</div>
          <div className="text-right">Actions</div>
        </div>

        {/* TABLE BODY */}
        {pages.map((page) => (
          <div
            key={page.id}
            className="grid grid-cols-2 px-6 py-2 text-sm border-b border-zinc-300 last:border-b-0 items-center hover:bg-gray-50"
          >
            <div className="text-gray-800 font-medium">
              {page.name}
            </div>

            <div className="text-right">
              <button
                onClick={() => handleEdit(page)}
                className="inline-flex items-center justify-center w-9 h-9 rounded-full border hover:bg-gray-100 text-gray-600"
                title="Edit"
              >
                <FiEdit className="text-lg" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= ADD / EDIT MODAL ================= */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" className="mb-4">
            {isEdit ? "Edit Page" : "Add Page"}
          </Typography>

          {/* PAGE NAME */}
          <TextField
            fullWidth
            label="Page Name"
            value={pageName}
            onChange={(e) => setPageName(e.target.value)}
            className="mb-4"
          />

          {/* JODIT EDITOR */}
          <div className=" rounded my-3">
            <JoditEditor
              ref={editorRef}
              value={content}
              onBlur={(newContent) => setContent(newContent)}
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outlined" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              className="bg-blue-600"
            >
              {isEdit ? "Update" : "Save"}
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
