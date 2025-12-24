'use client';

import { useState, useRef, useEffect } from 'react';

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
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Handle edit
  const handleEdit = (note: AdminNote) => {
    setEditingNote(note);
    setNoteName(note.name);
    setNotepadContent(note.content || '');
    const hasFile = note.file && note.file.trim() !== '';
    setActiveTab(hasFile ? 'upload' : 'notepad');
    
    setTimeout(() => {
      document.querySelector('.leftPanel')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
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

  // Status badge style
  const getStatusStyle = (status: string) => {
    const styles: Record<string, React.CSSProperties> = {
      active: { 
        backgroundColor: '#d1fae5', 
        color: '#065f46',
        borderColor: '#10b981'
      },
      draft: { 
        backgroundColor: '#fef3c7', 
        color: '#92400e',
        borderColor: '#f59e0b'
      },
      inactive: { 
        backgroundColor: '#f3f4f6', 
        color: '#374151',
        borderColor: '#9ca3af'
      }
    };
    return styles[status] || styles.draft;
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Admin Notes & Policies</h1>
        <p style={styles.subtitle}>Upload documents and create notes for your organization</p>
      </div>

      <div style={styles.mainContent}>
        {/* Left Panel */}
        <div style={styles.leftPanel} className="leftPanel">
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>
              {editingNote ? 'Edit Note' : 'Create New Note'}
            </h2>
            {editingNote && (
              <button style={styles.cancelButton} onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </div>

          <div style={styles.tabButtons}>
            <button
              style={{ 
                ...styles.tabButton, 
                ...(activeTab === 'upload' ? styles.activeTab : {}),
              }}
              onClick={() => setActiveTab('upload')}
            >
              📁 Upload Document
            </button>
            <button
              style={{ 
                ...styles.tabButton, 
                ...(activeTab === 'notepad' ? styles.activeTab : {}),
              }}
              onClick={() => setActiveTab('notepad')}
            >
              📝 Quick Notepad
            </button>
          </div>

          {activeTab === 'upload' && (
            <div style={styles.uploadSection}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Note Name *</label>
                <input
                  type="text"
                  value={noteName}
                  onChange={(e) => setNoteName(e.target.value)}
                  placeholder="Enter note name"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Upload Document</label>
                <div
                  style={styles.uploadArea}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div style={styles.uploadIcon}>📎</div>
                  <p style={styles.uploadText}>
                    {uploadedFile 
                      ? `Selected: ${uploadedFile.name}`
                      : editingNote && editingNote.file
                      ? `Current file: ${editingNote.file}`
                      : 'Click to upload or drag and drop'
                    }
                  </p>
                  <p style={styles.uploadSubtext}>
                    Supports CSV, TXT, PDF, Word, Excel, Images, Videos, etc.
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    style={styles.fileInput}
                  />
                </div>
              </div>

              <div style={styles.buttonGroup}>
                <button style={styles.saveButton} onClick={saveNote} disabled={saveLoading}>
                  {saveLoading ? 'Saving...' : editingNote ? 'Update Note' : 'Save Note'}
                </button>
                {editingNote && (
                  <button style={styles.cancelButton} onClick={resetForm}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'notepad' && (
            <div style={styles.notepadSection}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Note Name *</label>
                <input
                  type="text"
                  value={noteName}
                  onChange={(e) => setNoteName(e.target.value)}
                  placeholder="Enter note name"
                  style={styles.input}
                />
              </div>

              <div style={styles.notepadContainer}>
                <textarea
                  value={notepadContent}
                  onChange={(e) => setNotepadContent(e.target.value)}
                  placeholder="Start typing your notes here..."
                  style={styles.textarea}
                  rows={12}
                />
                <div style={styles.characterCount}>
                  Characters: {notepadContent.length} | Words: {notepadContent.trim() ? notepadContent.trim().split(/\s+/).length : 0}
                </div>
              </div>

              <div style={styles.buttonGroup}>
                <button style={styles.saveButton} onClick={saveNote} disabled={saveLoading}>
                  {saveLoading ? 'Saving...' : editingNote ? 'Update Note' : 'Save Note'}
                </button>
                {editingNote && (
                  <button style={styles.cancelButton} onClick={resetForm}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div style={styles.rightPanel}>
          <div style={styles.searchSection}>
            <div style={styles.searchContainer}>
              <div style={styles.searchIcon}>🔍</div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Note Name or ID..."
                style={styles.searchInput}
              />
              {searchQuery && (
                <button style={styles.clearSearchButton} onClick={() => setSearchQuery('')}>
                  ✕
                </button>
              )}
            </div>
            <div style={styles.statsContainer}>
              <div style={styles.notesCount}>Total Notes: {notes.length}</div>
              <div style={styles.statusStats}>
                <span style={{...styles.statusBadge, ...getStatusStyle('active')}}>
                  Active: {notes.filter(n => n.status === 'active').length}
                </span>
                <span style={{...styles.statusBadge, ...getStatusStyle('draft')}}>
                  Draft: {notes.filter(n => n.status === 'draft').length}
                </span>
                <span style={{...styles.statusBadge, ...getStatusStyle('inactive')}}>
                  Inactive: {notes.filter(n => n.status === 'inactive').length}
                </span>
              </div>
            </div>
          </div>

          <div style={styles.tableContainer}>
            {loading ? (
              <div style={styles.loading}>
                <div style={styles.spinner}></div>
                Loading notes...
              </div>
            ) : (
              <>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHeaderRow}>
                      <th style={styles.tableHeader}>SL.No</th>
                      <th style={styles.tableHeader}>Note Name</th>
                      <th style={styles.tableHeader}>Uploaded File</th>
                      <th style={styles.tableHeader}>Status</th>
                      <th style={styles.tableHeader}>Created</th>
                      <th style={styles.tableHeader}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notes.map((note, index) => (
                      <tr key={note._id} style={styles.tableRow}>
                        <td style={styles.tableCell}>{index + 1}</td>
                        <td style={styles.tableCell}>
                          <div style={styles.noteNameCell}>
                            <strong>{note.name}</strong>
                            {editingNote?._id === note._id && (
                              <span style={styles.editingBadge}>Editing</span>
                            )}
                          </div>
                        </td>
                        <td style={styles.tableCell}>
                          {note.file ? (
                            <button onClick={() => handleDownload(note.file!)} style={styles.downloadLink}>
                              📥 {note.file}
                            </button>
                          ) : (
                            <span style={styles.noFile}>📝 Text Note</span>
                          )}
                        </td>
                        <td style={styles.tableCell}>
                          <select
                            value={note.status}
                            onChange={(e) => handleStatusChange(note._id, e.target.value as any)}
                            style={{ ...styles.statusSelect, ...getStatusStyle(note.status) }}
                          >
                            <option value="draft">Draft</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </td>
                        <td style={styles.tableCell}>{formatDate(note.createdAt)}</td>
                        <td style={styles.tableCell}>
                          <div style={styles.actionButtons}>
                            <button style={styles.editButton} onClick={() => handleEdit(note)}>
                              ✏️ Edit
                            </button>
                            <button style={styles.deleteButton} onClick={() => handleDelete(note._id)}>
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {notes.length === 0 && (
                  <div style={styles.noResults}>
                    <div style={styles.noResultsIcon}>📝</div>
                    <h3>No notes yet</h3>
                    <p>Create your first note using the form on the left!</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f8fafc', padding: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  header: { marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' },
  title: { fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' },
  subtitle: { fontSize: '16px', color: '#64748b', margin: '0' },
  mainContent: { display: 'flex', flexDirection: 'column' as const, gap: '24px' },
  leftPanel: { flex: '1', backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' },
  rightPanel: { flex: '2', backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  sectionTitle: { fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: '0' },
  tabButtons: { display: 'flex', gap: '12px', marginBottom: '24px' },
  tabButton: { flex: '1', padding: '12px 16px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
  activeTab: { backgroundColor: '#3b82f6', color: 'white', borderColor: '#3b82f6' },
  uploadSection: { display: 'flex', flexDirection: 'column' as const, gap: '20px' },
  notepadSection: { display: 'flex', flexDirection: 'column' as const, gap: '20px' },
  formGroup: { display: 'flex', flexDirection: 'column' as const, gap: '8px' },
  label: { fontSize: '14px', fontWeight: '500', color: '#374151' },
  input: { padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none' },
  uploadArea: { border: '2px dashed #d1d5db', borderRadius: '8px', padding: '40px 20px', textAlign: 'center' as const, cursor: 'pointer', backgroundColor: '#f9fafb' },
  uploadIcon: { fontSize: '32px', marginBottom: '12px' },
  uploadText: { fontSize: '14px', color: '#374151', margin: '0 0 4px 0' },
  uploadSubtext: { fontSize: '12px', color: '#9ca3af', margin: '0' },
  fileInput: { display: 'none' },
  buttonGroup: { display: 'flex', gap: '12px' },
  saveButton: { flex: '1', padding: '12px 24px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
  cancelButton: { padding: '12px 24px', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
  notepadContainer: { border: '1px solid #d1d5db', borderRadius: '8px', overflow: 'hidden' },
  textarea: { width: '100%', padding: '16px', border: 'none', outline: 'none', resize: 'vertical' as const, fontSize: '14px', fontFamily: 'monospace', lineHeight: '1.5' },
  characterCount: { padding: '8px 16px', fontSize: '12px', color: '#9ca3af', backgroundColor: '#f9fafb', borderTop: '1px solid #d1d5db', textAlign: 'right' as const },
  searchSection: { display: 'flex', flexDirection: 'column' as const, gap: '16px', marginBottom: '24px' },
  searchContainer: { position: 'relative' as const, flex: '1' },
  searchIcon: { position: 'absolute' as const, left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' },
  searchInput: { width: '100%', padding: '12px 16px 12px 44px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none' },
  clearSearchButton: { position: 'absolute' as const, right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '16px', padding: '4px' },
  statsContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: '12px' },
  notesCount: { fontSize: '14px', color: '#6b7280', fontWeight: '500' },
  statusStats: { display: 'flex', gap: '8px', flexWrap: 'wrap' as const },
  statusBadge: { padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500' },
  tableContainer: { overflowX: 'auto' as const, minHeight: '400px' },
  table: { width: '100%', borderCollapse: 'collapse' as const },
  tableHeaderRow: { backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' },
  tableHeader: { padding: '12px 16px', textAlign: 'left' as const, fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' as const },
  tableRow: { borderBottom: '1px solid #f3f4f6' },
  tableCell: { padding: '16px', fontSize: '14px', color: '#374151' },
  noteNameCell: { display: 'flex', flexDirection: 'column' as const, gap: '4px' },
  editingBadge: { display: 'inline-block', padding: '2px 8px', backgroundColor: '#fef3c7', color: '#92400e', borderRadius: '4px', fontSize: '11px', fontWeight: '600', width: 'fit-content' },
  downloadLink: { color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontSize: '14px', padding: '0' },
  noFile: { color: '#9ca3af', fontSize: '14px' },
  statusSelect: { padding: '6px 12px', borderRadius: '6px', border: '1px solid transparent', fontSize: '12px', fontWeight: '500', cursor: 'pointer', outline: 'none' },
  actionButtons: { display: 'flex', gap: '8px' },
  editButton: { padding: '6px 12px', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' },
  deleteButton: { padding: '6px 12px', backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' },
  loading: { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', padding: '60px 20px', color: '#6b7280', fontSize: '14px' },
  spinner: { width: '40px', height: '40px', border: '3px solid #e5e7eb', borderTop: '3px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '12px' },
  noResults: { textAlign: 'center' as const, padding: '60px 20px', color: '#9ca3af', fontSize: '14px' },
  noResultsIcon: { fontSize: '48px', marginBottom: '16px' },
};