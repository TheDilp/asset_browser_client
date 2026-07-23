import { useState } from 'react';
import { Icon } from '@iconify/react';
import AudioPlayer from './AudioPlayer';
import Button from './form/Button';
import VaultSeal from './VaultSeal';

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

function formatDate(createdAt: string) {
	return createdAt ? new Date(createdAt).toLocaleDateString() : '';
}

function formatSize(size: number) {
	return `${(size / 1000000).toFixed(2)} MB`;
}

export default function PreviewTable({ data, type, sort: initialSort, basePath = '' }: Props) {
	const [preview, setPreview] = useState<PreviewTableItem | undefined>(undefined);
	const [sort, setSort] = useState<string | null>(initialSort ?? null);
	const deletable = !!type && type !== 'common';

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

	function ImageGrid({ items }: { items: PreviewTableItem[] }) {
		return (
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
				{items.map((item) =>
					item.size === 0 ? (
						<a
							key={item.id}
							href={`${basePath}/${item.title}`}
							className="flex flex-col items-center justify-center gap-y-2 aspect-square rounded-vault border border-vault-border bg-vault-surface hover:bg-vault-surface-raised hover:border-vault-accent/40 transition-all duration-150 p-4"
						>
							<Icon icon="ph:folder" className="text-3xl text-vault-muted" />
							<span className="text-sm text-center text-vault-text truncate w-full">
								{item.title}
							</span>
						</a>
					) : (
						<div
							key={item.id}
							className="group flex flex-col rounded-vault border border-vault-border bg-vault-surface hover:border-vault-accent/50 shadow-vault hover:shadow-vault-hover transition-all duration-150 overflow-hidden"
						>
							<button
								type="button"
								onClick={() => setPreview(item)}
								className="aspect-square w-full overflow-hidden bg-vault-ink"
							>
								<img
									loading="lazy"
									src={item.url}
									alt={item.title}
									className="w-full h-full object-cover"
								/>
							</button>
							<div className="p-2 flex flex-col gap-y-1">
								<span className="text-sm text-vault-text truncate">{item.title}</span>
								<div className="flex items-center justify-between font-mono text-[11px] text-vault-muted">
									<span>{formatSize(item.size)}</span>
									<span>{formatDate(item.createdAt)}</span>
								</div>
								<div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-150">
									{deletable ? (
										<Button
											icon="ph:trash"
											variant="danger"
											block={false}
											onClick={() =>
												deleteItem({ type: item.type ?? type, id: item.id, asset_url: item.url })
											}
										/>
									) : (
										<span />
									)}
									<Button
										icon="ph:copy"
										variant="ghost"
										block={false}
										onClick={() => copyUrl(item.url)}
									/>
								</div>
							</div>
						</div>
					)
				)}
			</div>
		);
	}

	function MusicList({ items }: { items: PreviewTableItem[] }) {
		return (
			<div className="flex flex-col gap-y-1">
				{items.map((item) =>
					item.size === 0 ? (
						<a
							key={item.id}
							href={`${basePath}/${item.title}`}
							className="flex items-center gap-x-3 px-4 py-2 rounded-vault border border-vault-border bg-vault-surface hover:bg-vault-surface-raised hover:border-vault-accent/40 transition-colors duration-150"
						>
							<Icon icon="ph:folder" className="text-lg text-vault-muted" />
							<span className="text-sm text-vault-text truncate">{item.title}</span>
						</a>
					) : (
						<div
							key={item.id}
							className="flex items-center gap-x-4 px-4 py-2 rounded-vault border border-vault-border bg-vault-surface hover:bg-vault-surface-raised hover:border-vault-accent/30 transition-colors duration-150"
						>
							<span className="flex-1 text-sm text-vault-text truncate">{item.title}</span>
							<span className="font-mono text-xs text-vault-muted w-24 text-right shrink-0">
								{formatDate(item.createdAt)}
							</span>
							<div className="w-64 shrink-0">
								<AudioPlayer id={item.id} url={item.url} />
							</div>
							<span className="font-mono text-xs text-vault-muted w-20 text-right shrink-0">
								{formatSize(item.size)}
							</span>
							<div className="flex items-center gap-x-6 shrink-0">
								<Button
									icon="ph:copy"
									variant="ghost"
									block={false}
									onClick={() => copyUrl(item.url)}
								/>
								{deletable && (
									<Button
										icon="ph:trash"
										variant="danger"
										block={false}
										onClick={() =>
											deleteItem({ type: item.type ?? type, id: item.id, asset_url: item.url })
										}
									/>
								)}
							</div>
						</div>
					)
				)}
			</div>
		);
	}

	function SortChips() {
		return (
			<div className="flex gap-x-2 mb-2">
				<Button
					label={`Title ${sort?.includes('title') ? (sort.startsWith('-') ? '↓' : '↑') : ''}`}
					variant="ghost"
					block={false}
					onClick={() => changeSort('title')}
				/>
				<Button
					label={`Date ${sort?.includes('created') ? (sort.startsWith('-') ? '↓' : '↑') : ''}`}
					variant="ghost"
					block={false}
					onClick={() => changeSort('created')}
				/>
			</div>
		);
	}

	function EmptyState() {
		return (
			<div className="flex flex-col items-center justify-center gap-y-3 py-24 text-vault-muted">
				<VaultSeal className="w-12 h-12 text-vault-accent opacity-40" />
				<span className="font-mono text-sm">No assets yet</span>
			</div>
		);
	}

	// Only used for the mixed-type (no `type` prop) search-results case, which never contains
	// folder markers — single-type callers pass `data` straight through instead.
	const partitionedImages = data.filter((item) => item.type === 'images');
	const partitionedMusic = data.filter((item) => item.type === 'music');

	return (
		<>
			{!!preview && (
				<div
					onClick={() => setPreview(undefined)}
					className="fixed inset-0 z-50 bg-vault-ink/80 backdrop-blur-sm flex items-center justify-center motion-safe:animate-fadeIn"
				>
					<div
						onClick={(e) => e.stopPropagation()}
						className="relative max-w-4xl max-h-[85vh] flex flex-col motion-safe:animate-scaleIn"
					>
						<button
							type="button"
							onClick={() => setPreview(undefined)}
							className="absolute -top-10 right-0 text-vault-muted hover:text-vault-text"
						>
							<Icon icon="ph:x" style={{ fontSize: 24 }} />
						</button>
						<img
							src={preview.url}
							alt={preview.title}
							className="max-h-[70vh] rounded-vault border border-vault-border object-contain"
						/>
						<div className="mt-2 flex items-center justify-between px-3 py-2 bg-vault-surface border border-vault-border rounded-vault font-mono text-xs text-vault-muted">
							{deletable ? (
								<Button
									icon="ph:trash"
									variant="danger"
									block={false}
									onClick={() =>
										deleteItem({
											type: preview.type ?? type,
											id: preview.id,
											asset_url: preview.url
										})
									}
								/>
							) : (
								<span />
							)}
							<span className="truncate px-2">
								{preview.title} · {formatSize(preview.size)} · {formatDate(preview.createdAt)}
							</span>
							<Button
								icon="ph:copy"
								variant="ghost"
								block={false}
								onClick={() => copyUrl(preview.url)}
							/>
						</div>
					</div>
				</div>
			)}

			{data.length === 0 && <EmptyState />}

			{type === 'images' && data.length > 0 && (
				<>
					<SortChips />
					<ImageGrid items={data} />
				</>
			)}

			{(type === 'music' || type === 'common') && data.length > 0 && (
				<>
					<SortChips />
					<MusicList items={data} />
				</>
			)}

			{!type && data.length > 0 && (
				<div className="flex flex-col gap-y-8">
					{partitionedImages.length > 0 && (
						<div>
							<h2 className="font-mono uppercase text-xs text-vault-muted mb-2">Images</h2>
							<ImageGrid items={partitionedImages} />
						</div>
					)}
					{partitionedMusic.length > 0 && (
						<div>
							<h2 className="font-mono uppercase text-xs text-vault-muted mb-2">Music</h2>
							<MusicList items={partitionedMusic} />
						</div>
					)}
				</div>
			)}
		</>
	);
}
