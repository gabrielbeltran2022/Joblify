import { useState } from "react";
import type { User, UserEducation } from "../../../api/userApi";
import { addEducationDetail } from "../../../api/userApi";

interface AddEducationProps {
  user: User | null;
  onClose: () => void;
  onSave?: (saved: UserEducation) => void;
}

const EDUCATION_LEVELS = [
  "Elementary",
  "High School",
  "Senior High School",
  "Vocational / TESDA",
  "Associate Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate",
];

const inputClass =
  "w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

export const AddEducation = ({ user, onClose, onSave }: AddEducationProps) => {
  const [formData, setFormData] = useState({
    schoolName: "",
    degree: "",
    fieldStudy: "",
    educationLevel: "",
    startDate: "",
    endDate: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const userId = user?._id;
    if (!userId) {
      setErrorMessage("User ID is missing. Cannot save education.");
      return;
    }

    if (formData.startDate && formData.endDate && formData.endDate < formData.startDate) {
      setErrorMessage("End date cannot be earlier than start date.");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload: UserEducation = { ...formData };
      if (!payload.startDate) delete payload.startDate;
      if (!payload.endDate) delete payload.endDate;

      const saved = await addEducationDetail(userId, payload);
      onSave?.(saved);
      onClose();
    } catch (err: any) {
      console.error("Failed to add education:", err);
      setErrorMessage(err?.message || "Failed to save education. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-xl p-6 max-w-lg w-full flex flex-col gap-5 max-h-[90vh] overflow-y-auto shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1.5 transition disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="border-b border-gray-100 pb-3">
          <h2 className="text-xl font-bold text-gray-900">Add Education</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Add your school and degree details below.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="schoolName" className="text-sm font-semibold text-gray-700">
              School Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="schoolName"
              name="schoolName"
              required
              placeholder="e.g. Cavite State University"
              value={formData.schoolName}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="educationLevel" className="text-sm font-semibold text-gray-700">
              Education Level <span className="text-red-500">*</span>
            </label>
            <select
              id="educationLevel"
              name="educationLevel"
              required
              value={formData.educationLevel}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="" disabled>
                Select level
              </option>
              {EDUCATION_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="degree" className="text-sm font-semibold text-gray-700">
              Degree <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="degree"
              name="degree"
              required
              placeholder="e.g. Bachelor of Science"
              value={formData.degree}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="fieldStudy" className="text-sm font-semibold text-gray-700">
              Field of Study <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fieldStudy"
              name="fieldStudy"
              required
              placeholder="e.g. Information Technology"
              value={formData.fieldStudy}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="endDate" className="text-sm font-semibold text-gray-700">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                min={formData.startDate || undefined}
                value={formData.endDate}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};