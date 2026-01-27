import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './createNotes.css'

const API_URL = process.env.REACT_APP_API_URL
// https://vercel-backendd-3.onrender.com

function CreateNotes() {
  const [note, setNote] = useState({
    title: '',
    content: '',
    date: '',
  })

  const navigate = useNavigate()

  const onChangeInput = (e) => {
    const { name, value } = e.target
    setNote({ ...note, [name]: value })
  }

  const createNote = async (e) => {
    e.preventDefault()

    try {
      // ✅ FIXED token key
      const token = localStorage.getItem('tokenStore')

      if (!token) {
        alert('Please login first')
        navigate('/')
        return
      }

      await axios.post(
        `${API_URL}/api/notes`,
        note,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      navigate('/') // success
    } catch (err) {
      console.error(err)

      if (err.response?.status === 401) {
        localStorage.clear()
        navigate('/')
      } else {
        alert('Failed to create note')
      }
    }
  }

  return (
    <div className="create-note">
      <h2>Create Note</h2>

      <form onSubmit={createNote} autoComplete="off">
        <div className="row">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={note.title}
            onChange={onChangeInput}
            required
          />
        </div>

        <div className="row">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            rows="10"
            value={note.content}
            onChange={onChangeInput}
            required
          />
        </div>

        <label htmlFor="date">Date: {note.date}</label>
        <div className="row">
          <input
            type="date"
            id="date"
            name="date"
            value={note.date}
            onChange={onChangeInput}
          />
        </div>

        <button type="submit">Save</button>
      </form>
    </div>
  )
}

export default CreateNotes
