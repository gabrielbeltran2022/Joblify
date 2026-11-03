
interface SubfooterLocation {
    id: number;
    text: string;
}

interface SubFooterItem {
    id: number;
    text: string; 
    link: string; 
}

interface FooterItem {
    id: number;
    location: SubfooterLocation[];
    links: SubFooterItem[];
    copyright: string; 
}

export const footerData: FooterItem[] = [
    {
        id: 1,
        location: [
            {
                id: 1,
                text: 'Philippines'
            },
            {
                id: 2,
                text: 'Vietnam'
            },{
                id: 3,
                text: 'Singapore'
            },{
                id: 4,
                text: 'Indonesia'
            }
        ],
        links: [
            {
                id: 1,
                text: 'Terms & Services',
                link: '/terms&condition'
            }
            ,{
                id: 2,
                text: "About Us",
                link: "/about"
            },
            {
                id: 3,
                text: 'Privacy Policy',
                link: '/privacy-policy'
            }
        ],
        copyright:  ' ©2026 Joblify, All rights reserved'
    }
    
];