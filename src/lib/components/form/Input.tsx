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
		<label className="h-14" title={title}>
			<span className="text-xs">{title}</span>
			<input
				placeholder={placeholder}
				autoFocus={autoFocus}
				name={name}
				value={value}
				type={type}
				onChange={(e) => onChange?.(e.currentTarget.value)}
				className="px-2 rounded h-8 w-full bg-zinc-800 text-white focus:outline-0 focus:ring-2 focus:border-0 ring-offset-0"
			/>
		</label>
	);
}
