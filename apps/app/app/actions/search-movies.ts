"use server";

import { fetchSearchMovies } from "../../lib/services/movie";

export async function searchMovies(query: string) {
  return fetchSearchMovies(query, {
    limit: 20,
    page: 1,
  });
}
