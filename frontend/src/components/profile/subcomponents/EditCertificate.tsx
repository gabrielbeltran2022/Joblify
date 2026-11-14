import { useState } from "react";
import {
  updateCertificateDetail,
  type User,
  type UserCertificate,
} from "../../../api/userApi";

interface EditCertificateProps {
  user: User | null;
  certificate: UserCertificate;
  onClose: () => void;
  onSave: (saved: UserCertificate) => void;
}

const toDateInput = (date?: string | Date | null): string =>
  date ? new Date(date).toISOString().slice(0, 10) : "";

const inputClass =
  "w-full px-3.5 py-2 border border-gray-300 rounded-lg text-base sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100";

export const EditCertificate = ({ user, certificate, onClose, onSave }: EditCertificateProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    certificationName: certificate.certificationName ?? "",
    certifiedFrom: certificate.certifiedFrom ?? "",
    startDate: toDateInput(certificate.startDate),
    endDate: toDateInput(certificate.endDate),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setErrorMessage(null);

    const userId = user?._id;
    const certId = certificate._id;
    if (!userId || !certId) {
      setErrorMessage("Missing user or certificate ID.");
      return;
    }

    if (formData.startDate && formData.endDate && formData.endDate < formData.startDate) {
      setErrorMessage("Expiration date cannot be earlier than issue date.");
      return;
    }

    try {
      setIsSubmitting(true);

      const input = { ...formData, certificationImage: imageFile };
      const saved = await updateCertificateDetail(userId, certId, input);

      onSave({ ...certificate, ...formData, ...saved, _id: certId });
      onClose();
    } catch (err: any) {
      console.error("Failed to update certificate:", err);
      setErrorMessage(err?.message || "Failed to update certificate. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-xl p-5 sm:p-6 max-w-lg w-full flex flex-col gap-5 max-h-[90vh] overflow-y-auto shadow-2xl">
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
          <h2 className="text-xl font-bold text-gray-900">Edit Certificate</h2>
          <p className="text-sm text-gray-500 mt-0.5">Update your certification details below.</p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="certificationName" className="text-sm font-semibold text-gray-700">
              Certificate Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text" id="certificationName" name="certificationName" required autoComplete="off"
              disabled={isSubmitting} placeholder="e.g. AWS Certified Solutions Architect"
              value={formData.certificationName} onChange={handleChange} className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="certifiedFrom" className="text-sm font-semibold text-gray-700">
              Issuing Organization <span className="text-red-500">*</span>
            </label>
            <input
              type="text" id="certifiedFrom" name="certifiedFrom" required autoComplete="off"
              disabled={isSubmitting} placeholder="e.g. Amazon Web Services"
              value={formData.certifiedFrom} onChange={handleChange} className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="certificationImage" className="text-sm font-semibold text-gray-700">
              Certificate Image
              <span className="ml-1 text-xs font-normal text-gray-400">
                (leave empty to keep the current image)
              </span>
            </label>
            <input
              type="file" id="certificationImage" accept="image/*" disabled={isSubmitting}
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-gray-700 file:mr-3 file:px-3 file:py-2 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="startDate" className="text-sm font-semibold text-gray-700">Issue Date</label>
              <input
                type="date" id="startDate" name="startDate" disabled={isSubmitting}
                value={formData.startDate} onChange={handleChange} className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="endDate" className="text-sm font-semibold text-gray-700">
                Expiration Date <span className="text-xs text-gray-400">(Optional)</span>
              </label>
              <input
                type="date" id="endDate" name="endDate" disabled={isSubmitting}
                min={formData.startDate || undefined}
                value={formData.endDate} onChange={handleChange} className={inputClass}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button" onClick={onClose} disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={isSubmitting}
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting && (
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};