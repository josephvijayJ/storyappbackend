const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const loginRoute = require('./routes/login');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const postRoute = require('./routes/posts');
const categoryRoute = require('./routes/categories');
const { cloudinary } = require('./utils/cloudinary');

const app = express();
dotenv.config();
let options = {
  origin: '*',
};
app.use(cors(options));

app.use(express.json({ limit: '50mb', extended: true }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.post('/api/upload', async (req, res) => {
  try {
    const fileStr = req.body.data;
    const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: 'blog_image',
    });

    const url = uploadedResponse.secure_url;
    console.log(uploadedResponse);
    res.json({ msg: ' Image Uploaded !!!!!!', url: url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: 'Something Went Wrong' });
  }
});

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
  .then(console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

app.use('/api/login', loginRoute);
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/posts', postRoute);
app.use('/api/categories', categoryRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Backend is Running ${port}`));
