import { NavLink } from "react-router-dom";
import deliveryImage from "../../assets/images/delivery.png";
import FeatureRow from "./FeatureRow";

function DeliverySection() {
  return (
    <FeatureRow image={deliveryImage} imageAlt="Pizza delivery rider" title="45-minute delivery">
      <p>We pride ourselves on delivering your favourite pizzas quickly and efficiently, hot from the oven.</p>
      <NavLink to="/order" className="btn btn-primary mt-2">Start your order</NavLink>
    </FeatureRow>
  );
}

export default DeliverySection;
