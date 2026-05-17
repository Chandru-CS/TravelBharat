import { Link } from "react-router-dom";

export default function PlaceCard({ place }) {
  return (
    <Link to={`/place/${place._id}`} className="link-unstyled">
      <article className="card">
        {Array.isArray(place.images) && place.images.length > 0 && (
          <div className="card-image-wrapper">
            <img
              src={place.images[0]}
              alt={place.name}
              className="card-image"
              loading="lazy"
            />
          </div>
        )}
        <h3 className="card-title">{place.name}</h3>
        {place.city && (
          <p className="card-meta">
            {place.city}
            {place.state?.name ? ` · ${place.state.name}` : null}
          </p>
        )}
      </article>
    </Link>
  );
}
