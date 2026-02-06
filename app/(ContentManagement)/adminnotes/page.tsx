// 'use client';

// import { useState, useRef, useEffect } from 'react';

// interface AdminNote {
//   _id: string;
//   name: string;
//   file?: string;
//   status: 'active' | 'draft' | 'inactive';
//   content: string;
//   createdAt: string;
// }

// export default function AdminNotesPage() {
//   const [notes, setNotes] = useState<AdminNote[]>([]);
//   const [notepadContent, setNotepadContent] = useState('');
//   const [noteName, setNoteName] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [editingNote, setEditingNote] = useState<AdminNote | null>(null);
//   const [uploadedFile, setUploadedFile] = useState<File | null>(null);
//   const [activeTab, setActiveTab] = useState<'upload' | 'notepad'>('upload');
//   const [loading, setLoading] = useState(false);
//   const [saveLoading, setSaveLoading] = useState(false);
  
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Fetch notes
//   const fetchNotes = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`/api/adminnote?search=${encodeURIComponent(searchQuery)}`);
//       const data = await res.json();
//       if (data.success && data.data) {
//         setNotes(data.data);
//       } else {
//         console.error('Failed to fetch notes:', data.error);
//       }
//     } catch (error) {
//       console.error('Failed to fetch notes:', error);
//       alert('Failed to fetch notes. Please check your connection.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchNotes();
//   }, [searchQuery]);

//   // Handle file upload
//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setUploadedFile(file);
//       if (!noteName && !editingNote) {
//         setNoteName(file.name.replace(/\.[^/.]+$/, ""));
//       }
//     }
//   };

//   // Save note
//   const saveNote = async () => {
//     if (!noteName.trim()) {
//       alert('Please enter a note name');
//       return;
//     }

//     setSaveLoading(true);

//     try {
//       let res;
      
//       // For file uploads, use FormData
//       if (activeTab === 'upload' && uploadedFile) {
//         const formData = new FormData();
//         formData.append('name', noteName);
//         formData.append('status', editingNote ? editingNote.status : 'draft');
//         formData.append('content', notepadContent);
//         formData.append('file', uploadedFile);

//         if (editingNote) {
//           res = await fetch(`/api/adminnote/${editingNote._id}`, {
//             method: 'PUT',
//             body: formData
//           });
//         } else {
//           res = await fetch('/api/adminnote', {
//             method: 'POST',
//             body: formData
//           });
//         }
//       } 
//       // For notepad, use JSON
//       else {
//         const noteData = {
//           name: noteName,
//           file: null,
//           status: editingNote ? editingNote.status : 'draft',
//           content: notepadContent,
//         };

//         if (editingNote) {
//           res = await fetch(`/api/adminnote/${editingNote._id}`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(noteData)
//           });
//         } else {
//           res = await fetch('/api/adminnote', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(noteData)
//           });
//         }
//       }
      
//       const result = await res.json();
//       if (result.success) {
//         fetchNotes();
//         resetForm();
//         alert(editingNote ? 'Note updated successfully!' : 'Note created successfully!');
//       } else {
//         alert(result.error || `Failed to ${editingNote ? 'update' : 'create'} note`);
//       }
      
//     } catch (error) {
//       console.error('Failed to save note:', error);
//       alert('Failed to save note. Please try again.');
//     } finally {
//       setSaveLoading(false);
//     }
//   };

//   // Reset form
//   const resetForm = () => {
//     setNoteName('');
//     setNotepadContent('');
//     setUploadedFile(null);
//     setEditingNote(null);
//     setActiveTab('upload');
//     if (fileInputRef.current) fileInputRef.current.value = '';
//   };

//   // Handle edit
//   const handleEdit = (note: AdminNote) => {
//     setEditingNote(note);
//     setNoteName(note.name);
//     setNotepadContent(note.content || '');
//     const hasFile = note.file && note.file.trim() !== '';
//     setActiveTab(hasFile ? 'upload' : 'notepad');
    
//     setTimeout(() => {
//       document.querySelector('.leftPanel')?.scrollIntoView({ behavior: 'smooth' });
//     }, 100);
//   };

//   // Handle delete
//   const handleDelete = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this note?')) {
//       return;
//     }

//     try {
//       const res = await fetch(`/api/adminnote/${id}`, {
//         method: 'DELETE'
//       });
      
//       const result = await res.json();
//       if (result.success) {
//         fetchNotes();
//         alert('Note deleted successfully!');
        
//         if (editingNote && editingNote._id === id) {
//           resetForm();
//         }
//       } else {
//         alert(result.error || 'Failed to delete note');
//       }
//     } catch (error) {
//       console.error('Failed to delete note:', error);
//       alert('Failed to delete note. Please try again.');
//     }
//   };

//   // Handle status change
//   const handleStatusChange = async (id: string, newStatus: 'active' | 'draft' | 'inactive') => {
//     try {
//       const res = await fetch(`/api/adminnote/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ status: newStatus })
//       });
      
//       const result = await res.json();
//       if (result.success) {
//         setNotes(notes.map(note => 
//           note._id === id ? { ...note, status: newStatus } : note
//         ));
//       } else {
//         console.error('Failed to update status:', result.error);
//         fetchNotes();
//       }
//     } catch (error) {
//       console.error('Failed to update status:', error);
//       fetchNotes();
//     }
//   };

//   // Download file
//   const handleDownload = (fileName: string) => {
//     window.open(`/uploads/admin-notes/${fileName}`, '_blank');
//   };

//   // Status badge style
//   const getStatusStyle = (status: string) => {
//     const styles: Record<string, React.CSSProperties> = {
//       active: { 
//         backgroundColor: '#d1fae5', 
//         color: '#065f46',
//         borderColor: '#10b981'
//       },
//       draft: { 
//         backgroundColor: '#fef3c7', 
//         color: '#92400e',
//         borderColor: '#f59e0b'
//       },
//       inactive: { 
//         backgroundColor: '#f3f4f6', 
//         color: '#374151',
//         borderColor: '#9ca3af'
//       }
//     };
//     return styles[status] || styles.draft;
//   };

//   // Format date
//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Handle drag and drop
//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     const files = e.dataTransfer.files;
//     if (files && files.length > 0) {
//       const file = files[0];
//       setUploadedFile(file);
//       if (!noteName && !editingNote) {
//         setNoteName(file.name.replace(/\.[^/.]+$/, ""));
//       }
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.header}>
//         <h1 style={styles.title}>Admin Notes & Policies</h1>
//         <p style={styles.subtitle}>Upload documents and create notes for your organization</p>
//       </div>

//       <div style={styles.mainContent}>
//         {/* Left Panel */}
//         <div style={styles.leftPanel} className="leftPanel">
//           <div style={styles.sectionHeader}>
//             <h2 style={styles.sectionTitle}>
//               {editingNote ? 'Edit Note' : 'Create New Note'}
//             </h2>
//             {editingNote && (
//               <button style={styles.cancelButton} onClick={resetForm}>
//                 Cancel Edit
//               </button>
//             )}
//           </div>

