import { parseAsInteger } from "nuqs";
import { createLoader, parseAsArrayOf, parseAsString } from "nuqs/server";

// Describe your search params, and reuse this in useQueryStates / createSerializer:
export const coordinatesSearchParams = {
  clt: parseAsString,
  ctg: parseAsArrayOf(parseAsString),
  sort_by: parseAsString,
  sort_order: parseAsString,
  page: parseAsInteger,
  cntry: parseAsString,
};

export const loadSearchParams = createLoader(coordinatesSearchParams);
