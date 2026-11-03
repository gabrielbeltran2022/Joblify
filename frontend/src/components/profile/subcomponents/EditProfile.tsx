import { useEffect, useState } from "react";
import type { User } from "../../../api/userApi";
import { updateUserProfile } from "../../../api/userApi";

interface EditProfileProps {
  user: User | null;
  onClose: () => void;
  onSave?: (updatedUser: Partial<User>) => void;
}

const formatDateForInput = (dob?: string | Date | null): string => {
  if (!dob) return "";
  const date = new Date(dob);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};

export const EditProfile = ({ user, onClose, onSave }: EditProfileProps) => {
  const userRecord = (user || {}) as Record<string, any>;

  const [formData, setFormData] = useState<Partial<User>>({
    _id: userRecord.id || userRecord._id || "",
    firstName: userRecord.firstName || "",
    lastName: userRecord.lastName || "",
    email: userRecord.email || "",
    contact: userRecord.contact || "",
    address: userRecord.address || "",
    profilePicture: userRecord.profilePicture || "",
    gender: userRecord.gender || "",
    middleName: userRecord.middleName || "",
    suffix: userRecord.suffix || "",
    profession: userRecord.profession || userRecord.jobtitle || "",
    jobtitle: userRecord.jobtitle || userRecord.profession || "",
    dateOfBirth: formatDateForInput(userRecord.dateOfBirth),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userId = formData._id;
      if (!userId) {
        throw new Error("Missing user Id");
      }

      const updatedUser = await updateUserProfile(userId, formData);

      onSave?.(updatedUser);
      onClose();
    } catch (e) {
      console.error("Failed to update profile", e);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-lg p-6 max-w-lg w-full flex flex-col gap-4 max-h-[90vh] overflow-y-auto shadow-xl">
      
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1.5 transition"
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

        <div>
          <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
          <p className="text-sm text-gray-600">Update your details below.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName || ""}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-blue-500"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName || ""}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700">Middle Name</label>
              <input
                type="text"
                name="middleName"
                value={(formData as any).middleName || ""}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-blue-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700">Suffix</label>
              <input
                type="text"
                name="suffix"
                value={(formData as any).suffix || ""}
                onChange={handleChange}
                placeholder="e.g. Jr., III"
                className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={(formData.dateOfBirth as string) || ""}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-blue-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700">Gender</label>
              <select
                name="gender"
                value={(formData as any).gender || ""}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-blue-500 bg-white"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700">Contact</label>
              <input
                type="text"
                name="contact"
                value={formData.contact || ""}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-blue-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700">Profession</label>
              <input
                type="text"
                name="profession"
                value={(formData as any).profession || ""}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-blue-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700">Job Title</label>
              <input
                type="text"
                name="jobtitle"
                value={(formData as any).jobtitle || ""}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-blue-500"
            />
          </div>

          <div className="flex justify-end mt-4 pt-3 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-blue-300 transition"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};