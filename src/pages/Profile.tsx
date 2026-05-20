import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Button from "../components/Button";

type Booking = {
	id: string;
	dateFrom: string;
	dateTo: string;
	guests: number;
	venue?: {
		id: string;
		name: string;
		media?: {
			url: string;
			alt: string;
		}[];
		location?: {
			city?: string;
			country?: string;
		};
	};
};

function Profile() {
	const storedUser = localStorage.getItem("user");
	const user = storedUser ? JSON.parse(storedUser) : null;

	const [bookings, setBookings] = useState<Booking[]>([]);
	const [isLoadingBookings, setIsLoadingBookings] = useState(true);
	const [bookingsError, setBookingsError] = useState("");
	const [avatarUrl, setAvatarUrl] = useState(user?.avatar?.url || "");
	const [avatarMessage, setAvatarMessage] = useState("");
	const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);

	useEffect(() => {
		if (!user?.name || !user?.accessToken) return;

		async function fetchBookings() {
			try {
				const response = await fetch(
					`${import.meta.env.VITE_API_BASE_URL}/holidaze/profiles/${user.name}/bookings?_venue=true`,
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
						result.errors?.[0]?.message || "Failed to fetch bookings",
					);
				}

				setBookings(result.data);
			} catch (error) {
				setBookingsError(
					error instanceof Error
						? error.message
						: "Something went wrong while loading bookings.",
				);
			} finally {
				setIsLoadingBookings(false);
			}
		}

		fetchBookings();
	}, [user?.name, user?.accessToken]);

	async function handleAvatarUpdate(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setAvatarMessage("");
		setIsUpdatingAvatar(true);

		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_BASE_URL}/holidaze/profiles/${user.name}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${user.accessToken}`,
						"X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
					},
					body: JSON.stringify({
						avatar: {
							url: avatarUrl,
							alt: `${user.name} avatar`,
						},
					}),
				},
			);

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.errors?.[0]?.message || "Avatar update failed");
			}

			const updatedUser = {
				...user,
				avatar: result.data.avatar,
			};

			localStorage.setItem("user", JSON.stringify(updatedUser));
			setAvatarMessage("Avatar updated successfully.");
			window.location.reload();
		} catch (error) {
			setAvatarMessage(
				error instanceof Error
					? error.message
					: "Something went wrong while updating avatar.",
			);
		} finally {
			setIsUpdatingAvatar(false);
		}
	}

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	return (
		<section className="mx-auto max-w-3xl rounded-2xl border-2 border-[var(--color-brand-primary)] bg-white p-6 shadow-lg">
			<h1 className="text-3xl font-normal text-[var(--color-brand-primary)]">
				Profile
			</h1>

			<div className="mt-6 flex items-center gap-4">
				<div className="h-20 w-20 overflow-hidden rounded-full border-2 border-[var(--color-brand-primary)] bg-gray-100">
					{user.avatar?.url && (
						<img
							src={user.avatar.url}
							alt={user.avatar.alt || user.name}
							className="h-full w-full object-cover"
						/>
					)}
				</div>

				<div>
					<h2 className="text-xl font-normal">{user.name}</h2>
					<p className="text-[var(--color-text-secondary)]">{user.email}</p>
					<p className="mt-1 text-sm text-[var(--color-text-secondary)]">
						{user.venueManager ? "Venue manager" : "Customer"}
					</p>
				</div>
			</div>

			<form onSubmit={handleAvatarUpdate} className="mt-8 space-y-4">
				<div>
					<label htmlFor="avatarUrl" className="block text-sm font-normal">
						Avatar image URL
					</label>
					<input
						id="avatarUrl"
						type="url"
						value={avatarUrl}
						onChange={(event) => setAvatarUrl(event.target.value)}
						placeholder="https://example.com/avatar.jpg"
						className="mt-1 w-full rounded-lg border px-4 py-3"
					/>
				</div>

				<Button type="submit" disabled={isUpdatingAvatar}>
					{isUpdatingAvatar ? "Updating..." : "Update avatar"}
				</Button>

				{avatarMessage && (
					<p className="text-sm text-[var(--color-brand-primary)]">
						{avatarMessage}
					</p>
				)}
			</form>

			<div className="mt-12">
				<h2 className="text-2xl font-normal text-[var(--color-brand-primary)]">
					Upcoming bookings
				</h2>

				{isLoadingBookings && (
					<p className="mt-4 text-[var(--color-text-secondary)]">
						Loading bookings...
					</p>
				)}

				{bookingsError && (
					<p className="mt-4 text-[var(--color-brand-primary)]">
						{bookingsError}
					</p>
				)}

				{!isLoadingBookings && !bookingsError && bookings.length === 0 && (
					<p className="mt-4 text-[var(--color-text-secondary)]">
						You have no upcoming bookings.
					</p>
				)}

				{!isLoadingBookings && !bookingsError && bookings.length > 0 && (
					<div className="mt-4 space-y-4">
						{bookings.map((booking) => (
							<article
								key={booking.id}
								className="rounded-2xl border-2 border-[var(--color-brand-primary)] bg-white p-4 shadow"
							>
								<h3 className="text-xl font-normal">
									{booking.venue?.name || "Venue"}
								</h3>

								<p className="mt-1 text-sm text-[var(--color-text-secondary)]">
									{booking.venue?.location?.city || "Unknown location"},{" "}
									{booking.venue?.location?.country || ""}
								</p>

								<div className="mt-3 space-y-1 text-sm">
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
								</div>
							</article>
						))}
					</div>
				)}
			</div>
		</section>
	);
}

export default Profile;
