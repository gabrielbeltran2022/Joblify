import { useEffect, useRef } from "react";
import { type CardItem } from "../../../component-data/CardData";

interface CardInfoProps {
    data: CardItem;
    onClose: () => void; 
}

export const CardInfo = ({ data, onClose }: CardInfoProps) => {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);
    
    if (!data) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div 
                ref={cardRef} 
                className="bg-white rounded-2xl max-w-[85%] h-[90vh] w-full p-6 shadow-xl relative flex flex-col justify-between animate-in fade-in zoom-in-95 duration-200 overflow-y-auto"
            >
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 font-bold text-lg cursor-pointer z-10"
                >
                    ✕
                </button>

                <div className="flex flex-col md:flex-row gap-6 my-6 overflow-y-auto flex-grow">
                    
                    <div className="w-full md:w-1/3 flex flex-col gap-6 sticky top-0 self-start border-r border-dotted border-slate-200 pr-4">
                        <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                            <img 
                                src={data.img} 
                                alt={`${data.company} logo`} 
                                className="w-20 h-20 object-cover" 
                            />
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">{data.jobtitle}</h2>
                                <p className="text-sm text-slate-500">{data.company}</p>
                            </div>
                        </div>

                        <div className="flex bg-white flex-col gap-2  text-sm text-slate-600 bg-slate-50 p-4  border-slate-100">
                            <h3 className="font-bold text-xl text-slate-800 mb-1">Overview</h3>
                            <p><strong>Location:</strong> {data.location}</p>
                            <p><strong>Work Type:</strong> {data.workType}</p>
                            <p><strong>Contract:</strong> {data.workContract}</p>
                            <p><strong>Schedule:</strong> {data.workSchedule}</p>
                            {data.minSalary && (
                                <p><strong>Salary:</strong> {data.sign || '$'}{data.minSalary.toLocaleString()}</p>
                            )}
                        </div>
                    </div>

                    <div className="w-full md:w-2/3 flex flex-col gap-4 bg-white">
                        {data.info && data.info.map((info, index) => (
                            <div key={index} className="flex flex-col gap-4  text-slate-700 ">
                                <div className="bg-slate-50 p-4 rounded-xl bg-white border border-slate-100 ">
                                    <h3 className="font-bold text-slate-800 mb-2">Responsibilities</h3>
                                    <p className="text-sm leading-relaxed whitespace-pre-line">{info.responsibility}</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl border bg-white border-slate-100">
                                    <h3 className="font-bold text-slate-800 mb-2">About the Role</h3>
                                    <p className="text-sm leading-relaxed whitespace-pre-line">{info.about}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                    <button 
                        onClick={() => {
                            console.log("Applied from modal for:", data.jobtitle);
                            onClose();
                        }}
                        className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition cursor-pointer shadow-sm"
                    >
                        Apply Now
                    </button>
                </div>
            </div>
        </div>
    );
};