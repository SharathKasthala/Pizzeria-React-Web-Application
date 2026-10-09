import ingredients from "../../assets/images/ingredients.jpg";
import FeatureRow from "./FeatureRow";

function IngredientsSection() {
  return (
    <FeatureRow image={ingredients} imageAlt="Pizza dough surrounded by tomatoes, cheese, mushrooms and basil" title="Ingredients">
      <p>
        We're ruthless about goodness. We have no qualms about tearing up a day-old lettuce leaf (straight
        from the farm), or steaming a baby (carrot). Cut. Cut. Chop. Chop. Steam. Steam. Stir. Stir.
      </p>
      <p>While they're still young and fresh, that's our motto. It makes the kitchen a better place.</p>
    </FeatureRow>
  );
}

export default IngredientsSection;
