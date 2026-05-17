import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('states');
  const [states, setStates] = useState([]);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [admin, setAdmin] = useState(null);

  // Form states
  const [stateForm, setStateForm] = useState({ name: '', description: '', image: '' });
  const [placeForm, setPlaceForm] = useState({
    name: '',
    state: '',
    city: '',
    category: 'Heritage',
    description: '',
    bestTime: '',
    entryFee: '',
    timings: '',
    location: '',
    images: [''],
    nearbyAttractions: ['']
  });

  useEffect(() => {
    if (token) {
      verifyToken();
      fetchData();
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await fetch('/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAdmin(data.admin);
      } else {
        localStorage.removeItem('adminToken');
        setToken(null);
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('adminToken');
      setToken(null);
    }
  };

  const fetchData = async () => {
    try {
      const [statesRes, placesRes] = await Promise.all([
        fetch('/api/admin/states'),
        fetch('/api/admin/places')
      ]);
      
      if (statesRes.ok && placesRes.ok) {
        const statesData = await statesRes.json();
        const placesData = await placesRes.json();
        setStates(statesData);
        setPlaces(placesData);
      }
    } catch (error) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddState = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/states', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(stateForm)
      });

      if (response.ok) {
        setStateForm({ name: '', description: '', image: '' });
        fetchData();
        setError('');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to add state');
      }
    } catch (error) {
      setError('Failed to add state');
    }
  };

  const handleAddPlace = async (e) => {
    e.preventDefault();
    try {
      const placeData = {
        ...placeForm,
        images: placeForm.images.filter(img => img.trim()),
        nearbyAttractions: placeForm.nearbyAttractions.filter(attr => attr.trim())
      };

      const response = await fetch('/api/admin/places', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(placeData)
      });

      if (response.ok) {
        setPlaceForm({
          name: '',
          state: '',
          city: '',
          category: 'Heritage',
          description: '',
          bestTime: '',
          entryFee: '',
          timings: '',
          location: '',
          images: [''],
          nearbyAttractions: ['']
        });
        fetchData();
        setError('');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to add place');
      }
    } catch (error) {
      setError('Failed to add place');
    }
  };

  const handleDeleteState = async (stateId) => {
    if (!window.confirm('Are you sure you want to delete this state and all its places?')) return;

    try {
      const response = await fetch(`/api/admin/states/${stateId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        fetchData();
        setError('');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete state');
      }
    } catch (error) {
      setError('Failed to delete state');
    }
  };

  const handleDeletePlace = async (placeId) => {
    if (!window.confirm('Are you sure you want to delete this place?')) return;

    try {
      const response = await fetch(`/api/admin/places/${placeId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        fetchData();
        setError('');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete place');
      }
    } catch (error) {
      setError('Failed to delete place');
    }
  };

  const addImageField = () => {
    setPlaceForm({ ...placeForm, images: [...placeForm.images, ''] });
  };

  const updateImageField = (index, value) => {
    const newImages = [...placeForm.images];
    newImages[index] = value;
    setPlaceForm({ ...placeForm, images: newImages });
  };

  const addAttractionField = () => {
    setPlaceForm({ ...placeForm, nearbyAttractions: [...placeForm.nearbyAttractions, ''] });
  };

  const updateAttractionField = (index, value) => {
    const newAttractions = [...placeForm.nearbyAttractions];
    newAttractions[index] = value;
    setPlaceForm({ ...placeForm, nearbyAttractions: newAttractions });
  };

  if (!token) {
    return <div className="admin-login-prompt">Please login to access admin panel</div>;
  }

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-info">
          <span>Welcome, {admin?.email}</span>
          <button onClick={() => { localStorage.removeItem('adminToken'); setToken(null); }}>
            Logout
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="admin-tabs">
        <button 
          className={activeTab === 'states' ? 'active' : ''}
          onClick={() => setActiveTab('states')}
        >
          States ({states.length})
        </button>
        <button 
          className={activeTab === 'places' ? 'active' : ''}
          onClick={() => setActiveTab('places')}
        >
          Places ({places.length})
        </button>
      </div>

      {activeTab === 'states' && (
        <div className="admin-section">
          <h2>Add New State</h2>
          <form onSubmit={handleAddState} className="admin-form">
            <input
              type="text"
              placeholder="State Name"
              value={stateForm.name}
              onChange={(e) => setStateForm({ ...stateForm, name: e.target.value })}
              required
            />
            <textarea
              placeholder="Description"
              value={stateForm.description}
              onChange={(e) => setStateForm({ ...stateForm, description: e.target.value })}
              required
            />
            <input
              type="url"
              placeholder="Image URL (optional)"
              value={stateForm.image}
              onChange={(e) => setStateForm({ ...stateForm, image: e.target.value })}
            />
            <button type="submit">Add State</button>
          </form>

          <h2>Existing States</h2>
          <div className="admin-list">
            {states.map(state => (
              <div key={state._id} className="admin-item">
                <div className="item-info">
                  <h3>{state.name}</h3>
                  <p>{state.description}</p>
                </div>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteState(state._id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'places' && (
        <div className="admin-section">
          <h2>Add New Place</h2>
          <form onSubmit={handleAddPlace} className="admin-form">
            <input
              type="text"
              placeholder="Place Name"
              value={placeForm.name}
              onChange={(e) => setPlaceForm({ ...placeForm, name: e.target.value })}
              required
            />
            <select
              value={placeForm.state}
              onChange={(e) => setPlaceForm({ ...placeForm, state: e.target.value })}
              required
            >
              <option value="">Select State</option>
              {states.map(state => (
                <option key={state._id} value={state._id}>{state.name}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="City"
              value={placeForm.city}
              onChange={(e) => setPlaceForm({ ...placeForm, city: e.target.value })}
              required
            />
            <select
              value={placeForm.category}
              onChange={(e) => setPlaceForm({ ...placeForm, category: e.target.value })}
            >
              <option value="Heritage">Heritage</option>
              <option value="Nature">Nature</option>
              <option value="Beach">Beach</option>
              <option value="Hill Station">Hill Station</option>
              <option value="Wildlife">Wildlife</option>
              <option value="Religious">Religious</option>
              <option value="Temple">Temple</option>
              <option value="Monument">Monument</option>
              <option value="Cultural">Cultural</option>
              <option value="Spiritual">Spiritual</option>
              <option value="Pilgrimage">Pilgrimage</option>
              <option value="Landmark">Landmark</option>
              <option value="Art">Art</option>
              <option value="Ceremony">Ceremony</option>
            </select>
            <textarea
              placeholder="Description"
              value={placeForm.description}
              onChange={(e) => setPlaceForm({ ...placeForm, description: e.target.value })}
            />
            <input
              type="text"
              placeholder="Best Time to Visit"
              value={placeForm.bestTime}
              onChange={(e) => setPlaceForm({ ...placeForm, bestTime: e.target.value })}
            />
            <input
              type="text"
              placeholder="Entry Fee"
              value={placeForm.entryFee}
              onChange={(e) => setPlaceForm({ ...placeForm, entryFee: e.target.value })}
            />
            <input
              type="text"
              placeholder="Timings"
              value={placeForm.timings}
              onChange={(e) => setPlaceForm({ ...placeForm, timings: e.target.value })}
            />
            <input
              type="text"
              placeholder="Location"
              value={placeForm.location}
              onChange={(e) => setPlaceForm({ ...placeForm, location: e.target.value })}
            />
            
            <div className="dynamic-fields">
              <label>Images:</label>
              {placeForm.images.map((image, index) => (
                <input
                  key={index}
                  type="url"
                  placeholder={`Image URL ${index + 1}`}
                  value={image}
                  onChange={(e) => updateImageField(index, e.target.value)}
                />
              ))}
              <button type="button" onClick={addImageField}>Add Image</button>
            </div>

            <div className="dynamic-fields">
              <label>Nearby Attractions:</label>
              {placeForm.nearbyAttractions.map((attraction, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Nearby Attraction ${index + 1}`}
                  value={attraction}
                  onChange={(e) => updateAttractionField(index, e.target.value)}
                />
              ))}
              <button type="button" onClick={addAttractionField}>Add Attraction</button>
            </div>

            <button type="submit">Add Place</button>
          </form>

          <h2>Existing Places</h2>
          <div className="admin-list">
            {places.map(place => (
              <div key={place._id} className="admin-item">
                <div className="item-info">
                  <h3>{place.name}</h3>
                  <p>{place.city}, {place.state?.name}</p>
                  <p>{place.category}</p>
                </div>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeletePlace(place._id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
