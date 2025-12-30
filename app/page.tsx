import {
	type QualifyingOfferResult,
	fetchQualifyingOffer,
} from "@/lib/qualifyingOffer";
import Image from "next/image";
import { QualifyingOfferPanel } from "@/components/QualifyingOfferPanel";

export default async function Home() {
	let initialResult: QualifyingOfferResult | null = null;
	let initialErrorMessage: string | null = null;

	try {
		initialResult = await fetchQualifyingOffer();
	} catch (error) {
		// Display an error message if data cannot be fetched.
		initialErrorMessage =
			error instanceof Error
				? error.message
				: "An unexpected error occurred while fetching data.";
	}

	return (
		<div className='min-h-screen bg-zinc-100 text-zinc-900 flex items-center justify-center px-4 py-10'>
			<main className='w-full max-w-4xl rounded-2xl bg-white border border-zinc-200 shadow-xl p-8 md:p-10 space-y-8'>
				<header className='space-y-2'>
					<div className='flex items-center gap-3'>
						<Image
							src='/philadelphia-phillies-1.svg'
							alt='Philadelphia Phillies logo'
							width={40}
							height={40}
							className='shrink-0 rounded-md border border-zinc-200 bg-white'
							priority
						/>
						<h1 className='text-3xl md:text-4xl font-semibold tracking-tight'>
							MLB Qualifying Offer Calculator
						</h1>
					</div>
					<p className='text-zinc-600 max-w-2xl text-sm md:text-base'>
						The qualifying offer is the average of the{" "}
						<span className='font-semibold text-zinc-900'>
							125 highest salaries
						</span>{" "}
						from the previous season. Data is pulled live on each
						page load from the league salary dataset.
					</p>
				</header>

				<QualifyingOfferPanel
					initialResult={initialResult}
					initialErrorMessage={initialErrorMessage}
				/>

				{!initialErrorMessage && initialResult && (
					<>
						<footer className='pt-2 border-t border-zinc-200 text-[0.7rem] text-zinc-500 space-y-1.5'>
							<p>
								Qualifying offer and salary statistics are
								recalculated on every page load using the latest
								data from the provided dataset endpoint.
							</p>
							<p>
								Implementation notes and resources are
								documented in comments in the source code (see{" "}
								<code>app/page.tsx</code>) and in the project
								README.
							</p>
							<div className='pt-1 space-y-0.5'>
								<p className='text-zinc-600'>
									<span className='font-semibold text-zinc-800'>
										Submission by:
									</span>{" "}
									Emmett Stein
								</p>
								<p>
									Email:{" "}
									<a
										href='mailto:emmettstein11@gmail.com'
										className='underline decoration-zinc-300 hover:decoration-zinc-500'>
										emmettstein11@gmail.com
									</a>
								</p>
								<p className='flex flex-wrap gap-x-3 gap-y-0.5'>
									<span>
										LinkedIn:{" "}
										<a
											href='https://www.linkedin.com/in/emmett-stein-60b21a1a3/'
											target='_blank'
											rel='noopener noreferrer'
											className='underline decoration-zinc-300 hover:decoration-zinc-500'>
											/emmett-stein-60b21a1a3
										</a>
									</span>
									<span>
										GitHub:{" "}
										<a
											href='https://github.com/estein14'
											target='_blank'
											rel='noopener noreferrer'
											className='underline decoration-zinc-300 hover:decoration-zinc-500'>
											@estein14
										</a>
									</span>
								</p>
							</div>
						</footer>
					</>
				)}
			</main>
		</div>
	);
}
