import React, { useState, useEffect } from "react";
import axios from "axios";
import UserForm from "./UserForm";
import "./UserList.css";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(6); // Show 6 users per page

    // Fetch users from the API

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("https://jsonplaceholder.typicode.com/users");
                setUsers(response.data);
            } catch (err) {
                setError("Failed to fetch users. Please try again later.");
            }
        };
        fetchUsers();
    }, []);

    // Clear error when dismissed or new API calls succeed
    const clearError = () => setError("");

    // Pagination Logic

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(users.length / usersPerPage);

    // Handle delete user

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
            setUsers(users.filter((user) => user.id !== id));
        } catch {
            setError("Failed to delete the user. Please try again.");
        }
    };

    // Handle edit user

    const handleEdit = (user) => {
        setEditingUser(user);
        setShowForm(true);
    };

    // Handle add new user
    
    const handleAdd = () => {
        setEditingUser(null);
        setShowForm(true);
    };

    // Handle save user
    const handleSave = (newUser) => {
        if (editingUser) {
            // PUT request to update the user
            axios
                .put(`https://jsonplaceholder.typicode.com/users/${newUser.id}`, newUser)
                .then((response) => {
                    setUsers(users.map((user) => (user.id === newUser.id ? newUser : user)));
                    setShowForm(false);
                    clearError();
                })
                .catch(() => {
                    setError("Failed to save changes. Please try again.");
                });
        } else {
            // POST request to add a new user
            axios
                .post("https://jsonplaceholder.typicode.com/users", newUser)
                .then((response) => {
                    // Simulate adding a new user by generating an ID
                    setUsers([...users, { ...newUser, id: Date.now() }]);
                    setShowForm(false);
                    clearError();
                })
                .catch(() => {
                    setError("Failed to add the user. Please try again.");
                });
        }
    };

    return (
        <div className="user-list-container">
            <h2>User List</h2>

            {/* Error message */}
            {error && (
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={clearError} className="close-error-btn">
                        Dismiss
                    </button>
                </div>
            )}

            {/* User list table */}
            <div className="table-container">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name.split(" ")[0]}</td>
                                <td>{user.name.split(" ")[1]}</td>
                                <td>{user.email}</td>
                                <td>{user.department || "N/A"}</td>
                                <td>
                                    <button onClick={() => handleEdit(user)} className="edit-btn">Edit</button>
                                    <button onClick={() => handleDelete(user.id)} className="delete-btn">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="pagination-container">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => paginate(index + 1)}
                            className="pagination-btn"
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>

            {/* Add user button */}
            <div className="add-user-container">
                <button onClick={handleAdd} className="add-user-btn">
                    Add User
                </button>
            </div>

            {/* Render user form */}
            {showForm && (
                <div className="user-form-container">
                    <UserForm
                        user={editingUser}
                        onSave={handleSave}
                        onCancel={() => setShowForm(false)}
                    />
                </div>
            )}
        </div>
    );
};

export default UserList;
