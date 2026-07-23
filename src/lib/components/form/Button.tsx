import { Icon } from '@iconify/react';
import type { MouseEvent } from 'react';

interface Props {
	label?: string;
	icon?: string;
	disabled?: boolean;
	variant?: 'primary' | 'info' | 'error';
	onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

function getVariantClass(variant: Props['variant']) {
	if (variant === 'info') return 'bg-blue-700 active:bg-blue-800 hover:bg-blue-600';
	if (variant === 'error') return 'bg-red-700 active:bg-red-800 hover:bg-red-600';
	return 'bg-zinc-950 active:bg-black hover:bg-zinc-900';
}

export default function Button({
	label = '',
	icon,
	disabled = false,
	variant = 'primary',
	onClick
}: Props) {
	return (
		<button
			type="submit"
			disabled={disabled}
			onClick={onClick}
			className={`w-full ${disabled ? 'cursor-not-allowed bg-zinc-400' : getVariantClass(variant)} rounded-md py-1 text-lg font-bold shadow flex items-center gap-x-2 px-2 justify-center`}
		>
			{!!label && <span>{label}</span>}
			{!!icon && <Icon icon={icon} style={{ fontSize: 24 }} />}
		</button>
	);
}
