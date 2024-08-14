import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditForm() {
  const { id } = useParams(); // Get the id from the URL
  const navigate = useNavigate(); // For navigation
  const [item, setItem] = useState({ name: '', age: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/complaint/${id}`);
        setItem(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch item.');
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((prevItem) => ({ ...prevItem, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/update_complaint/${id}`, item);
      navigate('/home'); // Redirect to the home page after successful update
    } catch (err) {
      setError('Failed to update item.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Edit Item</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-4 border border-gray-300 rounded-lg">
        <div className="mb-4">
          <label className="block text-gray-700">Name:</label>
          <input
            type="text"
            name="name"
            value={item.name}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Age:</label>
          <input
            type="number"
            name="age"
            value={item.age}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email:</label>
          <input
            type="email"
            name="email"
            value={item.email}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
