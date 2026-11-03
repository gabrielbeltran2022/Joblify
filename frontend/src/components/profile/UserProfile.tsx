import { useState, useRef, useEffect, useMemo } from "react";
import type { User, UserExperience } from "../../api/userApi"; 
import { useLocation } from "react-router-dom";
import { getUserExperiences } from "../../api/userApi";
import { EditProfile } from "./subcomponents/EditProfile";
import defaultProfile from '../../assets/default_profile.png';
import { AddExpriences } from "./subcomponents/AddExpriences";
import { Loading } from "../loading/Loading";
import { EditExperiences } from "./subcomponents/EditExpriences";


interface UserProfileProps {
  user: User | null; 
  currentUser?: { id: string | number; accessLevel: number } | null;
  loading?: boolean;
  onEditProfile?: (updatedData?: Partial<User>) => void;
  onMakeAppointment?: () => void;
  onLogout: () => void;
}

const calculateAge = (dob?: string | Date | null): number | null => {
  if (!dob) return null;
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

const formatDateRange = (start?: string | Date, end?: string | Date | null, isCurrent?: boolean) => {
  if (!start) return "";
  const startDateStr = new Date(start).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  
  if (isCurrent) {
    return `${startDateStr} - Present`;
  }
  
  if (end) {
    const endDateStr = new Date(end).toLocaleDateString("en-US", { month: "short", year: "numeric" });
    return `${startDateStr} - ${endDateStr}`;
  }
  
  return startDateStr;
};

export const UserProfile = ({
  user,
  currentUser,
  loading,
  onEditProfile,
  onMakeAppointment,
}: UserProfileProps) => {


  const [selectedCertImage, setSelectedCertImage] = useState<string | null>(null);
  const [currentCertPage, setCurrentCertPage] = useState<number>(1);
  const certItemsPerPage = 2;
  const [currentExpPage, setCurrentExpPage] = useState<number>(1);
  const expItemsPerPage = 3;
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isAddExpriences, setAddExpriences] = useState<boolean>(false);

  const [fetchedExperiences, setFetchedExperiences] = useState<UserExperience[]>([]);
  const [loadingExp, setLoadingExp] = useState<boolean>(false);

  const [isEditExpOpen, setIsEditExpOpen] = useState<boolean>(false);
  const [selectedExperience, setSelectedExperience] = useState<UserExperience | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const targetUserId = user?._id;

  useEffect(() => {
    if (!targetUserId) return;
    
    const loadExperiences = async () => {
      try {
         setLoadingExp(true);
        const data = await getUserExperiences(targetUserId);
        setFetchedExperiences(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load experiences:", err);
      } finally {
        setLoadingExp(false);
      }
    };

    loadExperiences();
  }, [targetUserId,location]);

  useEffect(() => {
    if (isEditOpen || selectedCertImage || isAddExpriences) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isEditOpen, selectedCertImage, isAddExpriences]);

  // Derived Values
  const isNotEmployer = currentUser?.accessLevel !== 1;
  const isSelf = Boolean(currentUser?.id && targetUserId && currentUser.id === targetUserId);
  const canEdit = isNotEmployer || isSelf;

  const userRecord = (user || {}) as Record<string, any>;

  const fullName = user?.firstName || user?.lastName
    ? `${user?.firstName || ''} ${userRecord.middleName && userRecord.middleName !== "N/A" ? userRecord.middleName : ''} ${user?.lastName || ''} ${userRecord.suffix && userRecord.suffix !== "N/A" ? userRecord.suffix : ''}`.replace(/\s+/g, " ").trim()
    : null;

  const expList = fetchedExperiences.length > 0 ? fetchedExperiences : (userRecord.experiences || []);
  const certificates: any[] = userRecord.certificates || [];
  const education: string | null = userRecord.education || null;
  const profession: string | null = userRecord.profession || userRecord.jobtitle || null;

  const profileImageSrc = (user?.profilePicture && user.profilePicture.trim() !== "") 
    ? user.profilePicture 
    : defaultProfile;

  const computedAge = calculateAge(userRecord.dateOfBirth);

  // --- SORT EXPERIENCES (Pure computation inside useMemo) ---
  const sortedExperiences = useMemo(() => {
    if (!expList.length) return [];

    return [...expList].sort((a, b) => {
      if (a.isCurrent && !b.isCurrent) return -1;
      if (!a.isCurrent && b.isCurrent) return 1;

      const dateA = new Date(a.startDate || a.startData || 0).getTime();
      const dateB = new Date(b.startDate || b.startData || 0).getTime();

      return dateB - dateA;
    });
  }, [expList]);

  // Pagination calculations
  const totalExpPages = Math.ceil(sortedExperiences.length / expItemsPerPage);
  const indexOfLastExp = currentExpPage * expItemsPerPage;
  const indexOfFirstExp = indexOfLastExp - expItemsPerPage;
  const currentExperiences = sortedExperiences.slice(indexOfFirstExp, indexOfLastExp);

  const certList = certificates || [];
  const totalCertPages = Math.ceil(certList.length / certItemsPerPage);
  const indexOfLastCert = currentCertPage * certItemsPerPage;
  const indexOfFirstCert = indexOfLastCert - certItemsPerPage;
  const currentCertificates = certList.slice(indexOfFirstCert, indexOfLastCert);

  // Event Handlers
  const handleOpenEditProfile = () => setIsEditOpen(true);
  const handleOpenAddExpriences = () => setAddExpriences(true);

  const handleSaveProfile = (updatedUser: Partial<User>) => {
    onEditProfile?.(updatedUser);
    setIsEditOpen(false);
  };

  const handleSaveExperience = (newExp: UserExperience) => {
    if (newExp) {
      setFetchedExperiences((prev) => [newExp, ...prev]);
    }
    setAddExpriences(false);
  };

  const handleEditExperience = (exp: UserExperience) => {
      setSelectedExperience(exp);
      setIsEditExpOpen(true);
  };

  const handleClosedExprience = () => {
    setIsEditExpOpen(false);
    setSelectedExperience(null)
  }

  const handleSaveEditExperience = (updatedExp: UserExperience) => {
  setFetchedExperiences((prev) =>
    prev.map((item) => (item._id === updatedExp._id ? updatedExp : item))
  );
  handleClosedExprience();
};
  if (loading) {
    return <Loading isLoading={true} />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-gray-100">
      <div className="flex flex-col w-full max-w-5xl p-6 gap-6 bg-white rounded-xl shadow-lg border border-gray-200 text-gray-800">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-6">
          <div className="flex items-center gap-4">
            <img
              src={profileImageSrc}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover scale-110"
              onError={(e) => {
                e.currentTarget.src = defaultProfile; 
              }}
            />
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold text-gray-900">{fullName || "No data"}</h1>
              <div className="text-sm text-gray-500">{profession || "No data"}</div>
            </div>
          </div>

          <div className="relative" ref={dropdownRef}>
            <div className="flex items-center gap-2">
              {canEdit ? (
                <button 
                  onClick={handleOpenEditProfile}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition"
                >
                  Edit profile
                </button>
              ) : (
                <button 
                  onClick={onMakeAppointment}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition"
                >
                  Make an Appointment
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="flex flex-col gap-6 md:col-span-1 border-r-0 md:border-r border-gray-200 pr-0 md:pr-6">
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-bold text-gray-900">Personal details</h2>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-xl">📍</span>
                  <div>Lives in <strong className="font-semibold">{user?.address || "No data"}</strong></div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">🏠</span>
                  <div>Contact: <strong className="font-semibold">{user?.contact || "No data"}</strong></div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">✉️</span>
                  <div>Email: <strong className="font-semibold">{user?.email || "No data"}</strong></div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">🎂</span>
                  <div>
                    Age:{" "}
                    <strong className="font-semibold">
                      {computedAge !== null ? `${computedAge} years old` : "No data"}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-gray-200 pt-4">
              <h2 className="text-lg font-bold text-gray-900">Work</h2>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">💼</div>
                <span className="font-medium text-gray-800">{profession || "No data"}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-gray-200 pt-4">
              <h2 className="text-lg font-bold text-gray-900">Education</h2>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">🎓</div>
                <span className="font-medium text-gray-800">{education || "No data"}</span>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-8 md:col-span-2">
            
            {/* Experiences Section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-900">Experiences</h2>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium">
                    {sortedExperiences.length} Total
                  </span>
                </div>
                {canEdit && (
                  <button 
                    onClick={handleOpenAddExpriences} 
                    aria-label="Add Experience"
                    className="p-1.5 text-gray-500 bg-gray-100 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      strokeWidth={1.8} 
                      stroke="currentColor" 
                      className="w-5 h-5"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M12 4.5v15m7.5-7.5h-15" 
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* RENDER EXPERIENCES WITH LOADING HANDLING */}
              <div className="flex flex-col gap-4 min-h-[120px] justify-center">
                {loadingExp ? (
                  <div className="flex items-center justify-center p-8 bg-gray-50 border border-gray-200 rounded-lg text-gray-400 text-sm animate-pulse">
                    Loading experiences...
                  </div>
                ) : sortedExperiences.length > 0 ? (
                  currentExperiences.map((exp: any) => (
                   <button
                      key={exp._id || exp.id}
                      onClick={() => handleEditExperience(exp)}
                      className="w-full text-left p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col gap-1 hover:shadow-sm hover:border-blue-300 transition cursor-pointer focus:outline-none"
                    >
                      <div className="flex justify-between items-start w-full">
                        <h3 className="font-semibold text-gray-900">{exp.jobtitle || exp.role}</h3>
                        <span className="text-xs text-gray-500 font-medium">
                          {exp.period || formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}
                        </span>
                      </div>
                      <p className="text-sm text-blue-600 font-medium">{exp.company}</p>
                      {exp.description && <p className="text-sm text-gray-600 mt-1">{exp.description}</p>}
             
                    </button>
                  ))
                ) : (
                  <div className="flex items-center justify-center p-8 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 text-sm font-medium">
                    No data
                  </div>
                )}
              </div>

              {totalExpPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <span className="text-xs text-gray-500 font-medium">
                    Page {currentExpPage} of {totalExpPages}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentExpPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentExpPage === 1}
                      className={`px-3 py-1 rounded text-xs font-medium transition ${
                        currentExpPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentExpPage((prev) => Math.min(prev + 1, totalExpPages))}
                      disabled={currentExpPage === totalExpPages}
                      className={`px-3 py-1 rounded text-xs font-medium transition ${
                        currentExpPage === totalExpPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Certificates Section */}
            <div className="flex flex-col gap-4 border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-900">Certificates</h2>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium">
                    {certList.length} Total
                  </span>
                </div>
              </div>

              {certList.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-h-[120px]">
                    {currentCertificates.map((cert) => (
                      <div key={cert.id || cert._id} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition flex flex-col justify-between">
                        <div className="h-32 bg-gray-200 cursor-pointer relative overflow-hidden group" onClick={() => setSelectedCertImage(cert.image)}>
                          <img src={cert.image} alt={cert.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-200" />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition">
                            Click to preview
                          </div>
                        </div>
                        <div className="p-3 flex flex-col gap-1">
                          <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{cert.title}</h4>
                          <p className="text-xs text-gray-500">{cert.issuer} {cert.date ? `• ${cert.date}` : ''}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {totalCertPages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                      <span className="text-xs text-gray-500 font-medium">
                        Page {currentCertPage} of {totalCertPages}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentCertPage((prev) => Math.max(prev - 1, 1))}
                          disabled={currentCertPage === 1}
                          className={`px-3 py-1 rounded text-xs font-medium transition ${
                            currentCertPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setCurrentCertPage((prev) => Math.min(prev + 1, totalCertPages))}
                          disabled={currentCertPage === totalCertPages}
                          className={`px-3 py-1 rounded text-xs font-medium transition ${
                            currentCertPage === totalCertPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center p-8 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 text-sm font-medium">
                  No data
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedCertImage && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setSelectedCertImage(null)}>
          <div className="relative max-w-2xl w-full bg-white rounded-lg p-2 overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedCertImage(null)} className="absolute top-2 right-2 bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black transition">
              ✕
            </button>
            <img src={selectedCertImage} alt="Certificate Preview" className="w-full h-auto rounded" />
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <EditProfile 
          user={user} 
          onClose={() => setIsEditOpen(false)} 
          onSave={handleSaveProfile}
        />
      )}

      {/* Add Experience Modal */}
      {isAddExpriences && (
        <AddExpriences 
          user={user} 
          onClose={() => setAddExpriences(false)} 
          onSave={handleSaveExperience}
        />
      )}

      {/* Edit Experience Modal */}
    {isEditExpOpen && selectedExperience && (
      <EditExperiences
        experience={selectedExperience}
        onClose={handleClosedExprience}
        onSave={handleSaveEditExperience}
      />
    )}
    </div>
  );
};