"use client";

import { useState } from "react";
import type { QualifyingOfferResult } from "@/lib/qualifyingOffer";
import { TopSalariesTable } from "@/components/TopSalariesTable";

type QualifyingOfferPanelProps = {
	initialResult: QualifyingOfferResult | null;
	initialErrorMessage: string | null;
};

export function QualifyingOfferPanel({
	initialResult,
	initialErrorMessage,
}: QualifyingOfferPanelProps) {
	const [result, setResult] = useState<QualifyingOfferResult | null>(
		initialResult
	);
	const [errorMessage, setErrorMessage] = useState<string | null>(
		initialErrorMessage
	);
	const [isLoading, setIsLoading] = useState(false);

	const handleReload = async () => {
		setIsLoading(true);
		setErrorMessage(null);

		try {
			const response = await fetch("/api/qualifying-offer", {
				cache: "no-store",
			});
			const data = await response.json();

			if (!response.ok || data?.error) {
				const message =
					typeof data?.error === "string"
						? data.error
						: "Failed to refresh data from the dataset endpoint.";
				setErrorMessage(message);
				setResult(null);
				return;
			}

			setResult(data as QualifyingOfferResult);
		} catch (error) {
			setErrorMessage(
				error instanceof Error
					? error.message
					: "An unexpected error occurred while refreshing data."
			);
			setResult(null);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
				<p className='text-[0.7rem] text-zinc-500'>
					Data is fetched live from the salary dataset. Use refresh
					button to reload.
				</p>
				<button
					type='button'
					onClick={handleReload}
					disabled={isLoading}
					className='inline-flex items-center justify-center rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60'>
					{isLoading ? "Refreshing data..." : "Reload data"}
				</button>
			</div>

			{/* Display an error message if data cannot be fetched */}
			{errorMessage && (
				<section className='mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800'>
					<h2 className='font-semibold mb-1'>Unable to load data</h2>
					<p>{errorMessage}</p>
					<p className='mt-2 text-xs text-red-600'>
						Please check your network connection and try again.
					</p>
				</section>
			)}

			{!errorMessage && result && (
				<>
					<section className='mt-6 grid gap-6 md:grid-cols-[2fr,3fr] items-start'>
						<div className='rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 p-[1px]'>
							<div className='rounded-2xl bg-white px-6 py-6 flex flex-col gap-3'>
								<h2 className='text-sm font-medium text-emerald-700 uppercase tracking-[0.18em]'>
									Upcoming Qualifying Offer
								</h2>
								<p className='text-4xl md:text-5xl font-semibold tabular-nums'>
									{result.qualifyingOffer !== null
										? `$${result.qualifyingOffer.toLocaleString(
												undefined,
												{
													minimumFractionDigits: 0,
													maximumFractionDigits: 0,
												}
										  )}`
										: "N/A"}
								</p>
								<p className='text-xs text-zinc-600 leading-relaxed'>
									Computed as the average of the top{" "}
									<span className='font-semibold text-zinc-900'>
										{Math.min(125, result.validCount)}
									</span>{" "}
									valid salaries in the dataset for this page
									load.
								</p>
							</div>
						</div>

						<div className='rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 space-y-3'>
							<h2 className='text-sm font-semibold text-zinc-900'>
								Dataset summary
							</h2>
							<dl className='grid grid-cols-2 gap-3 text-xs md:text-sm'>
								<div className='space-y-1'>
									<dt className='text-zinc-600'>
										Total rows in table
									</dt>
									<dd className='font-mono text-zinc-900'>
										{result.totalRows}
									</dd>
								</div>
								<div className='space-y-1'>
									<dt className='text-zinc-600'>
										Valid salary rows used
									</dt>
									<dd className='font-mono text-emerald-300'>
										{result.validCount}
									</dd>
								</div>
								<div className='space-y-1'>
									<dt className='text-zinc-600'>
										Rows ignored as malformed
									</dt>
									<dd className='font-mono text-amber-300'>
										{result.ignoredRows}
									</dd>
								</div>
								<div className='space-y-1'>
									<dt className='text-zinc-600'>
										Salaries in QO sample
									</dt>
									<dd className='font-mono text-zinc-900'>
										{result.topPlayers.length}
									</dd>
								</div>
							</dl>
							<p className='text-[0.7rem] text-zinc-500'>
								Any rows with missing, zero, or non-numeric
								salary values are safely ignored so they do not
								affect the calculation.
							</p>
						</div>
					</section>

					<div className='mt-4'>
						<TopSalariesTable players={result.topPlayers} />
					</div>
				</>
			)}
		</>
	);
}
