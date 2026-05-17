import { useEffect, useState } from "react";
import api from "../services/api";
import StateCard from "../components/StateCard";
import AddContentModal from "../components/AddContentModal";
import { useAuth } from "../AuthContext";

export default function Home() {
  const [states, setStates] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get("/states");
        if (!cancelled) {
          setStates(res.data);
          setFilteredStates(res.data);
        }
      } catch (e) {
        if (!cancelled) {
          setError(
            e?.response?.data?.message ??
              e?.message ??
              "Failed to load states."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredStates(states);
    } else {
      const filtered = states.filter((state) =>
        state.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStates(filtered);
    }
  }, [searchTerm, states]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddState = async (stateData) => {
    try {
      const token = localStorage.getItem('travelbharat_token');
      const response = await fetch('/api/admin/states', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(stateData)
      });

      if (response.ok) {
        const newState = await response.json();
        setStates([...states, newState.state]);
        setFilteredStates([...states, newState.state]);
        setShowAddModal(false);
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to add state');
      }
    } catch (error) {
      throw error;
    }
  };

  const handleAddPlace = async (placeData) => {
    try {
      const token = localStorage.getItem('travelbharat_token');
      const response = await fetch('/api/admin/places', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(placeData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to add place');
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <section>
      <header className="page-header">
        <h1 className="page-title">Discover India by state</h1>
        <p className="page-subtitle">
          Browse hand-picked states and explore their best destinations.
        </p>
      </header>

      {!loading && !error && states.length > 0 && (
        <div className="search-container">
          <input
            type="text"
            placeholder="Search states..."
            className="search-input"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      )}

      {loading ? (
        <p className="status-text">Loading states…</p>
      ) : error ? (
        <p className="status-text error">{error}</p>
      ) : filteredStates.length === 0 ? (
        <p className="status-text">
          {searchTerm ? "No states found matching your search." : "No states found."}
        </p>
      ) : (
        <div className="card-grid">
          {filteredStates.map((state) => (
            <StateCard key={state._id} state={state} />
          ))}
        </div>
      )}

      <AddContentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddState={handleAddState}
        onAddPlace={handleAddPlace}
        states={states}
      />
    </section>
  );
}