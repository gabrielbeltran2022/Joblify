import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SearchData } from "../../../component-data/SearchData";
import { Location, Jobtitle } from '../../../component-data/SearchListData';
import { useState, useRef, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
    onSearch?: (
        jobQuery: string, 
        selectedLocations: string[]
    ) => void;
}

export const Searchbar = ({onSearch}: SearchBarProps) => {
    
    const navigate = useNavigate();
    
    const [jobQuery, setJobQuery] = useState('');
    const [locationQuery, setLocationQuery] = useState('');
    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
    
    const [isLocationOpen, setLocationOpen] = useState(false);
    const [isJobtitleOpen, setJobtitleOpen] = useState(false);

    const searchBarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
                setLocationOpen(false);
                setJobtitleOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const filterLocation = Location.filter((data) =>
        data.locationName.toLowerCase().includes(locationQuery.toLowerCase())
    );

    const filterJobtitle = Jobtitle.filter((data) =>
        data.jobTitleName.toLowerCase().includes(jobQuery.toLowerCase())
    );

    const handleSearchClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        
        const finaLocation = selectedLocations.length > 0 ? selectedLocations : (locationQuery ? [locationQuery] : [])

        if(onSearch){
            onSearch(jobQuery,finaLocation)
        }

        navigate('/job');

    }

    return (

        <div ref={searchBarRef} className="flex items-center bg-white border border-slate-300 rounded-full shadow-md px-6 py-3 w-full max-w-2xl gap-4">
            {SearchData.map((data, index) => {
                const isLocationField = data.id === 2; 

                return (
                    <div 
                        key={data.id} 
                        className={`relative flex items-center gap-2 flex-1 ${
                            index !== SearchData.length - 1 ? 'border-r border-slate-200 pr-4' : 'pl-2'
                        }`}
                    >
                        <FontAwesomeIcon icon={data.icon} className="text-slate-400" />
                        <input 
                            type="text" 
                            placeholder={isLocationField ? "Location..." : "Job title, keywords..."} 
                            value={isLocationField ? (locationQuery || selectedLocations.join(', ')) : jobQuery}
                            onChange={(e) => {
                                if (isLocationField) {
                                    setLocationQuery(e.target.value);
                                    setLocationOpen(true);
                                } else {
                                    setJobQuery(e.target.value);
                                    setJobtitleOpen(true);
                                }
                            }}
                            onFocus={() => {
                                if (isLocationField) {
                                    setLocationOpen(true);
                                    setJobtitleOpen(false);
                                } else {
                                    setJobtitleOpen(true);
                                    setLocationOpen(false);
                                }
                            }}                    
                        />
                        {isLocationField && isLocationOpen && filterLocation.length > 0 && (
                            <div className="absolute top-full left-0 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto">
                                {filterLocation.map((loc) => (
                                    <div
                                        key={loc.id}
                                        onClick={() => {
                                            setSelectedLocations((prev) => [...prev, loc.locationName]);
                                            setLocationQuery('');
                                            setLocationOpen(false);
                                        }}
                                        className="px-4 py-2 hover:bg-slate-100 cursor-pointer text-sm text-slate-700"
                                    >
                                        {loc.locationName}
                                    </div>
                                ))} 
                            </div>
                        )}
                        {!isLocationField && isJobtitleOpen && filterJobtitle.length > 0 && (
                            <div className="absolute top-full left-0 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto">
                                {filterJobtitle.map((job) => (
                                    <div
                                        key={job.id}
                                        onClick={() => {
                                            setJobQuery(job.jobTitleName);
                                            setJobtitleOpen(false);
                                        }}
                                        className="px-4 py-2 hover:bg-slate-100 cursor-pointer text-sm text-slate-700"
                                    >
                                        {job.jobTitleName}
                                    </div>
                                ))} 
                            </div>
                        )}
                    </div>
                );
            })}

            <button className="bg-blue-500 text-sm cursor-pointer text-white px-4 py-2 rounded-full hover:bg-blue-700 transition whitespace-nowrap"
            onClick={handleSearchClick}>
                Explore Jobs
            </button>
        </div>
    );
};