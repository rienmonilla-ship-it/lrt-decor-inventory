import { useState } from 'react';
import { X, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from './firebase';

export default function BulkImportModal({ isOpen, onClose }) {
  const [file, setFile] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid CSV file.');
    }
  };

  const handleImport = async () => {
    if (!file) return;
    setIsImporting(true);
    setError('');
    setResult(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const lines = text.split('\n').filter(line => line.trim() !== '');
      
      const dataLines = lines.slice(1);
      let successCount = 0;
      let failCount = 0;

      const itemsSnapshot = await getDocs(collection(db, "items"));
      const existingItems = itemsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

      for (const line of dataLines) {
        const columns = line.split(',');
        if (columns.length < 7) {
          failCount++;
          continue;
        }

        const [id, name, category, unit, qty, min, price] = columns.map(col => col.trim().replace(/^"|"$/g, ''));
        
        const itemToUpdate = existingItems.find(item => item.id === id);

        if (itemToUpdate) {
          try {
            const itemRef = doc(db, "items", itemToUpdate.id);
            await updateDoc(itemRef, {
              name: name || itemToUpdate.name,
              category: category || itemToUpdate.category,
              unit: unit || itemToUpdate.unit,
              qty: Number(qty) || 0,
              min: Number(min) || 10,
              price: Number(price) || 0
            });
            successCount++;
          } catch (err) {
            console.error("Error updating item: ", err);
            failCount++;
          }
        } else {
          failCount++;
        }
      }

      setResult({ success: successCount, failed: failCount });
      setIsImporting(false);
    };
    reader.readAsText(file);
  };

  const handleDownloadTemplate = () => {
    const headers = "ID,Name,Category,Unit,Qty,Min,Price\n";
    const blob = new Blob([headers], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "LRT_Import_Template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Bulk Import Items</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Update quantities and prices via CSV.</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:text-red-400 text-sm rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}
          
          {result && (
            <div className="p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:text-green-400 text-sm rounded-lg flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> 
              Successfully updated {result.success} items. Failed: {result.failed}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase">Select CSV File</label>
            <input 
              type="file" 
              accept=".csv" 
              onChange={handleFileChange} 
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#0e2a21] file:text-white hover:file:bg-[#184536]"
            />
          </div>

          <button onClick={handleDownloadTemplate} className="text-xs text-blue-600 hover:underline">
            Download CSV Template
          </button>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 rounded-lg">Close</button>
            <button 
              onClick={handleImport} 
              disabled={!file || isImporting}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0e2a21] hover:bg-[#184536] rounded-lg disabled:opacity-50"
            >
              <Upload className="w-4 h-4" /> {isImporting ? 'Importing...' : 'Import'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}