const express = require("express");
const multer  = require('multer')
const Blog = require("../models/blog");
const path = require("path");
const   Comment = require("../models/comment");
const { v2: cloudinary } = require('cloudinary');


const router = express.Router();

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, path.resolve(`./public/uploads/`));
//     },
//     filename: function (req, file, cb) {
//       const fileName = `${Date.now()}-${file.originalname}`;
//       cb(null,fileName);
//     },
//   });

 const storage = multer.memoryStorage();
 const upload = multer({ storage: storage });


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


router.get("/add-new",(req,res)=>{
    return res.render("addBlog",{
        user:req.user
    });
});

router.post("/comments/:blogId",async(req,res)=>{
      await Comment.create({
      content:req.body.content,
      blogId:req.params.blogId,
      createdBy:req.user._id,
    });
    return res.redirect(`/blog/${req.params.blogId}`);
});


router.get("/:id",async (req,res)=>{
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({blogId: req.params.id}).populate("createdBy");
  return res.render("blog",{
    user:req.user,
    blog,
    comments,
  })
});

router.post("/",upload.single("coverImage"), async (req,res)=> {
  try {
    const { title, body } = req.body;

    // Upload to Cloudinary
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "blogs",
        resource_type: "image",
      },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({ error: "Image upload failed" });
        }
        const resizedUrl = result.secure_url.replace("/upload/", "/upload/w_400,h_300,c_fill/");
       
        const blog = await Blog.create({
          title,
          body,
          createdBy: req.user._id,
          coverImageURL: resizedUrl, 
        });

        return res.redirect(`/`);
      }
    );

    stream.end(req.file.buffer);

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;