import pino from "pino";
import prettyLogger from "pino-pretty";

const logger = pino(
	prettyLogger({
		messageFormat: (log, messageKey: string, levelLabel: string, extras) => {
			const BASE = `[SYNC-PARTIES]`;
			const message = log[messageKey];
			if (log.provider) {
				return `${BASE} [${log.provider}] ${message}`;
			}
			return `${BASE} ${message}`;
		},
		colorize: true,
		levelFirst: true,
		translateTime: "HH:MM:ss",
	}),
);
export async function syncParties() {
	logger.info("Syncing parties...");
	const startTime = Date.now();

	logger.info("Fetching providers...");
	const { getProviders } = await import("./providers");
	const providers = getProviders();

	for (const provider of providers) {
		logger.info(`Syncing provider: ${provider.constructor.name}`);
		try {
			const categories = await provider.getCategories();
			logger.info(
				`Fetched ${categories.length} categories from ${provider.constructor.name}`,
			);

			const countries = await provider.getCountries();
			logger.info(
				`Fetched ${countries.length} countries from ${provider.constructor.name}`,
			);

			const years = await provider.getYears();
			logger.info(
				`Fetched ${years.length} years from ${provider.constructor.name}`,
			);

			// You can add more detailed syncing logic here, e.g. fetching movies, details, etc.
		} catch (err: any) {
			logger.error(
				`Error syncing provider ${provider.constructor.name}: ${err.message}`,
			);
		}
	}

	const endTime = Date.now();
	const duration = ((endTime - startTime) / 1000).toFixed(2);
	logger.info(`Syncing parties completed in ${duration} seconds.`);
}

syncParties();
