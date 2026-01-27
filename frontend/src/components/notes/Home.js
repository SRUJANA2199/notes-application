import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'timeago.js'
import axios from 'axios'
import './home.css'

const API_URL = process.env.REACT_APP_API_URL;

function Home() {
  const [notes, setNotes] = useState([])
  const [token, setToken] = useState(null)

  const getNotes = async (authToken) => {
    try {
      const res = await axios.get(`${API_URL}/api/notes`, {
        headers: { Authorization: `Bearer ${authToken}` }
      })

      setNotes(res.data.notes || [])
    } catch (err) {
      console.error('Error fetching notes:', err)
      setNotes([])
    }
  }

  useEffect(() => {
    const storedToken = localStorage.getItem('tokenStore')
    setToken(storedToken)

    if (storedToken) {
      getNotes(storedToken)
    }
  }, [])

  const deleteNote = async (id) => {
    try {
      if (!token) return

      await axios.delete(`${API_URL}/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      getNotes(token)
    } catch (err) {
      console.error('Delete failed:', err)
      window.location.href = '/'
    }
  }

  return (
    <div className="notes-wrapper">
      {notes.map(note => (
        <div className="card" key={note._id}>
          <h4 title={note.title}>{note.title}</h4>

          <div className="text-wrapper">
            <p>{note.content}</p>
          </div>

          <p className="date">{format(note.date)}</p>

          <div className="card-footer">
            {note.name}
            <Link to={`/edit/${note._id}`}> Edit</Link>
          </div>

          <button className="close" onClick={() => deleteNote(note._id)}>
            X
          </button>
        </div>
      ))}
    </div>
  )
}

export default Home
