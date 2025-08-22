const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json()); 


let activities = [];


const getTodaysActivities = () => {
  const today = new Date().toDateString();
  return activities.filter(activity => {
    const activityDate = new Date(activity.datetime).toDateString();
    return activityDate === today;
  });
};


const getTodaysSummary = () => {
  const todaysActivities = getTodaysActivities();
  
  const summary = {
    walk: { totalDuration: 0, count: 0 },
    meal: { totalQuantity: 0, count: 0 },
    medication: { totalQuantity: 0, count: 0 }
  };

  todaysActivities.forEach(activity => {
    if (activity.type === 'walk') {
      summary.walk.totalDuration += parseInt(activity.duration) || 0;
      summary.walk.count += 1;
    } else if (activity.type === 'meal') {
      summary.meal.totalQuantity += parseInt(activity.quantity) || 0;
      summary.meal.count += 1;
    } else if (activity.type === 'medication') {
      summary.medication.totalQuantity += parseInt(activity.quantity) || 0;
      summary.medication.count += 1;
    }
  });

  return summary;
};


app.get('/api/summary/today', (req, res) => {
  try {
    const summary = getTodaysSummary();
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

app.get('/api/activities', (req, res) => {
  res.json(activities);
});

app.post('/api/activities', (req, res) => {
  try {
    const { petName, type, duration, quantity, datetime } = req.body;
    
    
    if (!petName || !type) {
      return res.status(400).json({ error: 'Pet name and activity type are required' });
    }

    const newActivity = {
      id: Date.now(), 
      petName,
      type,
      duration: type === 'walk' ? duration : null,
      quantity: type !== 'walk' ? quantity : null,
      datetime: datetime || new Date().toISOString()
    };

    activities.push(newActivity);
    res.status(201).json(newActivity);
  } catch (error) {
    res.status(500).json({ error: 'Failed to log activity' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});