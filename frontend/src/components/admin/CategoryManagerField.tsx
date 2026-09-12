'use client';

import React, { useEffect, useState } from 'react';
import { Category } from '@/types';
import { categoriesService } from '@/services/categoriesService';

interface CategoryManagerFieldProps {
  value: string | null | undefined;
  onChange: (categoryName: string) => void;
  required?: boolean;
}

export default function CategoryManagerField({
  value,
  onChange,
  required = false,
}: CategoryManagerFieldProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [addingError, setAddingError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoriesService.getAll();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setIsSaving(true);
    setAddingError(null);
    try {
      const res = await categoriesService.create(newCategoryName.trim());
      setCategories((prev) => [...prev, res.category].sort((a, b) => a.name.localeCompare(b.name)));
      onChange(res.category.name);
      setNewCategoryName('');
      setIsAdding(false);
    } catch (err: unknown) {
      setAddingError(err instanceof Error ? err.message : 'Failed to add category');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (cat: Category) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the category "${cat.name}"?\n\nAll blog posts currently in this category will become category-less (Uncategorized).`
    );
    if (!confirmDelete) return;

    setDeletingId(cat.id);
    setDeleteMessage(null);
    try {
      await categoriesService.delete(cat.id);
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      if (value === cat.name) {
        onChange('');
      }
      setDeleteMessage(`Category "${cat.name}" deleted. Associated posts are now category-less.`);
      setTimeout(() => setDeleteMessage(null), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete category');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-[14px] font-bold text-[#0f172a]">
          Category {required && <span className="text-[#ba1a1a]">*</span>}
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setIsAdding(!isAdding);
              setAddingError(null);
            }}
            className="text-[12px] text-[#1d4ed8] hover:text-[#1e40af] font-bold flex items-center gap-0.5"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isAdding ? 'close' : 'add_circle'}
            </span>
            <span>{isAdding ? 'Cancel' : '+ Add New'}</span>
          </button>
          <span className="text-[#cbd5e1]">|</span>
          <button
            type="button"
            onClick={() => setIsManageModalOpen(true)}
            className="text-[12px] text-[#475569] hover:text-[#0f172a] font-semibold flex items-center gap-0.5"
          >
            <span className="material-symbols-outlined text-[15px]">settings</span>
            <span>Manage</span>
          </button>
        </div>
      </div>

      {/* Inline Quick Add Form */}
      {isAdding && (
        <div className="p-3 bg-[#f1f5f9] border border-[#1d4ed8]/40 rounded-xl space-y-2 animate-in fade-in duration-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter new category name..."
              className="flex-1 bg-white border border-[#cbd5e1] rounded-lg px-3 py-2 text-[13px] form-input focus:border-[#1d4ed8]"
              autoFocus
            />
            <button
              type="button"
              onClick={handleAddCategory}
              disabled={isSaving || !newCategoryName.trim()}
              className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white px-4 py-2 rounded-lg text-[13px] font-bold transition-colors disabled:opacity-50 flex items-center gap-1 shadow-sm"
            >
              {isSaving ? (
                <span>Adding...</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">check</span>
                  <span>Save</span>
                </>
              )}
            </button>
          </div>
          {addingError && (
            <p className="text-[12px] text-[#ba1a1a] font-medium">{addingError}</p>
          )}
        </div>
      )}

      {/* Main Select Dropdown */}
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg p-3 text-[14px] form-input"
        disabled={loading}
      >
        <option value="">-- None (Category-less / Uncategorized) --</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* Manage & Delete Categories Modal */}
      {isManageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#cbd5e1] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#cbd5e1] pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0f172a] text-[22px]">
                  category
                </span>
                <h3 className="text-[18px] font-bold text-[#0f172a]">Manage Categories</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsManageModalOpen(false)}
                className="p-1 text-[#475569] hover:text-[#0f172a] rounded-lg hover:bg-[#e2e8f0]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-[13px] text-[#475569]">
              You can delete categories below. If a category is deleted, all blog posts in that category will automatically become <strong>category-less</strong>.
            </p>

            {deleteMessage && (
              <div className="p-3 bg-[#dbeafe] border border-[#1d4ed8] text-[#1e40af] text-[13px] rounded-lg font-medium">
                {deleteMessage}
              </div>
            )}

            <div className="max-h-60 overflow-y-auto divide-y divide-[#cbd5e1]/40 border border-[#cbd5e1] rounded-xl">
              {categories.length === 0 ? (
                <div className="p-4 text-center text-[13px] text-[#64748b]">
                  No categories found.
                </div>
              ) : (
                categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-3 flex items-center justify-between hover:bg-[#f8fafc] transition-colors"
                  >
                    <div>
                      <span className="text-[14px] font-bold text-[#0f172a] block">
                        {cat.name}
                      </span>
                      <span className="text-[11px] text-[#64748b] font-mono">
                        slug: {cat.slug}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat)}
                      disabled={deletingId === cat.id}
                      className="text-[#ba1a1a] hover:bg-[#ffdad6] p-1.5 rounded-lg text-[13px] font-bold transition-colors flex items-center gap-1 disabled:opacity-50"
                      title="Delete category"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {deletingId === cat.id ? 'hourglass_empty' : 'delete'}
                      </span>
                      <span>{deletingId === cat.id ? 'Deleting...' : 'Delete'}</span>
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsManageModalOpen(false)}
                className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white px-5 py-2.5 rounded-xl text-[14px] font-bold transition-colors shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
