import React, { useState, useEffect } from 'react';
import { Search, Filter, PlusIcon } from 'lucide-react';
import BlogCard from '../components/BlogCard';
import TornBackground from '../components/TornBackground';
import api from "../services/api";
import { useNavigate } from 'react-router-dom';

const UserBlogs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("userInfo") || '{}');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true)
        const response = await api.get("/blogs/all");
        if (response.data && response.data.success) {
          setBlogs(response.data.data);
        }
      } catch (err) {
        console.error(err);
      }finally {
        setLoading(false)
      }
    };
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative w-full py-10 min-h-screen theme-user bg-[var(--color-bg-body)] text-[var(--color-text-main)]">
      <TornBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-8 pb-12">

        {/* --- Header --- */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold font-nunito text-[var(--color-text-main)]">
              Community Blog
            </h1>
            <p className="text-[var(--color-text-muted)] text-lg mt-1">
              Expert advice, training tips, and heartwarming stories curated just for you.
            </p>
          </div>

          {/* --- Search & Filter --- */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative group w-full md:w-[320px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[var(--user-main)] transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-transparent 
                text-[var(--color-text-main)] placeholder-gray-400 focus:outline-none focus:ring-4 
                focus:ring-[var(--user-light)] shadow-sm transition-all"
              />
            </div>

            <button className="p-3 rounded-2xl bg-white text-gray-500 hover:text-[var(--user-main)] transition-all shadow-sm hover:shadow-md">
              <Filter size={20} />
            </button>
          </div>
        </header>

        {/* --- Blog Grid --- */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-300">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-[var(--user-light)] border-t-[var(--user-main)] animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[var(--user-main)]"></div>
              </div>
            </div>
            <p className="mt-4 font-bold text-[var(--user-main)] animate-pulse">Fetching stories...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map((blog) => (
                <BlogCard
                  key={blog._id}
                  {...blog}
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white mb-4 shadow-sm">
                  <Search className="text-gray-400 w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-[var(--color-text-main)]">No articles found</h3>
                <p className="text-[var(--color-text-muted)]">
                  Try adjusting your search terms.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {user && user.isBlogger && (
        <button
          onClick={() => navigate('/create-blog')}
          className="fixed bottom-8 right-8 z-50 flex items-center bg-[var(--user-main)] hover:bg-[var(--user-hover)] text-white 
          rounded-full shadow-[0_15px_30px_-5px_var(--user-main)] p-4 hover:pr-6 hover:pl-4 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] 
          hover:scale-110 active:scale-95 group"
          aria-label="Create new blog"
        >
          <PlusIcon 
            size={24} 
            className="transition-transform duration-500 group-hover:rotate-90" 
          />
          <span className="max-w-0 overflow-hidden opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 group-hover:ml-3 transition-all duration-500 ease-out whitespace-nowrap font-bold">
            Write Post
          </span>
        </button>
      )}
    </div>
  );
};

export default UserBlogs;