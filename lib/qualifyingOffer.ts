import * as cheerio from "cheerio";

const DATA_URL = "https://questionnaire-148920.appspot.com/swe/data.html";

export type PlayerSalary = {
	name: string;
	salary: number;
};

export type QualifyingOfferResult = {
	qualifyingOffer: number | null;
	validCount: number;
	totalRows: number;
	ignoredRows: number;
	topPlayers: PlayerSalary[];
};

/**
 * Fetch and parse the MLB salary table, then compute the qualifying offer
 * Parsing is done with cheerio package
 */
export async function fetchQualifyingOffer(): Promise<QualifyingOfferResult> {
	const response = await fetch(DATA_URL, { cache: "no-store" });

	if (!response.ok) {
		throw new Error(`Failed to fetch data (status ${response.status})`);
	}

	const html = await response.text();

	const $ = cheerio.load(html);
	const playerSalaries: PlayerSalary[] = [];

	$("table tr").each((_, row) => {
		const cells = $(row).find("td");
		if (cells.length < 2) {
			return;
		}

		const name = $(cells[0]).text().trim();
		const rawSalary = $(cells[1]).text().trim();

		// Normalizing salary to a number: removing currency symbols, commas and any stray characters
		const normalized = rawSalary.replace(/[^0-9.]/g, "");
		const salary = Number.parseFloat(normalized);

		if (!Number.isFinite(salary) || salary <= 0) {
			return;
		}

		playerSalaries.push({ name: name || "Unknown player", salary });
	});

	const totalRows = $("table tr").length;
	const validCount = playerSalaries.length;
	const ignoredRows = Math.max(totalRows - validCount, 0);

	// Sort by descendinding salary and keep the top 125
	const sorted = [...playerSalaries].sort((a, b) => b.salary - a.salary);
	const topPlayers = sorted.slice(0, 125);

	if (topPlayers.length === 0) {
		return {
			qualifyingOffer: null,
			validCount,
			totalRows,
			ignoredRows,
			topPlayers: [],
		};
	}

	// Calculate qualifying offer
	const total = topPlayers.reduce((sum, p) => sum + p.salary, 0);
	const qualifyingOffer = total / topPlayers.length;

	return {
		qualifyingOffer,
		validCount,
		totalRows,
		ignoredRows,
		topPlayers,
	};
}
