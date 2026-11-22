import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { apiFetch } from '../utils/supabase';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import Skeleton from '../components/Skeleton';

const CategoriesManagement = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ show: false, text: '', type: '' });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data: cats } = await supabase.from('categories').select('*').order('display_order');
      setCategories(cats || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const slug = formData.get('slug');
    const description = formData.get('description');
    const display_order = parseInt(formData.get('display_order') || '0');

    try {
      const { data, error } = await supabase.from('categories').insert({
        name,
        slug,
        description,
        display_order
      }).select().single();

      if (error) throw error;
      setMessage({ show: true, text: 'Category added', type: 'success' });
      e.target.reset();
      loadCategories();
    } catch (err) {
      setMessage({ show: true, text: 'Error adding category', type: 'error' });
    }
  };

  if (!user) return null;

  return (
    <div className="bg-warm_off_white">
      <header className="border-b border-border bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <span className="font-headline font-bold text-xl text-dark_gray">
                <span className="text-rust">Food Bite</span> Admin
              </span>
            </div>
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-sm text-medium_gray hover:text-rust transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-card border border-border p-5">
            <h2 className="font-headline font-bold text-lg text-dark_gray mb-4">Categories</h2>
            {loading ? (
              <Skeleton variant="text" count={4} />
            ) : (
              <div className="space-y-3">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <h3 className="font-medium">{cat.name}</h3>
                      <p className="text-xs text-medium_gray">{cat.slug}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-card border border-border p-5">
            <h2 className="font-headline font-bold text-lg text-dark_gray mb-4">Add category</h2>
            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-sm text-medium_gray mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-3 py-2 rounded-lg bg-white shadow-sm border border-border focus:outline-none focus:ring-2 focus:ring-rust transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-medium_gray mb-1">Slug</label>
                <input
                  type="text"
                  name="slug"
                  required
                  className="w-full px-3 py-2 rounded-lg bg-white shadow-sm border border-border focus:outline-none focus:ring-2 focus:ring-rust transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-medium_gray mb-1">Description</label>
                <textarea
                  name="description"
                  className="w-full px-3 py-2 rounded-lg bg-white shadow-sm border border-border focus:outline-none focus:ring-2 focus:ring-rust transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-medium_gray mb-1">Display order</label>
                <input
                  type="number"
                  name="display_order"
                  defaultValue="0"
                  className="w-full px-3 py-2 rounded-lg bg-white shadow-sm border border-border focus:outline-none focus:ring-2 focus:ring-rust transition-colors"
                />
              </div>
              <Button variant="primary" type="submit" className="w-full">Add category</Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CategoriesManagement;
