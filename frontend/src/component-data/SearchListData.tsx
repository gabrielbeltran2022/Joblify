
interface LocationItem {
    id: number;
    locationName: string;
}

interface JobItem {
    id: number,
    jobTitleName: string;
}


export const Location: LocationItem[] =  [
    {
        id: 1,
        locationName: "Makati City",
    },
    {
        id: 2,
        locationName: "Marikina City",
    },
    {
        id: 3,
        locationName: "Quezon City"
    },
    {
        id: 4,
        locationName: "Taguig City"
    }
]


export const Jobtitle: JobItem[] = [
    {
        id: 1,
        jobTitleName: "Developer"
    },
    {
        id: 2,
        jobTitleName: "Frontend Developer"
    },
    {
        id: 3,
        jobTitleName: "Backend Developer"
    }
]