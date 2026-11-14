import JoblifyLogo from '../assets/Joblify.png';

interface EmployerNavSchema {
    id: number
    title: string
    link: string
    img?: string 
}

export const EmployerNavData: EmployerNavSchema[] = [
    {
        id: 1,
        title: 'Logo',
        link: '/', // or wherever the logo should click to
        img: JoblifyLogo 
    },
    {
        id: 2,
        title: "Post Job",
        link: "/post-job"
    },
    {
        id: 3,
        title: "Find Employee",
        link: "/find-employee"
    },
    {
        id: 4,
        title: "Dash Board",
        link: '/company-details'
    }
]