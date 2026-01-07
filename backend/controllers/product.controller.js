const {Product} = require('../models/product.model.js');
const cloudinary = require('cloudinary').v2;

const createProduct = async (req, res) => {
  try {
    const { name, price, description, category, countInStock } = req.body;

    if (!req.file) {
            return res.status(400).json({ message: 'Product image is required.' });
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "products" 
        });

    const product = new Product({
      name,
      price,
      description,
      image: { 
                url: result.secure_url,
                public_id: result.public_id
            },
      category,
      countInStock,
      user: req.user._id, 
    });

const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.status(200).json(product);
    } else {
      return res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


const updateProduct = async (req, res) => {
  try {
    
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { name, price, description,category, countInStock } = req.body;

        let imageUrl = product.image.url; 
        let imagePublicId = product.image.public_id;


        if (req.file) { 
            if (product.image && product.image.public_id) {
                await cloudinary.uploader.destroy(product.image.public_id);
            }

            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "products"
            });
            imageUrl = result.secure_url;
            imagePublicId = result.public_id;
        }
    

    if (product) {
      product.name = req.body.name || product.name;
      product.price = req.body.price || product.price;
      product.description = req.body.description || product.description;
      product.category = req.body.category || product.category;
      product.countInStock = req.body.countInStock || product.countInStock;
      product.image = {
            url: imageUrl,
            public_id: imagePublicId
        };
      
      
      const updatedProduct = await product.save();
      
      res.json(updatedProduct);
    } else {
     
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error("--- 🚨 CRASH DURING PRODUCT UPDATE 🚨 ---", error);
    res.status(500).json({ message: 'Server Error' });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product.image && product.image.public_id) {
            await cloudinary.uploader.destroy(product.image.public_id);
        }
    if (product) {
      await product.deleteOne(); 
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct, 
  deleteProduct,
};