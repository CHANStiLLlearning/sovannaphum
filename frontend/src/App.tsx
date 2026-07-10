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
import CareersPage from './pages/CareersPage'

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminNews from './pages/admin/AdminNews';
import AdminJobs from './pages/admin/AdminJobs';
import AdminContacts from './pages/admin/AdminContacts';
import AdminSubscribers from './pages/admin/AdminSubscribers';
import AdminLogin from './pages/admin/AdminLogin';

import ScrollToTop from './components/ScrollToTop'
import ProtectedRoute from './components/ProtectedRoute';

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
                <Route path="jobs" element={<AdminJobs />} />
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
                  <Route path="/careers" element={<CareersPage />} />
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
