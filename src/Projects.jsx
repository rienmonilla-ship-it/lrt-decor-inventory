import { useState } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react'; 
import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from './firebase';
import ProjectModal from './ProjectModal';
import ConfirmModal from './ConfirmModal';
import Toast from './Toast';
import ProjectMaterialsModal from './ProjectMaterialsModal';
import { formatCurrency } from './formatCurrency'; // BAGONG IMPORT

export default function Projects({ projects, movements, items, userRole }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [toast, setToast] = useState(null);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const [isMaterialsOpen, setIsMaterialsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleSaveProject = async (formData) => {
    try {
      if (editingProject) {
        const projectRef = doc(db, "projects", editingProject.id);
        await updateDoc(projectRef, formData);
        setToast({ message: 'Project updated.', type: 'success' });
      } else {
        await addDoc(collection(db, "projects"), formData);
        setToast({ message: 'Project added.', type: 'success' });
      }
      closeModal();
    } catch (error) {
      console.error("Error saving project: ", error);
      setToast({ message: 'Failed to save project.', type: 'error' });
    }
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    try {
      await deleteDoc(doc(db, "projects", projectToDelete.id));
      setToast({ message: 'Project deleted.', type: 'success' });
    } catch (error) {
      console.error("Error deleting project: ", error);
      setToast({ message: 'Failed to delete project.', type: 'error' });
    }
  };

  const handleDeleteClick = (id, name) => {
    setProjectToDelete({ id, name });
    setIsConfirmOpen(true);
  };

  const openAddModal = () => { setEditingProject(null); setIsModalOpen(true); };
  const openEditModal = (project) => { setEditingProject(project); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setEditingProject(null); };

  const openMaterialsModal = (project) => {
    setSelectedProject(project);
    setIsMaterialsOpen(true);
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold tracking-wider uppercase mb-1">Job Tracking</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track materials, cost and status per installation job.</p>
        </div>
        <button onClick={openAddModal} className="flex items-center gap-2 bg-[#0e2a21] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#184536] transition-colors">
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const profit = (project.contractPrice || 0) - (project.cost || 0);
          
          return (
            <div key={project.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="p-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                    project.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {project.status}
                  </span>
                  <div className="flex gap-1">
                    <button onClick={() => openMaterialsModal(project)} title="View Materials" className="p-1.5 text-gray-400 hover:text-green-600 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    {userRole === 'admin' && (
                      <>
                        <button onClick={() => openEditModal(project)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteClick(project.id, project.name)} className="p-1.5 text-gray-400 hover:text-red-600 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{project.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{project.client}</p>
                <p className="text-xs text-gray-400 mt-1">{project.address}</p>
              </div>

              <div className="p-6 pt-4 mt-auto bg-gray-50 dark:bg-gray-900 rounded-b-xl space-y-2">
                <div className="flex justify-between">
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Contract Price</p>
                  <p className="text-sm font-bold text-gray-800 dark:text-white">{formatCurrency(project.contractPrice || 0)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Total Cost</p>
                  <p className="text-sm font-bold text-gray-800 dark:text-white">{formatCurrency(project.cost || 0)}</p>
                </div>
                <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Profit</p>
                  <p className={`text-sm font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(profit)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ProjectModal 
        key={editingProject ? editingProject.id : 'new-project'}
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onSave={handleSaveProject} 
        editingProject={editingProject}
      />

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${projectToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete Project"
      />

      <ProjectMaterialsModal 
        isOpen={isMaterialsOpen}
        onClose={() => setIsMaterialsOpen(false)}
        project={selectedProject}
        movements={movements}
        items={items}
      />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}