//           <div style={styles.tabButtons}>
//             <button
//               style={{ 
//                 ...styles.tabButton, 
//                 ...(activeTab === 'upload' ? styles.activeTab : {}),
//               }}
//               onClick={() => setActiveTab('upload')}
//             >
//               📁 Upload Document
//             </button>
//             <button
//               style={{ 
//                 ...styles.tabButton, 
//                 ...(activeTab === 'notepad' ? styles.activeTab : {}),
//               }}
//               onClick={() => setActiveTab('notepad')}
//             >
//               📝 Quick Notepad
//             </button>
//           </div>

//           {activeTab === 'upload' && (
//             <div style={styles.uploadSection}>
//               <div style={styles.formGroup}>
//                 <label style={styles.label}>Note Name *</label>
//                 <input
//                   type="text"
//                   value={noteName}
//                   onChange={(e) => setNoteName(e.target.value)}
//                   placeholder="Enter note name"
//                   style={styles.input}
//                   required
//                 />
//               </div>

//               <div style={styles.formGroup}>
//                 <label style={styles.label}>Upload Document</label>
//                 <div
//                   style={styles.uploadArea}
//                   onClick={() => fileInputRef.current?.click()}
//                   onDragOver={handleDragOver}
//                   onDrop={handleDrop}
//                 >
//                   <div style={styles.uploadIcon}>📎</div>
//                   <p style={styles.uploadText}>
//                     {uploadedFile 
//                       ? `Selected: ${uploadedFile.name}`
//                       : editingNote && editingNote.file
//                       ? `Current file: ${editingNote.file}`
//                       : 'Click to upload or drag and drop'
//                     }
//                   </p>
//                   <p style={styles.uploadSubtext}>
//                     Supports CSV, TXT, PDF, Word, Excel, Images, Videos, etc.
//                   </p>
//                   <input
//                     type="file"
//                     ref={fileInputRef}
//                     onChange={handleFileUpload}
//                     style={styles.fileInput}
//                   />
//                 </div>
//               </div>

//               <div style={styles.buttonGroup}>
//                 <button style={styles.saveButton} onClick={saveNote} disabled={saveLoading}>
//                   {saveLoading ? 'Saving...' : editingNote ? 'Update Note' : 'Save Note'}
//                 </button>
//                 {editingNote && (
//                   <button style={styles.cancelButton} onClick={resetForm}>
//                     Cancel
//                   </button>
//                 )}
//               </div>
//             </div>
//           )}

//           {activeTab === 'notepad' && (
//             <div style={styles.notepadSection}>
//               <div style={styles.formGroup}>
//                 <label style={styles.label}>Note Name *</label>
//                 <input
//                   type="text"
//                   value={noteName}
//                   onChange={(e) => setNoteName(e.target.value)}
//                   placeholder="Enter note name"
//                   style={styles.input}
//                 />
//               </div>

//               <div style={styles.notepadContainer}>
//                 <textarea
//                   value={notepadContent}
//                   onChange={(e) => setNotepadContent(e.target.value)}
//                   placeholder="Start typing your notes here..."
//                   style={styles.textarea}
//                   rows={12}
//                 />
//                 <div style={styles.characterCount}>
//                   Characters: {notepadContent.length} | Words: {notepadContent.trim() ? notepadContent.trim().split(/\s+/).length : 0}
//                 </div>
//               </div>

//               <div style={styles.buttonGroup}>
//                 <button style={styles.saveButton} onClick={saveNote} disabled={saveLoading}>
//                   {saveLoading ? 'Saving...' : editingNote ? 'Update Note' : 'Save Note'}
//                 </button>
//                 {editingNote && (
//                   <button style={styles.cancelButton} onClick={resetForm}>
//                     Cancel
//                   </button>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Right Panel */}
//         <div style={styles.rightPanel}>
//           <div style={styles.searchSection}>
//             <div style={styles.searchContainer}>
//               <div style={styles.searchIcon}>🔍</div>
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search by Note Name or ID..."
//                 style={styles.searchInput}
//               />
//               {searchQuery && (
//                 <button style={styles.clearSearchButton} onClick={() => setSearchQuery('')}>
//                   ✕
//                 </button>
//               )}
//             </div>
//             <div style={styles.statsContainer}>
//               <div style={styles.notesCount}>Total Notes: {notes.length}</div>
//               <div style={styles.statusStats}>
//                 <span style={{...styles.statusBadge, ...getStatusStyle('active')}}>
//                   Active: {notes.filter(n => n.status === 'active').length}
//                 </span>
//                 <span style={{...styles.statusBadge, ...getStatusStyle('draft')}}>
//                   Draft: {notes.filter(n => n.status === 'draft').length}
//                 </span>
//                 <span style={{...styles.statusBadge, ...getStatusStyle('inactive')}}>
//                   Inactive: {notes.filter(n => n.status === 'inactive').length}
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div style={styles.tableContainer}>
//             {loading ? (
//               <div style={styles.loading}>
//                 <div style={styles.spinner}></div>
//                 Loading notes...
//               </div>
//             ) : (
//               <>
//                 <table style={styles.table}>
//                   <thead>
//                     <tr style={styles.tableHeaderRow}>
//                       <th style={styles.tableHeader}>SL.No</th>
//                       <th style={styles.tableHeader}>Note Name</th>
//                       <th style={styles.tableHeader}>Uploaded File</th>
//                       <th style={styles.tableHeader}>Status</th>
//                       <th style={styles.tableHeader}>Created</th>
//                       <th style={styles.tableHeader}>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {notes.map((note, index) => (
//                       <tr key={note._id} style={styles.tableRow}>
//                         <td style={styles.tableCell}>{index + 1}</td>
//                         <td style={styles.tableCell}>
//                           <div style={styles.noteNameCell}>
//                             <strong>{note.name}</strong>
//                             {editingNote?._id === note._id && (
//                               <span style={styles.editingBadge}>Editing</span>
//                             )}
//                           </div>
//                         </td>
//                         <td style={styles.tableCell}>
//                           {note.file ? (
//                             <button onClick={() => handleDownload(note.file!)} style={styles.downloadLink}>
//                               📥 {note.file}
//                             </button>
//                           ) : (
//                             <span style={styles.noFile}>📝 Text Note</span>
//                           )}
//                         </td>
//                         <td style={styles.tableCell}>
//                           <select
//                             value={note.status}
//                             onChange={(e) => handleStatusChange(note._id, e.target.value as any)}
//                             style={{ ...styles.statusSelect, ...getStatusStyle(note.status) }}
//                           >
//                             <option value="draft">Draft</option>
//                             <option value="active">Active</option>
//                             <option value="inactive">Inactive</option>
//                           </select>
//                         </td>
//                         <td style={styles.tableCell}>{formatDate(note.createdAt)}</td>
//                         <td style={styles.tableCell}>
//                           <div style={styles.actionButtons}>
//                             <button style={styles.editButton} onClick={() => handleEdit(note)}>
//                               ✏️ Edit
//                             </button>
//                             <button style={styles.deleteButton} onClick={() => handleDelete(note._id)}>
//                               🗑️ Delete
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
                
