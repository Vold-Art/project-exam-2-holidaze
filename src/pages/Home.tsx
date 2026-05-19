import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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

	useEffect(() => {
		async function fetchVenues() {
			try {
				const response = await fetch(
					`${import.meta.env.VITE_API_BASE_URL}/holidaze/venues?sort=created&sortOrder=desc`,
				);

				if (!response.ok) {
					throw new Error("Failed to fetch venues");
				}

				const result = await response.json();
				setVenues(result.data);
			} catch (error) {
				setError("Something went wrong while loading venues.");
			} finally {
				setIsLoading(false);
			}
		}

		fetchVenues();
	}, []);

	if (isLoading) {
		return <p>Loading venues...</p>;
	}

	if (error) {
		return <p>{error}</p>;
	}

	const filteredVenues = venues.filter((venue) => {
		const searchValue = searchTerm.toLowerCase();

		const matchesSearch =
			venue.name.toLowerCase().includes(searchValue) ||
			venue.description.toLowerCase().includes(searchValue) ||
			venue.location?.city?.toLowerCase().includes(searchValue) ||
			venue.location?.country?.toLowerCase().includes(searchValue);

		const matchesPrice = maxPrice ? venue.price <= Number(maxPrice) : true;

		const matchesGuests = guestCount
			? venue.maxGuests >= Number(guestCount)
			: true;

		return matchesSearch && matchesPrice && matchesGuests;
	});

	return (
		<div>
			<h1 className="mb-6 text-2xl font-bold">Venues</h1>

			<div className="mb-6 grid gap-4 md:grid-cols-3">
				<input
					type="search"
					placeholder="Search by name, place or description..."
					value={searchTerm}
					onChange={(event) => setSearchTerm(event.target.value)}
					className="w-full rounded-lg border bg-white px-4 py-3"
				/>

				<input
					type="number"
					min="0"
					placeholder="Max price"
					value={maxPrice}
					onChange={(event) => setMaxPrice(event.target.value)}
					className="w-full rounded-lg border bg-white px-4 py-3"
				/>

				<input
					type="number"
					min="1"
					placeholder="Guests"
					value={guestCount}
					onChange={(event) => setGuestCount(event.target.value)}
					className="w-full rounded-lg border bg-white px-4 py-3"
				/>
			</div>

			<div className="mb-4 flex items-center justify-between text-sm text-gray-600">
				<p>
					Showing {filteredVenues.length} of {venues.length} venues
				</p>

				{(searchTerm || maxPrice || guestCount) && (
					<button
						type="button"
						onClick={() => {
							setSearchTerm("");
							setMaxPrice("");
							setGuestCount("");
						}}
						className="font-medium text-gray-900 underline"
					>
						Clear filters
					</button>
				)}
			</div>

			{filteredVenues.length === 0 ? (
				<p className="text-gray-500">No venues match your search or filters.</p>
			) : (
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					{filteredVenues.map((venue) => (
						<Link key={venue.id} to={`/venue/${venue.id}`}>
							<article className="overflow-hidden rounded-lg border bg-white shadow hover:bg-gray-100">
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

									<p className="mt-1 text-sm text-gray-500">
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
		</div>
	);
}

export default Home;
