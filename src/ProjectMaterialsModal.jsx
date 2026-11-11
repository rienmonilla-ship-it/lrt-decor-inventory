import { useState } from 'react';
import { X, Printer, Download } from 'lucide-react';
import { formatCurrency } from './formatCurrency';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function ProjectMaterialsModal({ isOpen, onClose, project, movements, items }) {
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen || !project) return null;

  // Kunin lahat ng OUT movements para sa project na ito
  const projectMovements = movements.filter(
    m => m.project === project.name && m.type === 'OUT'
  );

  // I-compute ang total price per item
  const materialsList = projectMovements.map(move => {
    const itemData = items.find(i => i.name === move.item);
    const unitPrice = itemData ? itemData.price : 0;
    const totalPrice = unitPrice * move.qty;
    return {
      ...move,
      unitPrice,
      totalPrice
    };
  });

  // Grand Total
  const grandTotal = materialsList.reduce((sum, m) => sum + m.totalPrice, 0);

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    const input = document.getElementById('pdf-receipt-container');
    
    try {
      // Kunin ang picture ng receipt container
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      
      // Gumawa ng PDF (A4 size)
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Project_${project.name}_Materials.pdf`);
    } catch (error) {
      console.error("Error generating PDF: ", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {/* ========================================= */}
      {/* NORMAL SCREEN VIEW */}
      {/* ========================================= */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 print:hidden">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
          
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Project Materials</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{project.name} · {project.client}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300 dark:border-gray-600 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <th className="p-2 font-semibold">Qty</th>
                  <th className="p-2 font-semibold">Description</th>
                  <th className="p-2 font-semibold text-right">Unit Price</th>
                  <th className="p-2 font-semibold text-right">Total Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {materialsList.map((m, index) => (
                  <tr key={index}>
                    <td className="p-2 text-sm text-gray-800 dark:text-white">{m.qty}</td>
                    <td className="p-2 text-sm text-gray-800 dark:text-white">{m.item}</td>
                    <td className="p-2 text-sm text-right text-gray-600 dark:text-gray-400">{formatCurrency(m.unitPrice)}</td>
                    <td className="p-2 text-sm text-right font-bold text-gray-800 dark:text-white">{formatCurrency(m.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t-2 border-gray-300 dark:border-gray-600 pt-4 mt-4 flex justify-between items-center">
              <p className="text-lg font-bold text-gray-900 dark:text-white">Grand Total:</p>
              <p className="text-2xl font-bold text-[#0e2a21] dark:text-green-400">{formatCurrency(grandTotal)}</p>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-900">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Close</button>
            <button 
              onClick={handleDownloadPDF} 
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0e2a21] hover:bg-[#184536] rounded-lg disabled:opacity-50"
            >
              {isGenerating ? 'Generating PDF...' : <><Download className="w-4 h-4" /> Download PDF</>}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* HIDDEN PDF TEMPLATE */}
      {/* ========================================= */}
      <div className="absolute -left-[9999px] top-0">
        <div id="pdf-receipt-container" className="bg-white p-10 w-[210mm] text-black" style={{ minHeight: '297mm' }}>
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold uppercase">LRT DECOR PRODUCTS</h1>
            <p className="text-sm">San Jose del Monte, Bulacan</p>
          </div>

          <div className="flex justify-between text-sm mb-4">
            <div>
              <p><strong>Client:</strong> {project.client}</p>
              <p><strong>Jobsite:</strong> {project.address}</p>
            </div>
            <div className="text-right">
              <p><strong>Status:</strong> {project.status}</p>
              <p><strong>Project:</strong> {project.name}</p>
              <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="mb-4 border-b-2 border-black"></div>

          <table className="w-full border-collapse border border-black text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-black p-2 text-center w-16">Qty</th>
                <th className="border border-black p-2 text-left">Description</th>
                <th className="border border-black p-2 text-right w-28">Unit Price</th>
                <th className="border border-black p-2 text-right w-32">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {materialsList.map((m, index) => (
                <tr key={index}>
                  <td className="border border-black p-2 text-center">{m.qty}</td>
                  <td className="border border-black p-2">{m.item}</td>
                  <td className="border border-black p-2 text-right">{formatCurrency(m.unitPrice)}</td>
                  <td className="border border-black p-2 text-right font-bold">{formatCurrency(m.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-white">
                <td colSpan="3" className="border border-black p-2 text-right font-bold uppercase">Grand Total:</td>
                <td className="border border-black p-2 text-right font-bold text-lg">{formatCurrency(grandTotal)}</td>
              </tr>
            </tfoot>
          </table>

          <div className="flex justify-between mt-20 px-8 text-sm">
            <div className="text-center w-48">
              <p className="mb-10">Prepared By:</p>
              <p className="border-t border-black pt-1">Signature</p>
            </div>
            <div className="text-center w-48">
              <p className="mb-10">Received By:</p>
              <p className="border-t border-black pt-1">Signature</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}