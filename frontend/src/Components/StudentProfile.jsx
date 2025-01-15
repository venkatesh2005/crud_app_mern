import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentProfile = () => {
    const [students, setStudents] = useState([]);
    const [currentStudent, setCurrentStudent] = useState(null);
    const [form, setForm] = useState({ name: '', email: '', age: '', phone: '' });

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/students');
            setStudents(res.data);
        } catch (error) {
            console.error('Error fetching students:', error.response ? error.response.data : error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentStudent) {
                // Update student
                const res = await axios.put(`http://localhost:5000/api/students/${currentStudent._id}`, form);
                setStudents(students.map((s) => (s._id === res.data._id ? res.data : s)));
            } else {
                // Create new student
                const res = await axios.post('http://localhost:5000/api/students', form);
                setStudents([...students, res.data]);
            }
            setForm({ name: '', email: '', age: '', phone: '' });
            setCurrentStudent(null);
        } catch (error) {
            console.error('Error submitting form:', error.response ? error.response.data : error.message);
        }
    };

    const handleEdit = (student) => {
        setCurrentStudent(student);
        setForm(student);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/students/${id}`);
            setStudents(students.filter((s) => s._id !== id));
        } catch (error) {
            console.error('Error deleting student:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Student Profiles</h2>

            <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Age"
                        value={form.age}
                        onChange={(e) => setForm({ ...form, age: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="tel"
                        className="form-control"
                        placeholder="Phone Number"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    {currentStudent ? 'Update Student' : 'Add Student'}
                </button>
            </form>

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Age</th>
                        <th>Phone</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, index) => (
                        <tr key={student._id}>
                            <td>{index + 1}</td>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                            <td>{student.age}</td>
                            <td>{student.phone}</td>
                            <td>
                                <button className="btn btn-warning me-2" onClick={() => handleEdit(student)}>
                                    Edit
                                </button>
                                <button className="btn btn-danger" onClick={() => handleDelete(student._id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StudentProfile;
