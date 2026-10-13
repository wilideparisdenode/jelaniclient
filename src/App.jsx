import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/common/ProtectedRoute'
import DashboardLayout from './components/dashboard/DashboardLayout'
import HomePage from './pages/HomePage'
import CoursesPage from './pages/CoursesPage'
import CourseDetailPage from './pages/CourseDetailPage'
import CheckoutPage from './pages/CheckoutPage'
import PaymentReturnPage from './pages/PaymentReturnPage'
import PostJobPage from './pages/PostJobPage'
import SupportPage from './pages/SupportPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import PostsPage from './pages/PostsPage'
import PostDetailPage from './pages/PostDetailPage'
import EventsPage from './pages/EventsPage'
import ProfilePage from './pages/ProfilePage'
import AdminCourses from './pages/admin/AdminCourses'
import AdminCategories from './pages/admin/AdminCategories'
import AdminOrders from './pages/admin/AdminOrders'
import AdminRoster from './pages/admin/AdminRoster'
import AdminUsers from './pages/admin/AdminUsers'
import AdminAnnouncements from './pages/admin/AdminAnnouncements'
import AdminPosts from './pages/admin/AdminPosts'
import AdminComments from './pages/admin/AdminComments'
import AdminQuizzes from './pages/admin/AdminQuizzes'
import AdminEvents from './pages/admin/AdminEvents'
import AdminQa from './pages/admin/AdminQa'
import StudentCourses from './pages/student/StudentCourses'
import StudentOrders from './pages/student/StudentOrders'
import StudentAnnouncements from './pages/student/StudentAnnouncements'
import StudentQuizzes from './pages/student/StudentQuizzes'
import StudentQa from './pages/student/StudentQa'

// Public marketing pages share the top-nav Layout. Dashboard areas nest their own
// sidebar layout behind ProtectedRoute (auth) and ProtectedRoute adminOnly (role).
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="courses/:id" element={<CourseDetailPage />} />
        <Route path="post-job" element={<PostJobPage />} />
        <Route path="support" element={<SupportPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="posts" element={<PostsPage />} />
        <Route path="posts/:id" element={<PostDetailPage />} />
        <Route path="events" element={<EventsPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="profile" element={<ProfilePage />} />
          <Route path="checkout/:courseId" element={<CheckoutPage />} />
          <Route path="checkout/success" element={<PaymentReturnPage />} />
          <Route path="checkout/cancel" element={<PaymentReturnPage cancelled />} />

          <Route path="dashboard" element={<DashboardLayout variant="student" />}>
            <Route index element={<Navigate to="courses" replace />} />
            <Route path="courses" element={<StudentCourses />} />
            <Route path="orders" element={<StudentOrders />} />
            <Route path="announcements" element={<StudentAnnouncements />} />
            <Route path="quizzes" element={<StudentQuizzes />} />
            <Route path="qa" element={<StudentQa />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={['admin', 'tutor']} />}>
          <Route path="tutor" element={<DashboardLayout variant="tutor" />}>
            <Route index element={<Navigate to="courses" replace />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="quizzes" element={<AdminQuizzes />} />
            <Route path="posts" element={<AdminPosts />} />
            <Route path="announcements" element={<AdminAnnouncements />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="qa" element={<AdminQa />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="admin" element={<DashboardLayout variant="admin" />}>
            <Route index element={<Navigate to="courses" replace />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="students" element={<AdminRoster />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="announcements" element={<AdminAnnouncements />} />
            <Route path="posts" element={<AdminPosts />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="comments" element={<AdminComments />} />
            <Route path="quizzes" element={<AdminQuizzes />} />
            <Route path="qa" element={<AdminQa />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
