import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import PlaceCard from "../components/PlaceCard";

export default function StatePage() {
  const { id } = useParams();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/places/state/${id}`);
        if (!cancelled) setPlaces(res.data);
      } catch (e) {
        if (!cancelled) {
          setError(
            e?.response?.data?.message ??
              e?.message ??
              "Failed to load places."
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

  return (
    <section>
      <header className="page-header">
        <h1 className="page-title">Places in this state</h1>
        <p className="page-subtitle">
          Explore popular destinations and attractions.
        </p>
      </header>

      {loading ? (
        <p className="status-text">Loading places…</p>
      ) : error ? (
        <p className="status-text error">{error}</p>
      ) : places.length === 0 ? (
        <p className="status-text">No places found.</p>
      ) : (
        <div className="card-grid">
          {places.map((place) => (
            <PlaceCard key={place._id} place={place} />
          ))}
        </div>
      )}
    </section>
  );
}