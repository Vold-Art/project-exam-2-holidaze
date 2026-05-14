import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

type Venue = {
	id: string;
	name: string;
	description?: string;
	price: number;
	maxGuests: number;
	bookings?: {
		id: string;
		dateFrom: string;
		dateTo: string;
		guests: number;
		customer?: {
			name: string;
			email: string;
		};
	}[];
};

function Manager() {
	const storedUser = localStorage.getItem("user");
	const user = storedUser ? JSON.parse(storedUser) : null;

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [mediaUrl, setMediaUrl] = useState("");
	const [price, setPrice] = useState(0);
	const [maxGuests, setMaxGuests] = useState(1);
	const [message, setMessage] = useState("");
	const [isCreating, setIsCreating] = useState(false);
	const [venues, setVenues] = useState<Venue[]>([]);
	const [isLoadingVenues, setIsLoadingVenues] = useState(true);
	const [venuesError, setVenuesError] = useState("");
	const [editingVenueId, setEditingVenueId] = useState<string | null>(null);

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	if (!user.venueManager) {
		return (
			<section className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow">
				<h1 className="text-2xl font-bold">Venue Manager</h1>
				<p className="mt-4 text-gray-600">
					You need to be registered as a venue manager to access this page.
				</p>
			</section>
		);
	}

	async function fetchManagerVenues() {
		if (!user?.name || !user?.accessToken) return;

		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_BASE_URL}/holidaze/profiles/${user.name}/venues?_bookings=true`,
				{
					headers: {
						Authorization: `Bearer ${user.accessToken}`,
						"X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
					},
				},
			);

			const result = await response.json();

			if (!response.ok) {
				throw new Error(
					result.errors?.[0]?.message || "Failed to fetch venues",
				);
			}

			setVenues(result.data);
		} catch (error) {
			setVenuesError(
				error instanceof Error
					? error.message
					: "Something went wrong while loading your venues.",
			);
		} finally {
			setIsLoadingVenues(false);
		}
	}

	useEffect(() => {
		fetchManagerVenues();
	}, []);

	async function handleSubmitVenue(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setMessage("");
		setIsCreating(true);

		try {
			const response = await fetch(
				editingVenueId
					? `${import.meta.env.VITE_API_BASE_URL}/holidaze/venues/${editingVenueId}`
					: `${import.meta.env.VITE_API_BASE_URL}/holidaze/venues`,
				{
					method: editingVenueId ? "PUT" : "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${user.accessToken}`,
						"X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
					},
					body: JSON.stringify({
						name,
						description,
						media: mediaUrl
							? [
									{
										url: mediaUrl,
										alt: name,
									},
								]
							: [],
						price,
						maxGuests,
						meta: {
							wifi: true,
							parking: false,
							breakfast: false,
							pets: false,
						},
					}),
				},
			);

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.errors?.[0]?.message || "Failed to save venue");
			}

			setMessage(
				editingVenueId
					? "Venue updated successfully."
					: "Venue created successfully.",
			);

			setName("");
			setDescription("");
			setMediaUrl("");
			setPrice(0);
			setMaxGuests(1);
			setEditingVenueId(null);
			fetchManagerVenues();
		} catch (error) {
			setMessage(
				error instanceof Error
					? error.message
					: "Something went wrong while saving the venue.",
			);
		} finally {
			setIsCreating(false);
		}
	}

	async function handleDeleteVenue(venueId: string) {
		const confirmDelete = window.confirm(
			"Are you sure you want to delete this venue?",
		);

		if (!confirmDelete) return;

		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_BASE_URL}/holidaze/venues/${venueId}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${user.accessToken}`,
						"X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
					},
				},
			);

			if (!response.ok) {
				throw new Error("Failed to delete venue");
			}

			setVenues((currentVenues) =>
				currentVenues.filter((venue) => venue.id !== venueId),
			);
		} catch (error) {
			alert(
				error instanceof Error
					? error.message
					: "Something went wrong while deleting the venue.",
			);
		}
	}

	return (
		<section className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow">
			<h1 className="text-2xl font-bold">Venue Manager</h1>
			<p className="mt-4 text-gray-600">Create and manage your venues here.</p>

			<form onSubmit={handleSubmitVenue} className="mt-8 space-y-4">
				<div>
					<label htmlFor="name" className="block text-sm font-medium">
						Venue name
					</label>
					<input
						id="name"
						type="text"
						value={name}
						onChange={(event) => setName(event.target.value)}
						required
						className="mt-1 w-full rounded-lg border px-4 py-2"
					/>
				</div>

				<div>
					<label htmlFor="description" className="block text-sm font-medium">
						Description
					</label>
					<textarea
						id="description"
						value={description}
						onChange={(event) => setDescription(event.target.value)}
						required
						className="mt-1 w-full rounded-lg border px-4 py-2"
					/>
				</div>

				<div>
					<label htmlFor="mediaUrl" className="block text-sm font-medium">
						Image URL
					</label>
					<input
						id="mediaUrl"
						type="url"
						value={mediaUrl}
						onChange={(event) => setMediaUrl(event.target.value)}
						className="mt-1 w-full rounded-lg border px-4 py-2"
					/>
				</div>

				<div>
					<label htmlFor="price" className="block text-sm font-medium">
						Price per night
					</label>
					<input
						id="price"
						type="number"
						min="0"
						value={price}
						onChange={(event) => setPrice(Number(event.target.value))}
						required
						className="mt-1 w-full rounded-lg border px-4 py-2"
					/>
				</div>

				<div>
					<label htmlFor="maxGuests" className="block text-sm font-medium">
						Max guests
					</label>
					<input
						id="maxGuests"
						type="number"
						min="1"
						value={maxGuests}
						onChange={(event) => setMaxGuests(Number(event.target.value))}
						required
						className="mt-1 w-full rounded-lg border px-4 py-2"
					/>
				</div>

				<button
					type="submit"
					disabled={isCreating}
					className="rounded-lg bg-gray-900 px-5 py-3 text-white hover:bg-gray-700 disabled:bg-gray-400"
				>
					{isCreating
						? editingVenueId
							? "Updating..."
							: "Creating..."
						: editingVenueId
							? "Update venue"
							: "Create venue"}
				</button>

				{editingVenueId && (
					<button
						type="button"
						onClick={() => {
							setEditingVenueId(null);
							setName("");
							setDescription("");
							setMediaUrl("");
							setPrice(0);
							setMaxGuests(1);
						}}
						className="ml-3 rounded-lg border px-5 py-3"
					>
						Cancel edit
					</button>
				)}

				{message && <p className="text-sm text-gray-600">{message}</p>}
			</form>

			<div className="mt-10">
				<h2 className="text-xl font-bold">Your venues</h2>

				{isLoadingVenues && (
					<p className="mt-4 text-gray-600">Loading your venues...</p>
				)}

				{venuesError && <p className="mt-4 text-red-600">{venuesError}</p>}

				{!isLoadingVenues && !venuesError && venues.length === 0 && (
					<p className="mt-4 text-gray-600">
						You have not created any venues yet.
					</p>
				)}

				{!isLoadingVenues && !venuesError && venues.length > 0 && (
					<div className="mt-4 space-y-4">
						{venues.map((venue) => (
							<article
								key={venue.id}
								className="rounded-lg border bg-gray-50 p-4"
							>
								<h3 className="font-semibold">{venue.name}</h3>
								<p className="mt-1 text-sm text-gray-600">
									${venue.price} / night · Max guests: {venue.maxGuests}
								</p>

								<button
									type="button"
									onClick={() => {
										setEditingVenueId(venue.id);
										setName(venue.name);
										setDescription(venue.description || "");
										setPrice(venue.price);
										setMaxGuests(venue.maxGuests);
									}}
									className="mt-4 mr-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
								>
									Edit
								</button>

								<button
									type="button"
									onClick={() => handleDeleteVenue(venue.id)}
									className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
								>
									Delete
								</button>
								<div className="mt-4 border-t pt-4">
									<h4 className="font-medium">Bookings</h4>

									{!venue.bookings || venue.bookings.length === 0 ? (
										<p className="mt-2 text-sm text-gray-600">
											No bookings for this venue yet.
										</p>
									) : (
										<div className="mt-2 space-y-2">
											{venue.bookings.map((booking) => (
												<div
													key={booking.id}
													className="rounded bg-white p-3 text-sm"
												>
													<p>
														<span className="font-medium">From:</span>{" "}
														{new Date(booking.dateFrom).toLocaleDateString()}
													</p>
													<p>
														<span className="font-medium">To:</span>{" "}
														{new Date(booking.dateTo).toLocaleDateString()}
													</p>
													<p>
														<span className="font-medium">Guests:</span>{" "}
														{booking.guests}
													</p>
													{booking.customer && (
														<p>
															<span className="font-medium">Customer:</span>{" "}
															{booking.customer.name}
														</p>
													)}
												</div>
											))}
										</div>
									)}
								</div>
							</article>
						))}
					</div>
				)}
			</div>
		</section>
	);
}

export default Manager;
