require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey'; // In production, use environment variable

// Initialize Supabase Client
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase;
if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  console.log('Supabase client initialized successfully.');
  
  // Auto-verify/create the 'images' storage bucket
  supabase.storage.createBucket('images', { public: true })
    .then(({ data, error }) => {
      if (error && error.message !== 'Bucket already exists' && error.error !== 'Duplicate') {
        console.warn('Could not auto-create Supabase bucket "images":', error.message);
      } else {
        console.log('Supabase bucket "images" verified/created successfully.');
      }
    })
    .catch(err => {
      console.warn('Failed to verify/create Supabase bucket:', err.message);
    });
} else {
  console.warn('WARNING: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not defined. File uploads will fallback to local storage.');
}

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Ensure uploads dir exists
if (!fs.existsSync(path.join(__dirname, 'public/uploads'))) {
  fs.mkdirSync(path.join(__dirname, 'public/uploads'), { recursive: true });
}

// Use memory storage for Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// --- Auth API ---
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });
    
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: admin.id, username: admin.username } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// --- Upload API ---
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (supabase) {
      const fileExt = path.extname(req.file.originalname);
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          duplex: 'half'
        });

      if (error) {
        console.error('Supabase storage upload error:', error);
        return res.status(500).json({ error: 'Failed to upload to Supabase storage' });
      }

      const { data: publicUrlData } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      return res.json({ url: publicUrlData.publicUrl });
    } else {
      const fileExt = path.extname(req.file.originalname);
      const fileName = `${Date.now()}${fileExt}`;
      const uploadPath = path.join(__dirname, 'public/uploads', fileName);
      
      fs.writeFileSync(uploadPath, req.file.buffer);
      const imageUrl = `http://localhost:${PORT}/uploads/${fileName}`;
      return res.json({ url: imageUrl });
    }
  } catch (err) {
    console.error('Upload handler error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});


// --- News API ---
app.get('/api/news', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    
    const skip = (page - 1) * limit;

    const where = search ? {
      OR: [
        { title: { contains: search } },
        { description: { contains: search } }
      ]
    } : {};

    const [news, total] = await Promise.all([
      prisma.newsArticle.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.newsArticle.count({ where })
    ]);

    res.json({
      data: news,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

app.post('/api/news', async (req, res) => {
  try {
    const { title, image, date, description } = req.body;
    const news = await prisma.newsArticle.create({
      data: { title, image, date, description }
    });
    res.status(201).json(news);
  } catch (error) {
    res.status(500).json({ error: "Failed to create news" });
  }
});

app.put('/api/news/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, image, date, description } = req.body;
    const news = await prisma.newsArticle.update({
      where: { id },
      data: { title, image, date, description }
    });
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: "Failed to update news" });
  }
});

app.delete('/api/news/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.newsArticle.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete news" });
  }
});

// --- Events API ---
app.get('/api/events', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    
    const skip = (page - 1) * limit;

    const where = search ? {
      OR: [
        { title: { contains: search } },
        { description: { contains: search } }
      ]
    } : {};

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.event.count({ where })
    ]);

    res.json({
      data: events,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const { title, description, location, date, image } = req.body;
    const event = await prisma.event.create({
      data: { title, description, location, date, image }
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: "Failed to create event" });
  }
});

app.put('/api/events/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, description, location, date, image } = req.body;
    const event = await prisma.event.update({
      where: { id },
      data: { title, description, location, date, image }
    });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: "Failed to update event" });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.event.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete event" });
  }
});

// --- Contact API ---
app.get('/api/contact', async (req, res) => {
  try {
    const contacts = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch contact messages" });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const contact = await prisma.contactMessage.create({
      data: { name, email, subject, message }
    });
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ error: "Failed to save contact message" });
  }
});

app.delete('/api/contact/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.contactMessage.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete contact message" });
  }
});

// --- Newsletter API ---
app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const subscriber = await prisma.subscriber.create({
      data: { email }
    });
    res.json(subscriber);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: "Email already subscribed" });
    }
    res.status(500).json({ error: "Failed to subscribe" });
  }
});

app.get('/api/subscribe', async (req, res) => {
  try {
    const subscribers = await prisma.subscriber.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch subscribers" });
  }
});

app.post('/api/subscribe/broadcast', async (req, res) => {
  const { subject, body } = req.body;
  if (!subject || !body) return res.status(400).json({ error: "Subject and body are required" });

  try {
    const subscribers = await prisma.subscriber.findMany();
    // In a real application, you would integrate with SendGrid, Mailchimp, or AWS SES here
    // and send the email asynchronously.
    console.log(`[MOCK BROADCAST] Sending email to ${subscribers.length} subscribers.`);
    console.log(`[Subject]: ${subject}`);
    
    res.json({ message: `Newsletter broadcasted successfully to ${subscribers.length} subscribers!` });
  } catch (error) {
    res.status(500).json({ error: "Failed to broadcast newsletter" });
  }
});

app.delete('/api/subscribe/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.subscriber.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete subscriber" });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