//                 {notes.length === 0 && (
//                   <div style={styles.noResults}>
//                     <div style={styles.noResultsIcon}>📝</div>
//                     <h3>No notes yet</h3>
//                     <p>Create your first note using the form on the left!</p>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   container: { minHeight: '100vh', backgroundColor: '#f8fafc', padding: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
//   header: { marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' },
//   title: { fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' },
//   subtitle: { fontSize: '16px', color: '#64748b', margin: '0' },
//   mainContent: { display: 'flex', flexDirection: 'column' as const, gap: '24px' },
//   leftPanel: { flex: '1', backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' },
//   rightPanel: { flex: '2', backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' },
//   sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
//   sectionTitle: { fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: '0' },
//   tabButtons: { display: 'flex', gap: '12px', marginBottom: '24px' },
//   tabButton: { flex: '1', padding: '12px 16px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
//   activeTab: { backgroundColor: '#3b82f6', color: 'white', borderColor: '#3b82f6' },
//   uploadSection: { display: 'flex', flexDirection: 'column' as const, gap: '20px' },
//   notepadSection: { display: 'flex', flexDirection: 'column' as const, gap: '20px' },
//   formGroup: { display: 'flex', flexDirection: 'column' as const, gap: '8px' },
//   label: { fontSize: '14px', fontWeight: '500', color: '#374151' },
//   input: { padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none' },
//   uploadArea: { border: '2px dashed #d1d5db', borderRadius: '8px', padding: '40px 20px', textAlign: 'center' as const, cursor: 'pointer', backgroundColor: '#f9fafb' },
//   uploadIcon: { fontSize: '32px', marginBottom: '12px' },
//   uploadText: { fontSize: '14px', color: '#374151', margin: '0 0 4px 0' },
//   uploadSubtext: { fontSize: '12px', color: '#9ca3af', margin: '0' },
//   fileInput: { display: 'none' },
//   buttonGroup: { display: 'flex', gap: '12px' },
//   saveButton: { flex: '1', padding: '12px 24px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
//   cancelButton: { padding: '12px 24px', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
//   notepadContainer: { border: '1px solid #d1d5db', borderRadius: '8px', overflow: 'hidden' },
//   textarea: { width: '100%', padding: '16px', border: 'none', outline: 'none', resize: 'vertical' as const, fontSize: '14px', fontFamily: 'monospace', lineHeight: '1.5' },
//   characterCount: { padding: '8px 16px', fontSize: '12px', color: '#9ca3af', backgroundColor: '#f9fafb', borderTop: '1px solid #d1d5db', textAlign: 'right' as const },
//   searchSection: { display: 'flex', flexDirection: 'column' as const, gap: '16px', marginBottom: '24px' },
//   searchContainer: { position: 'relative' as const, flex: '1' },
//   searchIcon: { position: 'absolute' as const, left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' },
//   searchInput: { width: '100%', padding: '12px 16px 12px 44px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none' },
//   clearSearchButton: { position: 'absolute' as const, right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '16px', padding: '4px' },
//   statsContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: '12px' },
//   notesCount: { fontSize: '14px', color: '#6b7280', fontWeight: '500' },
//   statusStats: { display: 'flex', gap: '8px', flexWrap: 'wrap' as const },
//   statusBadge: { padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500' },
//   tableContainer: { overflowX: 'auto' as const, minHeight: '400px' },
//   table: { width: '100%', borderCollapse: 'collapse' as const },
//   tableHeaderRow: { backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' },
//   tableHeader: { padding: '12px 16px', textAlign: 'left' as const, fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' as const },
//   tableRow: { borderBottom: '1px solid #f3f4f6' },
//   tableCell: { padding: '16px', fontSize: '14px', color: '#374151' },
//   noteNameCell: { display: 'flex', flexDirection: 'column' as const, gap: '4px' },
//   editingBadge: { display: 'inline-block', padding: '2px 8px', backgroundColor: '#fef3c7', color: '#92400e', borderRadius: '4px', fontSize: '11px', fontWeight: '600', width: 'fit-content' },
//   downloadLink: { color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontSize: '14px', padding: '0' },
//   noFile: { color: '#9ca3af', fontSize: '14px' },
//   statusSelect: { padding: '6px 12px', borderRadius: '6px', border: '1px solid transparent', fontSize: '12px', fontWeight: '500', cursor: 'pointer', outline: 'none' },
//   actionButtons: { display: 'flex', gap: '8px' },
//   editButton: { padding: '6px 12px', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' },
//   deleteButton: { padding: '6px 12px', backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' },
//   loading: { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', padding: '60px 20px', color: '#6b7280', fontSize: '14px' },
//   spinner: { width: '40px', height: '40px', border: '3px solid #e5e7eb', borderTop: '3px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '12px' },
//   noResults: { textAlign: 'center' as const, padding: '60px 20px', color: '#9ca3af', fontSize: '14px' },
//   noResultsIcon: { fontSize: '48px', marginBottom: '16px' },
// };











// 'use client';

// import { useState, useRef, useEffect } from 'react';
// import { Pagination, Select, MenuItem, SelectChangeEvent } from '@mui/material';

// interface AdminNote {
//   _id: string;
//   name: string;
//   file?: string;
//   status: 'active' | 'draft' | 'inactive';
//   content: string;
//   createdAt: string;
// }

// export default function AdminNotesPage() {
//   const [notes, setNotes] = useState<AdminNote[]>([]);
//   const [notepadContent, setNotepadContent] = useState('');
//   const [noteName, setNoteName] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [editingNote, setEditingNote] = useState<AdminNote | null>(null);
//   const [uploadedFile, setUploadedFile] = useState<File | null>(null);
//   const [activeTab, setActiveTab] = useState<'upload' | 'notepad'>('upload');
//   const [loading, setLoading] = useState(false);
//   const [saveLoading, setSaveLoading] = useState(false);
  
//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
  
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Fetch notes
//   const fetchNotes = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`/api/adminnote?search=${encodeURIComponent(searchQuery)}`);
//       const data = await res.json();
//       if (data.success && data.data) {
//         setNotes(data.data);
//         // Calculate total pages based on total items (you might need to adjust this based on your API)
//         const totalItems = data.total || data.data.length;
//         setTotalPages(Math.ceil(totalItems / itemsPerPage));
//       } else {
//         console.error('Failed to fetch notes:', data.error);
//       }
//     } catch (error) {
//       console.error('Failed to fetch notes:', error);
//       alert('Failed to fetch notes. Please check your connection.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchNotes();
//     setCurrentPage(1); // Reset to first page when search changes
//   }, [searchQuery]);

//   // Handle page change
//   const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
//     setCurrentPage(page);
//     // You might want to fetch data for the new page here
//     // For now, we'll just slice the existing data
//   };

//   // Handle items per page change
//   const handleItemsPerPageChange = (event: SelectChangeEvent<number>) => {
//     const newLimit = event.target.value as number;
//     setItemsPerPage(newLimit);
//     setCurrentPage(1); // Reset to first page when limit changes
//     // You might want to fetch data with new limit here
//   };

//   // Calculate paginated notes
//   const getPaginatedNotes = () => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     return notes.slice(startIndex, endIndex);
//   };

//   // Handle file upload
//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setUploadedFile(file);
//       if (!noteName && !editingNote) {
//         setNoteName(file.name.replace(/\.[^/.]+$/, ""));
//       }
//     }
//   };

