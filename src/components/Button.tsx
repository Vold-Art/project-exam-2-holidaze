type ButtonProps = {
	children: React.ReactNode;
	type?: "button" | "submit" | "reset";
	onClick?: () => void;
	disabled?: boolean;
	variant?: "primary" | "accent";
	className?: string;
};

function Button({
	children,
	type = "button",
	onClick,
	disabled = false,
	variant = "primary",
	className = "",
}: ButtonProps) {
	const baseClasses =
		"rounded-lg px-5 py-3 font-normal transition-colors disabled:cursor-not-allowed disabled:opacity-50";

	const variantClasses = {
		primary:
			"bg-[var(--color-brand-primary)] text-white hover:bg-[var(--color-brand-hover)]",
		accent:
			"bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]",
	};

	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={`${baseClasses} ${variantClasses[variant]} ${className}`}
		>
			{children}
		</button>
	);
}

export default Button;
