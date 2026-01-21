const { Blog } = require("../models/blogs.model.js");
const { UserModel } = require("../models/user.model.js");
const cloudinary = require("cloudinary").v2;

const createBlog = async (req, res) => {
  try {
    if (!req.user.isBlogger) {
      return res.status(403).json({ message: "Forbidden: You do not have permission to create a blog." });
    }

    const { title, content, description, badge, readTime } = req.body;

    if (!title || !content || !description || !req.file) {
      return res.status(400).json({ message: "Title, content, description, and image are required." });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "blogs"
    });

    const blog = new Blog({
      title,
      description,
      content,
      badge: badge || 'New', 
      readTime: readTime || 3, 
      author: req.user._id,
      authorModel:req.authorModel,
      image: {
        url: result.secure_url,
        public_id: result.public_id
      },

    });

    await blog.save();
    res.status(201).json({ message: "Blog published successfully", blog });
  } catch (err) {
    console.error("Error creating blog:", err);
    res.status(500).json({ success: false, message: "Server error", statusCode: 500 });
  }
};

const getBlogs = async (req, res) => {
  try {
    const userId = req.user?._id?.toString();
    console.log("userId from JWT:", userId);
    const blogs = await Blog.find()
      .populate("author", "username email image") 
      .sort({ createdAt: -1 }); 
    console.log(blogs)
    const modifiedBlogs = blogs.map((blog) => {
      const blogLikes = (blog.likes || [])
        .filter((id) => id)
        .map((id) => id.toString());

      return {
        ...blog._doc,
        liked: userId ? blogLikes.includes(userId) : false,
        likesCount: blogLikes.length,
      };
    });

    res.status(200).json({ success: true, data: modifiedBlogs, message: "All blogs fetched" });

  } catch (err) {
    console.error("Error in getBlogs:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      statusCode: 500,
    });
  }
};

const toggleLike = async (req, res) => {
  try {
    const userId = req.user._id;
    const blogId = req.params.id;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const alrLiked = blog.likes.includes(userId);

    if (alrLiked) {
      // Unlike: Filter out the userId
      blog.likes = blog.likes.filter((id) => id.toString() !== userId.toString());
      await blog.save();
      return res.status(200).json({ message: "Blog unliked" });
    } else {
      // Like: Push userId
      blog.likes.push(userId);
      await blog.save();
      return res.status(200).json({ message: "Blog liked" });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const getBlogById = async (req,res) => {
  try {
    const blogId = req.params.id
    const userId = req.user?._id.toString()

    const blog = await Blog.findById(blogId).populate("author", "username email")
    if(!blog) {
      return res.status(404).json({message:"Blog not found"})
    }
    const blogLikes = (blog.likes || []).map((id) => id.toString());
    const blogData = {
      ...blog._doc,
      liked: userId ? blogLikes.includes(userId) : false,
      likesCount: blogLikes.length,
    };

    res.status(200).json({message:"success",blogData})
  }
  catch(err)
  {
    console.error(err)
    res.status(500).json("Error fetching the blog details")
  }
}

module.exports = {
  createBlog,
  getBlogs,
  toggleLike,
  getBlogById
};