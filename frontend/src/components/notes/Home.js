import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'timeago.js'
import axios from 'axios'
import './home.css'

const API_URL = process.env.REACT_APP_API_URL;

function Home() {
    const [notes, setNotes] = useState([]);
    const [token, setToken] = useState('');

    const getNotes = async (token) => {
        try {
            const res = await axios.get(`${API_URL}/notes`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotes(res.data.notes || []);
        } catch (err) {
            console.error(err);
            setNotes([]);
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('tokenStore');
        setToken(token);
        if (token) getNotes(token);
    }, []);

    const deleteNote = async (id) => {
        try {
            if (token) {
                await axios.delete(`${API_URL}/notes/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                getNotes(token);
            }
        } catch (err) {
            window.location.href = '/';
        }
    }

    return (
        <div className="notes-wrapper">
            {Array.isArray(notes) && notes.map(note => (
                <div className="card" key={note._id}>
                    <h4 title={note.title}>{note.title}</h4>
                    <div className="text-wrapper">
                        <p>{note.content}</p>
                    </div>
                    <p className='date'>{format(note.date)}</p>
                    <div className="card-footer">
                        {note.name}
                        <Link to={`edit/${note._id}`}> Edit</Link>
                    </div>
                    <button className='close' onClick={() => deleteNote(note._id)}>X</button>
                </div>
            ))}
        </div>
    )
}

export default Home;
