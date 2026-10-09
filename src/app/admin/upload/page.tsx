'use client';

import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';

export default function UploadPage() {
    const [files, setFiles] = useState<File[]>([]);
    const [category, setCategory] = useState('projects');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [tags, setTags] = useState('');
    const [dataPointsRaw, setDataPointsRaw] = useState('');
    const [featured, setFeatured] = useState(false);
    const [importance, setImportance] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [isAIWorking, setIsAIWorking] = useState(false);
    const [isIntakeWorking, setIsIntakeWorking] = useState(false);
    const [editSlug, setEditSlug] = useState<string | null>(null);
    const [lastPrUrl, setLastPrUrl] = useState<string | null>(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [lastSaveInfo, setLastSaveInfo] = useState<any>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [submitStage, setSubmitStage] = useState<string | null>(null);
    const [intakePreview, setIntakePreview] = useState('');
    const [intakeAttachments, setIntakeAttachments] = useState<string[]>([]);

    const [items, setItems] = useState<any>({ projects: [], achievements: [], eca: [] });
    const [isLoadingItems, setIsLoadingItems] = useState(true);

    const fetchItems = async () => {
        setIsLoadingItems(true);
        try {
            const res = await fetch('/api/items/all');
            const data = await res.json();
            setItems(data);
        } catch (err) {
            console.error('Failed to fetch items', err);
        } finally {
            setIsLoadingItems(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleEdit = (item: any) => {
        setCategory(item.category === 'eca' ? 'eca' : item.category);
        setTitle(item.title);
        setDescription(item.description);
        setDate(item.date.split('T')[0]); // Extract YYYY-MM-DD
        setTags(item.tags.join(', '));
        setDataPointsRaw(item.dataPointsRaw || '');
        setFeatured(item.featured);
        setImportance(item.importance ?? 0);
        setEditSlug(item.slug);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (cat: string, slug: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        try {
            const res = await fetch(`/api/items/${cat}/${slug}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                alert('Deleted successfully');
                fetchItems();
            } else {
                alert('Failed to delete');
            }
        } catch (err) {
            console.error('Delete failed', err);
        }
    };

    const submitContent = async () => {
        setIsUploading(true);
        setLastPrUrl(null);
        setLastSaveInfo(null);
        setFormError(null);
        setSubmitStage('Preparing submission payload...');
        const formData = new FormData();
        for (const file of files) {
            formData.append('files', file);
        }
        formData.append('category', category);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('date', date);
        formData.append('tags', tags);
        formData.append('dataPointsRaw', dataPointsRaw);
        formData.append('featured', String(featured));
        formData.append('importance', String(importance));
        if (editSlug) {
            formData.append('editSlug', editSlug);
            // find original category of the item being edited
            const originalItem = [...items.projects, ...items.achievements, ...items.eca].find(i => i.slug === editSlug);
            if (originalItem) {
                formData.append('oldCategory', originalItem.category);
            }
        }

        try {
            setSubmitStage('Uploading files and project data...');
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            setSubmitStage('Processing response and updating portal view...');
            const result = await response.json();
            if (response.ok) {
                setLastSaveInfo(result);
                if (result?.prUrl) {
                    setLastPrUrl(result.prUrl);
                    alert('PR created. Merge it to publish.');
                }

                setEditSlug(null);
                resetForm();
                await fetchItems();
                setSubmitStage('Completed successfully.');
            } else {
                setFormError(result?.error || 'Save failed.');
                setSubmitStage('Failed.');
            }
        } catch (error) {
            console.error('Upload failed:', error);
            setFormError('Upload failed. Please try again.');
            setSubmitStage('Failed.');
        } finally {
            setIsUploading(false);
        }
    };

    const validateForm = (): string | null => {
        if (!title.trim()) return 'Title is required.';
        if (!description.trim()) return 'Description is required.';
        if (!date) return 'Date is required.';
        return null;
    };

    const handleOpenReview = (e: React.FormEvent) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            setFormError(validationError);
            return;
        }
        setFormError(null);
        setShowReviewModal(true);
    };

    const resetForm = () => {
        setEditSlug(null);
        setTitle('');
        setDescription('');
        setDate('');
        setTags('');
        setDataPointsRaw('');
        setFeatured(false);
        setImportance(0);
        setFiles([]);
        setIntakePreview('');
        setIntakeAttachments([]);
    };

    const handleAIEnhance = async () => {
        if (!title && !description) {
            alert('Please provide at least a title or description for AI to work with.');
            return;
        }

        setIsAIWorking(true);
        try {
            const res = await fetch('/api/ai-assist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    description,
                    tags,
                    category,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                console.error('AI assist error:', data.error);
                alert(data.error || 'AI assist failed. Please try again.');
                return;
            }

            if (data.description) {
                setDescription(data.description);
            }
            if (Array.isArray(data.tags)) {
                setTags(data.tags.join(', '));
            }
            if (typeof data.importance === 'number') {
                setImportance(data.importance);
            }
        } catch (err) {
            console.error('AI assist failed:', err);
            alert('AI assist failed. Please try again.');
        } finally {
            setIsAIWorking(false);
        }
    };

    const handleAIAutofillFromFile = async () => {
        if (files.length === 0) {
            alert('Please select one or more files first.');
            return;
        }

        setIsIntakeWorking(true);
        setIntakePreview('');
        setIntakeAttachments([]);
        try {
            const formData = new FormData();
            for (const file of files) {
                formData.append('files', file);
            }

            const res = await fetch('/api/ai-intake', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();

            if (!res.ok) {
                alert(data?.error || 'AI intake failed. Please try another file.');
                return;
            }

            if (data?.category) setCategory(data.category);
            if (data?.title) setTitle(data.title);
            if (data?.description) setDescription(data.description);
            if (Array.isArray(data?.tags)) setTags(data.tags.join(', '));
            if (typeof data?.importance === 'number') setImportance(data.importance);
            if (data?.extractedPreview) setIntakePreview(data.extractedPreview);
            if (Array.isArray(data?.attachedMedia)) setIntakeAttachments(data.attachedMedia);
        } catch (err) {
            console.error('AI intake failed:', err);
            alert('AI intake failed. Please try again.');
        } finally {
            setIsIntakeWorking(false);
        }
    };

    const isEditing = !!editSlug;

    return (
        <>
            <Navigation />
            <div className="min-h-screen bg-black pt-24 pb-12 px-4">
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="flex justify-end">
                        <a
                            href="/admin/ai"
                            className="text-sm px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10"
                        >
                            Open AI Assistant
                        </a>
                    </div>

                    {/* Upload Form */}
                    <div className="p-8 bg-gray-900/50 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                                {editSlug ? 'Edit Content' : 'CMS : Upload Content'}
                            </h1>
                            {editSlug && (
                                <button onClick={resetForm} className="text-gray-400 hover:text-white text-sm">
                                    Cancel Edit
                                </button>
                            )}
                        </div>
                        <form onSubmit={handleOpenReview} className="space-y-6">
                            {formError && (
                                <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-sm text-red-200">
                                    {formError}
                                </div>
                            )}
                            {lastPrUrl && (
                                <div className="p-4 rounded-xl border border-white/10 bg-black/30">
                                    <p className="text-sm text-gray-300">
                                        A Pull Request was created. Merge it to publish changes:
                                    </p>
                                    <a
                                        href={lastPrUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-400 hover:text-blue-300 underline break-all text-sm"
                                    >
                                        {lastPrUrl}
                                    </a>
                                </div>
                            )}
                            {lastSaveInfo && !lastSaveInfo?.prUrl && (
                                <div className="p-4 rounded-xl border border-green-500/30 bg-green-500/10 text-sm text-green-200">
                                    <p>Saved successfully.</p>
                                    <a
                                        href={`/${lastSaveInfo?.category}/${lastSaveInfo?.slug}`}
                                        className="inline-block mt-2 underline text-green-100"
                                    >
                                        Open saved item
                                    </a>
                                </div>
                            )}
                            {(isUploading || submitStage) && (
                                <div
                                    className={`p-4 rounded-xl border text-sm ${
                                        submitStage === 'Failed.'
                                            ? 'border-red-500/30 bg-red-500/10 text-red-200'
                                            : submitStage === 'Completed successfully.'
                                                ? 'border-green-500/30 bg-green-500/10 text-green-200'
                                                : 'border-blue-500/30 bg-blue-500/10 text-blue-200'
                                    }`}
                                >
                                    <p className="font-medium">Submission Status</p>
                                    <p className="mt-1">{submitStage || 'Starting...'}</p>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full p-3 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                                >
                                    <option value="projects">Project</option>
                                    <option value="achievements">Achievement</option>
                                    <option value="eca">ECA</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full p-3 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                                    placeholder="Enter title"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Short Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full p-3 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                                    rows={4}
                                    placeholder="Brief overview of the content"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={handleAIEnhance}
                                    disabled={isAIWorking}
                                    className={`mt-3 text-sm px-3 py-1 rounded-lg border transition ${
                                        isAIWorking
                                            ? 'border-gray-700 text-gray-500 cursor-not-allowed'
                                            : 'border-blue-500/40 text-blue-300 hover:border-blue-400 hover:text-blue-200'
                                    }`}
                                >
                                    {isAIWorking ? 'AI refining…' : 'Use AI to refine text & tags'}
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Date</label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full p-3 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Tags</label>
                                    <input
                                        type="text"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                        className="w-full p-3 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                                        placeholder="GIS, Mapping, Python..."
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Importance</label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={importance}
                                        onChange={(e) => setImportance(Number(e.target.value) || 0)}
                                        className="w-full p-3 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                                        placeholder="Higher number = more prominent"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Data Points (optional, for charts)
                                </label>
                                <textarea
                                    value={dataPointsRaw}
                                    onChange={(e) => setDataPointsRaw(e.target.value)}
                                    className="w-full p-3 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                                    rows={5}
                                    placeholder={`Example:\nHouseholds mapped: 148\nRoad segments digitized: 36\nIrrigation lines surveyed: 19`}
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    Add one metric per line as Label: Value. The system auto-selects best chart type.
                                </p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="featured"
                                    checked={featured}
                                    onChange={(e) => setFeatured(e.target.checked)}
                                    className="w-5 h-5 rounded border-white/10 bg-black/50 text-blue-500 focus:ring-blue-500/50 transition"
                                />
                                <label htmlFor="featured" className="text-gray-300 select-none">Mark as Featured</label>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    {editSlug ? 'Replace Files (Optional)' : 'Upload Files (PDF/Word/Image/Video)'}
                                </label>
                                <div className="relative border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-blue-500/30 transition group cursor-pointer">
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp,.gif,.mp4,.webm"
                                        multiple
                                        onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <div className="text-gray-500 group-hover:text-blue-400 transition">
                                        {files.length > 0 ? (
                                            <div className="flex items-center justify-center space-x-2 text-blue-400">
                                                <span className="text-2xl">📄</span>
                                                <span className="font-medium">{files.length} file(s) selected</span>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <span className="text-4xl block mb-2">📁</span>
                                                <p className="text-sm">Click or drag and drop to upload</p>
                                                <p className="text-xs">Supports PDF, Word, images, and small videos</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <button
                                        type="button"
                                        onClick={handleAIAutofillFromFile}
                                        disabled={isIntakeWorking || files.length === 0}
                                        className={`text-sm px-3 py-1 rounded-lg border transition ${
                                            isIntakeWorking || files.length === 0
                                                ? 'border-gray-700 text-gray-500 cursor-not-allowed'
                                                : 'border-purple-500/40 text-purple-300 hover:border-purple-400 hover:text-purple-200'
                                        }`}
                                    >
                                        {isIntakeWorking ? 'Reading files with AI…' : 'Auto-fill form from uploaded files'}
                                    </button>
                                </div>
                                {files.length > 0 && (
                                    <div className="mt-3 p-3 rounded-lg border border-white/10 bg-black/30">
                                        <p className="text-xs text-gray-400 mb-1">Selected files</p>
                                        <p className="text-xs text-gray-300 break-all">
                                            {files.map((f) => f.name).join(', ')}
                                        </p>
                                    </div>
                                )}
                                {!isEditing && files.length === 0 && (
                                    <div className="mt-3 p-3 rounded-lg border border-yellow-500/20 bg-yellow-500/10">
                                        <p className="text-xs text-yellow-200">
                                            You can save without files, but AI extraction works best when you upload at least one document.
                                        </p>
                                    </div>
                                )}
                                {intakePreview && (
                                    <div className="mt-3 p-3 rounded-lg border border-white/10 bg-black/30">
                                        <p className="text-xs text-gray-400 mb-1">Extracted text preview</p>
                                        <p className="text-xs text-gray-300 whitespace-pre-wrap max-h-28 overflow-auto">
                                            {intakePreview}
                                        </p>
                                    </div>
                                )}
                                {intakeAttachments.length > 0 && (
                                    <div className="mt-3 p-3 rounded-lg border border-white/10 bg-black/30">
                                        <p className="text-xs text-gray-400 mb-1">Detected attachments</p>
                                        <p className="text-xs text-gray-300 break-all">
                                            {intakeAttachments.join(', ')}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={isUploading}
                                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${isUploading
                                    ? 'bg-gray-700 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98]'
                                    }`}
                            >
                                {isUploading ? 'Processing...' : 'Review Before Save'}
                            </button>
                        </form>
                    </div>

                    {/* Manage Content List */}
                    <div className="p-8 bg-gray-900/50 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-sm">
                        <h2 className="text-2xl font-bold text-white mb-6">Manage Existing Content</h2>
                        {isLoadingItems ? (
                            <p className="text-gray-500">Loading items...</p>
                        ) : (
                            <div className="space-y-8">
                                {['projects', 'achievements', 'eca'].map((cat) => (
                                    <div key={cat}>
                                        <h3 className="text-lg font-semibold text-blue-400 uppercase tracking-wider mb-4 border-b border-white/5 pb-2">
                                            {cat}
                                        </h3>
                                        <div className="space-y-3">
                                            {items[cat].map((item: any) => (
                                                <div key={item.slug} className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-white/5 hover:border-white/10 transition">
                                                    <div>
                                                        <h4 className="text-white font-medium">{item.title}</h4>
                                                        <p className="text-gray-500 text-xs">{new Date(item.date).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <a
                                                            href={`/${cat}/${item.slug}`}
                                                            className="px-3 py-1 bg-white/10 text-white rounded-lg text-sm hover:bg-white/20 transition"
                                                        >
                                                            View
                                                        </a>
                                                        <button
                                                            onClick={() => handleEdit(item)}
                                                            className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-sm hover:bg-blue-500/20 transition"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(cat, item.slug)}
                                                            className="px-3 py-1 bg-red-500/10 text-red-500 rounded-lg text-sm hover:bg-red-500/20 transition"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            {items[cat].length === 0 && (
                                                <p className="text-gray-600 text-sm italic">No {cat} found.</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showReviewModal && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-gray-950 p-6 space-y-5">
                        <h2 className="text-xl font-bold text-white">Review Before Save</h2>
                        <div className="text-sm text-gray-300 space-y-2">
                            <p><span className="text-gray-500">Category:</span> {category}</p>
                            <p><span className="text-gray-500">Title:</span> {title}</p>
                            <p><span className="text-gray-500">Date:</span> {date}</p>
                            <p><span className="text-gray-500">Tags:</span> {tags || '(none)'}</p>
                            <p><span className="text-gray-500">Featured:</span> {featured ? 'Yes' : 'No'}</p>
                            <p><span className="text-gray-500">Importance:</span> {importance}</p>
                            <p><span className="text-gray-500">Chart points:</span> {dataPointsRaw.trim() ? 'Provided' : 'None'}</p>
                            <p className="text-gray-500">Description</p>
                            <p className="text-gray-200 whitespace-pre-wrap">{description}</p>
                            <p><span className="text-gray-500">Files:</span> {files.length > 0 ? files.map((f) => f.name).join(', ') : '(no new files selected)'}</p>
                        </div>

                        {!isEditing && files.length === 0 && (
                            <div className="p-3 rounded-xl border border-yellow-500/20 bg-yellow-500/10 text-xs text-yellow-200">
                                No files selected. The project will still be saved from form data, but document extraction and richer AI-generated details require uploaded files.
                            </div>
                        )}

                        <div className="p-3 rounded-xl border border-white/10 bg-white/5 text-xs text-gray-300">
                            Confirm Save will apply your changes to this site. Use “Open saved item” after saving to verify output.
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowReviewModal(false)}
                                className="px-4 py-2 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:bg-white/10"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={async () => {
                                    setShowReviewModal(false);
                                    await submitContent();
                                }}
                                disabled={isUploading}
                                className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50"
                            >
                                {isUploading ? 'Saving...' : editSlug ? 'Confirm Update' : 'Confirm Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
