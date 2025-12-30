"use client";

import { useMemo, useState } from "react";
import type { PlayerSalary } from "@/lib/qualifyingOffer";

type TopSalariesTableProps = {
	players: PlayerSalary[];
};

export function TopSalariesTable({ players }: TopSalariesTableProps) {
	const [query, setQuery] = useState("");

	// Filter players by name
	const filteredPlayers = useMemo(() => {
		const trimmed = query.trim().toLowerCase();
		if (!trimmed) return players;

		return players.filter((player) =>
			player.name.toLowerCase().includes(trimmed)
		);
	}, [players, query]);

	return (
		<section className='rounded-2xl border border-zinc-200 bg-white px-5 py-4 space-y-3'>
			<div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<h2 className='text-sm font-semibold text-zinc-900'>
						Top 125 salaries used in the calculation
					</h2>
					<p className='text-[0.7rem] text-zinc-500'>
						Sorted highest to lowest for this page load.
					</p>
				</div>
				<div className='w-full sm:w-64'>
					<label className='sr-only' htmlFor='salary-search'>
						Search by player name
					</label>
					<input
						id='salary-search'
						type='text'
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder='Search by player'
						className='w-full rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500'
					/>
				</div>
			</div>

			<div className='overflow-x-auto'>
				<div className='max-h-72 overflow-y-auto'>
					<table className='min-w-full text-left text-xs md:text-sm'>
						<thead className='border-b border-zinc-200 text-zinc-500 sticky top-0 bg-zinc-50 backdrop-blur'>
							<tr>
								<th className='py-2 pr-4 font-medium'>#</th>
								<th className='py-2 pr-4 font-medium'>
									Player
								</th>
								<th className='py-2 pr-4 font-medium text-right'>
									Salary
								</th>
							</tr>
						</thead>
						<tbody>
							{/* Display the players in the table */}
							{filteredPlayers.map((player, index) => (
								<tr
									key={`${player.name}-${player.salary}-${index}`}
									className='border-b border-zinc-100 last:border-b-0'>
									<td className='py-1.5 pr-4 text-zinc-500'>
										{index + 1}
									</td>
									<td className='py-1.5 pr-4 text-zinc-900'>
										{player.name}
									</td>
									<td className='py-1.5 pr-4 text-right font-mono text-zinc-900'>
										{`$${player.salary.toLocaleString(
											undefined,
											{
												minimumFractionDigits: 0,
												maximumFractionDigits: 0,
											}
										)}`}
									</td>
								</tr>
							))}

							{/* Display a message if no players match the search */}
							{filteredPlayers.length === 0 && (
								<tr>
									<td
										colSpan={3}
										className='py-3 pr-4 text-xs text-zinc-500'>
										No players match that search.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</section>
	);
}
