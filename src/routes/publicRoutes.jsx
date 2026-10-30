import { Route } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import About from '../pages/About.jsx';
import Contact from '../pages/Contact.jsx';
import CourseDetail from '../pages/CourseDetail.jsx';
import Courses from '../pages/Courses.jsx';
import Home from '../pages/Home.jsx';
import LoginPage from '../pages/auth/LoginPage.jsx';
import SignupPage from '../pages/auth/SignupPage.jsx';
import ServerErrorPage from '../pages/errors/ServerErrorPage';

const publicRoutes = (
  <>
    {/* Public pages with Navbar and Footer */}
    <Route element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="courses" element={<Courses />} />
      <Route path="courses/:courseId" element={<CourseDetail />} />
      <Route path="about" element={<About />} />
      <Route path="contact" element={<Contact />} />
    </Route>

    {/* Universal top-level auth routes */}
    <Route path="login" element={<LoginPage role="student" />} />
    <Route path="signup" element={<SignupPage role="student" />} />

    {/* Server error page (502) */}
    <Route path="502" element={<ServerErrorPage />} />
  </>
);

export default publicRoutes;