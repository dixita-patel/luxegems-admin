import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, Loader2, Image as ImageIcon, X } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function ProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditMode);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        inStock: true,
        featured: false
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (isEditMode) {
            fetchProductDetails();
        }
    }, [id]);

    const fetchProductDetails = async () => {
        try {
            const response = await api.get(`/products/${id}`);
            const product = response.data;
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                inStock: product.inStock,
                featured: product.featured
            });
            if (product.image) {
                setImagePreview(product.image);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            toast.error('Failed to load product details');
            navigate('/products');
        } finally {
            setFetching(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Image is required for new products, optional for updates unless we want to force it
        if (!image && !isEditMode) {
            toast.error('Please upload a product image');
            return;
        }

        setLoading(true);
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', Number(formData.price));
        data.append('category', formData.category);

        // Only append image if a new one was selected
        if (image) {
            data.append('image', image);
        }

        data.append('inStock', formData.inStock);
        data.append('featured', formData.featured);

        try {
            if (isEditMode) {
                await api.patch(`/products/${id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Product updated successfully!');
            } else {
                await api.post('/products', data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Product created successfully!');
            }
            navigate('/products');
        } catch (error) {
            console.error('Error saving product:', error);
            toast.error(error.response?.data?.message || 'Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <Loader2 size={40} className="animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <Link to="/products" className="flex items-center text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-2 group">
                        <ArrowLeft size={18} className="mr-1 transform group-hover:-translate-x-1 transition-transform" />
                        Back to Products
                    </Link>
                    <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white transition-colors">
                        {isEditMode ? 'Edit Product' : 'Add New Product'}
                    </h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Form Fields */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-300">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 transition-colors">Basic Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1 transition-colors">Product Name*</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Diamond Eternity Ring"
                                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-gray-900 dark:text-white font-medium"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1 transition-colors">Description*</label>
                                <textarea
                                    name="description"
                                    required
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe the product details, materials, etc."
                                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-gray-900 dark:text-white font-medium resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1 transition-colors">Price ($)*</label>
                                    <input
                                        type="number"
                                        name="price"
                                        required
                                        step="0.01"
                                        min="0"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        placeholder="2499.00"
                                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-gray-900 dark:text-white font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1 transition-colors">Category*</label>
                                    <select
                                        name="category"
                                        required
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-gray-900 dark:text-white font-medium appearance-none"
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Rings">Rings</option>
                                        <option value="Necklaces">Necklaces</option>
                                        <option value="Earrings">Earrings</option>
                                        <option value="Bracelets">Bracelets</option>
                                        <option value="Watches">Watches</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-300">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 transition-colors">Availability & Visibility</h2>
                        <div className="flex flex-wrap gap-6">
                            <label className="relative flex items-center cursor-pointer group">
                                <input
                                    type="checkbox"
                                    name="inStock"
                                    checked={formData.inStock}
                                    onChange={handleInputChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                <span className="ms-3 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest transition-colors">In Stock</span>
                            </label>

                            <label className="relative flex items-center cursor-pointer group">
                                <input
                                    type="checkbox"
                                    name="featured"
                                    checked={formData.featured}
                                    onChange={handleInputChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-500"></div>
                                <span className="ms-3 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest transition-colors">Featured Product</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Right Column: Image Upload & Submit */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-300">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 transition-colors">Product Image</h2>
                        <div className="relative group">
                            {imagePreview ? (
                                <div className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 transition-colors">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full text-red-600 shadow-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center aspect-square w-full rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:border-primary-500 transition-all cursor-pointer">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                                        <div className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm mb-3 transition-colors border border-gray-100 dark:border-gray-700">
                                            <Upload size={24} className="text-primary-600 dark:text-primary-500" />
                                        </div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white transition-colors tracking-tight">Click to upload product image</p>
                                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-widest transition-colors">PNG, JPG or WEBP (Max 5MB)</p>
                                    </div>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary-800 hover:bg-primary-900 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary-900/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-70"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <span>{isEditMode ? 'Update Product' : 'Publish Product'}</span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

