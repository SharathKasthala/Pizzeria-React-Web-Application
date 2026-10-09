// Image + text row; `reverse` puts the image on the right
function FeatureRow({ image, imageAlt, title, children, reverse = false }) {
  return (
    <section className={`feature-row ${reverse ? "feature-row--reverse" : ""}`}>
      <div className="feature-row__media">
        <img src={image} alt={imageAlt} loading="lazy" />
      </div>
      <div className="feature-row__text">
        <h2 className="section-title">{title}</h2>
        {children}
      </div>
    </section>
  );
}

export default FeatureRow;
