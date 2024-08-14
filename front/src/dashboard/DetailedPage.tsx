import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/complaint/${id}`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [id]);

  const handleEdit = () => {
    navigate(`/edit/${id}`);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/delete_complaint/${id}`);
      navigate('/home');
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div className='p-6 bg-[#d3e2ff] min-h-screen text-[#00215E] mt-12'>
      <div className='max-w-7xl mx-auto mt-12 bg-white p-8 rounded-lg shadow-lg'>
        <h2 className='text-2xl font-bold mb-4'>Detail Page</h2>
        <div className='mb-4'>
          <strong>Name:</strong> {data.name}
        </div>
        <div className='mb-4'>
          <strong>Age:</strong> {data.age}
        </div>
        <div className='mb-4'>
          <strong>Email:</strong> {data.email}
        </div>
        <div className='mb-4'>
          <strong>Phone:</strong> {data.phone}
        </div>
        <div className='mb-4'>
          <strong>Address:</strong> {data.address}
        </div>
        <div className='mt-4'>
          <Button onClick={handleEdit} className='mr-2'>
            Edit
          </Button>
          <Button onClick={handleDelete} className='bg-red-500'>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
