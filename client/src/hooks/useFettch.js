import { useState, useEffect } from "react";

export const useFetch = (url, options = {}, dependencies = []) => {
  const [data, setData] = useState(null);   // ✅ correct variable name
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Don't fetch if URL is null or undefined
    if (!url) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(url, options);
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}, ${response.status}`);
        }

        setData(responseData);
        setError(null);                     // ✅ reset error properly
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error };          // ✅ return correct state
};