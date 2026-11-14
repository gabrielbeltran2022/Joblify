import { API_URL, apiFetch, readError } from "./http";


interface Employer {
    _id: string
    userId: string
    companyName: string
    industry: string
    founded: Date
    location: string
    companySize: number
    isEmployer: boolean
}

export const getAllEmployerCompany = async (): Promise<Employer[]> => {
    const res = await apiFetch('/get-all-company', {
        method: "GET",
        credentials: "include"
    })

    console.log(res)
    if(!res.ok) throw await readError(res,"failed to retrieve companies");

    const json = await res.json();
    return json.data ?? json
}