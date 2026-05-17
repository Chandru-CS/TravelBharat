import React, { useState } from 'react';
import './AddContentModal.css';

const AddContentModal = ({ isOpen, onClose, onAddState, onAddPlace, states }) => {
  const [activeTab, setActiveTab] = useState('state');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // State form
  const [stateForm, setStateForm] = useState({ name: '', description: '', image: '' });

  // Place form
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

  const resetForms = () => {
    setStateForm({ name: '', description: '', image: '' });
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
    setError('');
  };

  const handleClose = () => {
    resetForms();
    onClose();
  };

  const handleAddState = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onAddState(stateForm);
      resetForms();
      setActiveTab('state');
    } catch (error) {
      setError(error.message || 'Failed to add state');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlace = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const placeData = {
        ...placeForm,
        images: placeForm.images.filter(img => img.trim()),
        nearbyAttractions: placeForm.nearbyAttractions.filter(attr => attr.trim())
      };

      await onAddPlace(placeData);
      resetForms();
      setActiveTab('place');
    } catch (error) {
      setError(error.message || 'Failed to add place');
    } finally {
      setLoading(false);
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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add Content</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <div className="modal-tabs">
          <button 
            className={activeTab === 'state' ? 'active' : ''}
            onClick={() => setActiveTab('state')}
          >
            Add State
          </button>
          <button 
            className={activeTab === 'place' ? 'active' : ''}
            onClick={() => setActiveTab('place')}
          >
            Add Place
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {activeTab === 'state' && (
          <form onSubmit={handleAddState} className="modal-form">
            <div className="form-group">
              <label>State Name</label>
              <input
                type="text"
                value={stateForm.name}
                onChange={(e) => setStateForm({ ...stateForm, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={stateForm.description}
                onChange={(e) => setStateForm({ ...stateForm, description: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Image URL (optional)</label>
              <input
                type="url"
                value={stateForm.image}
                onChange={(e) => setStateForm({ ...stateForm, image: e.target.value })}
                placeholder="Will use default if not provided"
              />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={handleClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Adding...' : 'Add State'}
              </button>
            </div>
          </form>
        )}

        {activeTab === 'place' && (
          <form onSubmit={handleAddPlace} className="modal-form">
            <div className="form-row">
              <div className="form-group">
                <label>Place Name</label>
                <input
                  type="text"
                  value={placeForm.name}
                  onChange={(e) => setPlaceForm({ ...placeForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>State</label>
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
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  value={placeForm.city}
                  onChange={(e) => setPlaceForm({ ...placeForm, city: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
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
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={placeForm.description}
                onChange={(e) => setPlaceForm({ ...placeForm, description: e.target.value })}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Best Time to Visit</label>
                <input
                  type="text"
                  value={placeForm.bestTime}
                  onChange={(e) => setPlaceForm({ ...placeForm, bestTime: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Entry Fee</label>
                <input
                  type="text"
                  value={placeForm.entryFee}
                  onChange={(e) => setPlaceForm({ ...placeForm, entryFee: e.target.value })}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Timings</label>
                <input
                  type="text"
                  value={placeForm.timings}
                  onChange={(e) => setPlaceForm({ ...placeForm, timings: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={placeForm.location}
                  onChange={(e) => setPlaceForm({ ...placeForm, location: e.target.value })}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Images</label>
              {placeForm.images.map((image, index) => (
                <input
                  key={index}
                  type="url"
                  placeholder={`Image URL ${index + 1}`}
                  value={image}
                  onChange={(e) => updateImageField(index, e.target.value)}
                />
              ))}
              <button type="button" className="btn btn-ghost" onClick={addImageField}>
                + Add Image
              </button>
            </div>

            <div className="form-group">
              <label>Nearby Attractions</label>
              {placeForm.nearbyAttractions.map((attraction, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Nearby Attraction ${index + 1}`}
                  value={attraction}
                  onChange={(e) => updateAttractionField(index, e.target.value)}
                />
              ))}
              <button type="button" className="btn btn-ghost" onClick={addAttractionField}>
                + Add Attraction
              </button>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={handleClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Adding...' : 'Add Place'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddContentModal;
