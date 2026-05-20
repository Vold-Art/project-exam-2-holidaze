import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Button from "../components/Button";

type Venue = {
	id: string;
	name: string;
	description?: string;
	price: number;
	maxGuests: number;
	meta?: {
		wifi?: boolean;
		parking?: boolean;
		breakfast?: boolean;
		pets?: boolean;
	};
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
	const [wifi, setWifi] = useState(false);
	const [parking, setParking] = useState(false);
	const [breakfast, setBreakfast] = useState(false);
	const [pets, setPets] = useState(false);
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
							? mediaUrl.split(",").map((url) => ({
									url: url.trim(),
									alt: name,
								}))
							: [],
						price,
						maxGuests,
						meta: {
							wifi,
							parking,
							breakfast,
							pets,
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
			setWifi(false);
			setParking(false);
			setBreakfast(false);
			setPets(false);
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
		<section className="mx-auto max-w-4xl rounded-2xl border-2 border-[var(--color-brand-primary)] bg-white p-6 shadow-lg">
			<h1 className="text-3xl font-normal text-[var(--color-brand-primary)]">
				Venue Manager
			</h1>

			<p className="mt-2 text-sm text-[var(--color-text-secondary)]">
				Create and manage your venues here.
			</p>

			<form onSubmit={handleSubmitVenue} className="mt-8 space-y-4">
				<div>
					<label htmlFor="name" className="block text-sm font-normal">
						Venue name
					</label>
					<input
						id="name"
						type="text"
						value={name}
						onChange={(event) => setName(event.target.value)}
						required
						className="mt-1 w-full rounded-lg border px-4 py-3"
					/>
				</div>

				<div>
					<label htmlFor="description" className="block text-sm font-normal">
						Description
					</label>
					<textarea
						id="description"
						value={description}
						onChange={(event) => setDescription(event.target.value)}
						required
						className="mt-1 w-full rounded-lg border px-4 py-3"
					/>
				</div>

				<div>
					<label htmlFor="mediaUrl" className="block text-sm font-normal">
						Image URLs
					</label>
					<input
						id="mediaUrl"
						type="text"
						value={mediaUrl}
						onChange={(event) => setMediaUrl(event.target.value)}
						placeholder="https://image1.jpg, https://image2.jpg"
						className="mt-1 w-full rounded-lg border px-4 py-3"
					/>
				</div>

				<div className="grid gap-4 md:grid-cols-2">
					<div>
						<label htmlFor="price" className="block text-sm font-normal">
							Price per night
						</label>
						<input
							id="price"
							type="number"
							min="0"
							value={price}
							onChange={(event) => setPrice(Number(event.target.value))}
							required
							className="mt-1 w-full rounded-lg border px-4 py-3"
						/>
					</div>

					<div>
						<label htmlFor="maxGuests" className="block text-sm font-normal">
							Max guests
						</label>
						<input
							id="maxGuests"
							type="number"
							min="1"
							value={maxGuests}
							onChange={(event) => setMaxGuests(Number(event.target.value))}
							required
							className="mt-1 w-full rounded-lg border px-4 py-3"
						/>
					</div>

					<div className="grid gap-4 text-sm font-normal text-[var(--color-text-primary)] md:col-span-2 md:grid-cols-4">
						<label className="flex items-center justify-center gap-2">
							<input
								type="checkbox"
								checked={wifi}
								onChange={(event) => setWifi(event.target.checked)}
							/>
							WiFi
						</label>

						<label className="flex items-center justify-center gap-2">
							<input
								type="checkbox"
								checked={parking}
								onChange={(event) => setParking(event.target.checked)}
							/>
							Parking
						</label>

						<label className="flex items-center justify-center gap-2">
							<input
								type="checkbox"
								checked={breakfast}
								onChange={(event) => setBreakfast(event.target.checked)}
							/>
							Breakfast
						</label>

						<label className="flex items-center justify-center gap-2">
							<input
								type="checkbox"
								checked={pets}
								onChange={(event) => setPets(event.target.checked)}
							/>
							Pets allowed
						</label>
					</div>
				</div>

				<div className="flex flex-wrap gap-3">
					<Button type="submit" disabled={isCreating}>
						{isCreating
							? editingVenueId
								? "Updating..."
								: "Creating..."
							: editingVenueId
								? "Update venue"
								: "Create venue"}
					</Button>

					{editingVenueId && (
						<Button
							type="button"
							variant="accent"
							onClick={() => {
								setEditingVenueId(null);
								setName("");
								setDescription("");
								setMediaUrl("");
								setPrice(0);
								setMaxGuests(1);
							}}
						>
							Cancel edit
						</Button>
					)}
				</div>

				{message && (
					<p className="text-sm text-[var(--color-brand-primary)]">{message}</p>
				)}
			</form>

			<div className="mt-12">
				<h2 className="text-2xl font-normal text-[var(--color-brand-primary)]">
					Your venues
				</h2>

				{isLoadingVenues && (
					<p className="mt-4 text-[var(--color-text-secondary)]">
						Loading your venues...
					</p>
				)}

				{venuesError && (
					<p className="mt-4 text-[var(--color-brand-primary)]">
						{venuesError}
					</p>
				)}

				{!isLoadingVenues && !venuesError && venues.length === 0 && (
					<p className="mt-4 text-[var(--color-text-secondary)]">
						You have not created any venues yet.
					</p>
				)}

				{!isLoadingVenues && !venuesError && venues.length > 0 && (
					<div className="mt-4 space-y-4">
						{venues.map((venue) => (
							<article
								key={venue.id}
								className="rounded-2xl border-2 border-[var(--color-brand-primary)] bg-white p-4 shadow"
							>
								<h3 className="text-xl font-normal">{venue.name}</h3>

								<p className="mt-1 text-sm text-[var(--color-text-secondary)]">
									${venue.price} / night · Max guests: {venue.maxGuests}
								</p>

								<div className="mt-4 flex flex-wrap gap-3">
									<Button
										type="button"
										variant="accent"
										className="px-4 py-2 text-sm"
										onClick={() => {
											setEditingVenueId(venue.id);
											setName(venue.name);
											setDescription(venue.description || "");
											setPrice(venue.price);
											setMaxGuests(venue.maxGuests);
											setWifi(venue.meta?.wifi || false);
											setParking(venue.meta?.parking || false);
											setBreakfast(venue.meta?.breakfast || false);
											setPets(venue.meta?.pets || false);
										}}
									>
										Edit
									</Button>

									<Button
										type="button"
										className="px-4 py-2 text-sm"
										onClick={() => handleDeleteVenue(venue.id)}
									>
										Delete
									</Button>
								</div>

								<div className="mt-4 border-t border-[var(--color-brand-primary)] pt-4">
									<h4 className="font-normal">Bookings</h4>

									{!venue.bookings || venue.bookings.length === 0 ? (
										<p className="mt-2 text-sm text-[var(--color-text-secondary)]">
											No bookings for this venue yet.
										</p>
									) : (
										<div className="mt-2 space-y-2">
											{venue.bookings.map((booking) => (
												<div
													key={booking.id}
													className="rounded-lg bg-gray-50 p-3 text-sm"
												>
													<p>
														<span className="font-normal">From:</span>{" "}
														{new Date(booking.dateFrom).toLocaleDateString()}
													</p>
													<p>
														<span className="font-normal">To:</span>{" "}
														{new Date(booking.dateTo).toLocaleDateString()}
													</p>
													<p>
														<span className="font-normal">Guests:</span>{" "}
														{booking.guests}
													</p>
													{booking.customer && (
														<p>
															<span className="font-normal">Customer:</span>{" "}
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