//   // Save note
//   const saveNote = async () => {
//     if (!noteName.trim()) {
//       alert('Please enter a note name');
//       return;
//     }

//     setSaveLoading(true);

//     try {
//       let res;
      
//       // For file uploads, use FormData
//       if (activeTab === 'upload' && uploadedFile) {
//         const formData = new FormData();
//         formData.append('name', noteName);
//         formData.append('status', editingNote ? editingNote.status : 'draft');
//         formData.append('content', notepadContent);
//         formData.append('file', uploadedFile);

//         if (editingNote) {
//           res = await fetch(`/api/adminnote/${editingNote._id}`, {
//             method: 'PUT',
//             body: formData
//           });
//         } else {
//           res = await fetch('/api/adminnote', {
//             method: 'POST',
//             body: formData
//           });
//         }
//       } 
//       // For notepad, use JSON
//       else {
//         const noteData = {
//           name: noteName,
//           file: null,
//           status: editingNote ? editingNote.status : 'draft',
//           content: notepadContent,
//         };

//         if (editingNote) {
//           res = await fetch(`/api/adminnote/${editingNote._id}`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(noteData)
//           });
//         } else {
//           res = await fetch('/api/adminnote', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(noteData)
//           });
//         }
//       }
      
//       const result = await res.json();
//       if (result.success) {
//         fetchNotes();
//         resetForm();
//         alert(editingNote ? 'Note updated successfully!' : 'Note created successfully!');
//       } else {
//         alert(result.error || `Failed to ${editingNote ? 'update' : 'create'} note`);
//       }
      
//     } catch (error) {
//       console.error('Failed to save note:', error);
//       alert('Failed to save note. Please try again.');
//     } finally {
//       setSaveLoading(false);
//     }
//   };

//   // Reset form
//   const resetForm = () => {
//     setNoteName('');
//     setNotepadContent('');
//     setUploadedFile(null);
//     setEditingNote(null);
//     setActiveTab('upload');
//     if (fileInputRef.current) fileInputRef.current.value = '';
//   };

//   // Handle edit
//   const handleEdit = (note: AdminNote) => {
//     setEditingNote(note);
//     setNoteName(note.name);
//     setNotepadContent(note.content || '');
//     const hasFile = note.file && note.file.trim() !== '';
//     setActiveTab(hasFile ? 'upload' : 'notepad');
    
//     setTimeout(() => {
//       document.querySelector('.leftPanel')?.scrollIntoView({ behavior: 'smooth' });
//     }, 100);
//   };

//   // Handle delete
//   const handleDelete = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this note?')) {
//       return;
//     }

//     try {
//       const res = await fetch(`/api/adminnote/${id}`, {
//         method: 'DELETE'
//       });
      
//       const result = await res.json();
//       if (result.success) {
//         fetchNotes();
//         alert('Note deleted successfully!');
        
//         if (editingNote && editingNote._id === id) {
//           resetForm();
//         }
//       } else {
//         alert(result.error || 'Failed to delete note');
//       }
//     } catch (error) {
//       console.error('Failed to delete note:', error);
//       alert('Failed to delete note. Please try again.');
//     }
//   };

//   // Handle status change
//   const handleStatusChange = async (id: string, newStatus: 'active' | 'draft' | 'inactive') => {
//     try {
//       const res = await fetch(`/api/adminnote/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ status: newStatus })
//       });
      
//       const result = await res.json();
//       if (result.success) {
//         setNotes(notes.map(note => 
//           note._id === id ? { ...note, status: newStatus } : note
//         ));
//       } else {
//         console.error('Failed to update status:', result.error);
//         fetchNotes();
//       }
//     } catch (error) {
//       console.error('Failed to update status:', error);
//       fetchNotes();
//     }
//   };

//   // Download file
//   const handleDownload = (fileName: string) => {
//     window.open(`/uploads/admin-notes/${fileName}`, '_blank');
//   };

//   // Status badge style
//   const getStatusStyle = (status: string) => {
//     const styles: Record<string, React.CSSProperties> = {
//       active: { 
//         backgroundColor: '#d1fae5', 
//         color: '#065f46',
//         borderColor: '#10b981'
//       },
//       draft: { 
//         backgroundColor: '#fef3c7', 
//         color: '#92400e',
//         borderColor: '#f59e0b'
//       },
//       inactive: { 
//         backgroundColor: '#f3f4f6', 
//         color: '#374151',
//         borderColor: '#9ca3af'
//       }
//     };
//     return styles[status] || styles.draft;
//   };

//   // Format date
//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Handle drag and drop
//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     const files = e.dataTransfer.files;
//     if (files && files.length > 0) {
//       const file = files[0];
//       setUploadedFile(file);
//       if (!noteName && !editingNote) {
//         setNoteName(file.name.replace(/\.[^/.]+$/, ""));
//       }
//     }
//   };

//   const paginatedNotes = getPaginatedNotes();

//   return (
//     <div style={styles.container}>
//       <div style={styles.header}>
//         <h1 style={styles.title}>Admin Notes & Policies</h1>
//         <p style={styles.subtitle}>Upload documents and create notes for your organization</p>
//       </div>

//       <div style={styles.mainContent}>
//         {/* Left Panel */}
//         <div style={styles.leftPanel} className="leftPanel">
//           <div style={styles.sectionHeader}>
//             <h2 style={styles.sectionTitle}>
//               {editingNote ? 'Edit Note' : 'Create New Note'}
//             </h2>
//             {editingNote && (
//               <button style={styles.cancelButton} onClick={resetForm}>
//                 Cancel Edit
//               </button>
//             )}
//           </div>

//           <div style={styles.tabButtons}>
//             <button
//               style={{ 
//                 ...styles.tabButton, 
//                 ...(activeTab === 'upload' ? styles.activeTab : {}),
//               }}
//               onClick={() => setActiveTab('upload')}
//             >
//               📁 Upload Document
//             </button>
//             <button
//               style={{ 
//                 ...styles.tabButton, 
//                 ...(activeTab === 'notepad' ? styles.activeTab : {}),
//               }}
//               onClick={() => setActiveTab('notepad')}
//             >
//               📝 Quick Notepad
//             </button>
//           </div>

//           {activeTab === 'upload' && (
//             <div style={styles.uploadSection}>
//               <div style={styles.formGroup}>
//                 <label style={styles.label}>Note Name *</label>
//                 <input
//                   type="text"
//                   value={noteName}
//                   onChange={(e) => setNoteName(e.target.value)}
//                   placeholder="Enter note name"
//                   style={styles.input}
//                   required
//                 />
//               </div>

//               <div style={styles.formGroup}>
//                 <label style={styles.label}>Upload Document</label>
//                 <div
//                   style={styles.uploadArea}
//                   onClick={() => fileInputRef.current?.click()}
//                   onDragOver={handleDragOver}
//                   onDrop={handleDrop}
//                 >
//                   <div style={styles.uploadIcon}>📎</div>
//                   <p style={styles.uploadText}>
//                     {uploadedFile 
//                       ? `Selected: ${uploadedFile.name}`
//                       : editingNote && editingNote.file
//                       ? `Current file: ${editingNote.file}`
//                       : 'Click to upload or drag and drop'
//                     }
//                   </p>
//                   <p style={styles.uploadSubtext}>
//                     Supports CSV, TXT, PDF, Word, Excel, Images, Videos, etc.
//                   </p>
//                   <input
//                     type="file"
//                     ref={fileInputRef}
//                     onChange={handleFileUpload}
//                     style={styles.fileInput}
//                   />
//                 </div>
//               </div>

