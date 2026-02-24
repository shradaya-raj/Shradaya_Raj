'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [category, setCategory] = useState('projects');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [tags, setTags] = useState('');
    const [featured, setFeatured] = useState(false);
    const [importance, setImportance] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [isAIWorking, setIsAIWorking] = useState(false);
    const [editSlug, setEditSlug] = useState<string | null>(null);

    const [items, setItems] = useState<any>({ projects: [], achievements: [], eca: [] });
    const [isLoadingItems, setIsLoadingItems] = useState(true);

    const router = useRouter();

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);
        const formData = new FormData();
        if (file) formData.append('file', file);
        formData.append('category', category);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('date', date);
        formData.append('tags', tags);
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
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            if (response.ok) {
                alert(editSlug ? 'Update successful!' : 'Upload successful!');
                const targetSlug = editSlug || result.slug;
                const targetCategory = category;

                setEditSlug(null);
                resetForm();
                await fetchItems();

                // Redirect to the newly created/updated item page
                router.push(`/${targetCategory}/${targetSlug}`);
            } else {
                alert('Error: ' + result.error);
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const resetForm = () => {
        setEditSlug(null);
        setTitle('');
        setDescription('');
        setDate('');
        setTags('');
        setFeatured(false);
        setImportance(0);
        setFile(null);
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

    return (
        <>
            <Navigation />
            <div className="min-h-screen bg-black pt-24 pb-12 px-4">
                <div className="max-w-4xl mx-auto space-y-12">
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
                        <form onSubmit={handleSubmit} className="space-y-6">
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
                                    {editSlug ? 'Replace Document (Optional)' : 'Upload Document (PDF/Word)'}
                                </label>
                                <div className="relative border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-blue-500/30 transition group cursor-pointer">
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        required={!editSlug}
                                    />
                                    <div className="text-gray-500 group-hover:text-blue-400 transition">
                                        {file ? (
                                            <div className="flex items-center justify-center space-x-2 text-blue-400">
                                                <span className="text-2xl">📄</span>
                                                <span className="font-medium">{file.name}</span>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <span className="text-4xl block mb-2">📁</span>
                                                <p className="text-sm">Click or drag and drop to upload</p>
                                                <p className="text-xs">Supports PDF and Word documents</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isUploading}
                                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${isUploading
                                    ? 'bg-gray-700 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98]'
                                    }`}
                            >
                                {isUploading ? 'Processing...' : editSlug ? 'Update Post' : 'Save & Publish'}
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
        </>
    );
}
