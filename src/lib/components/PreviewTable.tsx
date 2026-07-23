import { useState } from 'react';
import { Icon } from '@iconify/react';
import AudioPlayer from './AudioPlayer';
import Button from './form/Button';

export interface PreviewTableItem {
	id: string;
	createdAt: string;
	title: string;
	url: string;
	type?: 'images' | 'music';
	size: number;
}

interface Props {
	data: PreviewTableItem[];
	type?: string;
	sort?: string | null;
	/** current page pathname, used to build folder-row links (passed in rather than read from
	 *  window, since this renders server-side first before hydrating) */
	basePath?: string;
}

export default function PreviewTable({ data, type, sort: initialSort, basePath = '' }: Props) {
	const [preview, setPreview] = useState<string | undefined>(undefined);
	const [sort, setSort] = useState<string | null>(initialSort ?? null);

	function copyUrl(url: string) {
		navigator.clipboard.writeText(url);
	}

	function changeSort(column: string) {
		const newParams = new URLSearchParams(window.location.search);
		let nextSort: string;
		if (!sort) nextSort = `+${column}`;
		else if (sort === `+${column}`) nextSort = `-${column}`;
		else if (sort === `-${column}`) nextSort = `+${column}`;
		else nextSort = `+${column}`;
		newParams.set('sort', nextSort);
		setSort(nextSort);
		window.location.search = newParams.toString();
	}

	async function deleteItem(payload: { type: string | undefined; id: string; asset_url: string }) {
		const confirmDelete = confirm('Are you sure you want to delete this item?');
		if (confirmDelete) {
			try {
				await fetch(`/api/delete`, {
					method: 'DELETE',
					body: JSON.stringify(payload)
				});
				window.location.reload();
			} catch (error) {
				console.error(error);
			}
		}
	}

	return (
		<>
			{!!preview && (
				<div
					onClick={(e) => {
						e.preventDefault();
						setPreview(undefined);
					}}
					className="w-screen h-screen top-0 left-0 absolute bg-black bg-opacity-75 flex items-center justify-center"
				>
					<div className="absolute top-4 right-4 text-2xl">
						<Button icon="ph:x" />
					</div>
					<img src={preview} alt="preview" />
				</div>
			)}
			<div className="text-xs flex items-center uppercase bg-zinc-900 text-zinc-400 gap-x-8 px-4">
				<div
					className={`flex-1 py-3 cursor-pointer ${sort?.includes('title') ? 'text-blue-300' : ''}`}
					onClick={() => changeSort('title')}
				>
					Title
				</div>
				<div
					className={`w-20 py-3 cursor-pointer ${sort?.includes('created') ? 'text-blue-300' : ''}`}
					onClick={() => changeSort('created')}
				>
					Created at
				</div>
				<div className="py-3 w-80 text-right">Preview</div>
				<div className="py-3 w-24 text-right">Size</div>
				<div className="py-3 w-24 text-right">Actions</div>
			</div>
			<div className="flex flex-col max-h-[90%] overflow-y-auto">
				{data.map((item) => (
					<div
						key={item.id}
						className="border-b bg-zinc-800 border-zinc-700 flex flex-row flex-nowrap px-4 min-h-14 max-h-14 h-14 gap-x-8"
					>
						<div className="flex-1 font-medium whitespace-nowrap text-white text-xl items-center flex">
							{item.size === 0 ? (
								<a className="flex items-center gap-x-2" href={`${basePath}/${item.title}`}>
									<Icon icon="ph:folder" />
									{item.title}
								</a>
							) : (
								item.title
							)}
						</div>
						<div className="w-20 font-medium whitespace-nowrap text-white text-xl items-center flex">
							{item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}
						</div>
						<div className="flex items-center w-80 justify-end">
							{(type === 'images' || item.type === 'images') && item.size !== 0 && (
								<img
									loading="lazy"
									onClick={() => setPreview(item.url)}
									src={item.url}
									alt={item.title}
									className="w-10 h-10 cursor-pointer"
									onKeyDown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') setPreview(item.url);
									}}
								/>
							)}
							{(type === 'music' || item.type === 'music') && (
								<AudioPlayer id={item.id} url={item.url} />
							)}
						</div>
						{item.size === 0 ? (
							<div className="w-24" />
						) : (
							<div className="flex items-center justify-end w-24">
								{(item.size / 1000000).toFixed(2)} MB
							</div>
						)}
						<div className=" flex items-center gap-x-2 w-24 justify-end">
							{item.size !== 0 && (
								<div className="w-8 h-8">
									<Button icon="ph:copy" onClick={() => copyUrl(item.url)} />
								</div>
							)}
							<div className="w-8 h-8">
								<Button
									icon="ph:trash"
									variant="error"
									onClick={() =>
										deleteItem({
											type: item.type ?? type,
											id: item.id,
											asset_url: item.url
										})
									}
								/>
							</div>
						</div>
					</div>
				))}
			</div>
		</>
	);
}
