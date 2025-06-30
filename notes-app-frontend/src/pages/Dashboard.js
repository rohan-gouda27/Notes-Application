import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [editingNoteId, setEditingNoteId] = useState(null);
  const navigate = useNavigate();

  const fetchNotes = async () => {
    try {
      const res = await API.get('/notes');
      setNotes(res.data);
    } catch (err) {
      if (err.response.status === 401 || err.response.status === 403) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newNote.title || !newNote.content) return;
    try {
      await API.post('/notes', newNote);
      setNewNote({ title: '', content: '' });
      fetchNotes();
    } catch (err) {
      alert('Failed to create note');
    }
  };

  const handleEdit = async (note) => {
    setEditingNoteId(note.id);
    setNewNote({ title: note.title, content: note.content });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/notes/${editingNoteId}`, newNote);
      setEditingNoteId(null);
      setNewNote({ title: '', content: '' });
      fetchNotes();
    } catch (err) {
      alert('Failed to update note');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await API.delete(`/notes/${id}`);
      fetchNotes();
    } catch (err) {
      alert('Failed to delete note');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(search.toLowerCase()) ||
    note.updated_at.includes(search)
  );

  return (
    <div className="dashboard">
      <h2>My Notes</h2>
      <button onClick={handleLogout}>Logout</button>

      <input
        type="text"
        placeholder="Search by title or date..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginTop: 10, width: '60%' }}
      />

      <form onSubmit={editingNoteId ? handleUpdate : handleCreate} style={{ marginTop: 20 }}>
        <input
          type="text"
          placeholder="Title"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
        /><br />
        <textarea
          rows="5"
          placeholder="Content"
          value={newNote.content}
          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
        /><br />
        <button type="submit">{editingNoteId ? 'Update Note' : 'Add Note'}</button>
      </form>

      <hr />

      {filteredNotes.length > 0 ? (
        filteredNotes.map((note) => (
          <div key={note.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <small>Last Updated: {new Date(note.updated_at).toLocaleString()}</small>
<div style={{ marginTop: '8px' }}>
  <button onClick={() => handleEdit(note)}>Edit</button>
  <button onClick={() => handleDelete(note.id)} style={{ marginLeft: '10px' }}>
    Delete
  </button>
</div>

          </div>
        ))
      ) : (
        <p>No notes found.</p>
      )}
    </div>
  );
};

export default Dashboard;
