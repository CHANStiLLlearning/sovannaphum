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
const nodemailer = require('nodemailer');

// Configure Email Transporter (Support Gmail App Passwords, Mailtrap, AWS SES, etc.)
const mailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE !== 'false', // True for 465, false for 587
  auth: {
    user: process.env.SMTP_USER, // Your email address
    pass: process.env.SMTP_PASS, // Your App Password / SMTP secret key
  },
});

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
    const timeframe = req.query.timeframe || 'all';
    const dateFilter = req.query.date || '';
    
    const where = search ? {
      OR: [
        { title: { contains: search } },
        { description: { contains: search } }
      ]
    } : {};

    // Get all events matching the search query
    let events = await prisma.event.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Date filtering (Specific Calendar Date match)
    if (dateFilter) {
      const targetTime = Date.parse(dateFilter);
      if (!isNaN(targetTime)) {
        const targetDate = new Date(targetTime);
        targetDate.setHours(0, 0, 0, 0);
        
        events = events.filter(event => {
          const eventTime = Date.parse(event.date);
          if (isNaN(eventTime)) return false;
          const eventDate = new Date(eventTime);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate.getTime() === targetDate.getTime();
        });
      }
    }

    // Date filtering (Upcoming vs Past) in memory
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (timeframe !== 'all') {
      events = events.filter(event => {
        const eventTime = Date.parse(event.date);
        if (isNaN(eventTime)) {
          // Fallback for unparseable dates: treat as upcoming
          return timeframe === 'upcoming';
        }
        const eventDate = new Date(eventTime);
        eventDate.setHours(0, 0, 0, 0);
        return timeframe === 'upcoming' ? eventDate >= today : eventDate < today;
      });
    }

    // Sort:
    // - upcoming: ascending (nearest first)
    // - past / all: descending (most recent first)
    events.sort((a, b) => {
      const timeA = Date.parse(a.date);
      const timeB = Date.parse(b.date);
      
      if (isNaN(timeA)) return 1;
      if (isNaN(timeB)) return -1;
      
      if (timeframe === 'upcoming') {
        return timeA - timeB;
      }
      return timeB - timeA;
    });

    const total = events.length;
    // Paginate in memory
    const paginatedEvents = events.slice((page - 1) * limit, page * limit);

    res.json({
      data: paginatedEvents,
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
    const { title, description, location, date, image, status, badge } = req.body;
    const event = await prisma.event.create({
      data: { title, description, location, date, image, status, badge }
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: "Failed to create event" });
  }
});

app.put('/api/events/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, description, location, date, image, status, badge } = req.body;
    const event = await prisma.event.update({
      where: { id },
      data: { title, description, location, date, image, status, badge }
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

// --- Programs API ---
app.get('/api/programs', async (req, res) => {
  try {
    const programs = await prisma.program.findMany({
      orderBy: { id: 'asc' }
    });
    res.json(programs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch programs" });
  }
});

app.post('/api/programs', async (req, res) => {
  try {
    const { title, description, path, iconName, colorClass } = req.body;
    const program = await prisma.program.create({
      data: { title, description, path, iconName, colorClass }
    });
    res.status(201).json(program);
  } catch (error) {
    res.status(500).json({ error: "Failed to create program" });
  }
});

app.put('/api/programs/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, description, path, iconName, colorClass } = req.body;
    const program = await prisma.program.update({
      where: { id },
      data: { title, description, path, iconName, colorClass }
    });
    res.json(program);
  } catch (error) {
    res.status(500).json({ error: "Failed to update program" });
  }
});

app.delete('/api/programs/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.program.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete program" });
  }
});

// --- Teachers / Faculty API ---
app.get('/api/teachers', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const where = search ? {
      OR: [
        { name: { contains: search } },
        { role: { contains: search } },
        { subject: { contains: search } }
      ]
    } : {};

    const [teachers, total] = await Promise.all([
      prisma.teacher.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.teacher.count({ where })
    ]);

    res.json({
      data: teachers,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch teachers" });
  }
});

app.post('/api/teachers', async (req, res) => {
  try {
    const { name, role, subject, nationality, image } = req.body;
    const teacher = await prisma.teacher.create({
      data: { name, role, subject, nationality: nationality || 'Cambodian', image }
    });
    res.status(201).json(teacher);
  } catch (error) {
    res.status(500).json({ error: "Failed to create teacher" });
  }
});

app.put('/api/teachers/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, role, subject, nationality, image } = req.body;
    const teacher = await prisma.teacher.update({
      where: { id },
      data: { name, role, subject, nationality: nationality || 'Cambodian', image }
    });
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ error: "Failed to update teacher" });
  }
});

