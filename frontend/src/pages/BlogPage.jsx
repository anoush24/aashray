import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Heart, Share2, ArrowLeft, Mail } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const BlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const user = JSON.parse(localStorage.getItem("userInfo") || "null");
  const currentUserId = user?._id;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await api.get(`/blogs/${id}`);
        const fetchedBlog = response.data.blogData || response.data;

        setBlog(fetchedBlog);
        setLikesCount(fetchedBlog.likes ? fetchedBlog.likes.length : 0);

        if (currentUserId && fetchedBlog.likes) {
          const hasLiked = fetchedBlog.likes.includes(currentUserId);
          setIsLiked(hasLiked);
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        toast.error("Could not load article");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, navigate, currentUserId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleLike = async () => {
    if (!currentUserId) {
      toast.error("Please login to like posts");
      return;
    }

    const previousLiked = isLiked;
    const previousCount = likesCount;

    setIsLiked(!isLiked);
    setLikesCount(prev => !isLiked ? prev + 1 : prev - 1);

    try {
      await api.patch(`/blogs/${id}/toggleLike`);
    } catch (error) {
      console.error("Like failed", error);
      setIsLiked(previousLiked);
      setLikesCount(previousCount);
      toast.error("Failed to like post");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-body)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  if (!blog) return null;

  const authorName = blog.author?.username || "Unknown Author";
  const authorEmail = blog.author?.email || "";

  return (
    <div className="min-h-screen bg-[var(--color-bg-body)] pb-12 font-sans text-[var(--color-text-main)]">
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-gray-200 bg-white text-sm font-semibold text-[var(--color-text-main)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:shadow-sm transition-all group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span>Back to Feed</span>
        </button>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <header className="mb-8">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 text-sm font-bold text-[var(--color-primary)] bg-[var(--color-primary-light)] rounded-full">
              {blog.badge || "Article"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-nunito tracking-tight mb-4 leading-tight text-[var(--color-text-main)]">
            {blog.title}
          </h1>

          <p className="text-lg sm:text-xl text-[var(--color-text-muted)] mb-6 leading-relaxed">
            {blog.description}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6 border-t border-b border-gray-200">
            
            {/* Author Profile */}
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="w-12 h-12 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center text-[var(--color-primary)] mr-4 border border-[var(--color-primary-border)]">
                <User className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-[var(--color-text-main)]">{authorName}</p>
                {authorEmail && (
                  <a
                    href={`mailto:${authorEmail}`}
                    className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] flex items-center transition-colors"
                  >
                    <Mail className="w-3 h-3 mr-1" />
                    {authorEmail}
                  </a>
                )}
              </div>
            </div>

            {/* Date & Read Time */}
            <div className="flex items-center text-[var(--color-text-muted)] space-x-6 text-sm sm:text-base">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <time dateTime={blog.createdAt}>
                  {formatDate(blog.createdAt)}
                </time>
              </div>
              {blog.readTime && (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{blog.readTime} min read</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative w-full aspect-video mb-10 rounded-2xl overflow-hidden shadow-lg bg-gray-100">
          <img
            src={blog.image?.url || "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1000&q=80"}
            alt={blog.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Main Content Area */}
        <div className="prose prose-lg prose-stone max-w-none mb-12 text-[var(--color-text-main)]">
          <p className="whitespace-pre-line leading-8">
            {blog.content}
          </p>
        </div>

        {/* Footer / Interaction Area */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              
              {/* Like Button */}
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-6 py-2 rounded-full border transition-all duration-300 ${
                  isLiked
                    ? 'bg-[var(--color-primary-light)] border-[var(--color-primary)] text-[var(--color-primary)] shadow-sm scale-105'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                }`}
              >
                <Heart
                  className={`w-5 h-5 transition-transform ${isLiked ? 'fill-current scale-110' : 'scale-100'}`}
                />
                <span className="font-medium">
                  {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
                </span>
              </button>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="p-2 text-gray-400 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] rounded-full transition-colors"
                title="Copy Link"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </footer>

      </article>
    </div>
  );
};

export default BlogPage;
