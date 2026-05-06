import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
	rating: number;
	location: {
		address?: string;
		city?: string;
		country?: string;
	};
};

function Venue() {
	const { id } = useParams();

	const [venue, setVenue] = useState<Venue | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		async function fetchVenue() {
			try {
				const response = await fetch(
					`${import.meta.env.VITE_API_BASE_URL}/holidaze/venues/${id}`,
				);

				if (!response.ok) {
					throw new Error("Failed to fetch venue");
				}

				const result = await response.json();
				setVenue(result.data);
			} catch (error) {
				setError("Something went wrong while loading the venue.");
			} finally {
				setIsLoading(false);
			}
		}

		fetchVenue();
	}, [id]);

	if (isLoading) {
		return <p>Loading venue...</p>;
	}

	if (error) {
		return <p>{error}</p>;
	}

	if (!venue) {
		return <p>Venue not found.</p>;
	}

	return (
		<section className="grid gap-8 md:grid-cols-2">
			<div className="h-72 overflow-hidden rounded-lg bg-gray-200">
				{venue.media?.[0]?.url && (
					<img
						src={venue.media[0].url}
						alt={venue.media[0].alt || venue.name}
						className="h-full w-full object-cover"
					/>
				)}
			</div>

			<div>
				<p className="text-sm text-gray-500">
					{venue.location?.city || "Unknown location"},{" "}
					{venue.location?.country || ""}
				</p>

				<h1 className="mt-2 text-3xl font-bold">{venue.name}</h1>

				<p className="mt-4 text-gray-700">{venue.description}</p>

				<div className="mt-6 space-y-2">
					<p>
						<span className="font-semibold">Price:</span> ${venue.price} / night
					</p>
					<p>
						<span className="font-semibold">Max guests:</span> {venue.maxGuests}
					</p>
					<p>
						<span className="font-semibold">Rating:</span> {venue.rating}
					</p>
				</div>

				<button className="mt-8 rounded-lg bg-gray-900 px-5 py-3 text-white hover:bg-gray-700">
					Book this venue
				</button>
			</div>
		</section>
	);
}

export default Venue;
