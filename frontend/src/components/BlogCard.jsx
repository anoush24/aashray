import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const BlogCard = ({ 
  _id,
  title, 
  description, 
  image, 
  badge = "New", 
  author, 
  createdAt, 
  authorInitial = "S", 
  className = "" 
}) => {
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const user = JSON.parse(localStorage.getItem("userInfo") || "null");
  const navigate = useNavigate();

  // --- Tilt Logic ---
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setRotation({
      x: -((y - centerY) / 20),
      y: ((x - centerX) / 20)
    });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  const displayImage = typeof image === 'string' ? image : image?.url;

  const handleRead = (e) => {
    e.stopPropagation();
    if (!_id) return;

    const basePath =
      user?.role === "hospital" ? "/hospital/blogs" : "/user/blogs";

    navigate(`${basePath}/${_id}`);
  };

  return (
    <div
      ref={cardRef}
      className={`relative flex flex-col w-full h-[420px] max-w-[350px] 
      bg-[var(--color-bg-body)] rounded-3xl cursor-pointer 
      transition-transform duration-100 ease-out select-none ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        transform: `perspective(1500px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)
          scale3d(${rotation.x !== 0 ? 1.02 : 1}, ${rotation.x !== 0 ? 1.02 : 1}, 1.02)`,
        boxShadow:
          '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
        border: '1px solid var(--color-primary-border)'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Accent corner */}
      <div
        className="absolute top-0 right-0 w-20 h-20 rounded-tr-3xl rounded-bl-[100%] opacity-30"
        style={{
          background:
            'linear-gradient(to bottom left, color-mix(in srgb, var(--color-primary) 20%, transparent), transparent)'
        }}
      />

      {/* Bottom glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] blur-[4px]"
        style={{
          background:
            'linear-gradient(90deg, transparent, var(--color-primary), transparent)',
          opacity: rotation.x !== 0 ? 1 : 0,
          width: rotation.x !== 0 ? '90%' : '80%'
        }}
      />

      {/* Image */}
      <div
        className="h-48 w-full relative rounded-t-3xl overflow-hidden"
        style={{ transform: 'translateZ(20px)' }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center blur-md opacity-80"
          style={{ backgroundImage: `url('${displayImage}')` }}
        />

        <img
          src={displayImage}
          alt={title}
          className="w-full h-full object-cover"
          style={{
            transform:
              rotation.x !== 0
                ? 'translateZ(10px) scale(1.1)'
                : 'translateZ(10px)'
          }}
        />

        <div
          className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold bg-white"
          style={{ color: 'var(--color-primary)' }}
        >
          {badge}
        </div>
      </div>

      {/* Content */}
      <div
        className="p-5 flex-1 flex flex-col rounded-b-3xl"
        style={{
          background:
            'linear-gradient(to bottom, #fff, var(--color-primary-light))',
          transform: 'translateZ(30px)'
        }}
      >
        <h3
          className="text-xl font-extrabold mb-2 line-clamp-1"
          style={{ color: 'var(--color-text-main)' }}
        >
          {title}
        </h3>

        <p
          className="text-sm mb-3 line-clamp-3"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {description}
        </p>

        <div
          className="h-px w-full mt-auto mb-3"
          style={{
            background:
              'linear-gradient(90deg, transparent, var(--color-primary-border), transparent)'
          }}
        />

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{
                background:
                  'linear-gradient(135deg, var(--color-primary), #fc6076)'
              }}
            >
              {authorInitial}
            </div>
            <div>
              <div
                className="text-xs font-bold"
                style={{ color: 'var(--color-text-main)' }}
              >
                {author.username}
              </div>
              <div className="text-[10px] text-gray-400">{createdAt}</div>
            </div>
          </div>

          <div
            className="font-bold text-sm cursor-pointer"
            style={{
              color: 'var(--color-primary)',
              transform: rotation.x !== 0 ? 'translateX(5px)' : 'none'
            }}
            onClick={handleRead}
          >
            Read
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
