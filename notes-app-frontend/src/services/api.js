import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000',
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});


export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
};

export const notesAPI = {
  getNotes: () => API.get('/notes'),
  createNote: (noteData) => API.post('/notes', noteData),
  updateNote: (id, noteData) => API.put(`/notes/${id}`, noteData),
  deleteNote: (id) => API.delete(`/notes/${id}`),
};

export const adminAPI = {
  getAllNotes: () => API.get('/admin/notes'),
  getNotesByUser: (userId) => API.get(`/admin/users/${userId}/notes`),
  updateAnyNote: (id, noteData) => API.put(`/admin/notes/${id}`, noteData),
  deleteAnyNote: (id) => API.delete(`/admin/notes/${id}`),
  getAllUsers: () => API.get('/admin/users'),
  getProfile: () => API.get('/admin/profile'),
  changePassword: (passwordData) => API.put('/admin/change-password', passwordData),
  changeUsername: (usernameData) => API.put('/admin/change-username', usernameData),
};

export default API;
