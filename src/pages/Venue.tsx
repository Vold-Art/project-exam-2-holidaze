import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
	rating: number;
	bookings?: {
		id: string;
		dateFrom: string;
		dateTo: string;
		guests: number;
	}[];
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
	const [dateFrom, setDateFrom] = useState("");
	const [dateTo, setDateTo] = useState("");
	const [guests, setGuests] = useState(1);
	const [bookingMessage, setBookingMessage] = useState("");
	const [isBooking, setIsBooking] = useState(false);

	useEffect(() => {
		async function fetchVenue() {
			try {
				const response = await fetch(
					`${import.meta.env.VITE_API_BASE_URL}/holidaze/venues/${id}?_bookings=true`,
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

	async function handleBooking(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setBookingMessage("");
		setIsBooking(true);

		const storedUser = localStorage.getItem("user");
		const user = storedUser ? JSON.parse(storedUser) : null;

		if (!user?.accessToken) {
			setBookingMessage("You need to log in before booking.");
			setIsBooking(false);
			return;
		}

		const selectedStart = new Date(dateFrom);
		const selectedEnd = new Date(dateTo);

		if (selectedEnd <= selectedStart) {
			setBookingMessage("Check-out date must be after check-in date.");
			setIsBooking(false);
			return;
		}

		const hasOverlap = venue?.bookings?.some((booking) => {
			const bookedStart = new Date(booking.dateFrom);
			const bookedEnd = new Date(booking.dateTo);

			return selectedStart < bookedEnd && selectedEnd > bookedStart;
		});

		if (hasOverlap) {
			setBookingMessage(
				"These dates are already booked. Please choose another date.",
			);
			setIsBooking(false);
			return;
		}

		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_BASE_URL}/holidaze/bookings`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${user.accessToken}`,
						"X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
					},
					body: JSON.stringify({
						dateFrom,
						dateTo,
						guests,
						venueId: id,
					}),
				},
			);

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.errors?.[0]?.message || "Booking failed");
			}

			setBookingMessage("Booking created successfully.");
			setDateFrom("");
			setDateTo("");
			setGuests(1);
		} catch (error) {
			setBookingMessage(
				error instanceof Error
					? error.message
					: "Something went wrong while creating the booking.",
			);
		} finally {
			setIsBooking(false);
		}
	}

	return (
		<section className="grid gap-8 rounded-2xl border-2 border-[var(--color-brand-primary)] bg-white p-6 shadow-lg md:grid-cols-2">
			<div className="h-72 overflow-hidden rounded-2xl bg-gray-100 md:h-full">
				{venue.media?.[0]?.url && (
					<img
						src={venue.media[0].url}
						alt={venue.media[0].alt || venue.name}
						width="800"
						height="600"
						className="h-full w-full object-cover"
					/>
				)}
			</div>

			<div>
				<p className="text-sm text-[var(--color-text-secondary)]">
					{venue.location?.city || "Unknown location"},{" "}
					{venue.location?.country || ""}
				</p>

				<h1 className="mt-2 text-3xl font-normal text-[var(--color-brand-primary)]">
					{venue.name}
				</h1>

				<p className="mt-4 text-[var(--color-text-secondary)]">
					{venue.description}
				</p>

				<div className="mt-6 space-y-2">
					<p>
						<span className="font-normal">Price:</span> ${venue.price} / night
					</p>
					<p>
						<span className="font-normal">Max guests:</span> {venue.maxGuests}
					</p>
					<p>
						<span className="font-normal">Rating:</span> {venue.rating}
					</p>
				</div>

				<div className="mt-8 rounded-2xl border-2 border-[var(--color-brand-primary)] bg-white p-4">
					<h2 className="text-xl font-normal text-[var(--color-brand-primary)]">
						Booked dates
					</h2>

					{!venue.bookings || venue.bookings.length === 0 ? (
						<p className="mt-2 text-sm text-[var(--color-text-secondary)]">
							No booked dates yet.
						</p>
					) : (
						<ul className="mt-2 space-y-2 text-sm text-[var(--color-text-secondary)]">
							{venue.bookings.map((booking) => (
								<li key={booking.id}>
									{new Date(booking.dateFrom).toLocaleDateString()} –{" "}
									{new Date(booking.dateTo).toLocaleDateString()}
								</li>
							))}
						</ul>
					)}
				</div>

				<form onSubmit={handleBooking} className="mt-8 space-y-4">
					<div>
						<label htmlFor="dateFrom" className="block text-sm font-normal">
							Check-in
						</label>
						<input
							id="dateFrom"
							type="date"
							value={dateFrom}
							onChange={(event) => setDateFrom(event.target.value)}
							required
							className="mt-1 w-full rounded-lg border px-4 py-3"
						/>
					</div>

					<div>
						<label htmlFor="dateTo" className="block text-sm font-normal">
							Check-out
						</label>
						<input
							id="dateTo"
							type="date"
							value={dateTo}
							onChange={(event) => setDateTo(event.target.value)}
							required
							className="mt-1 w-full rounded-lg border px-4 py-3"
						/>
					</div>

					<div>
						<label htmlFor="guests" className="block text-sm font-normal">
							Guests
						</label>
						<input
							id="guests"
							type="number"
							min="1"
							max={venue.maxGuests}
							value={guests}
							onChange={(event) => setGuests(Number(event.target.value))}
							required
							className="mt-1 w-full rounded-lg border px-4 py-3"
						/>
					</div>

					<Button type="submit" disabled={isBooking}>
						{isBooking ? "Booking..." : "Book this venue"}
					</Button>

					{bookingMessage && (
						<p className="text-sm text-[var(--color-brand-primary)]">
							{bookingMessage}
						</p>
					)}
				</form>
			</div>
		</section>
	);
}

export default Venue;
