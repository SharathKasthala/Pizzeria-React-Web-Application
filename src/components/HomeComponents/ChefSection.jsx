import chefImage from "../../assets/images/chef.png";
import FeatureRow from "./FeatureRow";

function ChefSection() {
  return (
    <FeatureRow image={chefImage} imageAlt="Our chef preparing a pizza" title="Our chefs" reverse>
      <p>
        Our chefs are the heart and soul of our pizzeria. With years of experience and a passion for culinary
        excellence, they craft each pizza with precision and care. From selecting the finest ingredients to
        perfecting the dough, our chefs make every bite a delight.
      </p>
    </FeatureRow>
  );
}

export default ChefSection;
