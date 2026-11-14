import { Banner } from "./subcomponents/Banner"
import { Searchbar } from "./subcomponents/Searchbar"




export const  Home =  () => {

    return (
        <div className="flex justify-center min-h-[87vh] pb-8">
            <div className="flex flex-col items-center mt-6 w-full gap-6">
                <Searchbar/>
                <Banner/>
            </div>
        </div>
    )
}   