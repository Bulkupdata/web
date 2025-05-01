import AboutUs from "./AboutUs/AboutUs";
import DataOptions from "./DataOptions/DataPlans";
import FAQPage from "./FAQs/FAQPage";
import Hero from "./Hero/Hero";
import Footer from "./footer/Footer";

const Index = () => {
  return (
    <div style={{ backgroundColor: "white" }}>
      <Hero />
      <AboutUs />
      <DataOptions />
      <FAQPage />
      <Footer />
    </div>
  );
};

export default Index;
