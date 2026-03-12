"use server";

interface IResponse<T> {
	status: boolean;
	data: T;
}

interface Country {
	slug: string;
	name: string;
}

interface Year {
	name: string;
	slug: string;
}

interface Category {
	slug: string;
	name: string;
}

export interface NavbarData {
	countries: Country[];
	years: Year[];
	categories: Category[];
}

/**
 * Fetch navbar data from ophim API endpoints with server-side caching
 * Data is cached for 24 hours as it rarely changes
 */
export async function fetchNavbarData(): Promise<NavbarData> {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

	try {
		const [countriesRes, yearsRes, categoriesRes] = await Promise.all([
			fetch(`${baseUrl}/api/quoc-gia`, {
				next: { revalidate: 24 * 60 * 60 }, // Cache for 24 hours
			}),
			fetch(`${baseUrl}/api/nam-phat-hanh`, {
				next: { revalidate: 24 * 60 * 60 },
			}),
			fetch(`${baseUrl}/api/the-loai`, {
				next: { revalidate: 24 * 60 * 60 },
			}),
		]);

		const [countriesData, yearsData, categoriesData] = await Promise.all([
			countriesRes.json() as Promise<IResponse<{ items: Country[] }>>,
			yearsRes.json() as Promise<IResponse<{ items: Year[] }>>,
			categoriesRes.json() as Promise<IResponse<{ items: Category[] }>>,
		]);

		return {
			countries: countriesData.data?.items || [],
			years: yearsData.data?.items || [],
			categories: categoriesData.data?.items || [],
		};
	} catch (error) {
		console.error("Failed to fetch navbar data:", error);
		return {
			countries: [],
			years: [],
			categories: [],
		};
	}
}
