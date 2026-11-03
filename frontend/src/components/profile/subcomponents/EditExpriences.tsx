import React, { useState } from 'react';
import type { UserExperience } from '../../../api/userApi';

interface EditExperiencesProps {
  experience: UserExperience;
  onClose: () => void;
  onSave: (updated: UserExperience) => void;
}

const formatDateForInput = (dateVal: Date | string | null | undefined): string => {
  if (!dateVal) return '';
  if (typeof dateVal === 'string') {
    return dateVal.split('T')[0]; 
  }
  if (dateVal instanceof Date && !isNaN(dateVal.getTime())) {
    return dateVal.toISOString().split('T')[0];
  }
  return '';
};

export const EditExperiences = ({ experience, onClose, onSave }: EditExperiencesProps) => {
  const [formData, setFormData] = useState<UserExperience>({ ...experience });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-xl relative">
        <h2 className="text-xl font-bold mb-4">Edit Experience</h2>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1.5 transition disabled:opacity-50"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Job Title */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="jobtitle" className="text-sm font-semibold text-gray-700">
              Job Title
            </label>
            <input
              type="text"
              id="jobtitle"
              name="jobtitle"
              value={formData.jobtitle ?? ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Company */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="company" className="text-sm font-semibold text-gray-700">
              Company
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company ?? ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Dates Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="startDate" className="text-sm font-semibold text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formatDateForInput(formData.startDate)}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* End Date */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="endDate" className="text-sm font-semibold text-gray-700">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                disabled={formData.isCurrent}
                value={formData.isCurrent ? '' : formatDateForInput(formData.endDate)}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Currently Working Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isCurrent"
              checked={!!formData.isCurrent}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isCurrent: e.target.checked,
                  ...(e.target.checked ? { endDate: null } : {})
                }))
              }
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="isCurrent" className="text-sm text-gray-700 cursor-pointer select-none">
              I currently work here
            </label>
          </div>

          {/* Description */}
          <div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="description" className="text-sm font-semibold text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Describe your primary responsibilities, key projects, or achievements..."
                value={formData.description ?? ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting && (
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};