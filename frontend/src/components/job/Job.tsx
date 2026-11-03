import { Searchbar } from '../../components/home/subcomponents/Searchbar';
import { Card } from '../card/Card';
import { JobData } from '../../component-data/JobData';
import { Footer } from '../footer/Footer';
import { useEffect, useState } from 'react';


export const Job = () => {
    const [job,setJob] = useState('')
    const [searchLocation,setSearchLocation] = useState<string[]>([])
    const [openSearchLocation,setOpenSearchLocation] = useState(false)

  const handleSearch = (jobQuery: string, locations: string[]) => {
    setJob(jobQuery);
    setSearchLocation(locations);
    setOpenSearchLocation(false);
};


  return (
    <div className="p-8 flex flex-col items-center w-full gap-6">
      <Searchbar onSearch={handleSearch} />
        <div className='flex w-1/2 gap-4'>
        {JobData.map((item) => (
            <div key={item.id} className="flex flex-col gap-2">
            {Array.isArray(item.data) && item.data.length > 0 && (
                <select
                defaultValue={item.data[0].id}
                className="appearance-none bg-white border border-slate-300 rounded-sm px-4 py-2 text-[14px] text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition"
                >
                {item.data.map((subItem) => (
                    <option key={subItem.id} value={subItem.id}>
                    {subItem.text}
                    </option>
                ))}
                </select>
            )}
            </div>
        ))}
        </div>
      <div className='flex w-full gap-4'>
        <div className='flex w-full gap-4'>
                <Card/>
        </div>
      </div>  
    </div>
  );
};