app.delete('/api/teachers/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.teacher.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete teacher" });
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
    
    // Check if the same email sent a message in the last 15 minutes
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const existingMessage = await prisma.contactMessage.findFirst({
      where: {
        email,
        createdAt: {
          gte: fifteenMinutesAgo
        }
      }
    });

    if (existingMessage) {
      return res.status(429).json({ 
        error: "You have already sent a message recently. Please wait 15 minutes before sending another one." 
      });
    }

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
    if (subscribers.length === 0) {
      return res.json({ message: "No subscribers found to broadcast to." });
    }

    const emailList = subscribers.map(s => s.email);

    // If SMTP credentials are set, send real emails
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const mailOptions = {
        from: `"Khmer America School" <${process.env.SMTP_USER}>`,
        to: process.env.SMTP_USER, // Send to self
        bcc: emailList,            // BCC all subscribers securely
        subject: subject,
        html: body,                // Render rich text/HTML body
      };

      await mailTransporter.sendMail(mailOptions);
      console.log(`[SMTP BROADCAST] Sent to ${subscribers.length} subscribers.`);
      res.json({ message: `Newsletter broadcasted successfully to ${subscribers.length} subscribers!` });
    } else {
      // Fallback if SMTP not configured yet
      console.warn('[SMTP BROADCAST WARNING] SMTP_USER or SMTP_PASS environment variables are not set. Using MOCK fallback.');
      console.log(`[MOCK BROADCAST] Sending email to ${subscribers.length} subscribers.`);
      console.log(`[Subject]: ${subject}`);
      res.json({ 
        message: `[MOCK MODE] Newsletter broadcasted successfully to ${subscribers.length} subscribers! Configure SMTP in Render Settings to send real emails.` 
      });
    }
  } catch (error) {
    console.error('Failed to send broadcast:', error);
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

// --- Slides API ---
app.get('/api/slides', async (req, res) => {
  try {
    const slides = await prisma.slide.findMany({
      orderBy: { id: 'desc' }
    });
    res.json(slides);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch slides" });
  }
});

app.post('/api/slides', async (req, res) => {
  try {
    const { image, tag, title, description, iconName, primaryBtnText, primaryBtnLink, secondaryBtnText, secondaryBtnLink } = req.body;
    const slide = await prisma.slide.create({
      data: {
        image,
        tag,
        title,
        description,
        iconName: iconName || 'graduation-cap',
        primaryBtnText: primaryBtnText || 'Learn More',
        primaryBtnLink: primaryBtnLink || '/programs',
        secondaryBtnText: secondaryBtnText || 'Contact Us',
        secondaryBtnLink: secondaryBtnLink || '/contact'
      }
    });
    res.status(201).json(slide);
  } catch (error) {
    res.status(500).json({ error: "Failed to create slide" });
  }
});

app.put('/api/slides/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { image, tag, title, description, iconName, primaryBtnText, primaryBtnLink, secondaryBtnText, secondaryBtnLink } = req.body;
    const slide = await prisma.slide.update({
      where: { id },
      data: {
        image,
        tag,
        title,
        description,
        iconName,
        primaryBtnText,
        primaryBtnLink,
        secondaryBtnText,
        secondaryBtnLink
      }
    });
    res.json(slide);
  } catch (error) {
    res.status(500).json({ error: "Failed to update slide" });
  }
});

app.delete('/api/slides/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.slide.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete slide" });
  }
});

// --- Programs API ---
app.get('/api/programs', async (req, res) => {
  try {
    const programs = await prisma.program.findMany({
      orderBy: { id: 'asc' }
    });
    res.json(programs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch programs" });
  }
});

app.post('/api/programs', async (req, res) => {
  try {
    const { title, description, path, iconName, colorClass, ageRange, gradeLevel, image } = req.body;
    const program = await prisma.program.create({
      data: { title, description, path, iconName, colorClass, ageRange, gradeLevel, image }
    });
    res.status(201).json(program);
  } catch (error) {
    console.error("Program create error:", error);
    res.status(500).json({ error: "Failed to create program" });
  }
});

app.put('/api/programs/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, description, path, iconName, colorClass, ageRange, gradeLevel, image } = req.body;
    const program = await prisma.program.update({
      where: { id },
      data: { title, description, path, iconName, colorClass, ageRange, gradeLevel, image }
    });
    res.json(program);
  } catch (error) {
    console.error("Program update error:", error);
    res.status(500).json({ error: "Failed to update program" });
  }
});

app.delete('/api/programs/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.program.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete program" });
  }
});

// --- Testimonials API ---
app.get('/api/testimonials', async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({ orderBy: { id: 'desc' } });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
});

app.post('/api/testimonials', async (req, res) => {
  try {
    const { name, role, image, quote } = req.body;
    const testimonial = await prisma.testimonial.create({ data: { name, role, image, quote } });
    res.status(201).json(testimonial);
  } catch (error) {
    res.status(500).json({ error: "Failed to create testimonial" });
  }
});

app.put('/api/testimonials/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, role, image, quote } = req.body;
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: { name, role, image, quote }
    });
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ error: "Failed to update testimonial" });
  }
});

app.delete('/api/testimonials/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.testimonial.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete testimonial" });
  }
});

// --- FAQ API ---
app.get('/api/faqs', async (req, res) => {
  try {
    const faqs = await prisma.fAQ.findMany({ orderBy: { id: 'desc' } });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch FAQs" });
  }
});

