import { useReducer, useState, useCallback, useMemo, useEffect } from "react";
import useFetchPhotos from "./hooks/useFetchPhotos";
function App() {
  function favoritesReducer(state, action) {
    if (action.type === "TOGGLE_FAVORITE") {
      if (state.includes(action.id)) {
        return state.filter((id) => id !== action.id);
      } else {
        return [...state, action.id];
      }
    }

    return state;
  }
  const { photos, loading, error } = useFetchPhotos();
  const [favorites, dispatch] = useReducer(favoritesReducer, [], () => {
    try {
      return JSON.parse(localStorage.getItem("favorites")) ?? [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [photos, searchTerm]);

  return (
    <>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold tracking-tight">Photo Gallery</h1>
        <p className="text-gray-600">
          Explore Photography from creators around the world
        </p>
        <input
          value={searchTerm}
          onChange={handleSearch}
          className="mt-4 w-full rounded-lg border border-gray-300 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          placeholder="Search Photos By author"
        />
        {loading && <p>Loading photos...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {!loading && !error && filteredPhotos.length === 0 && (
            <p className="text-gray-500 mt-6 text-center">
              No photos found. Try another author!
            </p>
          )}

          {filteredPhotos.map((photo) => {
            return (
              <div
                className="rounded-xl border p-3 shadow-sm transition duration-200 hover:shadow-lg hover:-translate-y-1"
                key={photo.id}
              >
                <img
                  className="w-full h-48 object-cover rounded-lg"
                  src={photo.download_url}
                  alt="Photo"
                />
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{photo.author}</p>
                  <button
                    className="cursor-pointer text-xl"
                    onClick={() => {
                      dispatch({
                        type: "TOGGLE_FAVORITE",
                        id: photo.id,
                      });
                    }}
                  >
                    {favorites.includes(photo.id) ? "❤️" : "🤍"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
export default App;
