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
  authorInitial="S", 
  className = "" 
}) => {
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  // --- Tilt Logic ---
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / 20);
    const rotateY = ((x - centerX) / 20);

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };
  const displayImage = typeof image === 'string' ? image : image?.url;

  const navigate = useNavigate()
  const handleRead = (e) => {
    e.stopPropagation()
    if(_id) {
      navigate(`/user/blogs/${_id}`)
    }
  }
  return (
    <div 
      ref={cardRef}
      className={`relative flex flex-col w-full h-[420px] max-w-[350px] bg-[var(--user-bg)] rounded-3xl cursor-pointer transition-transform duration-100 ease-out select-none ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        transform: `perspective(1500px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(${rotation.x !== 0 ? 1.02 : 1}, ${rotation.x !== 0 ? 1.02 : 1}, 1.02)`,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        border: '1px solid rgba(241, 120, 82, 0.1)' 
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >

      <div 
        className="absolute top-0 right-0 w-20 h-20 rounded-tr-3xl rounded-bl-[100%] pointer-events-none opacity-30 transition-all duration-400 group-hover:opacity-80"
        style={{
          background: 'linear-gradient(to bottom left, rgba(241, 120, 82, 0.2), transparent)', 
          transform: 'translateZ(0px)' 
        }}
      />

      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[2px] opacity-0 blur-[4px] transition-all duration-400"
        style={{
          background: 'linear-gradient(90deg, transparent, var(--user-main), transparent)',
          transform: 'translateZ(1px)',
          opacity: rotation.x !== 0 ? 1 : 0, 
          width: rotation.x !== 0 ? '90%' : '80%'
        }}
      />

      <div 
        className="h-48 w-full relative shrink-0 rounded-t-3xl overflow-hidden z-10"
        style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center blur-md opacity-80"
          style={{ 
            backgroundImage: `url('${displayImage}')`,
            transform: 'scale(1.2) translateZ(-10px)'
          }}
        />

        <img 
          src={displayImage} 
          alt={title}
          className="w-full h-full object-cover relative transition-transform duration-600 ease-out"
          style={{ 
            transform: rotation.x !== 0 ? 'translateZ(10px) scale(1.1)' : 'translateZ(10px)'
          }} 
        />
        
        <div 
          className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold shadow-md bg-white/95 backdrop-blur-sm"
          style={{ 
            color: 'var(--user-main)',
            transform: 'translateZ(50px)', 
          }}
        >
          {badge}
        </div>
      </div>

      <div 
        className="p-5 pb-4 rounded-b-3xl relative z-20 flex-1 flex flex-col"
        style={{
          background: 'linear-gradient(to bottom, #fff, var(--user-light))',
          transform: 'translateZ(30px)', 
        }}
      >
        <h3 
          className="text-xl font-extrabold mb-2 line-clamp-1"
          style={{ 
            color: 'var(--user-text)',
          }}
        >
          {title}
        </h3>
        
        <p 
          className="text-sm leading-relaxed mb-3 line-clamp-3 overflow-hidden text-ellipsis"
          style={{ 
            color: 'var(--color-text-muted)', 
          }}
        >
          {description}
        </p>

        <div 
          className="h-[1px] w-full mb-3 mt-auto"
          style={{ 
            background: 'linear-gradient(90deg, transparent, var(--user-border), transparent)',
          }}
        />

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
              style={{ 
                background: 'linear-gradient(135deg, var(--user-main), #fc6076)' 
              }}
            >
              {authorInitial}
            </div>
            <div>
              <div className="text-xs font-bold" style={{ color: 'var(--user-text)' }}>{author.username}</div>
              <div className="text-[10px] text-gray-400">{createdAt}</div>
            </div>
          </div>

          <div className="font-bold text-sm flex items-center gap-1 transition-transform duration-300"
            style={{ 
              color: 'var(--user-main)',
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