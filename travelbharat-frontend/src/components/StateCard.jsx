import { Link } from "react-router-dom";

export default function StateCard({ state }) {
  const handleImageError = (e) => {
    e.target.src = `https://picsum.photos/seed/${state.name}/400/300.jpg`;
  };

  return (
    <Link to={`/state/${state._id}`} className="link-unstyled">
      <article className="card">
        {state.image ? (
          <div className="card-image-wrapper">
            <img
              src={state.image}
              alt={state.name}
              className="card-image"
              loading="lazy"
              onError={handleImageError}
            />
          </div>
        ) : (
          <div className="card-image-wrapper">
            <img
              src={`https://picsum.photos/seed/${state.name}/400/300.jpg`}
              alt={state.name}
              className="card-image"
              loading="lazy"
            />
          </div>
        )}
        <h3 className="card-title">{state.name}</h3>
        {state.description && (
          <p className="card-meta">{state.description}</p>
        )}
      </article>
    </Link>
  );
}