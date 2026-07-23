import { Icon } from '@iconify/react';
import type { MouseEvent } from 'react';

interface Props {
	label?: string;
	icon?: string;
	disabled?: boolean;
	variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
	block?: boolean;
	onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

function getVariantClass(variant: Props['variant']) {
	if (variant === 'secondary')
		return 'bg-transparent border border-vault-border text-vault-text hover:bg-vault-surface-raised hover:border-vault-accent/50';
	if (variant === 'danger')
		return 'bg-transparent border border-red-900/60 text-red-400 hover:bg-red-950/40 hover:border-red-700';
	if (variant === 'ghost')
		return 'bg-transparent text-vault-muted hover:text-vault-text hover:bg-vault-surface-raised';
	return 'bg-vault-accent text-vault-ink hover:bg-vault-accent/90 active:bg-vault-accent/80 font-semibold';
}

export default function Button({
	label = '',
	icon,
	disabled = false,
	variant = 'primary',
	block = true,
	onClick
}: Props) {
	return (
		<button
			type="submit"
			disabled={disabled}
			onClick={onClick}
			className={`${block ? 'w-full' : ''} ${disabled ? 'cursor-not-allowed opacity-40' : getVariantClass(variant)} rounded-vault py-1.5 px-3 font-sans transition-colors duration-150 flex items-center gap-x-2 justify-center disabled:cursor-not-allowed disabled:bg-transparent disabled:opacity-40`}
		>
			{!!label && <span>{label}</span>}
			{!!icon && <Icon icon={icon} style={{ fontSize: 20 }} />}
		</button>
	);
}
