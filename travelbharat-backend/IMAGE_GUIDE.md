# Image Update Guide for TravelBharat

## Current Status
✅ All 28 states and 8 union territories added
✅ 2-3 famous tourist places for each state/UT
✅ Total: 36 states/UTs with 85+ tourist places

## Where to Change Images Manually

### 1. Database Level (Recommended)
Run the complete seed file to populate your database:
```bash
cd travelbharat-backend
node seed-complete.js
```

### 2. Individual Image Updates

#### State Images
Location: `travelbharat-backend/models/State.js`
- Each state has an `image` field
- Update via MongoDB queries or admin panel

#### Tourist Place Images  
Location: `travelbharat-backend/models/TouristPlace.js`
- Each place has an `images` array (3 images per place)
- Update via MongoDB queries or admin panel

### 3. Image URL Patterns Used

#### Current Pexels URLs (Replace with your own):
- States: `https://images.pexels.com/photos/[id]/pexels-photo-[id].jpeg`
- Places: Same pattern with different IDs

#### Better Image Sources:
1. **Unsplash**: `https://source.unsplash.com/featured/?[query],[state]`
2. **Pixabay**: `https://pixabay.com/photos/[query]-[id]/`
3. **Custom**: Upload to your server/cloud storage

### 4. MongoDB Update Examples

#### Update State Image:
```javascript
db.states.updateOne(
  { name: "Karnataka" },
  { $set: { image: "your-new-image-url.jpg" } }
)
```

#### Update Tourist Place Images:
```javascript
db.touristplaces.updateOne(
  { name: "Mysore Palace" },
  { 
    $set: { 
      images: [
        "new-image-1.jpg",
        "new-image-2.jpg", 
        "new-image-3.jpg"
      ] 
    } 
  }
)
```

### 5. Bulk Image Update Script

Create `update-images.js`:
```javascript
const mongoose = require('mongoose');
const State = require('./models/State');
const TouristPlace = require('./models/TouristPlace');

// Your custom image mapping
const stateImages = {
  "Karnataka": "https://your-server/karnataka.jpg",
  "Rajasthan": "https://your-server/rajasthan.jpg",
  // ... add all states
};

const placeImages = {
  "Mysore Palace": [
    "https://your-server/mysore-palace-1.jpg",
    "https://your-server/mysore-palace-2.jpg",
    "https://your-server/mysore-palace-3.jpg"
  ],
  // ... add all places
};

// Update script
async function updateImages() {
  await mongoose.connect('mongodb://localhost:27017/travelbharat');
  
  // Update states
  for (const [stateName, imageUrl] of Object.entries(stateImages)) {
    await State.updateOne(
      { name: stateName },
      { $set: { image: imageUrl } }
    );
  }
  
  // Update places
  for (const [placeName, imageUrls] of Object.entries(placeImages)) {
    await TouristPlace.updateOne(
      { name: placeName },
      { $set: { images: imageUrls } }
    );
  }
  
  console.log('Images updated successfully');
  process.exit(0);
}

updateImages();
```

### 6. Recommended Image Specifications

#### State Cards:
- **Size**: 400x300px minimum
- **Format**: JPEG or WebP
- **Quality**: High (80-90% compression)

#### Tourist Place Galleries:
- **Size**: 800x600px minimum
- **Format**: JPEG or WebP  
- **Quality**: High (80-90% compression)
- **Count**: 3 images per place

### 7. Image Storage Options

#### Local Storage:
```
travelbharat-backend/
├── uploads/
│   ├── states/
│   └── places/
```

#### Cloud Storage:
- **AWS S3**: Recommended for production
- **Cloudinary**: Good for image optimization
- **Firebase Storage**: Easy integration

### 8. Admin Panel Integration

Add image upload functionality to your admin panel:
- State image upload
- Tourist place gallery upload
- Image preview and management
- Bulk upload capability

## Next Steps

1. **Run the complete seed**: `node seed-complete.js`
2. **Test the application**: Check all states and places load correctly
3. **Update images**: Use the methods above to replace Pexels images
4. **Add admin functionality**: For easier image management
5. **Optimize images**: Ensure fast loading times

## Important Notes

- Keep image URLs consistent
- Use descriptive filenames
- Maintain aspect ratios
- Test image loading on different devices
- Consider lazy loading for better performance
