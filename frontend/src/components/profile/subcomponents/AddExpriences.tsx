import { useState } from "react";
import type { User } from "../../../api/userApi";
import { addExprincesDetail } from "../../../api/userApi";
import type { UserExperience } from "../../../api/userApi";

interface EditProfileProps {
  user: User | null;
  onClose: () => void;
  onSave?: (updatedData: any) => void;
}

export const AddExpriences = ({ user, onClose, onSave }: EditProfileProps) => {
  const [formData, setFormData] = useState({
    jobtitle: "",
    company: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
  });


  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
  e.preventDefault();
  setErrorMessage(null);

  const userId = user?._id 
  if (!userId) {
    setErrorMessage("User ID is missing. Cannot save experience.");
    return;
  }

  try {
    setIsSubmitting(true);
    
    const payload: UserExperience = { ...formData };

    if (payload.isCurrent) {
      delete payload.endDate;
    } else if (!payload.endDate) {
      delete payload.endDate;
    }

    const savedExperience = await addExprincesDetail(userId, payload);

    if (onSave) {
      onSave(savedExperience);
    }

    onClose();
  } catch (err: any) {
    console.error("Failed to add experience:", err);
    setErrorMessage(err?.response?.data?.message || err?.message || "Failed to save experience. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-xl p-6 max-w-lg w-full flex flex-col gap-5 max-h-[90vh] overflow-y-auto shadow-2xl">
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

        {/* Modal Header */}
        <div className="border-b border-gray-100 pb-3">
          <h2 className="text-xl font-bold text-gray-900">Add Experience</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Add your work experience and employment details below.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Job Title */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="jobtitle" className="text-sm font-semibold text-gray-700">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="jobtitle"
              name="jobtitle"
              required
              placeholder="e.g. Senior Full Stack Developer"
              value={formData.jobtitle}
              onChange={handleChange}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Company Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="company" className="text-sm font-semibold text-gray-700">
              Company <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="company"
              name="company"
              required
              placeholder="e.g. Acme Corporation"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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
                value={formData.startDate}
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
                value={formData.isCurrent ? "" : formData.endDate}
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
              checked={formData.isCurrent}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, isCurrent: e.target.checked }))
              }
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="isCurrent" className="text-sm text-gray-700 cursor-pointer select-none">
              I currently work here
            </label>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Describe your primary responsibilities, key projects, or achievements..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition disabled:opacity-50 flex items-center gap-2"
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