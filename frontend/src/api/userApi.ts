
import { API_URL, apiFetch, readError } from "./http";

interface LoginPayload {
  email: string;
}

interface LoginResponse {
  message: string;
  user: User;
  accessToken: string;
}


export interface VerifyOtpPayload {
  email: string;
  code: string;
}

export interface ApiResponse {
  success?: boolean;
  message?: string;
  isVerified?: boolean;
  data?: any;
}


export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  middleName?: string | null;
  suffix?: string | null;
  profession?: string | null;
  jobtitle?: string | null;
  gender: string
  email: string;
  accessLevel: number;
  address?: string | null;
  contact?: string | number | null;
  profilePicture?: string | null;
  isVerified?: boolean;
  isProfileComplete?: boolean;
  dateOfBirth?: Date | string | null;
}


export interface UserExperience {
  _id?: string;
  userId?: string;
  jobtitle: string;
  company: string;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  isCurrent: boolean;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserCertificate {
  _id?: string;
  userId: string;
  certificationImage?: string | null;
  certificationName: string;
  certifiedFrom: string;          
  endDate?: Date | string | null;
  startDate?: Date | string | null;
}

type CertInput = {
  certificationName?: string;
  certifiedFrom?: string;
  startDate?: string;
  endDate?: string;
  certificationImage?: File | null;
};

const toCertForm = (data: CertInput) => {
  const body = new FormData();
  if (data.certificationName) body.append("certificationName", data.certificationName);
  if (data.certifiedFrom) body.append("certifiedFrom", data.certifiedFrom);
  if (data.startDate) body.append("startDate", data.startDate);
  if (data.endDate) body.append("endDate", data.endDate);
  if (data.certificationImage) body.append("certificationImage", data.certificationImage);
  return body; 
};

export const handleLogin = async (payload: LoginPayload): Promise<LoginResponse | void> => {
  try {
    const response = await fetch(`${API_URL}/send-code`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      credentials: 'include', 
      body: JSON.stringify(payload) 
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // console.log('Login successful:', data);
    return data as LoginResponse;

  } catch (error) {
    if (error instanceof Error) {
      console.error('Login Error:', error.message);
    } else {
      console.error('An unexpected error occurred:', error);
    }
  }
};


export const verifyOtp = async (payload: { email: string; code: string }) => {
  
  const response = await fetch(`${API_URL}/verify-signup`, { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'OTP verification failed');
  }

  return data;
};

//PUBLIC no token and no refresh access 

export const getUserInfo = async (userId: string): Promise<User> => {
  const res = await fetch(`${API_URL}/get-user-profile/${userId}`);
  if (!res.ok) throw await readError(res, "Failed to fetch profile");
  const data = await res.json();
  return data.data?.user || data.user;
};



export const getUserExperiences = async (userId: string): Promise<UserExperience[]> => {
  try {
    const response = await fetch(`${API_URL}/user-experiences/${userId}`, {
      method: "GET",
      credentials: "include", 
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to retrieve experience details");
    }

    const result = await response.json();

    return result.data ?? result ?? [];
  } catch (e: any) {
    console.error("Failed to retrieve data:", e);
    throw e;
  }
};



export const getUserCertificate = async (userId: string): Promise<UserCertificate[]> => {
    try{
      const response = await fetch(`${API_URL}/get-certification/${userId}`, {
      method: "GET",
      credentials: "include", 
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to retrieve experience details");
    }

    const result = await response.json();

    return result.data ?? result ?? [];
    }catch(e: any){
      console.error('Failed to retrieve data:',e)
      throw e 
    }
} 

/* ---------- PROTECTED (token + auto refresh) ---------- */

export const getCurrentUser = async (): Promise<User> => {
  const res = await apiFetch("/me");
  if (!res.ok) throw await readError(res, "Failed to fetch current user");
  const data = await res.json();
  return data.data?.user || data.user;
};


export const updateUserProfile = async (userId: string, updatedUser: Partial<User>): Promise<User> => {
  const res = await apiFetch(`/update-user/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedUser),
  });
  if (!res.ok) throw await readError(res, "Failed to update user profile");
  const result = await res.json();
  return result.data?.user || result.user || result.data || result;
};

export const addExprincesDetail = async (userId: string, exp: UserExperience): Promise<UserExperience> => {
  const res = await apiFetch(`/add-user-expriences/${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(exp),
  });
  if (!res.ok) throw await readError(res, "Failed to save experience details");
  const result = await res.json();
  return result.data ?? result;
};


export const updateExprience = async (userId: string, expId: string, exp: UserExperience): Promise<UserExperience> => {
    const res = await apiFetch(`/update-user-expriences/${userId}/${expId}`,{
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(exp)
    })

    if(!res.ok) throw await readError(res,"Failed to update user expriences")
    const result = await res.json();
    return result.data ?? result
}

export const addCertificateDetail = async (userId: string, data: CertInput): Promise<UserCertificate> => {
  const res = await apiFetch(`/add-user-certification/${userId}`, 
    { 
      method: "POST", 
      body: toCertForm(data) 
    });
  if (!res.ok) throw await readError(res, "Failed to add certificate");
  const result = await res.json();
  return result.data ?? result;
};


export const updateCertificateDetail = async (userId: string, certId: string, data: CertInput): Promise<UserCertificate> => {
  const res = await apiFetch(`/update-user-certification/${userId}/${certId}`,
     { 
      method: "PUT", 
      body: toCertForm(data) 
    });
  
    if (!res.ok) throw await readError(res, "Failed to update certificate");
  const result = await res.json();
  return result.data ?? result;
};

export const deleteCertificateDetail = async (certId: string): Promise<void> => {
  const res = await apiFetch(`/delete-user-certification/${certId}`, 
    { method: 
      "DELETE" 
    });
  if (!res.ok) throw await readError(res, "Failed to delete certificate");
};