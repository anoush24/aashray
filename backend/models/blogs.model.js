const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
    title: {
        type : String,
        required : true
    },
    description: {
        type:String,
        required: true,
        maxLength:300
    },
    content: {
        type : String,
        required : true
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        refPath: 'authorModel'
    },
    authorModel: {
        type:String,
        required:true,
        enum:['UserModel','HospMod']
    },
    badge: {
        type:String,
        enum: ['New', 'Hot', 'Diet', 'Seasonal', 'Finance', 'Training', 'Health', 'Story'],
        default: 'New'
    },
    readTime: {
        type:Number,
        default:3
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserModel'
        }
    ],
    image: {
        url: { type: String, required: true },
        public_id: { type: String, required: true }
    },
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = { Blog };