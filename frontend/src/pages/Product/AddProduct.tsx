import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import { useNavigate } from 'react-router-dom';
// import { mockBrands } from '../../mocks/mockBrand';

const mockCategories = ['Coffee', 'Cake'];
const mockTypes = ['Hot', 'Cold'];

const AddProduct: React.FC = () => {
  const [photo, setPhoto] = useState<File | null>(null);
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!productName.trim()) newErrors.productName = 'Required';
    if (!description.trim()) newErrors.description = 'Required';
    if (!photo) newErrors.photo = 'Required';
    if (!price.trim()) newErrors.price = 'Required';
    if (!brand) newErrors.brand = 'Required';
    if (!category) newErrors.category = 'Required';
    if (!type) newErrors.type = 'Required';
    if (!quantity.trim()) newErrors.quantity = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    console.log({ productName, description, price, brand, category, type, quantity, photo });
  };

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <Sidebar />
        <div className="main-content">
          <Header />
          <div className="dashboard-body p-6">
            <div className=" mx-auto space-y-6">
              <div className="text-sm text-blue-600 cursor-pointer" onClick={() => navigate('/products')}>
                ← Back to Product List
              </div>

              <h1 className="text-3xl font-bold text-neutral-800">Add New Product</h1>

              <div className="bg-white rounded-xl p-8 shadow-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Upload Photo */}
                  <div className="flex flex-col items-center space-y-2">
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <div className="w-[72px] h-[72px] rounded-full bg-gray-100 flex items-center justify-center">
                        <img src="/assets/icons/camera-icon.png" alt="Upload" className="w-6 h-6 object-contain" />
                      </div>
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoChange}
                      />
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-blue-600 font-medium">Upload Photo <span className="text-red-500">*</span></span>
                      {errors.photo && <span className="text-red-500 text-xs">{errors.photo}</span>}
                    </div>
                  </div>

                  {/* Grid Layout: 2 columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      {/* Product Name */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-sm font-medium">Product Name <span className="text-red-500">*</span></label>
                          {errors.productName && <span className="text-red-500 text-xs">{errors.productName}</span>}
                        </div>
                        <input
                          type="text"
                          placeholder="Enter product name"
                          className="w-full border border-gray-300 rounded-md px-4 py-2"
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                        />
                      </div>

                      {/* Price + Brand */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-sm font-medium">Price <span className="text-red-500">*</span></label>
                            {errors.price && <span className="text-red-500 text-xs">{errors.price}</span>}
                          </div>
                          <input
                            type="number"
                            min={0}
                            className="w-full border border-gray-300 rounded-md px-4 py-2"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                          />
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-sm font-medium">Brand <span className="text-red-500">*</span></label>
                            {errors.brand && <span className="text-red-500 text-xs">{errors.brand}</span>}
                          </div>
                          <select
                            className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white custom-select"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                          >
                            <option value="">--- Choose Brand ---</option>
                            {/* {mockBrands.map((b) => (
                              <option key={b.id} value={b.name}>{b.name}</option>
                            ))} */}
                          </select>
                        </div>
                      </div>

                      {/* Category + Type + Quantity */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-sm font-medium">Category <span className="text-red-500">*</span></label>
                            {errors.category && <span className="text-red-500 text-xs">{errors.category}</span>}
                          </div>
                          <select
                            className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white custom-select"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                          >
                            <option value="">--- Choose ---</option>
                            {mockCategories.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-sm font-medium">Type <span className="text-red-500">*</span></label>
                            {errors.type && <span className="text-red-500 text-xs">{errors.type}</span>}
                          </div>
                          <select
                            className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white custom-select"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                          >
                            <option value="">--- Choose ---</option>
                            {mockTypes.map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-sm font-medium">Quantity <span className="text-red-500">*</span></label>
                            {errors.quantity && <span className="text-red-500 text-xs">{errors.quantity}</span>}
                          </div>
                          <input
                            type="number"
                            min={1}
                            className="w-full border border-gray-300 rounded-md px-4 py-2"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Description */}
                    <div className="flex flex-col h-full">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-sm font-medium">Description <span className="text-red-500">*</span></label>
                        {errors.description && <span className="text-red-500 text-xs">{errors.description}</span>}
                      </div>
                      <textarea
                        placeholder="Enter description"
                        className="border border-gray-300 rounded-md px-4 py-2 h-full min-h-[240px]"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="text-center pt-4">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-8 py-2 rounded-md hover:bg-blue-600"
                    >
                      Add new
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
