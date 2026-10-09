function PageLoader() {
  return (
    <div className="page-loader" role="status">
      <span className="spinner-border text-primary" aria-hidden="true"></span>
      <span className="visually-hidden">Loading…</span>
    </div>
  );
}

export default PageLoader;