//               <div style={styles.buttonGroup}>
//                 <button style={styles.saveButton} onClick={saveNote} disabled={saveLoading}>
//                   {saveLoading ? 'Saving...' : editingNote ? 'Update Note' : 'Save Note'}
//                 </button>
//                 {editingNote && (
//                   <button style={styles.cancelButton} onClick={resetForm}>
//                     Cancel
//                   </button>
//                 )}
//               </div>
//             </div>
//           )}

//           {activeTab === 'notepad' && (
//             <div style={styles.notepadSection}>
//               <div style={styles.formGroup}>
//                 <label style={styles.label}>Note Name *</label>
//                 <input
//                   type="text"
//                   value={noteName}
//                   onChange={(e) => setNoteName(e.target.value)}
//                   placeholder="Enter note name"
//                   style={styles.input}
//                 />
//               </div>

//               <div style={styles.notepadContainer}>
//                 <textarea
//                   value={notepadContent}
//                   onChange={(e) => setNotepadContent(e.target.value)}
//                   placeholder="Start typing your notes here..."
//                   style={styles.textarea}
//                   rows={12}
//                 />
//                 <div style={styles.characterCount}>
//                   Characters: {notepadContent.length} | Words: {notepadContent.trim() ? notepadContent.trim().split(/\s+/).length : 0}
//                 </div>
//               </div>

//               <div style={styles.buttonGroup}>
//                 <button style={styles.saveButton} onClick={saveNote} disabled={saveLoading}>
//                   {saveLoading ? 'Saving...' : editingNote ? 'Update Note' : 'Save Note'}
//                 </button>
//                 {editingNote && (
//                   <button style={styles.cancelButton} onClick={resetForm}>
//                     Cancel
//                   </button>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Right Panel */}
//         <div style={styles.rightPanel}>
//           <div style={styles.searchSection}>
//             <div style={styles.searchContainer}>
//               <div style={styles.searchIcon}>🔍</div>
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search by Note Name or ID..."
//                 style={styles.searchInput}
//               />
//               {searchQuery && (
//                 <button style={styles.clearSearchButton} onClick={() => setSearchQuery('')}>
//                   ✕
//                 </button>
//               )}
//             </div>
//             <div style={styles.statsContainer}>
//               <div style={styles.notesCount}>Total Notes: {notes.length}</div>
//               <div style={styles.statusStats}>
//                 <span style={{...styles.statusBadge, ...getStatusStyle('active')}}>
//                   Active: {notes.filter(n => n.status === 'active').length}
//                 </span>
//                 <span style={{...styles.statusBadge, ...getStatusStyle('draft')}}>
//                   Draft: {notes.filter(n => n.status === 'draft').length}
//                 </span>
//                 <span style={{...styles.statusBadge, ...getStatusStyle('inactive')}}>
//                   Inactive: {notes.filter(n => n.status === 'inactive').length}
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div style={styles.tableContainer}>
//             {loading ? (
//               <div style={styles.loading}>
//                 <div style={styles.spinner}></div>
//                 Loading notes...
//               </div>
//             ) : (
//               <>
//                 <table style={styles.table}>
//                   <thead>
//                     <tr style={styles.tableHeaderRow}>
//                       <th style={styles.tableHeader}>SL.No</th>
//                       <th style={styles.tableHeader}>Note Name</th>
//                       <th style={styles.tableHeader}>Uploaded File</th>
//                       <th style={styles.tableHeader}>Status</th>
//                       <th style={styles.tableHeader}>Created</th>
//                       <th style={styles.tableHeader}>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {paginatedNotes.map((note, index) => (
//                       <tr key={note._id} style={styles.tableRow}>
//                         <td style={styles.tableCell}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
//                         <td style={styles.tableCell}>
//                           <div style={styles.noteNameCell}>
//                             <strong>{note.name}</strong>
//                             {editingNote?._id === note._id && (
//                               <span style={styles.editingBadge}>Editing</span>
//                             )}
//                           </div>
//                         </td>
//                         <td style={styles.tableCell}>
//                           {note.file ? (
//                             <button onClick={() => handleDownload(note.file!)} style={styles.downloadLink}>
//                               📥 {note.file}
//                             </button>
//                           ) : (
//                             <span style={styles.noFile}>📝 Text Note</span>
//                           )}
//                         </td>
//                         <td style={styles.tableCell}>
//                           <select
//                             value={note.status}
//                             onChange={(e) => handleStatusChange(note._id, e.target.value as any)}
//                             style={{ ...styles.statusSelect, ...getStatusStyle(note.status) }}
//                           >
//                             <option value="draft">Draft</option>
//                             <option value="active">Active</option>
//                             <option value="inactive">Inactive</option>
//                           </select>
//                         </td>
//                         <td style={styles.tableCell}>{formatDate(note.createdAt)}</td>
//                         <td style={styles.tableCell}>
//                           <div style={styles.actionButtons}>
//                             <button style={styles.editButton} onClick={() => handleEdit(note)}>
//                               ✏️ Edit
//                             </button>
//                             <button style={styles.deleteButton} onClick={() => handleDelete(note._id)}>
//                               🗑️ Delete
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
                
//                 {notes.length === 0 ? (
//                   <div style={styles.noResults}>
//                     <div style={styles.noResultsIcon}>📝</div>
//                     <h3>No notes yet</h3>
//                     <p>Create your first note using the form on the left!</p>
//                   </div>
//                 ) : (
//                   // Pagination Footer
//                   <div style={styles.paginationFooter}>
//                     {/* Left side - Items per page selector */}
//                     <div style={styles.paginationLeft}>
//                       <span style={styles.paginationLabel}>Items per page:</span>
//                       <Select
//                         value={itemsPerPage}
//                         onChange={handleItemsPerPageChange}
//                         size="small"
//                         sx={{
//                           height: '36px',
//                           fontSize: '14px',
//                           marginLeft: '8px',
//                           '& .MuiOutlinedInput-notchedOutline': {
//                             borderColor: '#d1d5db',
//                           },
//                           '&:hover .MuiOutlinedInput-notchedOutline': {
//                             borderColor: '#3b82f6',
//                           },
//                         }}
//                       >
//                         <MenuItem value={5}>5</MenuItem>
//                         <MenuItem value={10}>10</MenuItem>
//                         <MenuItem value={20}>20</MenuItem>
//                         <MenuItem value={50}>50</MenuItem>
//                       </Select>
//                       <span style={styles.paginationInfo}>
//                         Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, notes.length)} of {notes.length} entries
//                       </span>
//                     </div>
                    
