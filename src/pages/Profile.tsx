import { Navigate } from "react-router-dom";

function Profile() {
	const storedUser = localStorage.getItem("user");
	const user = storedUser ? JSON.parse(storedUser) : null;

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	return (
		<section className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow">
			<h1 className="text-2xl font-bold">Profile</h1>

			<div className="mt-6 flex items-center gap-4">
				<div className="h-20 w-20 overflow-hidden rounded-full bg-gray-200">
					{user.avatar?.url && (
						<img
							src={user.avatar.url}
							alt={user.avatar.alt || user.name}
							className="h-full w-full object-cover"
						/>
					)}
				</div>

				<div>
					<h2 className="text-xl font-semibold">{user.name}</h2>
					<p className="text-gray-600">{user.email}</p>
					<p className="mt-1 text-sm text-gray-500">
						{user.venueManager ? "Venue manager" : "Customer"}
					</p>
				</div>
			</div>
		</section>
	);
}

export default Profile;
