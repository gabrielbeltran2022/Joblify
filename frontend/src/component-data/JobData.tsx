
interface SubItem {
    id: number;
    text: string;
}

interface JobItem {
    id: number;
    data: string | SubItem[];
}



export const JobData: JobItem[] = [
    {
        id: 1,
        data:  [
            {
                id: 1,
                text: 'Remote'
            },
            {
                id: 2,
                text: 'On-site'
            },
            {
                id: 3,
                text: 'Hybrid'
            }
        ]
    },
    {
        id: 2,
        data: [
            {
                id: 1,
                text: 'Full time'
            },
            {
                id: 2,
                text: 'Part time'
            },
            {
                id: 3,
                text: 'Contractual'
            }
        ]
    },{
        id: 3,
        data: [
            {
                id: 1,
                text: 'All Dates'
            },
            {
                id: 2,
                text: 'Last 24 Hours '
            },
            {
                id: 3,
                text: 'Last 3 Days'
            },
            {
                id: 4,
                text: 'Last 7 Days'
            },
            {
                id: 5,
                text: 'Last 30 days'
            }
        ]
    }
]
