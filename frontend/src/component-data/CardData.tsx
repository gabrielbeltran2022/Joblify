import sanmiguel from '../../src/assets/sanmiguel.webp';

export interface CompanyInfo {
    id: number;
    responsibility: string | null;
    about: string | null;
}

export interface CardItem {
    id: number;
    jobtitle: string;
    company: string;
    location: string;
    minSalary?: number;
    maxSalary?: number;
    sign?: '$' | '₱';
    img: string; 
    workType: string;
    workContract: string;
    workSchedule: string;
    info: CompanyInfo[];
}

export const CardData: CardItem[] = [
    {
        id: 1,
        jobtitle: 'Full Stack Developer',
        company: 'San Miguel Corporation',
        location: 'Ortigas City',
        minSalary: 20000,
        maxSalary: 35000,
        sign: '₱',
        img: sanmiguel,
        workType: 'Remote',
        workContract: 'Full Time',
        workSchedule: 'last 30 Days',
        info: [
            {
                id: 1,
                responsibility: `Develop and maintain frontend and backend features for web applications.
Build responsive user interfaces and integrate them with backend APIs.
Develop and maintain REST APIs and server-side applications.
Work with databases and perform CRUD operations.
Debug, troubleshoot, and resolve application issues.
Write clean, maintainable, and reusable code.
Collaborate with developers, QA, designers, and other team members.
Participate in code reviews, testing, deployment, and application maintenance.
Integrate third-party APIs and services when required.
Continuously improve application performance, functionality, and reliability.`,
                about: `0–2 years of experience in Full Stack Web Development or a related role.
Experience with HTML, CSS, JavaScript, and TypeScript.
Basic experience with frontend frameworks such as React.
Basic experience with backend technologies such as Node.js, Express, or Fastify.
Understanding of REST APIs and API integration.
Knowledge of databases such as MySQL, PostgreSQL, or SQL Server.
Familiarity with Git and version control.
Basic understanding of authentication, authorization, and web security.
Good problem-solving and debugging skills.
Willingness to learn new technologies and development practices.`
            }
        ]
    }
];