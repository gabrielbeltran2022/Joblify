import { useEffect, useRef, useState} from "react";
import { CardData,type CardItem  } from "../../component-data/CardData";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { CardInfo } from "./subcomponents/CardInfo";

export const Card = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState<CardItem | null >(null); 
    const [visibleCount, setVisibleCount] = useState(12);
    const visibleItems = CardData.slice(0, visibleCount);

    useEffect(() => {
        if(isOpen){
            document.body.style.overflow = 'hidden'
        }else{
            document.body.style.overflow = 'auto'
        }

        return () => {
            document.body.style.overflow = 'auto'
        };

    },[isOpen])

    const handleViewInfo = (data: CardItem) => {
        setSelectedCard(data); 
        setIsOpen(true);      
    };

    const handleViewMore = () => {
        setVisibleCount((prevCount) => prevCount + 4);
    };

    return (
        <div className="w-full flex flex-col items-center gap-6 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl">
                {visibleItems.map((data: CardItem) => {
                    const currency = data.sign || '';

                    const getSalaryText = () => {
                        if (data.minSalary && data.maxSalary) {
                            return `${currency}${data.minSalary.toLocaleString()} - ${currency}${data.maxSalary.toLocaleString()}`;
                        } else if (data.minSalary) {
                            return `${currency}${data.minSalary.toLocaleString()}`;
                        } else if (data.maxSalary) {
                            return `${currency}${data.maxSalary.toLocaleString()}`;
                        }
                        return "Salary not specified";
                    };

                    return (
                        <div 
                            key={data.id}
                            onClick={() => handleViewInfo(data)} // 4. Trigger modal and pass this card's data
                            className="w-full border border-slate-200 rounded-xl p-5 shadow-sm bg-white flex flex-col justify-between hover:shadow-md transition gap-4 relative overflow-hidden cursor-pointer"
                        >
                            <div 
                                className="absolute top-0 left-0 right-0 h-[24%] bg-[#296cf2]/80 pointer-events-none z-0"
                                style={{
                                    borderBottomLeftRadius: '100% 120%',
                                    borderBottomRightRadius: '100% 120%'
                                }}
                            ></div>
                            <div className="relative z-10 flex flex-col justify-between h-full gap-4">
                                <div className="flex justify-between items-start">
                                    <img 
                                        src={data.img} 
                                        alt={`${data.company} logo`} 
                                        className="w-12 h-12 rounded-full object-cover border border-slate-100 shadow-sm flex-shrink-0 bg-white"
                                    />
                                    <button 
                                        className="text-slate-300 hover:text-red-400 transition p-1 cursor-pointer"
                                        title="Add to task monitoring"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevents the card click from firing when clicking the bookmark button
                                            console.log("Added to task monitoring:", data.jobtitle);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faPaperclip} className="text-xl" />
                                    </button>
                                </div>
                                
          
                                <div className="flex flex-col gap-2">
                                    <div>
                                        <h1 className="font-semibold text-base text-slate-800 line-clamp-1">{data.jobtitle}</h1>
                                        <h4 className="text-xs text-slate-500">{data.company}</h4>
                                    </div>

                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-medium border border-blue-100">
                                            {data.workType}
                                        </span>
                                        <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md font-medium border border-emerald-100">
                                            {data.workContract}
                                        </span>
                                        <span className="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-md font-medium border border-purple-100">
                                            {data.workSchedule}
                                        </span>
                                    </div>
                                    
                                    {/* Salary Badge */}
                                    <div className="pt-1">
                                        <p className="text-xs font-medium text-slate-700 bg-slate-50 px-3 py-1 rounded-md inline-block border border-slate-100">
                                            {getSalaryText()}
                                        </p>
                                    </div>
                                </div>

                                {/* Bottom Section: Location & Apply Button */}
                                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-[11px] text-slate-400 truncate max-w-[100px]">{data.location}</span>
                                    
                                    <button 
                                        className="bg-blue-600 text-white text-xs font-medium px-4 py-2 rounded-full hover:bg-blue-700 transition cursor-pointer shadow-sm"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevents the card click from firing when clicking "Apply"
                                            console.log("Apply clicked for:", data.jobtitle);
                                        }}
                                    >
                                        Apply Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {visibleCount < CardData.length && (
                <div className="flex flex-col items-center gap-2 mt-6">
                    <button
                        onClick={handleViewMore}
                        className="px-6 py-2.5 rounded-full border border-slate-300 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition cursor-pointer shadow-sm"
                    >
                        View More (+4)
                    </button>
                    <span className="text-xs text-slate-400">
                        Showing {Math.min(visibleCount, CardData.length)} of {CardData.length} jobs
                    </span>
                </div>
            )}

            {isOpen && selectedCard && (
                <CardInfo 
                    data={selectedCard} 
                    onClose={() => setIsOpen(false)} 
                />
            )}
        </div>
    );
};