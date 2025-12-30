import { fetchQualifyingOffer } from "@/lib/qualifyingOffer";

export async function GET() {
	try {
		const result = await fetchQualifyingOffer();
		return Response.json(result, { status: 200 });
	} catch (error) {
		const message =
			error instanceof Error
				? error.message
				: "An unexpected error occurred while fetching data.";

		return Response.json({ error: message }, { status: 500 });
	}
}
