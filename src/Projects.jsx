import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react'; 
import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from './firebase';
import ProjectModal from './ProjectModal';

export default function Projects({ projects }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const handleSaveProject = async (formData) => {
    try {
      if (editingProject) {
        const projectRef = doc(db, "projects", editingProject.id);
        await updateDoc(projectRef, formData);
      } else {
        await addDoc(collection(db, "projects"), formData);
      }
      closeModal();
    } catch (error) {
      console.error("Error saving project: ", error);
      alert("Failed to save project.");
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete project "${name}"?`)) {
      try {
        await deleteDoc(doc(db, "projects", id));
      } catch (error) {
        console.error("Error deleting project: ", error);
      }
    }
  };

  const openAddModal = () => { setEditingProject(null); setIsModalOpen(true); };
  const openEditModal = (project) => { setEditingProject(project); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setEditingProject(null); };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs text-gray-500 font-semibold tracking-wider uppercase mb-1">Job Tracking</p>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">Track materials, cost and status per installation job.</p>
        </div>
        <button onClick={openAddModal} className="flex items-center gap-2 bg-[#0e2a21] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#184536] transition-colors">
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="p-6 pb-4 border-b border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                  project.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'
                }`}>
                  {project.status}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => openEditModal(project)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(project.id, project.name)} className="p-1.5 text-gray-400 hover:text-red-600 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-lg text-gray-900">{project.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{project.client}</p>
              <p className="text-xs text-gray-400 mt-1">{project.address}</p>
            </div>

            <div className="p-6 pt-4 mt-auto flex justify-between items-center bg-gray-50 rounded-b-xl">
              <div>
                <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Materials</p>
                <p className="text-sm font-bold text-gray-800 mt-0.5">{project.materials}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Cost</p>
                <p className="text-sm font-bold text-gray-800 mt-0.5">
                  ₱{project.cost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ProjectModal 
        key={editingProject ? editingProject.id : 'new-project'}
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onSave={handleSaveProject} 
        editingProject={editingProject}
      />
    </div>
  );
}