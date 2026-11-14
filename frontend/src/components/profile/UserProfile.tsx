import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

import {
  getUserExperiences,
  getUserCertificate,
  deleteCertificateDetail,
  deleteExperience,
  getUserEducation,
  deleteEducation,
  type User,
  type UserExperience,
  type UserCertificate,
  type UserEducation,
} from "../../api/userApi";

import defaultProfile from "../../assets/default_profile.png";

import { Loading } from "../loading/Loading";
import { EditProfile } from "./subcomponents/EditProfile";
import { AddExpriences } from "./subcomponents/AddExpriences";
import { EditExperiences } from "./subcomponents/EditExpriences";
import { AddCertificate } from "./subcomponents/AddCertificate";
import { AddEducation } from "./subcomponents/AddEducation"
import { EditEducation } from "./subcomponents/EditEducation"
import { EditCertificate } from "./subcomponents/EditCertificate";

/* -------------------------------------------------------------------------- */
/* Types & constants                                                          */
/* -------------------------------------------------------------------------- */

interface UserProfileProps {
  user: User | null;
  currentUser?: { id: string | number; accessLevel: number } | null;
  loading?: boolean;
  onEditProfile?: (updatedData?: Partial<User>) => void;
  onMakeAppointment?: () => void;
  onLogout: () => void;
}

const API_URL = "http://localhost:3000";
const EXP_PER_PAGE = 3;
const CERT_PER_PAGE = 2;
const EDU_PER_PAGE = 3

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const formatMonthYear = (date?: string | Date | null): string =>
  date
    ? new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "";

const formatDateRange = (
  start?: string | Date | null,
  end?: string | Date | null,
  isCurrent?: boolean
): string => {
  if (!start) return "";
  const startStr = formatMonthYear(start);
  if (isCurrent) return `${startStr} - Present`;
  if (end) return `${startStr} - ${formatMonthYear(end)}`;
  return startStr;
};

const calculateAge = (dob?: string | Date | null): number | null => {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

// Backend stores relative paths like /uploads/certifications/x.png
const getImageUrl = (path?: string | null): string => {
  console.log("API_URL:", API_URL, "path:", path);
  console.log("Combined:", `${API_URL}${path}`);
  if (!path) return "";
  return path.startsWith("http") ? path : `${API_URL}${path}`;
};



const cleanPart = (value?: string | null) => (value && value !== "N/A" ? value : "");

/* -------------------------------------------------------------------------- */
/* Small presentational pieces                                                */
/* -------------------------------------------------------------------------- */

const EmptyState = ({ children = "No data" }: { children?: string }) => (
  <div className="flex items-center justify-center p-8 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 text-sm font-medium">
    {children}
  </div>
);

const LoadingState = ({ children }: { children: string }) => (
  <div className="flex items-center justify-center p-8 bg-gray-50 border border-gray-200 rounded-lg text-gray-400 text-sm animate-pulse">
    {children}
  </div>
);

const AddButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className="p-1.5 text-gray-500 bg-gray-100 hover:text-blue-600 rounded-full transition-colors"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  </button>
);

const PencilIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.862 4.487Zm0 0L19.5 7.125"
    />
  </svg>
);

const TrashIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
    />
  </svg>
);

const SectionHeader = ({
  title,
  count,
  action,
  underline = true
}: {
  title: string;
  count?: number;
  action?: React.ReactNode;
  underline?: boolean;
}) => (
  <div
    className={`flex items-center justify-between pb-2 ${underline ? "border-b border-gray-100" : ""
      }`}
  >
    <div className="flex items-center gap-2">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      {count !== undefined && (
        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium">
          {count} Total
        </span>
      )}
    </div>
    {action}
  </div>
);

