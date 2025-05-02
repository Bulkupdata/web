import AboutUs from "./AboutUs/AboutUs";
import DataOptions from "./DataOptions/DataPlans";
import Hero from "./Hero/Hero";


const Index = () => {
  return (
    <div style={{ backgroundColor: "white" }}>
      <Hero />
      <DataOptions />
      <AboutUs />
    </div>
  );
};

export default Index;
