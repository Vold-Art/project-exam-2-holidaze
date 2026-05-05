import { Link } from "react-router-dom";

function Home() {
	const venues = [
		{ id: 1, name: "Cozy Cabin", location: "Norway" },
		{ id: 2, name: "Modern Apartment", location: "Oslo" },
		{ id: 3, name: "Beach House", location: "Bergen" },
	];

	return (
		<div>
			<h1 className="mb-6 text-2xl font-bold">Venues</h1>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				{venues.map((venue) => (
					<Link key={venue.id} to={`/venue/${venue.id}`}>
						<div className="rounded-lg border bg-white p-4 shadow hover:bg-gray-100">
							<h2 className="text-lg font-semibold">{venue.name}</h2>
							<p className="text-sm text-gray-500">{venue.location}</p>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}

export default Home;
