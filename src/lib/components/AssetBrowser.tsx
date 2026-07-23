import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import Button from './form/Button';
import Input from './form/Input';
import PreviewTable, { type PreviewTableItem } from './PreviewTable';

interface Props {
	game: string;
	type: 'images' | 'music';
	pageNumber: number;
	folderPath?: string;
	items: PreviewTableItem[];
	totalCount: number;
	totalPages: number;
	initialCount: number;
	initialSort: string | null;
	initialTitleFilter: string | null;
}

const IMAGE_ACCEPT = 'image/png, image/jpeg, image/webp, image/gif, image/bmp, image/avif';
const MUSIC_ACCEPT = 'audio/wave, audio/ogg, audio/flac, audio/mp3, audio/opus';
const PAGE_SIZES = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

export default function AssetBrowser({
	game,
	type,
	pageNumber,
	folderPath,
	items,
	totalCount,
	totalPages,
	initialCount,
	initialSort,
	initialTitleFilter
}: Props) {
	const [search, setSearch] = useState(initialTitleFilter ?? '');
	const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	function pagePath(page: number) {
		return `/${game}/${type}/${page}${folderPath ? `/${folderPath}` : ''}`;
	}

	function buildUploadUrl() {
		const params = new URLSearchParams({ game, type });
		if (folderPath) params.set('folder', folderPath);
		return `/api/upload?${params.toString()}`;
	}

	function beginUpload() {
		fileInputRef.current?.click();
	}

	async function upload(e: ChangeEvent<HTMLInputElement>) {
		const files = e.currentTarget.files;
		if (files) {
			const data = new FormData();
			for (let index = 0; index < files.length; index++) {
				data.append(files[index].name, files[index]);
			}
			try {
				await fetch(buildUploadUrl(), { method: 'POST', body: data });
				window.location.reload();
			} catch (error) {
				console.error(error);
			}
		}
	}

	async function createFolder() {
		const folderName = prompt('Enter folder name:');
		if (!folderName) return;
		const file = new File([''], folderName, { type: 'application/x-directory' });
		const data = new FormData();
		data.append(folderName, file);
		try {
			await fetch(buildUploadUrl(), { method: 'POST', body: data });
			window.location.reload();
		} catch (error) {
			console.error(error);
		}
	}

	function debounce(v: string) {
		setSearch(v);
		clearTimeout(timerRef.current);
		timerRef.current = setTimeout(() => {
			const query = new URLSearchParams(window.location.search);
			query.set('title', v);
			window.location.search = query.toString();
		}, 550);
	}

	function selectPage(e: ChangeEvent<HTMLSelectElement>) {
		const newPageNumber = Number(e.currentTarget.value || 1);
		window.location.href = pagePath(newPageNumber);
	}

	function selectCount(e: ChangeEvent<HTMLSelectElement>) {
		const newCount = Number(e.currentTarget.value || 10);
		window.location.href = `${pagePath(pageNumber)}?count=${newCount}`;
	}

	function goBack() {
		window.location.href = window.location.pathname.split('/').slice(0, -1).join('/');
	}

	return (
		<div className="py-2">
			<div className="w-full text-sm text-left flex flex-col overflow-hidden max-h-[calc(90vh)]">
				<input
					onChange={upload}
					type="file"
					accept={type === 'images' ? IMAGE_ACCEPT : MUSIC_ACCEPT}
					multiple
					className="hidden"
					ref={fileInputRef}
				/>
				<div className="w-full flex items-end justify-between pb-2">
					<div className="flex items-center gap-x-2 font-mono text-sm text-vault-muted">
						{folderPath && (
							<Button
								label="Back"
								variant="ghost"
								block={false}
								icon="ph:caret-left"
								onClick={goBack}
							/>
						)}
						<span>Total: {totalCount}</span>
					</div>
					<div className="flex items-end gap-x-2">
						<Input
							autoFocus={!!initialTitleFilter}
							title="Search"
							value={search}
							onChange={debounce}
						/>
						<Button
							icon="ph:folder-plus"
							label="Create folder"
							variant="secondary"
							block={false}
							onClick={createFolder}
						/>
						<Button
							icon="ph:upload"
							label="Upload"
							variant="secondary"
							block={false}
							onClick={beginUpload}
						/>
					</div>
				</div>
				<PreviewTable data={items} type={type} sort={initialSort} basePath={pagePath(pageNumber)} />
			</div>
			<div className="w-full flex items-center justify-between">
				<div className="flex gap-x-2 items-center">
					<select
						onChange={selectPage}
						value={pageNumber}
						className="bg-vault-surface border border-vault-border text-vault-text rounded-vault text-sm font-mono px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-vault-accent"
					>
						{Array.from(Array(totalPages).keys()).map((page) => (
							<option key={page} value={page + 1}>
								Page {page + 1}
							</option>
						))}
					</select>
					<select
						onChange={selectCount}
						value={initialCount}
						className="bg-vault-surface border border-vault-border text-vault-text rounded-vault text-sm font-mono px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-vault-accent"
					>
						{PAGE_SIZES.map((count) => (
							<option key={count} value={count}>
								Items: {count}
							</option>
						))}
					</select>
				</div>
				<div className="w-full flex items-center justify-end gap-x-1 py-2">
					<a href={pageNumber <= 1 ? '#' : pagePath(pageNumber - 1)}>
						<Button
							variant="ghost"
							block={false}
							icon="ph:caret-left"
							disabled={pageNumber === 1}
						/>
					</a>
					<a href={pagePath(pageNumber + 1)}>
						<Button
							variant="ghost"
							block={false}
							icon="ph:caret-right"
							disabled={items.length === 0 || pageNumber >= totalPages}
						/>
					</a>
				</div>
			</div>
		</div>
	);
}
