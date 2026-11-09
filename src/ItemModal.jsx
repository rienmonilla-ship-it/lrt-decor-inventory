import { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from './firebase';

export default function ItemModal({ isOpen, onClose, onSave, editingItem, isSaving }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Structural & Track Systems',
    spec: '',
    unit: 'pcs',
    qty: 0,
    min: 0,
    price: 0,
    imageUrl: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // I-reset o i-load ang data kapag binuksan/isinarado ang modal
  useEffect(() => {
    if (isOpen) {
      if (editingItem) {
        setFormData(editingItem);
        setImagePreview(editingItem.imageUrl || null);
      } else {
        setFormData({
          name: '',
          category: 'Structural & Track Systems',
          spec: '',
          unit: 'pcs',
          qty: 0,
          min: 0,
          price: 0,
          imageUrl: ''
        });
        setImagePreview(null);
      }
      setImageFile(null);
    }
  }, [isOpen, editingItem]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'qty' || name === 'min' || name === 'price' ? Number(value) : value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    let finalImageUrl = formData.imageUrl || '';

    try {
      // Kung may bagong piniling image, i-upload muna sa Firebase Storage
      if (imageFile) {
        const storageRef = ref(storage, `items/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        finalImageUrl = await getDownloadURL(storageRef);
      }

      // Isama ang imageUrl sa data na ise-save
      onSave({ ...formData, imageUrl: finalImageUrl });

    } catch (error) {
      console.error("Error uploading image: ", error);
      alert("Failed to upload image. Please check your Firebase Storage rules.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Enter item details below.</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* BODY */}
        <div className="overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* IMAGE UPLOAD SECTION */}
            <div className="flex items-center gap-4 pb-2">
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-20 h-20 rounded-lg object-cover border border-gray-300 dark:border-gray-600" 
                />
              ) : (
                <div className="w-20 h-20 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 flex items-center justify-center">
                  <span className="text-xs text-gray-400">No Image</span>
                </div>
              )}
              
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase">Item Photo</label>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    <span>Choose Image</span>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden" 
                    />
                  </label>
                  {imageFile && <span className="text-xs text-green-600 dark:text-green-400">Selected</span>}
                </div>
                <p className="text-[10px] text-gray-500 mt-1">Max 2MB. JPG, PNG.</p>
              </div>
            </div>

            {/* ITEM NAME */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase">Item Name</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" placeholder="e.g. 5mm Insulation" />
            </div>

            {/* CATEGORY & SPEC */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
                  <option>Structural & Track Systems</option>
                  <option>Mechanisms & Hardware</option>
                  <option>Fasteners & Fixings</option>
                  <option>Sealants, Insulation & Finishing</option>
                  <option>Tools & Consumables</option>
                  <option>Services & Installations</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase">Specification</label>
                <input type="text" name="spec" value={formData.spec} onChange={handleChange} className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" placeholder="e.g. 5mm" />
              </div>
            </div>

            {/* UNIT, QTY, MIN, PRICE */}
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase">Unit</label>
                <input required type="text" name="unit" value={formData.unit} onChange={handleChange} className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" placeholder="pcs" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase">Qty</label>
                <input required type="number" name="qty" min="0" value={formData.qty} onChange={handleChange} className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase">Min Stock</label>
                <input required type="number" name="min" min="0" value={formData.min} onChange={handleChange} className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase">Price (₱)</label>
                <input required type="number" name="price" min="0" step="0.01" value={formData.price} onChange={handleChange} className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-800 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" />
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Cancel</button>
              <button 
                type="submit" 
                disabled={isUploading || isSaving} 
                className="px-4 py-2 text-sm font-medium text-white bg-[#0e2a21] hover:bg-[#184536] rounded-lg disabled:opacity-50 flex items-center gap-2"
              >
                {isUploading ? (
                  <>Uploading Image...</>
                ) : isSaving ? (
                  <>Saving...</>
                ) : (
                  <>{editingItem ? 'Update Item' : 'Save Item'}</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}