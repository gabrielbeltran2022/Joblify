
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

    // Ensures an array is returned even if backend sends null/undefined
    return result.data ?? result ?? [];
  } catch (e: any) {
    console.error("Failed to retrieve data:", e);
    throw e; // Rethrow so the calling component can display an error state
  }
};