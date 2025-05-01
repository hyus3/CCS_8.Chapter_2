import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './CafeView.css';

// Define Geoapify API key
const GEOAPIFY_API_KEY = 'ad9ccb4d38894adc9f2d8e53a218afae';
const DUMAGUETE_COORDINATES = { lat: 9.3151189, lng: 123.2981697 };

const CafeView: React.FC = () => {
  const { placeId } = useParams<{ placeId: string }>();
  const [cafe, setCafe] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!placeId) {
      setError("No cafe ID provided");
      setLoading(false);
      return;
    }

    // Fetch cafe details from Geoapify API
    setLoading(true);
    
    // In a real app, you'd make a direct API call with the placeId
    // For now, we'll fetch from the list and find the matching cafe
    fetchCafeFromGeoapify(placeId);

    // Cleanup function to destroy map when component unmounts
    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, [placeId]);
  
  const fetchCafeFromGeoapify = async (placeId: string) => {
    try {
      // Fetch cafes from Geoapify API
      const response = await fetch(
        `https://api.geoapify.com/v2/places?categories=catering.cafe,commercial.food_and_drink&filter=circle:123.2981697,9.3151189,5000&bias=proximity:123.2981697,9.3151189&limit=300&apiKey=${GEOAPIFY_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch cafes from Geoapify API');
      }
      
      const data = await response.json();
      
      // Find cafe with matching ID
      // In a real app, you would have a direct endpoint for a specific place ID
      // This is a workaround for demonstration purposes
      const foundCafe = data.features.find((feature: any) => 
        feature.properties.place_id === placeId || feature.properties.name.toLowerCase().includes(placeId.toLowerCase())
      );
      
      if (!foundCafe) {
        throw new Error('Cafe not found');
      }
      
      // Transform the data into our cafe format
      const cafeDetails = {
        place_id: foundCafe.properties.place_id,
        name: foundCafe.properties.name || 'Unnamed Cafe',
        address: formatAddress(foundCafe.properties),
        rating: foundCafe.properties.rate || Math.floor(Math.random() * 5) + 1,
        amenities: extractAmenities(foundCafe.properties),
        photos: ['/api/placeholder/400/320'], // Placeholder since API doesn't return photos
        lat: foundCafe.properties.lat,
        lng: foundCafe.properties.lon,
        description: foundCafe.properties.description || null
      };
      
      setCafe(cafeDetails);
      setLoading(false);
      
      // Initialize map after we have the cafe details
      setTimeout(() => {
        initializeMap(cafeDetails);
      }, 100);
      
    } catch (error) {
      console.error('Error fetching cafe details:', error);
      setError(`Failed to load cafe details: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setLoading(false);
    }
  };
  
  // Helper function to format address from Geoapify properties
  const formatAddress = (properties: any): string => {
    const addressParts = [];
    
    if (properties.address_line1) {
      addressParts.push(properties.address_line1);
    } else {
      if (properties.street) addressParts.push(properties.street);
      if (properties.housenumber) addressParts.push(properties.housenumber);
    }
    
    if (properties.address_line2) {
      addressParts.push(properties.address_line2);
    } else {
      if (properties.city) addressParts.push(properties.city);
      if (properties.state) addressParts.push(properties.state);
      if (properties.postcode) addressParts.push(properties.postcode);
      if (properties.country) addressParts.push(properties.country);
    }
    
    return addressParts.join(', ') || 'Address not available';
  };
  
  // Helper function to extract amenities from Geoapify properties
  const extractAmenities = (properties: any): string[] => {
    const amenities = [];
    
    if (properties.categories) {
      const categoryParts = properties.categories.split('.').pop();
      if (categoryParts) amenities.push(categoryParts);
    }
    
    // Add some common cafe amenities
    if (properties.wifi) amenities.push('WiFi');
    if (properties.outdoor_seating) amenities.push('Outdoor Seating');
    if (properties.air_conditioning) amenities.push('AC');
    
    // Add default tags if we don't have enough
    while (amenities.length < 4) {
      const defaultTags = ['Coffee', 'Breakfast', 'Lunch', 'Desserts', 'Vegan Options', 'WiFi', 'Power Outlets'];
      const randomTag = defaultTags[Math.floor(Math.random() * defaultTags.length)];
      if (!amenities.includes(randomTag)) {
        amenities.push(randomTag);
      }
    }
    
    return amenities;
  };

  const initializeMap = (cafeDetails: any) => {
    // Only initialize map if mapRef is available and map hasn't been created yet
    if (!mapRef.current || leafletMap.current) return;

    // Use coordinates from cafe details
    let lat = cafeDetails.lat || DUMAGUETE_COORDINATES.lat;
    let lng = cafeDetails.lng || DUMAGUETE_COORDINATES.lng;
    
    // Create map
    leafletMap.current = L.map(mapRef.current).setView([lat, lng], 15);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(leafletMap.current);

    // Add marker for cafe location
    L.marker([lat, lng])
      .addTo(leafletMap.current)
      .bindPopup(cafeDetails.name)
      .openPopup();
  };

  // Handle back button click
  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  if (loading) {
    return <div className="cafe-view-loading">Loading cafe details...</div>;
  }

  if (error) {
    return <div className="cafe-view-error">{error}</div>;
  }

  if (!cafe) {
    return <div className="cafe-view-error">Cafe not found</div>;
  }

  // Generate a sample menu (in a real app, this would come from your API)
  const menuItems = [
    { name: 'Item 1', price: '₱120' },
    { name: 'Item 2', price: '₱120' },
    { name: 'Item 3', price: '₱120' },
    { name: 'Item 4', price: '₱120' },
    { name: 'Item 5', price: '₱120' },
    { name: 'Item 6', price: '₱120' },
  ];

  return (
    <div className="cafe-view-container">
      {/* Main Content */}
      <div className="cafe-view-content">
        {/* Main Cafe Image */}
        <div className="cafe-image-container">
          {cafe.photos && cafe.photos.length > 0 ? (
            <img src={cafe.photos[0]} alt={cafe.name} className="cafe-image" />
          ) : (
            <div className="placeholder-image">No Image Available</div>
          )}
          
          {/* Secondary Cafe Image (if available) */}
          {cafe.photos && cafe.photos.length > 1 && (
            <img src={cafe.photos[1]} alt={`${cafe.name} secondary view`} className="cafe-image" />
          )}
        </div>

        {/* Cafe Details */}
        <div className="cafe-details">
          <h1 className="cafe-name">{cafe.name}</h1>
          <p className="cafe-description">
            {cafe.description || 
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'}
          </p>

          {/* Tags/Amenities */}
          <div className="cafe-tags">
            {cafe.amenities.map((amenity: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined, index: React.Key | null | undefined) => (
              <span key={index} className="cafe-tag">{amenity}</span>
            ))}
          </div>

          {/* Rating */}
          <div className="cafe-rating">
            {'★'.repeat(Math.floor(cafe.rating))}
            {'☆'.repeat(5 - Math.floor(cafe.rating))}
          </div>

          {/* Menu */}
          <div className="cafe-menu">
            <h2>menu</h2>
            <div className="menu-items">
              {menuItems.map((item, index) => (
                <div key={index} className="menu-item">
                  <span className="item-name">{item.name}</span>
                  <span className="item-price">{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="cafe-map-container">
        <div ref={mapRef} className="cafe-map"></div>
      </div>

      {/* Address Section */}
      <div className="cafe-address">
        <div className="address-icon">📍</div>
        <div className="address-text">{cafe.address}</div>
      </div>
    </div>
  );
};

export default CafeView;