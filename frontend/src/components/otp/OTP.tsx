import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { OTPData } from "../../component-data/LoginData";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { verifyOtp } from "../../api/userApi";
import type { VerifyOtpPayload } from "../../api/userApi";
import { useUserContext } from "../../context/UserContext"; // 1. Import UserContext

export const OTP = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { setUser } = useUserContext(); // 2. Access setUser from context
    
    const email = location.state?.email || "";
    const [data, setData] = useState<VerifyOtpPayload>({ email, code: "" });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    useEffect(() => {
        if (data) {
            console.log("State successfully updated:", data);
        }
    }, [data]);

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const d1 = formData.get("digit1") || "";
        const d2 = formData.get("digit2") || "";
        const d3 = formData.get("digit3") || "";
        const d4 = formData.get("digit4") || "";
        const d5 = formData.get("digit5") || "";
        const d6 = formData.get("digit6") || "";

        const fullOtp = `${d1}${d2}${d3}${d4}${d5}${d6}`;

        if (fullOtp.length < 6) {
            setError("Please enter the complete 6-digit OTP.");
            return;
        }

        try {
            setError("");
            setIsSubmitting(true);
            
            const result = await verifyOtp({ email, code: fullOtp });

            setData(result);
            console.log("OTP Verification Response:", result);

            const authenticatedUser = result.data?.user || result.user;
            console.log(authenticatedUser)
            
            if (authenticatedUser) {
                setUser(authenticatedUser);
                const userId = authenticatedUser.id || authenticatedUser._id;
                
                if (userId) {
                    localStorage.setItem('userId', userId);
                }
            }

            navigate("/job"); 
        } catch (err: any) {
            setError(err.message || "Invalid or expired OTP."); 
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full h-[100vh] flex items-center justify-center bg-gray-50">
            <form 
                onSubmit={handleSubmit}
                className="flex flex-col border-2 border-gray-200 w-full max-w-md p-8 rounded-lg shadow-md gap-6 bg-white items-center"
            >
                {OTPData.map((item, index) => (
                    <div key={index} className="flex flex-col items-center gap-2">
                       {item.icon && (
                            <FontAwesomeIcon 
                                icon={item.icon} 
                                className="text-[26px] text-blue-500 self-start cursor-pointer hover:text-black transition"
                                onClick={() => navigate('/login')} 
                            />
                        )}

                        {item.img && (
                            <img src={item.img} alt="Logo" className="h-30 w-auto object-contain" />
                        )}
                        <h2 className="text-xl font-bold text-slate-800">{item.title}</h2>
                        <p className="text-xs text-gray-500 text-center">{item.text}</p>
                    </div>
                ))}

                {/* 6 Native HTML Input Boxes */}
                <div className="flex gap-2 justify-center w-full">
                    <input name="digit1" type="text" maxLength={1} disabled={isSubmitting} className="w-12 h-12 text-center border-2 border-gray-300 rounded-lg text-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" />
                    <input name="digit2" type="text" maxLength={1} disabled={isSubmitting} className="w-12 h-12 text-center border-2 border-gray-300 rounded-lg text-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" />
                    <input name="digit3" type="text" maxLength={1} disabled={isSubmitting} className="w-12 h-12 text-center border-2 border-gray-300 rounded-lg text-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" />
                    <input name="digit4" type="text" maxLength={1} disabled={isSubmitting} className="w-12 h-12 text-center border-2 border-gray-300 rounded-lg text-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" />
                    <input name="digit5" type="text" maxLength={1} disabled={isSubmitting} className="w-12 h-12 text-center border-2 border-gray-300 rounded-lg text-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" />
                    <input name="digit6" type="text" maxLength={1} disabled={isSubmitting} className="w-12 h-12 text-center border-2 border-gray-300 rounded-lg text-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" />
                </div>
                {error && <span className="text-red-500 text-xs">{error}</span>}
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition text-sm font-medium cursor-pointer disabled:bg-blue-400"
                >
                    {isSubmitting ? "Verifying..." : "Verify OTP"}
                </button>
            </form>
        </div>
    );
};