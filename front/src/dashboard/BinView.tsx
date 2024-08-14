import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function BinView() {
  const post = 'http://localhost:3000';
  const [binItems, setBinItems] = useState([]);

  useEffect(() => {
    const fetchBinItems = async () => {
      try {
        const response = await axios.get(`${post}/bin_items`);
        setBinItems(response.data);
      } catch (error) {
        console.error("Error fetching bin items:", error);
      }
    };
    fetchBinItems();
  }, [post]);

  const handleRestore = async (id) => {
    try {
      await axios.post(`${post}/restore_item/${id}`);
      setBinItems(binItems.filter(item => item._id !== id)); // Remove restored item from UI
    } catch (error) {
      console.error("Error restoring item:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Bin Items</h2>
      <table className="min-w-full bg-white border-2 border-gray-400 rounded-lg capitalize">
        <thead>
          <tr className="bg-gray-100 text-left border-2 border-gray-400">
            <th className="p-2">Name</th>
            <th className="p-2">Age</th>
            <th className="p-2">Email</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {binItems.map((item) => (
            <tr key={item._id} className="border-b border-gray-200">
              <td className="p-2">{item.name}</td>
              <td className="p-2">{item.age}</td>
              <td className="p-2">{item.email}</td>
              <td className="p-2">
                <button
                  onClick={() => handleRestore(item._id)}
                  className="bg-blue-500 text-white p-1 rounded"
                >
                  Restore
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
