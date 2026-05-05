import { useParams } from "react-router-dom";

const venues = [
	{
		id: "1",
		name: "Cozy Cabin",
		location: "Norway",
		description: "A peaceful cabin surrounded by forest and mountains.",
		price: 120,
		maxGuests: 4,
	},
	{
		id: "2",
		name: "Modern Apartment",
		location: "Oslo",
		description: "A bright city apartment close to restaurants and shops.",
		price: 150,
		maxGuests: 2,
	},
	{
		id: "3",
		name: "Beach House",
		location: "Bergen",
		description: "A relaxing stay near the coast with beautiful sea views.",
		price: 180,
		maxGuests: 6,
	},
];

function Venue() {
	const { id } = useParams();

	const venue = venues.find((venue) => venue.id === id);

	if (!venue) {
		return <p>Venue not found.</p>;
	}

	return (
		<section className="grid gap-8 md:grid-cols-2">
			<div className="h-72 rounded-lg bg-gray-200"></div>

			<div>
				<p className="text-sm text-gray-500">{venue.location}</p>
				<h1 className="mt-2 text-3xl font-bold">{venue.name}</h1>

				<p className="mt-4 text-gray-700">{venue.description}</p>

				<div className="mt-6 space-y-2">
					<p>
						<span className="font-semibold">Price:</span> ${venue.price} / night
					</p>
					<p>
						<span className="font-semibold">Max guests:</span> {venue.maxGuests}
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
