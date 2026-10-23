import { useReducer, useState, useCallback, useMemo } from "react";
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
  const [favorites, dispatch] = useReducer(favoritesReducer, []);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  return (
    <>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold">Photo Gallery</h1>
        <p className="text-gray-600">
          Explore Photography from creators around the world
        </p>
        <input
          value={searchTerm}
          onChange={handleSearch}
          className="rounded md:rounded-lg p-3 mt-4 border w-full mx-auto"
          placeholder="Search Photos By author"
        />
        {loading && <p>Loading photos...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {photos
          .filter((photo) =>
            photo.author.toLowerCase().includes(searchTerm.toLowerCase()),
          )
          .map((photo) => {
            return (
              <div
                className="rounded-lg border p-3 shadow-sm mt-4 "
                key={photo.id}
              >
                <img
                  className="w-full rounded-lg"
                  src={photo.download_url}
                  alt="Photo"
                />
                <div className="flex items-center justify-between">
                  <p>{photo.author}</p>
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
    </>
  );
}
export default App;
