
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


export const handleLogin = async (payload: LoginPayload): Promise<LoginResponse | void> => {
  try {
    const response = await fetch('http://localhost:3000/api/send-code', {
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
  
  const response = await fetch('http://localhost:3000/api/verify-signup', { 
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

export const getUserInfo = async (userId: string): Promise<User> => {

  const response = await fetch(`http://localhost:3000/api/get-user-profile/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch profile");

  return data.data?.user || data.user;
};

export const updateUserProfile = async (
  userId: string,
  updatedUser: Partial<User>
): Promise<User> => {

  const response = await fetch(
    `http://localhost:3000/api/update-user/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(updatedUser),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(
      errorData.message ||
      `Failed to update user profile: ${response.statusText}`
    );
  }

  const result = await response.json();

  return result.data?.user || result.user || result.data || result;
};

export const addExprincesDetail = async (
  userId: string,
  updateExprinces: UserExperience
): Promise<UserExperience> => {
  const response = await fetch(`http://localhost:3000/api/update-user-expriences/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      
    },
    credentials: "include",
    body: JSON.stringify(updateExprinces),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to save experience details");
  }

  const result = await response.json();
  return result.data ?? result;
};


export const getUserExperiences = async (userId: string): Promise<UserExperience[]> => {
  try {
    const response = await fetch(`http://localhost:3000/api/user-experiences/${userId}`, {
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
      const response = await fetch(`http://localhost:3000/api/get-certification/${userId}`, {
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
export const addCertificateDetail = async (
  userId: string,
  data: {
    certificationName: string;
    certifiedFrom: string;
    startDate?: string;
    endDate?: string;
    certificationImage?: File | null;
  }
): Promise<UserCertificate> => {
  const body = new FormData();
  body.append("certificationName", data.certificationName);
  body.append("certifiedFrom", data.certifiedFrom);
  if (data.startDate) body.append("startDate", data.startDate);
  if (data.endDate) body.append("endDate", data.endDate);
  if (data.certificationImage) body.append("certificationImage", data.certificationImage);

  const response = await fetch(`http://localhost:3000/api/add-user-certification/${userId}`, {
    method: "POST",
    credentials: "include",
    body,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to add certificate details");
  }

  const result = await response.json();
  return result.data ?? result;
};

export const updateCertificateDetail = async (
  userId: string,
  certId: string,
  data: {
    certificationName?: string;
    certifiedFrom?: string;
    startDate?: string;
    endDate?: string;
    certificationImage?: File | null;
  }
): Promise<UserCertificate> => {
  const body = new FormData();
  if (data.certificationName) body.append("certificationName", data.certificationName);
  if (data.certifiedFrom) body.append("certifiedFrom", data.certifiedFrom);
  if (data.startDate) body.append("startDate", data.startDate);
  if (data.endDate) body.append("endDate", data.endDate);
  if (data.certificationImage) body.append("certificationImage", data.certificationImage);

  const response = await fetch(
    `http://localhost:3000/api/update-user-certification/${userId}/${certId}`,
    {
      method: "PUT",
      credentials: "include",
      body,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update certificate details");
  }

  const result = await response.json();
  return result.data ?? result;
};

export const deleteCertificateDetail = async (certId: string): Promise<void> => {
  const response = await fetch(`http://localhost:3000/api/delete-user-certification/${certId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete certificate");
  }
};