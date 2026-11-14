import { navdata } from "../../component-data/Navbar";
import { LoginData, TermConditionData } from "../../component-data/LoginData";
import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from "react";
import type { ChangeEvent } from "react";
import { handleLogin } from "../../api/userApi";


export const Login = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const term = TermConditionData[0];

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        if (isSubmitting) return;

        if (!email.trim()) {
            setError('Email is required');
            return;
        }

        try {
            setError('');
            setIsSubmitting(true);

            await handleLogin({ email });
            navigate('/OTP', { state: { email } });
        } catch (err) {
            setError('Login failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex w-full min-h-screen justify-center items-center bg-gray-50 p-4">

            <form
                onSubmit={handleSubmit}
                aria-busy={isSubmitting}
                className="flex flex-col border-2 border-gray-200 w-full max-w-md p-5 sm:p-8 rounded-lg shadow-md gap-4 bg-white items-center"
            >
                <NavLink
                    to={'/'}
                    onClick={(e) => isSubmitting && e.preventDefault()}
                    className="font-bold text-xl text-slate-800 mb-1"
                >
                    {navdata[0].img ? (
                        <img
                            src={navdata[0].img}
                            alt="Joblify Logo"
                            className="h-20 sm:h-24 w-auto object-contain"
                        />
                    ) : (
                        <span className="font-bold text-xl text-slate-800">{navdata[0].title}</span>
                    )}
                </NavLink>

                <h2 className="text-xl font-bold text-center text-slate-800">{term.header}</h2>
                <p className="text-xs text-gray-600 text-center mb-2">{term.title}</p>

                {LoginData.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        disabled={isSubmitting}
                        className="w-full border py-2 rounded-md hover:bg-gray-100 transition flex items-center justify-center gap-3 font-medium text-gray-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <img src={item.img} alt="" className="w-5 h-5 object-contain" />
                        {item.text}
                    </button>
                ))}

                <div className="flex items-center my-1 w-full">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="px-2 text-gray-400 text-xs">or</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="login-email" className="text-xs font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        id="login-email"
                        type="email"
                        value={email}
                        disabled={isSubmitting}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        className="border rounded-md px-3 py-2 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        placeholder="Enter your email"
                    />
                    {error && <span className="text-red-500 text-xs">{error}</span>}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition text-sm font-medium mt-2 cursor-pointer disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isSubmitting && (
                        <svg
                            className="w-4 h-4 animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                    )}
                    {isSubmitting ? "Sending..." : "Continue"}
                </button>

                <p className="text-[10px] sm:text-xs text-gray-500 text-center mt-2 whitespace-pre-line leading-relaxed">
                    {term.content}
                </p>
            </form>
        </div>
    );
};