app.post('/api/faqs', async (req, res) => {
  try {
    const { question, answer_kh, answer_en } = req.body;
    const faq = await prisma.fAQ.create({ data: { question, answer_kh, answer_en } });
    res.status(201).json(faq);
  } catch (error) {
    res.status(500).json({ error: "Failed to create FAQ" });
  }
});

app.put('/api/faqs/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { question, answer_kh, answer_en } = req.body;
    const faq = await prisma.fAQ.update({
      where: { id },
      data: { question, answer_kh, answer_en }
    });
    res.json(faq);
  } catch (error) {
    res.status(500).json({ error: "Failed to update FAQ" });
  }
});

app.delete('/api/faqs/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.fAQ.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete FAQ" });
  }
});

// --- Partners API ---
app.get('/api/partners', async (req, res) => {
  try {
    const partners = await prisma.partner.findMany({ orderBy: { id: 'desc' } });
    res.json(partners);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch partners" });
  }
});

app.post('/api/partners', async (req, res) => {
  try {
    const { name, logo } = req.body;
    const partner = await prisma.partner.create({ data: { name, logo } });
    res.status(201).json(partner);
  } catch (error) {
    res.status(500).json({ error: "Failed to create partner" });
  }
});

app.put('/api/partners/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, logo } = req.body;
    const partner = await prisma.partner.update({
      where: { id },
      data: { name, logo }
    });
    res.json(partner);
  } catch (error) {
    res.status(500).json({ error: "Failed to update partner" });
  }
});

app.delete('/api/partners/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.partner.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete partner" });
  }
});

// --- Settings API ---
app.get('/api/settings', async (req, res) => {
  try {
    const dbSettings = await prisma.setting.findMany();
    const settingsMap = {};
    dbSettings.forEach(s => {
      settingsMap[s.key] = s.value;
    });
    res.json(settingsMap);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    const settingsData = req.body;
    const promises = Object.keys(settingsData).map(key => {
      return prisma.setting.upsert({
        where: { key },
        update: { value: String(settingsData[key]) },
        create: { key, value: String(settingsData[key]) }
      });
    });
    await Promise.all(promises);
    const dbSettings = await prisma.setting.findMany();
    const settingsMap = {};
    dbSettings.forEach(s => {
      settingsMap[s.key] = s.value;
    });
    res.json(settingsMap);
  } catch (error) {
    console.error("Settings save error:", error);
    res.status(500).json({ error: "Failed to save settings" });
  }
});

// --- Features API ---
app.get('/api/features', async (req, res) => {
  try {
    let features = await prisma.feature.findMany({
      orderBy: { id: 'asc' }
    });
    
    // Auto-seed defaults if table is empty
    if (features.length === 0) {
      const defaultFeatures = [
        {
          title: 'Classroom Management',
          iconName: 'classroom-management',
          description: 'Nurturing student interaction and positive behaviors to create a highly collaborative classroom learning environment.',
          bgColor: 'bg-blue-500/10 text-blue-600 border-blue-100'
        },
        {
          title: 'Exam & Assessments',
          iconName: 'exam',
          description: 'Comprehensive testing and tracking systems to measure academic milestones and ensure success for every student.',
          bgColor: 'bg-amber-500/10 text-amber-600 border-amber-100'
        },
        {
          title: 'Flexible Payments',
          iconName: 'payment',
          description: 'Providing modern, secure, and hassle-free payment structures for convenient tuitions and school services.',
          bgColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-100'
        },
        {
          title: 'Student Registration',
          iconName: 'student-regi',
          description: 'Seamless online enrollment, registration, and documentation designed to make school onboarding easy for parents.',
          bgColor: 'bg-[#1E3A8A]/10 text-[#1E3A8A] border-[#1E3A8A]/20'
        },
        {
          title: 'Advanced Settings',
          iconName: 'setting',
          description: 'Tailored school rules, configurations, and state-of-the-art facilities adapted to individual student needs.',
          bgColor: 'bg-purple-500/10 text-purple-600 border-purple-100'
        }
      ];
      
      await Promise.all(defaultFeatures.map(f => prisma.feature.create({ data: f })));
      features = await prisma.feature.findMany({ orderBy: { id: 'asc' } });
    }
    
    res.json(features);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch features" });
  }
});

app.post('/api/features', async (req, res) => {
  try {
    const { title, description, iconName, bgColor } = req.body;
    const feature = await prisma.feature.create({
      data: { title, description, iconName, bgColor }
    });
    res.status(201).json(feature);
  } catch (error) {
    res.status(500).json({ error: "Failed to create feature" });
  }
});

app.put('/api/features/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, description, iconName, bgColor } = req.body;
    const feature = await prisma.feature.update({
      where: { id },
      data: { title, description, iconName, bgColor }
    });
    res.json(feature);
  } catch (error) {
    res.status(500).json({ error: "Failed to update feature" });
  }
});

app.delete('/api/features/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.feature.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete feature" });
  }
});

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Server is running on port ${PORT}`);
  
});
