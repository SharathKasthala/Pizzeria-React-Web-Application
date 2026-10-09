const STEPS = [
  { title: "Pick a pizza", text: "Choose from the menu, filtered by veg or non-veg." },
  { title: "Make it yours", text: "Add extra toppings and watch the price update as you go." },
  { title: "Delivered in 45 min", text: "Pay on delivery by cash or UPI." },
];

function HowItWorks() {
  return (
    <section className="how" aria-labelledby="how-title">
      <h2 id="how-title" className="section-title">How ordering works</h2>
      <ol className="how__steps">
        {STEPS.map((s) => (
          <li key={s.title}>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default HowItWorks;