//                     {/* Right side - Pagination controls */}
//                     <div style={styles.paginationRight}>
//                       <Pagination
//                         count={totalPages}
//                         page={currentPage}
//                         onChange={handlePageChange}
//                         color="primary"
//                         size="medium"
//                         showFirstButton
//                         showLastButton
//                         siblingCount={1}
//                         boundaryCount={1}
//                         sx={{
//                           '& .MuiPaginationItem-root': {
//                             fontSize: '14px',
//                             '&.Mui-selected': {
//                               backgroundColor: '#3b82f6',
//                               color: 'white',
//                               '&:hover': {
//                                 backgroundColor: '#2563eb',
//                               },
//                             },
//                           },
//                         }}
//                       />
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   container: { minHeight: '100vh', backgroundColor: '#f8fafc', padding: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
//   header: { marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' },
//   title: { fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' },
//   subtitle: { fontSize: '16px', color: '#64748b', margin: '0' },
//   mainContent: { display: 'flex', flexDirection: 'column' as const, gap: '24px' },
//   leftPanel: { flex: '1', backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' },
//   rightPanel: { flex: '2', backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' },
//   sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
//   sectionTitle: { fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: '0' },
//   tabButtons: { display: 'flex', gap: '12px', marginBottom: '24px' },
//   tabButton: { flex: '1', padding: '12px 16px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
//   activeTab: { backgroundColor: '#3b82f6', color: 'white', borderColor: '#3b82f6' },
//   uploadSection: { display: 'flex', flexDirection: 'column' as const, gap: '20px' },
//   notepadSection: { display: 'flex', flexDirection: 'column' as const, gap: '20px' },
//   formGroup: { display: 'flex', flexDirection: 'column' as const, gap: '8px' },
//   label: { fontSize: '14px', fontWeight: '500', color: '#374151' },
//   input: { padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none' },
//   uploadArea: { border: '2px dashed #d1d5db', borderRadius: '8px', padding: '40px 20px', textAlign: 'center' as const, cursor: 'pointer', backgroundColor: '#f9fafb' },
//   uploadIcon: { fontSize: '32px', marginBottom: '12px' },
//   uploadText: { fontSize: '14px', color: '#374151', margin: '0 0 4px 0' },
//   uploadSubtext: { fontSize: '12px', color: '#9ca3af', margin: '0' },
//   fileInput: { display: 'none' },
//   buttonGroup: { display: 'flex', gap: '12px' },
//   saveButton: { flex: '1', padding: '12px 24px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
//   cancelButton: { padding: '12px 24px', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
//   notepadContainer: { border: '1px solid #d1d5db', borderRadius: '8px', overflow: 'hidden' },
//   textarea: { width: '100%', padding: '16px', border: 'none', outline: 'none', resize: 'vertical' as const, fontSize: '14px', fontFamily: 'monospace', lineHeight: '1.5' },
//   characterCount: { padding: '8px 16px', fontSize: '12px', color: '#9ca3af', backgroundColor: '#f9fafb', borderTop: '1px solid #d1d5db', textAlign: 'right' as const },
//   searchSection: { display: 'flex', flexDirection: 'column' as const, gap: '16px', marginBottom: '24px' },
//   searchContainer: { position: 'relative' as const, flex: '1' },
//   searchIcon: { position: 'absolute' as const, left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' },
//   searchInput: { width: '100%', padding: '12px 16px 12px 44px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none' },
//   clearSearchButton: { position: 'absolute' as const, right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '16px', padding: '4px' },
//   statsContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: '12px' },
//   notesCount: { fontSize: '14px', color: '#6b7280', fontWeight: '500' },
//   statusStats: { display: 'flex', gap: '8px', flexWrap: 'wrap' as const },
//   statusBadge: { padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500' },
//   tableContainer: { overflowX: 'auto' as const, minHeight: '400px' },
//   table: { width: '100%', borderCollapse: 'collapse' as const },
//   tableHeaderRow: { backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' },
//   tableHeader: { padding: '12px 16px', textAlign: 'left' as const, fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' as const },
//   tableRow: { borderBottom: '1px solid #f3f4f6' },
//   tableCell: { padding: '16px', fontSize: '14px', color: '#374151' },
//   noteNameCell: { display: 'flex', flexDirection: 'column' as const, gap: '4px' },
//   editingBadge: { display: 'inline-block', padding: '2px 8px', backgroundColor: '#fef3c7', color: '#92400e', borderRadius: '4px', fontSize: '11px', fontWeight: '600', width: 'fit-content' },
//   downloadLink: { color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontSize: '14px', padding: '0' },
//   noFile: { color: '#9ca3af', fontSize: '14px' },
//   statusSelect: { padding: '6px 12px', borderRadius: '6px', border: '1px solid transparent', fontSize: '12px', fontWeight: '500', cursor: 'pointer', outline: 'none' },
//   actionButtons: { display: 'flex', gap: '8px' },
//   editButton: { padding: '6px 12px', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' },
//   deleteButton: { padding: '6px 12px', backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' },
//   loading: { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', padding: '60px 20px', color: '#6b7280', fontSize: '14px' },
//   spinner: { width: '40px', height: '40px', border: '3px solid #e5e7eb', borderTop: '3px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '12px' },
//   noResults: { textAlign: 'center' as const, padding: '60px 20px', color: '#9ca3af', fontSize: '14px' },
//   noResultsIcon: { fontSize: '48px', marginBottom: '16px' },
//   // Pagination styles
//   paginationFooter: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: '24px',
//     paddingTop: '16px',
//     borderTop: '1px solid #e5e7eb',
//     flexWrap: 'wrap' as const,
//     gap: '16px',
//   },
//   paginationLeft: {
//     display: 'flex',
//     alignItems: 'center',
//     fontSize: '14px',
//     color: '#6b7280',
//   },
//   paginationLabel: {
//     marginRight: '8px',
//   },
//   paginationInfo: {
//     marginLeft: '16px',
//     fontSize: '14px',
//     color: '#6b7280',
//   },
//   paginationRight: {
//     display: 'flex',
//     alignItems: 'center',
//   },
// };





















//UPDATED BY SRIDHAR







'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Upload, 
  FileText, 
  Edit, 
  Trash2, 
  Download, 
  Plus, 
  X,
  Check,
  Filter,
  Menu,
  ChevronLeft
} from 'lucide-react';

interface AdminNote {
  _id: string;
  name: string;
  file?: string;
  status: 'active' | 'draft' | 'inactive';
  content: string;
  createdAt: string;
}

