import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import "../../public/home.css";

export default function Home() {
  const post = "http://localhost:3000";
  const [data2, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${post}/all_complaints`);
        setData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [post]);

  const handleSort = (column) => {
    const sortedData = [...filteredData].sort((a, b) => {
      if (column === "age") {
        const ageA = parseInt(a.age, 10);
        const ageB = parseInt(b.age, 10);
        return sortOrder === "asc" ? ageA - ageB : ageB - ageA;
      } else if (column === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      return 0;
    });

    setFilteredData(sortedData);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setSortColumn(column);
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase().trim();
    setSearchQuery(query);

    if (query === "") {
      setFilteredData(data2);
    } else {
      const filtered = data2.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.age.includes(query) ||
          item.email.toLowerCase().includes(query)
      );
      setFilteredData(filtered);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${post}/delete_complaint/${id}`);
      setFilteredData(filteredData.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleRowClick = (id) => {
    navigate(`/detail/${id}`);
  };

  return (
    <div className="p-6 bg-[#d3e2ff] min-h-screen text-[#00215E] mt-12">
      <div className="max-w-7xl mx-auto mt-12 bg-white p-8 rounded-lg box1">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search..."
          className="mb-4 p-2 border border-gray-300 rounded-lg mr-4"
        />
        <Button>
          <Link to='/form'>New Complaint</Link>
        </Button>
        <table className="min-w-full bg-white border-2 border-gray-800 rounded-lg capitalize">
          <thead>
            <tr className="bg-[#2b73b1] text-white h-16">
              <th className="p-2 border-r-2 border-gray-300">
                s.no
              </th>
              <th className="p-2 border-l-2 border-r-2 border-gray-300">
                <button
                  onClick={() => handleSort("name")}
                  className="underline"
                >
                  Name{" "}
                  {sortColumn === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th className="p-2 border-l-2 border-r-2 border-gray-300">
                <button onClick={() => handleSort("age")} className="underline">
                  Age{" "}
                  {sortColumn === "age" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th className="p-2 border-l-2 border-r-2 border-gray-300">
                Email
              </th>
              <th className="p-2 border-l-2 border-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) =>
              item.age > -1 ? (
                <tr
                  key={item._id}
                  className="border-b border-gray-300 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleRowClick(item._id)}
                >
                  <td className="p-2 border-r-2 border-gray-300">
                    {index + 1}
                  </td>
                  <td className="p-2 border-l-2 border-r-2 border-gray-300">
                    {item.name}
                  </td>
                  <td className="p-2 border-l-2 border-r-2 border-gray-300">
                    {item.age}
                  </td>
                  <td className="p-2 border-l-2 border-r-2 border-gray-300">
                    {item.email}
                  </td>
                  <td className="p-2 border-l-2 border-gray-300">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(item._id);
                      }}
                      className="text-[#3FA2F6] hover:underline mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item._id);
                      }}
                      className="text-[#DC3545] hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ) : null
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
