import type { InputHTMLAttributes } from 'react';

interface Props {
	name?: string;
	title?: string;
	value: string;
	placeholder?: string;
	autoFocus?: boolean;
	type?: InputHTMLAttributes<HTMLInputElement>['type'];
	onChange?: (value: string) => void;
}

export default function Input({
	name = '',
	title = '',
	value,
	placeholder = '',
	autoFocus = false,
	type = 'text',
	onChange
}: Props) {
	return (
		<label className="flex flex-col gap-y-1" title={title}>
			<span className="text-xs font-mono uppercase tracking-wide text-vault-muted">{title}</span>
			<input
				placeholder={placeholder}
				autoFocus={autoFocus}
				name={name}
				value={value}
				type={type}
				onChange={(e) => onChange?.(e.currentTarget.value)}
				className="px-3 rounded-vault h-9 w-full bg-vault-surface border border-vault-border text-vault-text placeholder:text-vault-muted/60 focus:outline-none focus:ring-2 focus:ring-vault-accent focus:border-vault-accent transition-colors duration-150"
			/>
		</label>
	);
}
