import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";

type Venue = {
	id: string;
	name: string;
	description: string;
	media: {
		url: string;
		alt: string;
	}[];
	price: number;
	maxGuests: number;
	location: {
		city?: string;
		country?: string;
	};
};

function Home() {
	const [venues, setVenues] = useState<Venue[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [maxPrice, setMaxPrice] = useState("");
	const [guestCount, setGuestCount] = useState("");
	const [page, setPage] = useState(1);
	const [totalVenues, setTotalVenues] = useState(0);
	const [sortOption, setSortOption] = useState("created-desc");

	function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
		setSearchTerm(event.target.value);
		setPage(1);
	}

	const [sortField, sortOrder] = sortOption.split("-");

	useEffect(() => {
		async function fetchVenues() {
			try {
				const endpoint = searchTerm
					? `${import.meta.env.VITE_API_BASE_URL}/holidaze/venues/search?q=${encodeURIComponent(searchTerm)}&limit=30&page=${page}&sort=${sortField}&sortOrder=${sortOrder}`
					: `${import.meta.env.VITE_API_BASE_URL}/holidaze/venues?sort=${sortField}&sortOrder=${sortOrder}&limit=30&page=${page}`;

				const response = await fetch(endpoint);

				if (!response.ok) {
					throw new Error("Failed to fetch venues");
				}

				const result = await response.json();
				setVenues(result.data);
				setTotalVenues(result.meta.totalCount);
			} catch (error) {
				setError("Something went wrong while loading venues.");
			} finally {
				setIsLoading(false);
			}
		}

		fetchVenues();
	}, [searchTerm, page, sortOption]);

	if (isLoading) {
		return <p>Loading venues...</p>;
	}

	if (error) {
		return <p>{error}</p>;
	}

	const filteredVenues = venues.filter((venue) => {
		const matchesPrice = maxPrice ? venue.price <= Number(maxPrice) : true;

		const matchesGuests = guestCount
			? venue.maxGuests >= Number(guestCount)
			: true;

		return matchesPrice && matchesGuests;
	});

	const startVenue = totalVenues === 0 ? 0 : (page - 1) * 30 + 1;
	const endVenue = Math.min(page * 30, totalVenues);

	return (
		<div>
			<h1 className="sr-only">Venues</h1>

			<section className="mb-10 rounded-2xl bg-[var(--color-brand-primary)] p-6 shadow-lg">
				<h2 className="mb-4 text-2xl font-normal text-white">
					Find your perfect stay
				</h2>

				<div className="grid gap-4 md:grid-cols-4">
					<div className="md:col-span-2">
						<label htmlFor="venueSearch" className="sr-only">
							Search venues
						</label>
						<input
							id="venueSearch"
							type="search"
							placeholder="Search by location or venue name..."
							value={searchTerm}
							onChange={handleSearchChange}
							className="w-full rounded-lg bg-white px-4 py-3"
						/>
					</div>

					<div>
						<label htmlFor="maxPrice" className="sr-only">
							Max price
						</label>
						<input
							id="maxPrice"
							type="number"
							min="0"
							placeholder="Max price"
							value={maxPrice}
							onChange={(event) => setMaxPrice(event.target.value)}
							className="w-full rounded-lg bg-white px-4 py-3"
						/>
					</div>

					<div>
						<label htmlFor="guestCount" className="sr-only">
							Guests
						</label>
						<input
							id="guestCount"
							type="number"
							min="1"
							placeholder="Guests"
							value={guestCount}
							onChange={(event) => setGuestCount(event.target.value)}
							className="w-full rounded-lg bg-white px-4 py-3"
						/>
					</div>
				</div>
			</section>

			<div className="mb-4 flex flex-col gap-4 text-sm text-[var(--color-text-secondary)] md:flex-row md:items-center md:justify-between">
				<p>
					Showing {startVenue}–{endVenue} of {totalVenues} venues
				</p>

				<div className="flex flex-wrap items-center gap-4">
					<label
						htmlFor="sortOption"
						className="font-normal text-[var(--color-text-secondary)]"
					>
						Sort by
					</label>

					<select
						id="sortOption"
						value={sortOption}
						onChange={(event) => {
							setSortOption(event.target.value);
							setPage(1);
						}}
						className="rounded-lg border-2 border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)] px-4 pr-8 py-2 font-normal text-white"
					>
						<option value="created-desc">Newest</option>
						<option value="created-asc">Oldest</option>
						<option value="price-asc">Price: low to high</option>
						<option value="price-desc">Price: high to low</option>
					</select>

					{(searchTerm || maxPrice || guestCount) && (
						<button
							type="button"
							onClick={() => {
								setSearchTerm("");
								setMaxPrice("");
								setGuestCount("");
								setPage(1);
							}}
							className="font-normal text-[var(--color-text-primary)] underline"
						>
							Clear filters
						</button>
					)}
				</div>
			</div>

			{filteredVenues.length === 0 ? (
				<p className="text-[var(--color-text-secondary)]">
					No venues match your search or filters.
				</p>
			) : (
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					{filteredVenues.map((venue) => (
						<Link key={venue.id} to={`/venue/${venue.id}`}>
							<article className="overflow-hidden rounded-lg border-2 border-[var(--color-brand-primary)] bg-white shadow transition hover:shadow-lg">
								<div className="h-48 bg-gray-200">
									{venue.media?.[0]?.url && (
										<img
											src={venue.media[0].url}
											alt={venue.media[0].alt || venue.name}
											className="h-full w-full object-cover"
										/>
									)}
								</div>

								<div className="p-4">
									<h2 className="text-lg font-semibold">{venue.name}</h2>

									<p className="mt-1 text-sm text-[var(--color-text-secondary)]">
										{venue.location?.city || "Unknown location"},{" "}
										{venue.location?.country || ""}
									</p>

									<p className="mt-3 font-medium">${venue.price} / night</p>
								</div>
							</article>
						</Link>
					))}
				</div>
			)}

			<div className="mt-8 flex items-center justify-center gap-4">
				<Button
					type="button"
					variant="accent"
					onClick={() => setPage((currentPage) => Math.max(currentPage - 1, 1))}
					disabled={page === 1}
				>
					Previous
				</Button>

				<span className="text-sm font-normal text-[var(--color-text-secondary)]">
					Page {page}
				</span>

				<Button
					type="button"
					variant="primary"
					onClick={() => setPage((currentPage) => currentPage + 1)}
					disabled={filteredVenues.length < 30}
				>
					Next
				</Button>
			</div>
		</div>
	);
}

export default Home;
