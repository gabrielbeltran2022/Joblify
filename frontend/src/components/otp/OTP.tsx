import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { OTPData } from "../../component-data/LoginData";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { verifyOtp, handleLogin } from "../../api/userApi";
import type { VerifyOtpPayload } from "../../api/userApi";
import { useUserContext } from "../../context/UserContext"; // 1. Import UserContext

const OTP_LIFETIME_MS = 60_000;

export const OTP = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { setUser } = useUserContext(); // 2. Access setUser from context

    const email = location.state?.email || "";
    const [data, setData] = useState<VerifyOtpPayload>({ email, code: "" });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [expiresAt, setExpiresAt] = useState(() => Date.now() + OTP_LIFETIME_MS);
    const [secondsLeft, setSecondsLeft] = useState(OTP_LIFETIME_MS / 1000);
    const [isResending, setIsResending] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (data) {
            console.log("State successfully updated:", data);
        }
    }, [data]);

    useEffect(() => {
        const tick = () =>
            setSecondsLeft(Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000)));

        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [expiresAt]);

    const isExpired = secondsLeft === 0;
    const timeLabel = `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")}`;

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isExpired) {
            setError("Your code has expired. Please request a new one.");
            return;
        }

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

            if (isExpired) {
                setError("Your code has expired. Please request a new one.");
                return;
            }

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

    const handleResend = async () => {
        if (isResending || isSubmitting || !email) return;

        try {
            setError("");
            setIsResending(true);

            await handleLogin({ email });          // same call your Login page uses to send the code

            formRef.current?.reset();              // clear the 6 boxes
            setExpiresAt(Date.now() + OTP_LIFETIME_MS); // restart the countdown
            formRef.current?.querySelector("input")?.focus();
        } catch {
            setError("Could not resend the code. Please try again.");
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="flex flex-col border-2 border-gray-200 w-full max-w-md p-5 sm:p-8 rounded-lg shadow-md gap-5 sm:gap-6 bg-white items-center"
            >
                {OTPData.map((item, index) => (
                    <div key={index} className="flex flex-col items-center gap-2 w-full">
                        {item.icon && (
                            <FontAwesomeIcon
                                icon={item.icon}
                                className="text-[26px] text-blue-500 self-start cursor-pointer hover:text-black transition"
                                onClick={() => navigate('/login')}
                            />
                        )}

                        {item.img && (
                            <img
                                src={item.img}
                                alt="Logo"
                                className="h-20 sm:h-28 w-auto max-w-full object-contain"
                            />
                        )}
                        <h2 className="text-lg sm:text-xl font-bold text-slate-800 text-center">{item.title}</h2>
                        <p className="text-sm sm:text-xs text-gray-500 text-center">{item.text}</p>
                    </div>
                ))}

                <div className="flex gap-1.5 sm:gap-2 justify-center w-full">
                    {Array.from({ length: 6 }, (_, i) => (
                        <input
                            key={i}
                            name={`digit${i + 1}`}
                            type="text"
                            autoComplete={i === 0 ? "one-time-code" : "off"}
                            autoCapitalize="characters"
                            maxLength={1}
                            disabled={isSubmitting}
                            className="flex-1 min-w-0 max-w-12 h-11 sm:h-12 text-center border-2 border-gray-300 rounded-lg text-xl font-bold uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        />
                    ))}
                </div>

                {error && <span className="text-red-500 text-xs text-center">{error}</span>}

                <div className="flex flex-col items-center gap-1 text-xs text-gray-500">
                    {isExpired ? (
                        <span className="text-red-500 font-medium">Your code has expired</span>
                    ) : (
                        <span>
                            Code expires in{" "}
                            <span className="font-semibold tabular-nums text-slate-800">{timeLabel}</span>
                        </span>
                    )}

                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={isResending || isSubmitting || !isExpired}
                        className="text-blue-600 font-medium hover:underline disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isResending ? "Sending..." : "Resend code"}
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || isExpired}
                    className="w-full bg-blue-600 text-white py-3 sm:py-2.5 rounded-lg hover:bg-blue-700 transition text-sm font-medium cursor-pointer disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? "Verifying..." : "Verify OTP"}
                </button>
            </form>
        </div>
    );
};