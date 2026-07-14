import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import AdmissionsLayout from './pages/admissions/AdmissionsLayout'
import AdmissionsIndex from './pages/admissions/AdmissionsIndex'
import AdmissionProcess from './pages/admissions/AdmissionProcess'
import OurTeachers from './pages/admissions/OurTeachers'
import PaymentMethod from './pages/admissions/PaymentMethod'
import ProgramsLayout from './pages/programs/ProgramsLayout'
import ProgramsIndex from './pages/programs/ProgramsIndex'
import KhmerGeneralEducation from './pages/programs/KhmerGeneralEducation'
import IntegratedEnglish from './pages/programs/IntegratedEnglish'
import GeneralEnglish from './pages/programs/GeneralEnglish'
import ChineseLanguage from './pages/programs/ChineseLanguage'
import NewsPage from './pages/NewsPage'
import NewsDetailPage from './pages/NewsDetailPage'
import ContactPage from './pages/ContactPage'


import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminNews from './pages/admin/AdminNews';
import AdminEvents from './pages/admin/AdminEvents';
import AdminContacts from './pages/admin/AdminContacts';
import AdminSubscribers from './pages/admin/AdminSubscribers';
import AdminLogin from './pages/admin/AdminLogin';

import ScrollToTop from './components/ScrollToTop'
import ProtectedRoute from './components/ProtectedRoute';
import EventPage from './pages/EventPage';
import FacultyPage from './pages/FacultyPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminFaculty from './pages/admin/AdminFaculty';

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
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Admin Routes (Protected) */}
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="news" element={<AdminNews />} />
                <Route path="events" element={<AdminEvents />} />
                <Route path="faculty" element={<AdminFaculty />} />
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
                  <Route path="/admissions" element={<AdmissionsLayout />}>
                    <Route index element={<AdmissionsIndex />} />
                    <Route path="process" element={<AdmissionProcess />} />
                    <Route path="teachers" element={<OurTeachers />} />
                    <Route path="payment" element={<PaymentMethod />} />
                  </Route>
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
