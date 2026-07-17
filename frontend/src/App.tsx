import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import CoreValuesPage from './pages/CoreValuesPage'

import ProgramsLayout from './pages/programs/ProgramsLayout'
import ProgramsIndex from './pages/programs/ProgramsIndex'
import KhmerGeneralEducation from './pages/programs/KhmerGeneralEducation'
import IntegratedEnglish from './pages/programs/IntegratedEnglish'
import GeneralEnglish from './pages/programs/GeneralEnglish'
import ChineseLanguage from './pages/programs/ChineseLanguage'
import NewsPage from './pages/NewsPage'
import NewsDetailPage from './pages/NewsDetailPage'
import ContactPage from './pages/ContactPage'


import AdminLayout from './pages/admin/layout/AdminLayout';
import AdminDashboard from './pages/admin/dashboard/AdminDashboard';
import AdminNews from './pages/admin/news/AdminNews';
import AdminEvents from './pages/admin/events/AdminEvents';
import AdminContacts from './pages/admin/inbox/AdminContacts';
import AdminSubscribers from './pages/admin/inbox/AdminSubscribers';
import AdminLogin from './pages/admin/auth/AdminLogin';
import AdminSlides from './pages/admin/slides/AdminSlides';

import ScrollToTop from './components/ScrollToTop'
import ProtectedRoute from './components/ProtectedRoute';
import EventPage from './pages/EventPage';
import FacultyPage from './pages/FacultyPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminFaculty from './pages/admin/faculty/AdminFaculty';
import AdminPrograms from './pages/admin/programs/AdminPrograms';
import AdminAboutUs from './pages/admin/school-info/AdminAboutUs';
import AdminContactUs from './pages/admin/school-info/AdminContactUs';
import AdminFAQ from './pages/admin/school-info/AdminFAQ';
import AdminPartners from './pages/admin/school-info/AdminPartners';

const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-white font-sans flex flex-col">
    <Header />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Admin Login Route */}
            <Route path="/kas-portal-entry" element={<AdminLogin />} />

            {/* Admin Routes (Protected) */}
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="news" element={<AdminNews />} />
                <Route path="events" element={<AdminEvents />} />
                <Route path="faculty" element={<AdminFaculty />} />
                <Route path="slides" element={<AdminSlides />} />
                <Route path="programs" element={<AdminPrograms />} />
                <Route path="about-us" element={<AdminAboutUs />} />
                <Route path="contact-us" element={<AdminContactUs />} />
                <Route path="faq" element={<AdminFAQ />} />
                <Route path="partners" element={<AdminPartners />} />
                <Route path="contacts" element={<AdminContacts />} />
                <Route path="subscribers" element={<AdminSubscribers />} />
              </Route>
            </Route>

            {/* Public Routes */}
            <Route path="/*" element={
              <PublicLayout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/about/core-values" element={<CoreValuesPage />} />

                  <Route path="/programs" element={<ProgramsLayout />}>
                    <Route index element={<ProgramsIndex />} />
                    <Route path="kge" element={<KhmerGeneralEducation />} />
                    <Route path="iep" element={<IntegratedEnglish />} />
                    <Route path="gep" element={<GeneralEnglish />} />
                    <Route path="chinese" element={<ChineseLanguage />} />
                  </Route>
                  <Route path="/news" element={<NewsPage />} />
                  <Route path="/news/:id" element={<NewsDetailPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/eventpage" element={<EventPage />} />
                  <Route path="/faculty" element={<FacultyPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </PublicLayout>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  )
}

export default App
