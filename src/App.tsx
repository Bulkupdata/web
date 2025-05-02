import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./LandingPage/Index";
import Navbar from "./LandingPage/NewNav/NewNav";
import FAQPage from "./LandingPage/FAQs/FAQPage";
import Footer from "./LandingPage/footer/Footer";
// import SignIn from "./Auth/SignIn";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar /> <Index />
              <Footer />
            </>
          }
        />
        <Route
          path="/faq"
          element={
            <>
              <Navbar /> <FAQPage />
              <Footer />
            </>
          }
        />
        {/* <Route path="/auth-sign-in" element={<SignIn />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
