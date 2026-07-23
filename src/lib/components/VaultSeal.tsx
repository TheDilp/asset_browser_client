interface Props {
	className?: string;
}

export default function VaultSeal({ className = '' }: Props) {
	return (
		<svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
			<circle cx="32" cy="32" r="27" stroke="currentColor" strokeWidth="3" />
			<circle cx="32" cy="32" r="14" stroke="currentColor" strokeWidth="3" />
			<line x1="32" y1="7" x2="32" y2="14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
			<line x1="32" y1="50" x2="32" y2="57" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
			<line x1="7" y1="32" x2="14" y2="32" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
			<line x1="50" y1="32" x2="57" y2="32" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
			<circle cx="32" cy="32" r="4" fill="currentColor" />
		</svg>
	);
}