export default function AdminNotesPage() {
  const [notes, setNotes] = useState<AdminNote[]>([]);
  const [notepadContent, setNotepadContent] = useState('');
  const [noteName, setNoteName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNote, setEditingNote] = useState<AdminNote | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'notepad'>('upload');
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check mobile view
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setShowForm(false); // Hide form by default on mobile
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch notes
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/adminnote?search=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.success && data.data) {
        setNotes(data.data);
      } else {
        console.error('Failed to fetch notes:', data.error);
      }
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      alert('Failed to fetch notes. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [searchQuery]);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      if (!noteName && !editingNote) {
        setNoteName(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  // Save note
  const saveNote = async () => {
    if (!noteName.trim()) {
      alert('Please enter a note name');
      return;
    }

    setSaveLoading(true);

    try {
      let res;
      
      // For file uploads, use FormData
      if (activeTab === 'upload' && uploadedFile) {
        const formData = new FormData();
        formData.append('name', noteName);
        formData.append('status', editingNote ? editingNote.status : 'draft');
        formData.append('content', notepadContent);
        formData.append('file', uploadedFile);

        if (editingNote) {
          res = await fetch(`/api/adminnote/${editingNote._id}`, {
            method: 'PUT',
            body: formData
          });
        } else {
          res = await fetch('/api/adminnote', {
            method: 'POST',
            body: formData
          });
        }
      } 
      // For notepad, use JSON
      else {
        const noteData = {
          name: noteName,
          file: null,
          status: editingNote ? editingNote.status : 'draft',
          content: notepadContent,
        };

        if (editingNote) {
          res = await fetch(`/api/adminnote/${editingNote._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(noteData)
          });
        } else {
          res = await fetch('/api/adminnote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(noteData)
          });
        }
      }
      
      const result = await res.json();
      if (result.success) {
        fetchNotes();
        resetForm();
        alert(editingNote ? 'Note updated successfully!' : 'Note created successfully!');
      } else {
        alert(result.error || `Failed to ${editingNote ? 'update' : 'create'} note`);
      }
      
    } catch (error) {
      console.error('Failed to save note:', error);
      alert('Failed to save note. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setNoteName('');
    setNotepadContent('');
    setUploadedFile(null);
    setEditingNote(null);
    setActiveTab('upload');
    setShowForm(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Handle edit
  const handleEdit = (note: AdminNote) => {
    setEditingNote(note);
    setNoteName(note.name);
    setNotepadContent(note.content || '');
    const hasFile = note.file && note.file.trim() !== '';
    setActiveTab(hasFile ? 'upload' : 'notepad');
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      const res = await fetch(`/api/adminnote/${id}`, {
        method: 'DELETE'
      });
      
      const result = await res.json();
      if (result.success) {
        fetchNotes();
        alert('Note deleted successfully!');
        
        if (editingNote && editingNote._id === id) {
          resetForm();
        }
      } else {
        alert(result.error || 'Failed to delete note');
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
      alert('Failed to delete note. Please try again.');
    }
  };

  // Handle status change
  const handleStatusChange = async (id: string, newStatus: 'active' | 'draft' | 'inactive') => {
    try {
      const res = await fetch(`/api/adminnote/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      const result = await res.json();
      if (result.success) {
        setNotes(notes.map(note => 
          note._id === id ? { ...note, status: newStatus } : note
        ));
      } else {
        console.error('Failed to update status:', result.error);
        fetchNotes();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      fetchNotes();
    }
  };

  // Download file
  const handleDownload = (fileName: string) => {
    window.open(`/uploads/admin-notes/${fileName}`, '_blank');
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      setUploadedFile(file);
      if (!noteName && !editingNote) {
        setNoteName(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    const colors = {
      active: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
      draft: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' }
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  // Open form for creating new note
  const openNewNoteForm = () => {
    resetForm();
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6">
      {/* Header */}
      <div className="mb-4 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
          <div className="flex items-center gap-3">
            {isMobile && showForm && (
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft size={24} />
              </button>
            )}
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-gray-800">Admin Notes & Policies</h1>
              <p className="text-gray-600 text-sm md:text-base mt-1">Upload documents and create notes for your organization</p>
            </div>
          </div>
          
          {/* Add New Note Button - Mobile & Desktop */}
          <div className="flex items-center gap-2">
            {!showForm ? (
              <button
                onClick={openNewNoteForm}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
              >
                <Plus size={20} />
                <span className="text-sm md:text-base">Add New Note</span>
              </button>
            ) : (
              !isMobile && (
                <button
                  onClick={() => setShowForm(false)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X size={20} />
                  Close Form
                </button>
              )
            )}
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Main Content Container */}
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          {/* Left Panel - Form - Show only when showForm is true */}
          {showForm && (
            <div className={`${isMobile ? 'w-full' : 'lg:w-2/5 xl:w-1/3'}`}>
              {isMobile && (
                <div className="sticky top-0 bg-white border-b p-4 flex items-center gap-3 z-10 mb-4">
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {editingNote ? 'Edit Note' : 'Add New Note'}
                  </h2>
                </div>
              )}
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
                {!isMobile && (
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {editingNote ? 'Edit Note' : 'Add New Note'}
                    </h2>
                    {editingNote && (
                      <button
                        onClick={resetForm}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                      >
                        <X size={18} />
                        Cancel Edit
                      </button>
                    )}
                  </div>
                )}

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-6">
                  <button
                    onClick={() => setActiveTab('upload')}
                    className={`flex-1 flex items-center justify-center gap-2 px-2 py-3 font-medium text-sm transition-colors ${activeTab === 'upload' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <Upload size={18} />
                    <span className="hidden sm:inline">Upload Document</span>
                    <span className="sm:hidden">Upload</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('notepad')}
                    className={`flex-1 flex items-center justify-center gap-2 px-2 py-3 font-medium text-sm transition-colors ${activeTab === 'notepad' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <FileText size={18} />
                    <span className="hidden sm:inline">Quick Notepad</span>
                    <span className="sm:hidden">Notepad</span>
                  </button>
                </div>

                {/* Upload Tab */}
                {activeTab === 'upload' && (
                  <div className="space-y-4 md:space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Note Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={noteName}
                        onChange={(e) => setNoteName(e.target.value)}
                        placeholder="Enter note name"
                        className="w-full px-3 md:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm md:text-base"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Document
                      </label>
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className="border-2 border-dashed border-gray-300 rounded-xl p-4 md:p-6 text-center cursor-pointer hover:border-blue-400 transition-colors bg-gray-50"
                      >
                        <div className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 flex items-center justify-center bg-blue-100 rounded-full">
                          <Upload className="text-blue-600" size={20} />
                        </div>
                        <p className="text-gray-700 font-medium mb-1 text-sm md:text-base">
                          {uploadedFile 
                            ? `Selected: ${uploadedFile.name}`
                            : editingNote && editingNote.file
                            ? `Current file: ${editingNote.file}`
                            : 'Click to upload or drag and drop'
                          }
                        </p>
                        <p className="text-xs md:text-sm text-gray-500">
                          Supports CSV, TXT, PDF, Word, Excel, Images, Videos, etc.
                        </p>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 md:gap-3 pt-2">
                      <button
                        onClick={saveNote}
                        disabled={saveLoading}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                      >
                        {saveLoading ? (
                          <>
                            <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm">Saving...</span>
                          </>
                        ) : (
                          <>
                            <Check size={18} />
                            {editingNote ? 'Update Note' : 'Save Note'}
                          </>
                        )}
                      </button>
                      <button
                        onClick={resetForm}
                        className="px-3 md:px-4 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors text-sm md:text-base"
                      >
                        {editingNote ? 'Cancel Edit' : 'Cancel'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Notepad Tab */}
                {activeTab === 'notepad' && (
                  <div className="space-y-4 md:space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Note Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={noteName}
                        onChange={(e) => setNoteName(e.target.value)}
                        placeholder="Enter note name"
                        className="w-full px-3 md:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm md:text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Note Content
                      </label>
                      <div className="border border-gray-300 rounded-lg overflow-hidden">
                        <textarea
                          value={notepadContent}
                          onChange={(e) => setNotepadContent(e.target.value)}
                          placeholder="Start typing your notes here..."
                          className="w-full px-3 md:px-4 py-3 border-none outline-none resize-none min-h-[150px] md:min-h-[200px] focus:ring-0 text-sm md:text-base"
                          rows={6}
                        />
                        <div className="px-3 md:px-4 py-2 border-t border-gray-200 bg-gray-50 text-xs md:text-sm text-gray-500 flex justify-between items-center">
                          <span>Characters: {notepadContent.length}</span>
                          <span>Words: {notepadContent.trim() ? notepadContent.trim().split(/\s+/).length : 0}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 md:gap-3 pt-2">
                      <button
                        onClick={saveNote}
                        disabled={saveLoading}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                      >
                        {saveLoading ? (
                          <>
                            <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm">Saving...</span>
                          </>
                        ) : (
                          <>
                            <Check size={18} />
                            {editingNote ? 'Update Note' : 'Save Note'}
                          </>
                        )}
                      </button>
                      <button
                        onClick={resetForm}
                        className="px-3 md:px-4 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors text-sm md:text-base"
                      >
                        {editingNote ? 'Cancel Edit' : 'Cancel'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Right Panel - Notes List - Show always on desktop, conditionally on mobile */}
          <div className={`${showForm && isMobile ? 'hidden' : 'flex-1'} transition-all duration-300`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Search and Filter Bar */}
              <div className="p-3 md:p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="relative flex-1 max-w-xl">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search notes..."
                      className="w-full pl-9 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm md:text-base"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-gray-600">
                      <span className="font-medium hidden md:inline">Total:</span>
                      <span className="font-bold text-gray-800">{notes.length}</span>
                    </div>
                    <button className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Filter size={16} />
                      <span className="hidden md:inline text-sm">Filter</span>
                    </button>
                  </div>
                </div>
                
                {/* Status Stats */}
                <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-3 md:mt-4">
                  <div className={`px-2 py-1 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm font-medium ${getStatusColor('active').bg} ${getStatusColor('active').text} border ${getStatusColor('active').border}`}>
                    Active: {notes.filter(n => n.status === 'active').length}
                  </div>
                  <div className={`px-2 py-1 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm font-medium ${getStatusColor('draft').bg} ${getStatusColor('draft').text} border ${getStatusColor('draft').border}`}>
                    Draft: {notes.filter(n => n.status === 'draft').length}
                  </div>
                  <div className={`px-2 py-1 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm font-medium ${getStatusColor('inactive').bg} ${getStatusColor('inactive').text} border ${getStatusColor('inactive').border}`}>
                    Inactive: {notes.filter(n => n.status === 'inactive').length}
                  </div>
                </div>
              </div>

              {/* Notes Table/List */}
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-8 md:py-12">
                    <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-3 md:mb-4"></div>
                    <p className="text-gray-600 text-sm md:text-base">Loading notes...</p>
                  </div>
                ) : notes.length > 0 ? (
                  <div className="min-w-full">
                    {/* Mobile List View */}
                    {isMobile ? (
                      <div className="divide-y divide-gray-200">
                        {notes.map((note, index) => (
                          <div key={note._id} className="p-3 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-gray-600 font-medium text-sm">#{index + 1}</span>
                                  {editingNote?._id === note._id && (
                                    <span className="text-xs text-blue-600 font-medium px-2 py-0.5 bg-blue-50 rounded-full">Editing</span>
                                  )}
                                </div>
                                <h3 className="font-medium text-gray-900 text-base mb-1">{note.name}</h3>
                                <p className="text-xs text-gray-500 mb-2">
                                  Created: {formatDate(note.createdAt)}
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleEdit(note)}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => handleDelete(note._id)}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div>
                                <select
                                  value={note.status}
                                  onChange={(e) => handleStatusChange(note._id, e.target.value as any)}
                                  className={`px-2 py-1 rounded-full text-xs font-medium border outline-none cursor-pointer transition-colors ${getStatusColor(note.status).bg} ${getStatusColor(note.status).text} ${getStatusColor(note.status).border}`}
                                >
                                  <option value="draft">Draft</option>
                                  <option value="active">Active</option>
                                  <option value="inactive">Inactive</option>
                                </select>
                              </div>
                              
                              {note.file && (
                                <button
                                  onClick={() => handleDownload(note.file!)}
                                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs font-medium"
                                >
                                  <Download size={12} />
                                  Download
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* Desktop Table View */
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">SL.No</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Note Name</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">File</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Created</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {notes.map((note, index) => (
                            <tr key={note._id} className="hover:bg-gray-50 transition-colors">
                              <td className="py-3 px-4">
                                <span className="text-gray-600 font-medium text-sm">{index + 1}</span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex flex-col">
                                  <span className="font-medium text-gray-900 text-sm md:text-base">{note.name}</span>
                                  {editingNote?._id === note._id && (
                                    <span className="text-xs text-blue-600 font-medium mt-0.5">Currently editing</span>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-4 hidden md:table-cell">
                                {note.file ? (
                                  <button
                                    onClick={() => handleDownload(note.file!)}
                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                                  >
                                    <Download size={14} />
                                    {note.file.length > 20 ? `${note.file.substring(0, 20)}...` : note.file}
                                  </button>
                                ) : (
                                  <span className="text-gray-500 flex items-center gap-2 text-sm">
                                    <FileText size={14} />
                                    Text Note
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <select
                                  value={note.status}
                                  onChange={(e) => handleStatusChange(note._id, e.target.value as any)}
                                  className={`px-2 py-1 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm font-medium border outline-none cursor-pointer transition-colors ${getStatusColor(note.status).bg} ${getStatusColor(note.status).text} ${getStatusColor(note.status).border}`}
                                >
                                  <option value="draft">Draft</option>
                                  <option value="active">Active</option>
                                  <option value="inactive">Inactive</option>
                                </select>
                              </td>
                              <td className="py-3 px-4 hidden lg:table-cell">
                                <span className="text-gray-600 text-xs md:text-sm">{formatDate(note.createdAt)}</span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-1 md:gap-2">
                                  <button
                                    onClick={() => handleEdit(note)}
                                    className="p-1.5 md:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Edit"
                                  >
                                    <Edit size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(note._id)}
                                    className="p-1.5 md:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 md:py-12 px-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3 md:mb-4">
                      <FileText className="text-gray-400" size={24} />
                    </div>
                    <h3 className="text-base md:text-lg font-medium text-gray-900 mb-1 md:mb-2">No notes yet</h3>
                    <p className="text-gray-600 text-center text-sm md:text-base max-w-md mb-4 md:mb-6">
                      Create your first note by clicking the "Add New Note" button
                    </p>
                    <button
                      onClick={openNewNoteForm}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors text-sm"
                    >
                      <Plus size={18} />
                      Add New Note
                    </button>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {notes.length > 0 && (
                <div className="px-3 md:px-6 py-3 md:py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-xs md:text-sm text-gray-600">
                    Showing {notes.length} of {notes.length} notes
                  </div>
                  <div className="flex items-center gap-1 md:gap-2">
                    <button className="px-2 md:px-3 py-1.5 border border-gray-300 rounded-lg text-xs md:text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                      Previous
                    </button>
                    <button className="px-2 md:px-3 py-1.5 border border-gray-300 rounded-lg text-xs md:text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}