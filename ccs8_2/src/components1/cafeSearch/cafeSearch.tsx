// CafeSearch.tsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./cafeSearch.css";

interface Cafe {
  name: string;
  formatted: string;
  image?: string; // Optional image URL from the API
}

const CafeSearch: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [results, setResults] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    const fetchCafes = async () => {
      setLoading(true);
      const apiKey = "ad9ccb4d38894adc9f2d8e53a218afae";
      const url = `https://api.geoapify.com/v2/places?categories=catering.cafe,commercial.food_and_drink&filter=place:5196b20c71acd35e405977be9f1a2f9d2240c00208e2031e77686f736f6e66697273743a6c6f63616c6974793a343231313933393933&text=${encodeURIComponent(query)}&limit=10&apiKey=${apiKey}`;

      try {
        const res = await fetch(url);
        const data = await res.json();
        
        // Map the API response to our Cafe interface, including images if available
        setResults(data.features.map((f: any) => {
          // Check if the place has images in the API response
          const image = f.properties.images?.photos?.[0]?.src || 
                         f.properties.place_photos?.[0]?.url ||
                         null;
                         
          return {
            name: f.properties.name || "Unnamed Cafe",
            formatted: f.properties.formatted || "Unknown location",
            image: image // This will be undefined if no image is available
          };
        }));
      } catch (error) {
        console.error("Error fetching cafes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCafes();
  }, [query]);

  return (
    <div className="cafeSearch-container">
      <h2>Search results for "{query}"</h2>
      {loading ? (
        <div className="loading">Loading cafes...</div>
      ) : (
        <div className="card-grid">
          {results.length > 0 ? (
            results.map((cafe, i) => (
              <div className="card" key={i}>
                <div 
                  className="card-image" 
                  style={cafe.image ? {
                    backgroundImage: `url(${cafe.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  } : undefined}
                />
                <div className="card-footer">
                  <div className="card-title">{cafe.name}</div>
                  <div className="card-location">{cafe.formatted}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">No cafes found. Try another search.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CafeSearch;