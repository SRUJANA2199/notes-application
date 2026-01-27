import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import './createNotes.css'

const API_URL = process.env.REACT_APP_API_URL
// https://vercel-backendd-3.onrender.com

function EditNote() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [note, setNote] = useState({
    title: '',
    content: '',
    date: ''
  })

  // ✅ Fetch note
  useEffect(() => {
    const getNote = async () => {
      try {
        const token = localStorage.getItem('tokenStore')
        if (!token) return navigate('/')

        const res = await axios.get(
          `${API_URL}/api/notes/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        setNote({
          title: res.data.title,
          content: res.data.content,
          date: res.data.date?.slice(0, 10) // YYYY-MM-DD
        })
      } catch (err) {
        console.error(err)
        navigate('/')
      }
    }

    getNote()
  }, [id, navigate])

  const onChangeInput = (e) => {
    const { name, value } = e.target
    setNote({ ...note, [name]: value })
  }

  // ✅ Update note
  const editNote = async (e) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem('tokenStore')
      if (!token) return navigate('/')

      await axios.put(
        `${API_URL}/api/notes/${id}`,
        note,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      navigate('/')
    } catch (err) {
      console.error(err)
      navigate('/')
    }
  }

  return (
    <div className="create-note">
      <h2>Edit Note</h2>

      <form onSubmit={editNote} autoComplete="off">
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

        <div className="row">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={note.date}
            onChange={onChangeInput}
          />
        </div>

        <button type="submit">Update</button>
      </form>
    </div>
  )
}

export default EditNote
