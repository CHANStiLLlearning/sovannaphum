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

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Seed default slides if table is empty
  try {
    const slideCount = await prisma.slide.count();
    if (slideCount === 0) {
      await prisma.slide.createMany({
        data: [
          {
            image: "/images/a.png",
            tag: "WELCOME TO KHMER AMERICA SCHOOL",
            title: "Shaping Leaders of the Digital Era",
            description: "Offering high-quality education programs from kindergarten through high school, integrated with global standards and values.",
            iconName: "graduation-cap",
            primaryBtnText: "Our Programs",
            primaryBtnLink: "/programs",
            secondaryBtnText: "Contact Us",
            secondaryBtnLink: "/contact"
          },
          {
            image: "/images/b.png",
            tag: "ADMISSIONS OPEN FOR 2026-2027",
            title: "Secure Your Child's Education Today",
            description: "Register early to receive special enrollment privileges. Guided campus tours and consultations are available daily.",
            iconName: "compass",
            primaryBtnText: "Admission Info",
            primaryBtnLink: "/admissions",
            secondaryBtnText: "Inquire Now",
            secondaryBtnLink: "/contact"
          },
          {
            image: "/images/c.png",
            tag: "DIVERSE & VIBRANT SCHOOL LIFE",
            title: "A Community Built on Excellence",
            description: "Engage in sports tournaments, science exhibitions, and art festivals to discover your inner talents and build confidence.",
            iconName: "calendar",
            primaryBtnText: "School Events",
            primaryBtnLink: "/eventpage",
            secondaryBtnText: "Read Latest News",
            secondaryBtnLink: "/news"
          },
          {
            image: "/images/d.png",
            tag: "INTEGRATED ENGLISH & CHINESE",
            title: "Fluent in Language, Global in Outlook",
            description: "Master foreign languages from certified native instructors using interactive, modern classroom teaching technology.",
            iconName: "graduation-cap",
            primaryBtnText: "Language Courses",
            primaryBtnLink: "/programs",
            secondaryBtnText: "Contact Office",
            secondaryBtnLink: "/contact"
          }
        ]
      });
      console.log("Sample slides seeded successfully.");
    }
  } catch (err) {
    console.warn("Failed to automatically seed slides:", err.message);
  }

  // Seed default programs if table is empty
  try {
    const programCount = await prisma.program.count();
    if (programCount === 0) {
      await prisma.program.createMany({
        data: [
          {
            title: 'Khmer General Education',
            description: 'A comprehensive national curriculum recognized by the Ministry of Education, Youth and Sport.',
            path: '/programs/kge',
            iconName: 'book-open',
            colorClass: 'bg-blue-50/70 text-blue-600 border border-blue-100/50'
          },
          {
            title: 'Integrated English Program (IEP)',
            description: 'An advanced dual-curriculum blending Cambodian national standards with international English proficiency.',
            path: '/programs/iep',
            iconName: 'globe',
            colorClass: 'bg-amber-50/70 text-amber-500 border border-amber-100/50'
          },
          {
            title: 'General English Program (GEP)',
            description: 'Dedicated English language instruction focused on listening, speaking, reading, and writing skills.',
            path: '/programs/gep',
            iconName: 'message-square',
            colorClass: 'bg-emerald-50/70 text-emerald-600 border border-emerald-100/50'
          },
          {
            title: 'Chinese Language Program',
            description: 'Standardized Chinese language courses equipping students for international opportunities.',
            path: '/programs/chinese',
            iconName: 'languages',
            colorClass: 'bg-red-50/70 text-[#9A2220] border border-red-100/50'
          }
        ]
      });
      console.log("Sample programs seeded successfully.");
    }
  } catch (err) {
    console.warn("Failed to automatically seed programs:", err.message);
  }

  // Seed default settings if empty or missing
  try {
    const defaultSettings = [
      { key: 'about_hero_image', value: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1920' },
      { key: 'about_hero_title', value: 'About Us' },
      { key: 'about_mission_title', value: 'Our Mission' },
      { key: 'about_mission_desc', value: 'To provide our students with the highest quality of education, combining international academic standards with rich Cambodian cultural values. We aim to nurture young minds to become innovative thinkers and responsible global citizens.' },
      { key: 'about_vision_title', value: 'Our Vision' },
      { key: 'about_vision_desc', value: 'To be the leading educational institution in Cambodia that is recognized internationally for academic excellence, character development, and equipping students with the essential skills to thrive in the 21st century.' },
      { key: 'contact_hero_title', value: 'Contact Us' },
      { key: 'contact_hero_subtitle', value: 'Get in touch with Khmer America School' },
      { key: 'contact_hero_image', value: 'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?q=80&w=1920' },
      { key: 'contact_phone', value: '(+855) 15 838 015' },
      { key: 'contact_email', value: 'info@khmeramericaschool.edu.kh' },
      { key: 'contact_telegram', value: 't.me/khmeramericaschoolcambodia' },
      { key: 'contact_address', value: 'St. 60CVV Dermkor Village, Sangkat Chrouy changvar, Khan Chrouy Changvar, Phnom Penh.' },
      { key: 'contact_linkedin', value: '@khmeramericaschoolcambodia' },
      { key: 'contact_facebook', value: 'Khmer America School, Cambodia' },
      { key: 'contact_instagram', value: '@khmeramericaschool' },
      { key: 'contact_tiktok', value: '@khmeramericaschool' },
      { key: 'contact_map_iframe', value: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15635.882414777322!2d104.915725!3d11.5594002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109513e9a5a3a71%3A0x6e0988ccafcb89af!2sSovannaphumi%20School!5e0!3m2!1sen!2skh!4v1700000000000!5m2!1sen!2skh' },
      { key: 'faculty_hero_title', value: 'Meet Our Faculty' },
      { key: 'faculty_hero_subtitle', value: 'Dedicated educators shaping the next generation with passion, expertise, and care.' },
      { key: 'faculty_hero_image', value: 'https://images.unsplash.com/photo-1580637182598-a836179cf7b9?auto=format&fit=crop&q=80&w=1920' },
      { key: 'event_hero_title', value: 'School Events & Activities' },
      { key: 'event_hero_subtitle', value: 'Stay updated with our upcoming events, academic exhibitions, sports championships, and cultural celebrations.' },
      { key: 'event_hero_image', value: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1920' },
      { key: 'program_hero_title', value: 'Academic Programs' },
      { key: 'program_hero_image', value: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=1920' },
      { key: 'mgmt_name', value: 'Mr. CHAN' },
      { key: 'mgmt_title', value: 'Chief Executive Officer' },
      { key: 'mgmt_photo', value: 'https://portfolio-web-eosin-alpha.vercel.app/assets/keokimchan-CZlzWr5F.png' },
      { key: 'mgmt_welcome_title', value: 'Welcome to Khmer America School' },
      { key: 'mgmt_message_1', value: 'Education is the most powerful weapon which you can use to change the world. At Khmer America School, we are committed to providing the highest quality education to build the future leaders of Cambodia.' },
      { key: 'mgmt_message_2', value: 'Since our founding, we have continuously strived for excellence, expanding our reach and improving our curriculum to meet international standards while preserving our rich Khmer culture and heritage.' },
      { key: 'mgmt_message_3', value: 'I invite you to join our growing community of learners, educators, and parents who share a common vision: empowering the next generation with knowledge, character, and skills for success in a rapidly changing world.' }
    ];
    const promises = defaultSettings.map(async (s) => {
      const exists = await prisma.setting.findUnique({ where: { key: s.key } });
      if (!exists) {
        await prisma.setting.create({ data: s });
      }
    });
    await Promise.all(promises);
    console.log("Sample settings seeded successfully.");
  } catch (err) {
    console.warn("Failed to automatically seed settings:", err.message);
  }
});
