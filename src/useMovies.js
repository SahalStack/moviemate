import { useState, useEffect } from "react";

const KEY = import.meta.env.VITE_API_KEY;
console.log(KEY)

export function useMovies(query) {
	const [movies, setMovies] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		if (query.length < 3) {
			setMovies([]);
			setError("");
			return;
		}

		const controller = new AbortController();

		async function fetchMovies() {
			try {
				setIsLoading(true);
				setError("");

				const res = await fetch(
					`https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
					{ signal: controller.signal }
				);

				if (!res.ok)
					throw new Error("Something went wrong with fetching movies");

				const data = await res.json();

				if (data.Response === "False")
					throw new Error("Movie not found");

				setMovies(data.Search);
			} catch (error) {
				if (error.name !== "AbortError") {
					setError(error.message);
				}
			} finally {
				setIsLoading(false);
			}
		}

		fetchMovies();

		return () => controller.abort();
	}, [query]);

	return { movies, isLoading, error };
}