import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Image as ImageIcon,
  Sparkles,
  Send,
  Upload,
  Clock,
  CheckCircle
} from 'lucide-react';
import BlogCard from '../components/BlogCard';
import api from '../services/api';
import toast from 'react-hot-toast';

const CreateBlog = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    badge: 'New',
    readTime: 5,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.content || !imageFile) {
      toast.error('Please fill all fields and upload an image.');
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('content', formData.content);
      data.append('badge', formData.badge);
      data.append('readTime', formData.readTime);
      data.append('image', imageFile);

      await api.post('/blogs/create', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Blog published successfully!');
      navigate('/user/blogs');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to create blog');
    } finally {
      setLoading(false);
    }
  };

  const user = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const previewAuthor = { username: user.username || 'You' };

  return (
    <div className="w-full bg-[var(--color-bg-body)]">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2">
          <div className="p-6 lg:p-12 max-w-2xl mx-auto w-full">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-4 py-2 mb-10 rounded-full border border-gray-200 bg-white text-sm font-semibold text-[var(--color-text-main)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:shadow-sm transition-all group"
            >
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span>Back to Feed</span>
            </button>

            <h1 className="text-3xl font-extrabold text-[var(--color-text-main)] mb-2 font-nunito">
              Create New Post
            </h1>
            <p className="text-[var(--color-text-muted)] mb-8">
              Share your thoughts with the community.
            </p>

            <form onSubmit={handleSubmit} className="space-y-8 pb-24">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-bold text-[var(--color-text-main)] ml-1">Title</label>
                  <span className="text-xs text-gray-400">{formData.title.length}/80</span>
                </div>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Budgeting for your first pet"
                  maxLength={80}
                  className="w-full p-4 rounded-2xl bg-white border border-gray-200 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary-light)] outline-none transition-all font-bold text-lg text-[var(--color-text-main)]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-bold text-[var(--color-text-main)] ml-1">Short Description</label>
                  <span className="text-xs text-gray-400">{formData.description.length}/200</span>
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="A quick summary for the card view..."
                  maxLength={200}
                  className="w-full p-4 h-28 rounded-2xl bg-white border border-gray-200 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary-light)] outline-none transition-all resize-none text-[var(--color-text-main)]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--color-text-main)] ml-1">Full Content</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Write your full article here..."
                  className="w-full p-4 h-64 rounded-2xl bg-white border border-gray-200 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary-light)] outline-none transition-all resize-none text-[var(--color-text-main)]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-[var(--color-text-main)] ml-1">
                    <Clock size={16} /> Read Time (min)
                  </label>
                  <input
                    type="number"
                    name="readTime"
                    min="1"
                    max="60"
                    value={formData.readTime}
                    onChange={handleChange}
                    className="w-full p-4 rounded-2xl bg-white border border-gray-200 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary-light)] outline-none transition-all font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-[var(--color-text-main)] ml-1">
                    <Sparkles size={16} /> Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Finance', 'Health', 'Training', 'Story'].map((badge) => (
                      <button
                        key={badge}
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, badge }))}
                        className={`px-3 py-2 rounded-full text-sm font-bold border transition-all flex-1 ${
                          formData.badge === badge
                            ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md'
                            : 'bg-white text-gray-500 border-gray-200 hover:border-[var(--color-primary)]'
                        }`}
                      >
                        {badge}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-[var(--color-text-main)] ml-1">
                  <ImageIcon size={16} /> Cover Image
                </label>
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={`w-full p-8 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 ${
                    imageFile
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]'
                      : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                  }`}>
                    {imageFile ? (
                      <>
                        <CheckCircle size={32} className="text-[var(--color-primary)]" />
                        <span className="font-bold text-[var(--color-primary)] text-center break-all px-4">
                          {imageFile.name}
                        </span>
                        <span className="text-xs text-gray-500">Click to change image</span>
                      </>
                    ) : (
                      <>
                        <Upload size={32} className="text-gray-400 group-hover:text-[var(--color-primary)] transition-colors" />
                        <span className="font-medium text-gray-500">Click to upload cover image</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-[var(--color-primary)] text-white font-bold text-lg shadow-lg shadow-[var(--color-primary-light)] hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="animate-pulse">Publishing...</span>
                ) : (
                  <>
                    <Send size={20} /> Publish Post
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="hidden md:flex w-1/2 bg-[var(--color-primary-light)] sticky top-20 h-[calc(100vh-5rem)] items-center justify-center p-12 overflow-hidden">
          <div className="relative z-10 scale-110 pointer-events-none">
            <BlogCard
              title={formData.title || 'Post title appears here'}
              description={formData.description || 'Short description'}
              image={
                previewUrl ||
                'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=500&q=80'
              }
              badge={formData.badge}
              author={previewAuthor}
              date="Just now"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;
