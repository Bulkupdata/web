import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Navbar from "./LandingPage/NewNav/NewNav";
import Footer from "./LandingPage/footer/Footer";
import Hero from "./LandingPage/Hero/Hero";
import RechargeInstructions from "./LandingPage/RechargeInstructions/RechargeInstructions";
import SlidingPage from "./Components/SlidingPage/SlidingPage";
import PrivacyPolicy from "./LandingPage/PrivacyPolicy/PrivacyPolicy";
import TermsAndConditions from "./LandingPage/PrivacyPolicy/TermsAndConditions";
import ScrollToTop from "./ScrollToTop";
import PaymentSuccess from "./LandingPage/Status/PaymentSuccess";
import PaymentRedirectHandler from "./LandingPage/Modal/PaymentRedirectHandler";

// Import the new status pages (adjust paths if needed)
import RechargeSuccess from "./LandingPage/Status/RechargeSuccess";
import RechargeFailure from "./LandingPage/Status/RechargeFailure";

function App() {
  return (
    <Router>
      <PaymentRedirectHandler />
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Hero />
              <RechargeInstructions />
              <SlidingPage />
              <Footer />
            </>
          }
        />

        <Route
          path="/payment-success"
          element={
            <>
              <Navbar />
              <PaymentSuccess />
              <Footer />
            </>
          }
        />

        {/* New routes for recharge success and failure */}
        <Route
          path="/recharge-success"
          element={
            <>
              <Navbar />
              <RechargeSuccess />
              <Footer />
            </>
          }
        />
        <Route
          path="/recharge-failure"
          element={
            <>
              <Navbar />
              <RechargeFailure />
              <Footer />
            </>
          }
        />

        <Route
          path="/privacy-policy"
          element={
            <>
              <Navbar />
              <PrivacyPolicy />
              <Footer />
            </>
          }
        />

        <Route
          path="/terms-and-conditions"
          element={
            <>
              <Navbar />
              <TermsAndConditions />
              <Footer />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;