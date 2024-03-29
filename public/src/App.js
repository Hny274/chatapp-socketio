import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Chat from './pages/chat';
import SetAvatar from './pages/setAvatar';
import { Toaster } from "react-hot-toast"
export default function App() {
  return <BrowserRouter>
    <Routes>
      <Route path="/register" element={<Register />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/" element={<Chat />}></Route>
      <Route path="/setAvatar" element={<SetAvatar />}></Route>
    </Routes>
    <Toaster position='bottom-center' />
  </BrowserRouter>
}