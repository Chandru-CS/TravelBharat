import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function PlaceDetails() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/places/${id}`);
        if (!cancelled) setPlace(res.data);
      } catch (e) {
        if (!cancelled) {
          setError(
            e?.response?.data?.message ??
              e?.message ??
              "Failed to load place details."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <p className="status-text">Loading place details…</p>;
  }

  if (error) {
    return <p className="status-text error">{error}</p>;
  }

  if (!place) {
    return <p className="status-text">Place not found.</p>;
  }

  return (
    <section className="details-layout">
      <h1 className="details-title">{place.name}</h1>

      {Array.isArray(place.images) && place.images.length > 0 && (
        <div className="details-gallery">
          {place.images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`${place.name} view ${index + 1}`}
              className="details-image"
              loading="lazy"
            />
          ))}
        </div>
      )}

      {place.city && (
        <p className="details-text">
          {place.city}
          {place.state?.name ? ` · ${place.state.name}` : null}
        </p>
      )}

      {place.description && (
        <p className="details-text">{place.description}</p>
      )}

      <div className="details-meta">
        {place.bestTime && (
          <p className="details-text">
            <strong>Best time to visit:</strong> {place.bestTime}
          </p>
        )}
        {place.timings && (
          <p className="details-text">
            <strong>Timings:</strong> {place.timings}
          </p>
        )}
        {place.entryFee && (
          <p className="details-text">
            <strong>Entry fee:</strong> {place.entryFee}
          </p>
        )}
        {place.location && (
          <p className="details-text">
            <strong>Location:</strong> {place.location}
          </p>
        )}
      </div>

      {Array.isArray(place.nearbyAttractions) &&
        place.nearbyAttractions.length > 0 && (
          <div className="details-extra">
            <h2 className="details-subtitle">Nearby attractions</h2>
            <ul className="details-list">
              {place.nearbyAttractions.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
    </section>
  );
}

// import React from "react";

// function PlaceDetails() {
//   return (
//     <div>
//       <h1>Place Details</h1>
//     </div>
//   );
// }

// export default PlaceDetails;