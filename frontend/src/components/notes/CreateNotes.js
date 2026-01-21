import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './createNotes.css'

const API_URL = process.env.REACT_APP_API_URL;

function CreateNotes() {
  const [note, setNote] = useState({
    title: '',
    content: '',
    date: '',
  })

  const history = useNavigate()

  const onChangeInput = e => {
    const { name, value } = e.target;
    setNote({ ...note, [name]: value })
  }

  const createNote = async e => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('tokenStore')
      if (token) {
        const { title, content, date } = note;
        const newNote = { title, content, date }

        await axios.post(`${API_URL}/api/notes`, newNote, {
          headers: { Authorization: `Bearer ${token}` }
        })

        history('/') // redirect after success
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.clear()
        history('/')
      } else {
        console.error(err)
        alert('Failed to create note')
      }
    }
  }

  return (
    <div className="create-note">
      <h2>Create note</h2>

      <form onSubmit={createNote} autoComplete='off'>
        <div className="row">
          <label htmlFor="title">Title</label>
          <input type="text" id='title' name="title"
            value={note.title} required onChange={onChangeInput}
          />
        </div>

        <div className="row">
          <label htmlFor="content">Content</label>
          <textarea cols="30" rows="10" id='content'  name="content"
            value={note.content} required
            onChange={onChangeInput}
          ></textarea>
        </div>

        <label htmlFor="date">Date: {note.date}</label>
        <div className="row">
          <input type="date" id='date' name="date"
             value={note.date}
             onChange={onChangeInput}
          />
        </div>

        <button type='submit'>Save</button>
      </form>
    </div>
  )
}

export default CreateNotes
