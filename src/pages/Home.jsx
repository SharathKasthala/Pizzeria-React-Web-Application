import Hero from "../components/HomeComponents/Hero";
import HowItWorks from "../components/HomeComponents/HowItWorks";
import StorySection from "../components/HomeComponents/StorySection";
import IngredientsSection from "../components/HomeComponents/IngredientsSection";
import ChefSection from "../components/HomeComponents/ChefSection";
import DeliverySection from "../components/HomeComponents/DeliverySection";

function Home() {
  return (
    <>
      <Hero />
      <div className="container py-5">
        <HowItWorks />
        <StorySection />
        <IngredientsSection />
        <ChefSection />
        <DeliverySection />
      </div>
    </>
  );
}

export default Home;
