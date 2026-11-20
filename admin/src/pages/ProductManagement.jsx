import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import CategoryChip from '../components/CategoryChip';
import EmptyState from '../components/EmptyState';
import Skeleton from '../components/Skeleton';

const ProductManagement = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', price: '', stock: '', category: '', image_url: '', availability: 'in_stock' });
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState({ show: false, text: '', type: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: cats } = await supabase.from('categories').select('*').order('display_order');
      setCategories(cats || []);

      const { data: prods } = await apiFetch('/api/admin/products');
      setProducts(prods || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setMessage({ show: true, text: 'Error loading data', type: 'error' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (editing) {
      await supabase.from('products').update(form).eq('id', editing);
    } else {
      await supabase.from('products').insert({ ...form, category_id: form.category || null });
    }
    setEditing(null);
    setForm({ name: '', price: '', stock: '', category: '', image_url: '', availability: 'in_stock' });
    loadData();
    setMessage({ show: true, text: 'Product saved', type: 'success' });
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this product?')) {
      await supabase.from('products').delete().eq('id', id);
      loadData();
      setMessage({ show: true, text: 'Product deleted', type: 'success' });
    }
  };

  if (!user) return null;

  return (
    <div className="bg-warm_off_white">
      {/* Header */}
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
        {/* Header actions */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="primary" onClick={() => setEditing(null)}>
            Add new product
          </Button>
          <Button variant="secondary">Import products</Button>
        </div>

        {/* Products table */}
        <div className="bg-white rounded-card border border-border p-5">
          {loading ? (
            <Skeleton variant="text" count={6} />
          ) : (
            <div>
              <h2 className="font-headline font-bold text-lg text-dark_gray mb-4">Products</h2>
              {products.length === 0 ? (
                <EmptyState
                  title="No products found"
                  description="Add your first product to get started."
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="font-label font-semibold text-medium_gray text-left">Name</th>
                        <th className="font-label font-semibold text-medium_gray text-left">Category</th>
                        <th className="font-label font-semibold text-medium_gray text-left">Price</th>
                        <th className="font-label font-semibold text-medium_gray text-left">Stock</th>
                        <th className="font-label font-semibold text-medium_gray text-left">Availability</th>
                        <th className="font-label font-semibold text-medium_gry text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p.id} className="border-b border-border hover:bg-gray-50">
                          <td className="font-medium">{p.name}</td>
                          <td>{p.category?.name || 'Uncategorized'}</td>
                          <td>{'₦' + Math.round(p.price_kobo / 100).toLocaleString()}</td>
                          <td>{p.stock}</td>
                          <td><StatusBadge status={p.availability} className="text-xs" /></td>
                          <td className="text-right">
                            <button
                              onClick={() => setEditing(p.id)}
                              className="text-rust hover:underline text-sm font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="text-red-500 hover:underline text-sm font-medium ml-2"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Add/Edit form modal */}
        {editing && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
              <h3 className="font-headline font-bold text-xl mb-4">{editing ? 'Edit product' : 'Add new product'}</h3>
              
              <form>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-medium_gray mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 rounded-lg bg-white shadow-sm border border-border focus:outline-none focus:ring-2 focus:ring-rust transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-medium_gray mb-1">Price (kobo)</label>
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 rounded-lg bg-white shadow-sm border border-border focus:outline-none focus:ring-2 focus:ring-rust transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-medium_gray mb-1">Stock</label>
                    <input
                      type="number"
                      name="stock"
                      value={form.stock}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 rounded-lg bg-white shadow-sm border border-border focus:outline-none focus:ring-2 focus:ring-rust transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-medium_gray mb-1">Category</label>
                    <select name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2 rounded-lg bg-white shadow-sm border border-border focus:outline-none focus:ring-2 focus:ring-rust transition-colors">
                      <option value="">Select category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.slug}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-medium_gray mb-1">Image URL</label>
                  <input
                    type="text"
                    name="image_url"
                    value={form.image_url}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg bg-white shadow-sm border border-border focus:outline-none focus:ring-2 focus:ring-rust transition-colors"
                    placeholder="https://..."
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-medium_gray mb-1">Availability</label>
                  <select name="availability" value={form.availability} onChange={handleChange} className="w-full px-3 py-2 rounded-lg bg-white shadow-sm border border-border focus:outline-none focus:ring-2 focus:ring-rust transition-colors">
                    <option value="in_stock">In stock</option>
                    <option value="low_stock">Low stock</option>
                    <option value="sold_out">Sold out</option>
                  </select>
                </div>

                <button
                  type="submit"
                  onClick={handleSave}
                  className="w-full bg-rust text-white py-3 rounded-md font-medium hover:bg-rust/90 transition-colors"
                >
                  {editing ? 'Update product' : 'Add product'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductManagement;
