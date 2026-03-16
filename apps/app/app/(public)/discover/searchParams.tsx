import {
  parseAsFloat,
  createLoader,
  parseAsString,
  parseAsArrayOf,
} from "nuqs/server";

// Describe your search params, and reuse this in useQueryStates / createSerializer:
export const coordinatesSearchParams = {
  clt: parseAsString,
  ctg: parseAsArrayOf(parseAsString),
  sort_by: parseAsString,
  sort_order: parseAsString,
};

export const loadSearchParams = createLoader(coordinatesSearchParams);
