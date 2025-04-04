'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { useRouter } from 'next/navigation';
import MapComponent from './MapComponent';
import Sidebar from './Sidebar';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  workType?: string;
  profilePicture?: string;
  address: string;
}

interface SearchProps {
  onSelectUser?: (userId: string) => void;
}

export default function Search({ onSelectUser }: SearchProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 300);
  const [results, setResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const router = useRouter();

  const searchUsers = async (searchQuery: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/search?query=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  useEffect(() => {
    if (debouncedQuery) {
      searchUsers(debouncedQuery);
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  const handleMessageClick = (userId: string) => {
    router.push(`/messenger/${userId}`);
  };

  const handleBookClick = (userId: string) => {
    router.push(`/booking/${userId}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-violet-400 mb-6 text-center">Search Users</h1>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name, email, or work type..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 border border-violet-500 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 mb-6"
        />

        {/* Search Results */}
        <div className="space-y-4">
          {results.map((user) => (
            <div
              key={user._id}
              className={`p-5 border border-gray-700 rounded-lg shadow-md flex items-center justify-between cursor-pointer transition-all duration-300 hover:bg-gray-800 ${
                selectedUser?._id === user._id ? 'bg-gray-800' : ''
              }`}
              onClick={() => handleUserClick(user)}
            >
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden mr-4">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-violet-300 text-lg font-semibold">
                      {user.name ? user.name.charAt(0) : '?'}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white">{user.name}</h3>
                  <p className="text-sm text-gray-400">{user.email}</p>
                  {user.role === 'provider' && (
                    <p className="text-sm text-violet-400">{user.workType}</p>
                  )}
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleMessageClick(user._id)}
                  className="px-4 py-2 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                >
                  Message
                </button>
                <button
                  onClick={() => handleBookClick(user._id)}
                  disabled={user.role !== 'provider'}
                  className={`px-4 py-2 text-sm rounded-lg transition-all duration-300 ${
                    user.role === 'provider'
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  Book
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Map Component (Shows only if a user is selected) */}
        {selectedUser && (
          <div className="mt-6 bg-gray-800 p-5 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-violet-300 mb-3">Location of {selectedUser.name}</h3>
            <MapComponent address={selectedUser.address} />
          </div>
        )}
      </div>
    </div>
  );
}
