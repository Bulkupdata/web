import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Global
import Navbar from "./LandingPage/NewNav/NewNav";
import Footer from "./LandingPage/footer/Footer";
import ScrollToTop from "./ScrollToTop";
import PaymentRedirectHandler from "./LandingPage/Modal/PaymentRedirectHandler";

// Landing
import Hero from "./LandingPage/Hero/Hero";
import RechargeInstructions from "./LandingPage/RechargeInstructions/RechargeInstructions";
import SlidingPage from "./Components/SlidingPage/SlidingPage";

// Policies
import PrivacyPolicy from "./LandingPage/PrivacyPolicy/PrivacyPolicy";
import TermsAndConditions from "./LandingPage/PrivacyPolicy/TermsAndConditions";

// Status
import PaymentSuccess from "./LandingPage/Status/PaymentSuccess";
import RechargeSuccess from "./LandingPage/Status/RechargeSuccess";
import RechargeFailure from "./LandingPage/Status/RechargeFailure";

// Features / Modals
import BulkPurchasePage from "./LandingPage/Modal/BulkPurchasePage";
//import BulkSummaryPage from "./LandingPage/Modal/BulkSummaryPage";
import Auth from "./LandingPage/Modal/Auth";
import UserRechargesPage from "./LandingPage/Modal/UserRechargesPage";
import Admin from "./LandingPage/Modal/Admin";

// Admin
import AdminDashboard from "./LandingPage/AdminDashboard/AdminDashboard";
import FAQPage from "./LandingPage/FAQs/FAQPage";
import FeedbackForm from "./LandingPage/FeedbackForm/FeedbackForm";
import LiveChatButton from "./LandingPage/LiveChatButton/LiveChatButton";
import AdminUsers from "./LandingPage/Modal/AdminUsers";
import FeedbackList from "./LandingPage/FeedbackForm/FeedbackList";

// ✅ Layout wrapper for consistent Navbar/Footer
const PageLayout: React.FC<{
  children: React.ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
}> = ({ children, showNavbar = true, showFooter = true }) => (
  <>
    {showNavbar && <Navbar />}
    <main>{children}</main>
    {showFooter && <Footer />}
  </>
);

// ✅ Small wrapper for protected user route
const UserRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const userId = localStorage.getItem("bulkup_data_userId");

  if (userId) {
    return <>{children}</>; // allow access
  } else {
    return <Navigate to="/auth" replace />; // redirect to login/auth page
  }
};

// ✅ Small wrapper for protected admin route
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const adminId = localStorage.getItem("bulkup_data_admin_userId");
  const adminName = localStorage.getItem("bulkup_data_admin_name");

  if (adminId && adminName) {
    return <>{children}</>; // show dashboard
  } else {
    return <Navigate to="/admin" replace />; // redirect to login
  }
};

function App() {
  return (
    <Router>
      <PaymentRedirectHandler />
      <ScrollToTop />
      <LiveChatButton />

      <Routes>
        {/* Landing Page */}
        <Route
          path="/"
          element={
            <PageLayout>
              <Hero />
              <RechargeInstructions />
              <SlidingPage />
            </PageLayout>
          }
        />

        {/* Status */}
        <Route
          path="/payment-success"
          element={
            <PageLayout>
              <PaymentSuccess />
            </PageLayout>
          }
        />

        <Route
          path="/faqs"
          element={
            <PageLayout>
              <FAQPage />
            </PageLayout>
          }
        />
        <Route
          path="/feedback"
          element={
            <PageLayout>
              <FeedbackForm />
            </PageLayout>
          }
        />
        <Route
          path="/recharge-success"
          element={
            <PageLayout>
              <RechargeSuccess />
            </PageLayout>
          }
        />
        <Route
          path="/recharge-failure"
          element={
            <PageLayout>
              <RechargeFailure />
            </PageLayout>
          }
        />

        {/* Policies */}
        <Route
          path="/privacy-policy"
          element={
            <PageLayout>
              <PrivacyPolicy />
            </PageLayout>
          }
        />
        <Route
          path="/terms-and-conditions"
          element={
            <PageLayout>
              <TermsAndConditions />
            </PageLayout>
          }
        />

        {/* Auth / User */}
        <Route
          path="/auth"
          element={
            <PageLayout showNavbar={false}>
              <Auth />
            </PageLayout>
          }
        />
        <Route
          path="/user-recharge"
          element={
            <PageLayout>
              <UserRoute>
                <UserRechargesPage />
              </UserRoute>
            </PageLayout>
          }
        />

        <Route
          path="/admin"
          element={
            <PageLayout>
              <Admin />
            </PageLayout>
          }
        />
        <Route
          path="/admin-feedbacks"
          element={
            <PageLayout>
              <AdminRoute>
                <FeedbackList />
              </AdminRoute>
            </PageLayout>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <PageLayout>
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            </PageLayout>
          }
        />

        <Route
          path="/admin-users"
          element={
            <PageLayout>
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            </PageLayout>
          }
        />
        {/* Bulk Purchase */}
        <Route
          path="/bulk-data"
          element={
            <PageLayout>
              <BulkPurchasePage />
            </PageLayout>
          }
        />
        {/* <Route
          path="/bulk-summary"
          element={
            <PageLayout>
              <BulkSummaryPage />
            </PageLayout>
          }
        /> */}
      </Routes>
    </Router>
  );
}

export default App;
