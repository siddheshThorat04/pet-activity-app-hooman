import React, { useState } from 'react';
import axios from 'axios';

const ActivityForm = ({ onActivityAdded }) => {
  const [formData, setFormData] = useState({
    petName: '',
    type: 'walk',
    duration: '',
    quantity: '',
    datetime: new Date().toISOString().slice(0, 16) 
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.petName.trim()) {
      newErrors.petName = 'Pet name is required';
    }
    
    if (formData.type === 'walk' && !formData.duration) {
      newErrors.duration = 'Duration is required for walks';
    }
    
    if (formData.type !== 'walk' && !formData.quantity) {
      newErrors.quantity = 'Quantity is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      
      const payload = {
        petName: formData.petName,
        type: formData.type,
        datetime: formData.datetime
      };
      
      if (formData.type === 'walk') {
        payload.duration = formData.duration;
      } else {
        payload.quantity = formData.quantity;
      }
      
      const response = await axios.post('/api/activities', payload);
      
      
      setFormData({
        petName: '',
        type: 'walk',
        duration: '',
        quantity: '',
        datetime: new Date().toISOString().slice(0, 16)
      });
      
      setErrors({});
      
      if (onActivityAdded) {
        onActivityAdded(response.data);
      }
      
      alert('Activity logged successfully!');
      
    } catch (error) {
      console.error('Error logging activity:', error);
      alert('Failed to log activity. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="activity-form">
      <h2>Log New Activity</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="petName">Pet Name *</label>
          <input
            type="text"
            id="petName"
            name="petName"
            value={formData.petName}
            onChange={handleChange}
            placeholder="e.g., Rex"
            className={errors.petName ? 'error' : ''}
          />
          {errors.petName && <span className="error-text">{errors.petName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="type">Activity Type *</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="walk">Walk</option>
            <option value="meal">Meal</option>
            <option value="medication">Medication</option>
          </select>
        </div>

        {formData.type === 'walk' ? (
          <div className="form-group">
            <label htmlFor="duration">Duration (minutes) *</label>
            <input
              type="number"
              id="duration"
              name="duration"
              min="1"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g., 30"
              className={errors.duration ? 'error' : ''}
            />
            {errors.duration && <span className="error-text">{errors.duration}</span>}
          </div>
        ) : (
          <div className="form-group">
            <label htmlFor="quantity">
              {formData.type === 'meal' ? 'Food Amount' : 'Dosage'} *
            </label>
            <input
              type="text"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder={formData.type === 'meal' ? 'e.g., 1 cup' : 'e.g., 1 pill'}
              className={errors.quantity ? 'error' : ''}
            />
            {errors.quantity && <span className="error-text">{errors.quantity}</span>}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="datetime">Date & Time</label>
          <input
            type="datetime-local"
            id="datetime"
            name="datetime"
            value={formData.datetime}
            onChange={handleChange}
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="submit-btn"
        >
          {isSubmitting ? 'Logging...' : 'Log Activity'}
        </button>
      </form>
    </div>
  );
};

export default ActivityForm;