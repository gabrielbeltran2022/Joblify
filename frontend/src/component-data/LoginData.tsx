import google from '../assets/google.png';
import email from '../assets/emailLogo.png'
import { faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";



interface ConditionItem {
    id: number;
    header: string;
    title: string;
    content: string;
}

interface Loginitem {
    id: number;
    img: string;
    text: string;
}

interface OTPItem {
    id: number;
    img: string;
    title: string;
    text: string;
    icon: IconDefinition
}

export const TermConditionData: ConditionItem[] = [
    {
        id: 1,
        header: `Start your job search with Joblify`,
        title: `Sign in or create your account to discover opportunities and take the next step in your career.`,
        content: `By selecting “Continue,” you confirm that you have read and agree to Joblify’s Terms of Service. You also understand how we use cookies and handle your information as explained in our Cookie Policy and Privacy Policy.

From time to time, Joblify may send you helpful updates, job-related information, or promotional messages. You can unsubscribe from promotional communications whenever you choose.`
    }
];

export const LoginData: Loginitem[] = [
    {
        id: 1,
        img: google,
        text: 'Continue with Google'
    }
];

export const OTPData: OTPItem[] = [
    {
        id: 1,
        img: email,
        title: 'Enter Verification Code',
        text: 'Your OTP has been sent successfully. Please check your email and enter the 6-digit code to verify your account. The code will expire shortly.',
        icon: faCircleArrowLeft
    }
]