const Pager = ({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) => {
  if (totalPages <= 1) return null;

  const btn = (disabled: boolean) =>
    `px-3 py-1 rounded text-xs font-medium transition ${disabled
      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
    }`;

  return (
    <div className="flex items-center justify-between border-t border-gray-100 pt-3">
      <span className="text-xs text-gray-500 font-medium">
        Page {page} of {totalPages}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(page - 1, 1))}
          disabled={page === 1}
          className={btn(page === 1)}
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => onChange(Math.min(page + 1, totalPages))}
          disabled={page === totalPages}
          className={btn(page === totalPages)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export const UserProfile = ({
  user,
  currentUser,
  loading,
  onEditProfile,
  onMakeAppointment,
}: UserProfileProps) => {
  const location = useLocation();

  // Modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddExperience, setIsAddExperience] = useState(false);
  const [isEditExpOpen, setIsEditExpOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<UserExperience | null>(null);
  const [isOpenEducation, setIsOpenEducation] = useState(false);
  const [isEditEduOpen, setIsEditEduOpen] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState<UserEducation | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  // The same modal handles adding (selectedCertificate = null) and editing
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<UserCertificate | null>(null);
  const [selectedCertImage, setSelectedCertImage] = useState<string | null>(null);
  const [isEditCertOpen, setIsEditCertOpen] = useState(false);

  // Data state
  const [experiences, setExperiences] = useState<UserExperience[]>([]);
  const [certificates, setCertificates] = useState<UserCertificate[]>([]);
  const [educations, setEducations] = useState<UserEducation[]>([]);
  const [loadingExp, setLoadingExp] = useState(false);
  const [loadingCert, setLoadingCert] = useState(false);
  const [loadingEdu, setLoadingEdu] = useState(false);

  // Pagination state
  const [expPage, setExpPage] = useState(1);
  const [certPage, setCertPage] = useState(1);
  const [eduPage, setEduPage] = useState(1);

  const targetUserId = user?._id;

  /* ----------------------------- Permissions ------------------------------ */

  const isLoggedIn = Boolean(currentUser);
  const isNotEmployer = currentUser?.accessLevel !== 1;
  const isSelf = Boolean(
    currentUser?.id && targetUserId && String(currentUser.id) === String(targetUserId)
  );
  // Guests never edit. Employers can only edit their own profile.
  const canEdit = isLoggedIn && (isNotEmployer || isSelf);

  /* ------------------------------ Data loading ---------------------------- */

  useEffect(() => {
    if (!targetUserId) return;

    let cancelled = false;

    const load = async () => {
      setLoadingExp(true);
      setLoadingCert(true);
      setLoadingEdu(true);

      const [expRes, certRes, eduRes] = await Promise.allSettled([
        getUserExperiences(targetUserId),
        getUserCertificate(targetUserId),
        getUserEducation(targetUserId),
      ]);

      if (cancelled) return;

      if (expRes.status === "fulfilled") {
        setExperiences(Array.isArray(expRes.value) ? expRes.value : []);
      } else {
        console.error("Failed to load experiences:", expRes.reason);
      }

      if (certRes.status === "fulfilled") {
        setCertificates(Array.isArray(certRes.value) ? certRes.value : []);
      } else {
        console.error("Failed to load certificates:", certRes.reason);
      }

      if (eduRes.status === "fulfilled") {
        setEducations(Array.isArray(eduRes.value) ? eduRes.value : []);
      } else {
        console.error("Failed to load education:", eduRes.reason);
      }

      setLoadingExp(false);
      setLoadingCert(false);
      setLoadingEdu(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [targetUserId, location]);



  // Lock page scroll while any modal is open
  const anyModalOpen =
    isEditOpen ||
    isAddExperience ||
    isEditExpOpen ||
    isCertificateOpen ||
    isEditCertOpen ||
    Boolean(selectedCertImage) ||
    isOpenEducation ||
    isEditEduOpen;
  ;

  useEffect(() => {
    document.body.style.overflow = anyModalOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [anyModalOpen]);

  /* ----------------------------- Derived values --------------------------- */

  const userRecord = (user || {}) as Record<string, any>;

  const fullName =
    user?.firstName || user?.lastName
      ? [
        user?.firstName,
        cleanPart(userRecord.middleName),
        user?.lastName,
        cleanPart(userRecord.suffix),
      ]
        .filter(Boolean)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim()
      : null;

  const profession: string | null = userRecord.profession || null;
  const jobtitle: string | null = userRecord.jobtitle || null
  const age = calculateAge(userRecord.dateOfBirth);
  const profileImageSrc = user?.profilePicture?.trim() ? user.profilePicture : defaultProfile;

  const expList: any[] = experiences.length > 0 ? experiences : userRecord.experiences || [];
  const certList: any[] = certificates.length > 0 ? certificates : userRecord.certificates || [];
  const educationList: any[] = educations.length > 0 ? educations : userRecord.education || [];

  const sortedExperiences = useMemo(() => {
    return [...expList].sort((a, b) => {
      if (a.isCurrent && !b.isCurrent) return -1;
      if (!a.isCurrent && b.isCurrent) return 1;
      const dateA = new Date(a.startDate || 0).getTime();
      const dateB = new Date(b.startDate || 0).getTime();
      return dateB - dateA;
    });
  }, [expList]);

  const sortedEducation = useMemo(() => {
    return [...educationList].sort((a, b) =>
      new Date(b.startDate || 0).getTime() - new Date(a.startDate || 0).getTime())
  }, [educationList])

  const totalExpPages = Math.ceil(sortedExperiences.length / EXP_PER_PAGE);
  const visibleExperiences = sortedExperiences.slice(
    (expPage - 1) * EXP_PER_PAGE,
    expPage * EXP_PER_PAGE
  );

  const totalCertPages = Math.ceil(certList.length / CERT_PER_PAGE);
  const visibleCertificates = certList.slice(
    (certPage - 1) * CERT_PER_PAGE,
    certPage * CERT_PER_PAGE
  );


  const totalEduPages = Math.ceil(sortedEducation.length / EDU_PER_PAGE);
  const visibleEducation = sortedEducation.slice(
    (eduPage - 1) * EDU_PER_PAGE,
    eduPage * EDU_PER_PAGE
  );

  useEffect(() => {
    if (totalEduPages > 0 && eduPage > totalEduPages) setEduPage(totalEduPages);
  }, [totalEduPages, eduPage]);

  useEffect(() => {
    if (totalCertPages > 0 && certPage > totalCertPages) setCertPage(totalCertPages);
  }, [totalCertPages, certPage]);
  /* -------------------------------- Handlers ------------------------------ */

  const handleSaveProfile = (updatedUser: Partial<User>) => {
    onEditProfile?.(updatedUser);
    setIsEditOpen(false);
  };

  // Experiences
  const handleSaveExperience = (newExp: UserExperience) => {
    if (newExp) setExperiences((prev) => [newExp, ...prev]);
    setIsAddExperience(false);
  };

  const handleOpenEditExperience = (exp: UserExperience) => {
    if (!canEdit) return;
    setSelectedExperience(exp);
    setIsEditExpOpen(true);
  };

  const handleCloseEditExperience = () => {
    setIsEditExpOpen(false);
    setSelectedExperience(null);
  };

  const handleSaveEditedExperience = (updated: UserExperience) => {

    setExperiences((prev) => prev.map((item) => (item._id === updated._id ? updated : item)));
    handleCloseEditExperience();
  };

  const handleDeleteExperiences = async (expId?: string) => {
    const userId = user?._id
    if (!userId || !expId) return;

    try {
      await deleteExperience(userId, expId);
      setExperiences((prev) => prev.filter((exp) => (exp._id) !== expId));

    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setDeletingId(null);
    }
  };
  // Certificates

  const handleOpenAddCertificate = () => setIsCertificateOpen(true);

  const handleOpenEditCertificate = (cert: UserCertificate) => {
    if (!canEdit) return;
    setSelectedCertificate(cert);
    setIsEditCertOpen(true);
  };

  const handleCloseAddCertificate = () => setIsCertificateOpen(false);

  const handleCloseEditCertificate = () => {
    setIsEditCertOpen(false);
    setSelectedCertificate(null);
  };

  const handleSaveCertificate = (saved: UserCertificate) => {
    if (saved) setCertificates((prev) => [saved, ...prev]);
    handleCloseAddCertificate();
  };

  const handleSaveEditedCertificate = (updated: UserCertificate) => {
    setCertificates((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
    handleCloseEditCertificate();
  };

  const handleDeleteCertificate = async (cert: UserCertificate) => {
    if (!canEdit || !cert._id) return;

    try {
      await deleteCertificateDetail(cert._id);
      setCertificates((prev) => prev.filter((c) => c._id !== cert._id));
    } catch (err) {
      console.error("Failed to delete certificate:", err);
    }
  };

  const handleSaveEducation = (newEdu: any) => {
    if (newEdu) setEducations((prev) => [newEdu, ...prev])
    setIsOpenEducation(false)
  }

  const handleOpenEditEducation = (edu: UserEducation) => {
    if (!canEdit) return;
    setSelectedEducation(edu);
    setIsEditEduOpen(true);
  };

  const handleCloseEditEducation = () => {
    setIsEditEduOpen(false);
    setSelectedEducation(null);
  };

  const handleSaveEditedEducation = (updated: UserEducation) => {
    console.log(updated)
    setEducations((prev) => prev.map((item) => (item._id === updated._id ? updated : item)));
    handleCloseEditEducation();
  };

  const handleDeleteEducation = async (eduId?: string) => {
    const userId = user?._id;
    if (!canEdit || !userId || !eduId) return;

    try {
      await deleteEducation(userId, eduId);
      setEducations((prev) => prev.filter((edu) => edu._id !== eduId));
    } catch (error) {
      console.error("Delete education failed:", error);
    }
  };


  /* --------------------------------- Render ------------------------------- */

  if (loading) return <Loading isLoading={true} />;

  return (
    <div className="flex min-h-screen items-center justify-center p-3 sm:p-6 bg-gray-100">
      <div className="flex flex-col w-full max-w-5xl p-4 sm:p-6 gap-6 bg-white rounded-xl shadow-lg border border-gray-200 text-gray-800">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-6">
          <div className="flex items-center gap-4 min-w-0">
            <img
              src={profileImageSrc}
              alt="Profile"
              className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src = defaultProfile;
              }}
            />
            <div className="flex flex-col gap-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
                {fullName || "No data"}
              </h1>
              <div className="text-sm text-gray-500">{jobtitle || "No data"}</div>
            </div>
          </div>

          {isLoggedIn && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {canEdit ? (
                <button
                  type="button"
                  onClick={() => setIsEditOpen(true)}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition whitespace-nowrap"
                >
                  Edit profile
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onMakeAppointment}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition whitespace-nowrap"
                >
                  Make an Appointment
                </button>
              )}
            </div>
          )}
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left column */}
          <div className="flex flex-col gap-6 lg:col-span-1 min-w-0 border-b lg:border-b-0 pb-6 lg:pb-0 lg:border-r border-gray-200 lg:pr-6">
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-bold text-gray-900">Personal details</h2>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-start gap-3">
                  <span className="text-xl shrink-0 w-6 text-center">📍</span>
                  <div className="min-w-0 break-words">
                    Lives in <strong className="font-semibold">{user?.address || "No data"}</strong>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl shrink-0 w-6 text-center">🏠</span>
                  <div className="min-w-0 break-words">
                    Contact: <strong className="font-semibold">{user?.contact || "No data"}</strong>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl shrink-0 w-6 text-center">✉️</span>
                  <div className="min-w-0 break-words">
                    Email: <strong className="font-semibold break-all">{user?.email || "No data"}</strong>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl shrink-0 w-6 text-center">🎂</span>
                  <div className="min-w-0 break-words">
                    Age:{" "}
                    <strong className="font-semibold">
                      {age !== null ? `${age} years old` : "No data"}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-gray-200 pt-4">
              <h2 className="text-lg font-bold text-gray-900">Work</h2>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-9 h-9 shrink-0 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">💼</div>
                <span className="font-medium text-gray-800 min-w-0 break-words">{profession || "No data"}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-gray-200 pt-4 flex-1">
              <section className="flex flex-col gap-4 flex-1">
                <SectionHeader
                  title="Education"
                  underline={false}
                  action={
                    canEdit && (
                      <AddButton label="Add Education" onClick={() => setIsOpenEducation(true)} />
                    )
                  }
                />

                {loadingEdu ? (
                  <LoadingState>Loading education...</LoadingState>
                ) : visibleEducation.length > 0 ? (
                  <>
                    <div className="flex flex-col gap-3 min-h-[17rem]">
                      {visibleEducation.map((edu) => {
                        const eduId = edu._id || edu.id;

                        return (
                          <div
                            key={eduId}
                            role={canEdit ? "button" : undefined}
                            tabIndex={canEdit ? 0 : undefined}
                            onClick={() => canEdit && handleOpenEditEducation(edu)}
                            onKeyDown={(e) => {
                              if (canEdit && (e.key === "Enter" || e.key === " ")) {
                                e.preventDefault();
                                handleOpenEditEducation(edu);
                              }
                            }}
                            className={`flex items-start gap-4 text-sm p-4 border border-gray-200 rounded-lg bg-gray-50 transition focus:outline-none ${canEdit ? "hover:shadow-sm hover:border-blue-300 cursor-pointer" : "cursor-default"
                              }`}
                          >
                            <div className="w-10 h-10 shrink-0 bg-white rounded-full flex items-center justify-center text-gray-600">
                              🎓
                            </div>

                            <div className="flex flex-col min-w-0 flex-1 gap-1">
                              <span className="font-semibold text-gray-900 leading-snug break-words">
                                {edu.schoolName || "No data"}
                              </span>
                              {edu.degree && (
                                <span className="text-xs text-gray-600 leading-snug break-words">
                                  {edu.degree}
                                  {edu.fieldStudy ? ` in ${edu.fieldStudy}` : ""}
                                </span>
                              )}
                              <span className="text-xs text-gray-400 mt-0.5">
                                {formatDateRange(edu.startDate, edu.endDate)}
                              </span>
                            </div>

                            {canEdit && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteEducation(eduId);
                                }}
                                aria-label="Delete education"
                                title="Delete"
                                className="shrink-0 -mr-1 -mt-1 p-2 rounded-full text-red-600 hover:bg-red-50 hover:text-red-700 transition cursor-pointer"
                              >
                                <TrashIcon />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-auto">
                      <Pager page={eduPage} totalPages={totalEduPages} onChange={setEduPage} />
                    </div>
                  </>
                ) : (
                  <EmptyState />
                )}
              </section>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-8 lg:col-span-2 min-w-0">
            {/* Experiences */}
            <section className="flex flex-col gap-4">
              <SectionHeader
                title="Experiences"
                count={sortedExperiences.length}
                action={
                  canEdit && (
                    <AddButton label="Add Experience" onClick={() => setIsAddExperience(true)} />
                  )
                }
              />

              <div className="flex flex-col gap-4 min-h-[120px] justify-center">
                {loadingExp ? (
                  <LoadingState>Loading experiences...</LoadingState>
                ) : visibleExperiences.length > 0 ? (
                  visibleExperiences.map((exp) => {
                    const expId = exp._id || exp.id;

                    return (

                      <div
                        key={expId}
                        role={canEdit ? "button" : undefined}
                        tabIndex={canEdit ? 0 : undefined}
                        onClick={() => canEdit && handleOpenEditExperience(exp)}
                        onKeyDown={(e) => {
                          if (canEdit && (e.key === "Enter" || e.key === " ")) {
                            e.preventDefault();
                            handleOpenEditExperience(exp);
                          }
                        }}
                        className={`w-full text-left p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col gap-1 transition focus:outline-none ${canEdit
                          ? "hover:shadow-sm hover:border-blue-300 cursor-pointer"
                          : "cursor-default"
                          }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 w-full">
                          <h3 className="font-semibold text-gray-900 break-words min-w-0">{exp.jobtitle || exp.role}</h3>
                          <span className="text-xs text-gray-500 font-medium sm:whitespace-nowrap sm:shrink-0">
                            {exp.period || formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}
                          </span>
                        </div>

                        <p className="text-sm text-blue-600 font-medium">{exp.company}</p>

                        {exp.description && (
                          <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                        )}

                        {canEdit && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteExperiences(expId);
                            }}
                            aria-label="Delete experience"
                            title="Delete"
                            className="self-end mt-2 p-1.5 rounded-full text-red-600 hover:bg-red-50 hover:text-red-700 transition cursor-pointer"
                          >
                            <TrashIcon />
                          </button>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <EmptyState />
                )}
              </div>

              <Pager page={expPage} totalPages={totalExpPages} onChange={setExpPage} />
            </section>

            {/* Certificates */}
            <section className="flex flex-col gap-4 border-t border-gray-200 pt-6">
              <SectionHeader
                title="Certificates"
                count={certList.length}
                action={
                  canEdit && (
                    <AddButton label="Add Certificate" onClick={handleOpenAddCertificate} />
                  )
                }
              />

              {loadingCert ? (
                <LoadingState>Loading certificates...</LoadingState>
              ) : visibleCertificates.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-h-[120px]">
                    {visibleCertificates.map((cert) => {
                      const imageUrl = getImageUrl(cert.certificationImage || cert.image);
                      const title = cert.certificationName || cert.title;
                      const issuer = cert.certifiedFrom || cert.issuer;
                      const issued = formatMonthYear(cert.startDate);

                      return (
                        <div
                          key={cert._id || cert.id}
                          className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition flex flex-col justify-between"
                        >
                          <div
                            className="h-32 bg-gray-200 cursor-pointer relative overflow-hidden group"
                            onClick={() => imageUrl && setSelectedCertImage(imageUrl)}
                          >
                            {imageUrl && (
                              <>
                                <img
                                  src={imageUrl}
                                  alt={title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                                />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition">
                                  Click to preview
                                </div>
                              </>
                            )}
                          </div>

                          <div className="p-3 flex flex-wrap items-start justify-between gap-2">
                            <div className="flex flex-col gap-1 min-w-0 flex-1">
                              <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{title}</h4>
                              <p className="text-xs text-gray-500 break-words">
                                {issuer} {issued ? `• ${issued}` : ""}
                              </p>
                            </div>

                            {canEdit && (
                              <div className="flex gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditCertificate(cert)}
                                  aria-label="Edit certificate"
                                  title="Edit"
                                  className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-blue-600 transition cursor-pointer"
                                >
                                  <PencilIcon />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteCertificate(cert)}
                                  aria-label="Delete certificate"
                                  title="Delete"
                                  className="p-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition cursor-pointer"
                                >
                                  <TrashIcon />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Pager page={certPage} totalPages={totalCertPages} onChange={setCertPage} />
                </>
              ) : (
                <EmptyState />
              )}
            </section>
          </div>
        </div>
      </div>

      {/* Certificate image preview */}
      {selectedCertImage && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedCertImage(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white rounded-lg p-2 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedCertImage(null)}
              className="absolute top-2 right-2 bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black transition"
            >
              ✕
            </button>
            <img src={selectedCertImage} alt="Certificate Preview" className="w-full h-auto rounded" />
          </div>
        </div>
      )}

      {/* Edit modals: only ever rendered for people allowed to edit */}
      {canEdit && isEditOpen && (
        <EditProfile user={user} onClose={() => setIsEditOpen(false)} onSave={handleSaveProfile} />
      )}

      {canEdit && isAddExperience && (
        <AddExpriences
          user={user}
          onClose={() => setIsAddExperience(false)}
          onSave={handleSaveExperience}
        />
      )}

      {canEdit && isEditExpOpen && selectedExperience && (
        <EditExperiences
          user={user}
          experience={selectedExperience}
          onClose={handleCloseEditExperience}
          onSave={handleSaveEditedExperience}
        />
      )}

      {canEdit && isCertificateOpen && (
        <AddCertificate
          user={user}
          onClose={handleCloseAddCertificate}
          onSave={handleSaveCertificate}
        />
      )}

      {canEdit && isEditCertOpen && selectedCertificate && (
        <EditCertificate
          user={user}
          certificate={selectedCertificate}
          onClose={handleCloseEditCertificate}
          onSave={handleSaveEditedCertificate}
        />
      )}
      {canEdit && isOpenEducation && (
        <AddEducation
          user={user}
          onClose={() => setIsOpenEducation(false)}
          onSave={handleSaveEducation}
        />
      )}

      {canEdit && isEditEduOpen && selectedEducation && (
        <EditEducation
          user={user}
          education={selectedEducation}
          onClose={handleCloseEditEducation}
          onSave={handleSaveEditedEducation}
        />
      )}

      {deletingId && <Loading isLoading={true} />}
    </div>
  );
};