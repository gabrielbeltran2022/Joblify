import bg from '../../../assets/bg.jpg';
import { headingData, cardsData,midContentData} from '../../../component-data/BannerData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export const Banner = () => {
    return (
        <div className="flex w-full h-96 ">
            <div className="w-[45%] h-full  flex flex-col p-8">
                <div className="flex-1 flex items-center">
                    {headingData.map((data) => (
                            <div key={data.id} className='text-5xl font-sans'>
                                <h5>{data.title}</h5>
                            </div>
                    ))}
                </div>
                <div className="flex-1 flex items-center">
                    {midContentData.map((data) => (
                            <div key={data.id} className='text-sm font-sans'>
                                <h5>{data.title}</h5>
                            </div>
                    ))}
                </div>
                <div className="flex-1 flex items-center">
                    {cardsData.map((data) => (
                    <div 
                        key={data.id} 
                        className="w-[200px] h-full bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col justify-center items-center text-center p-4 m-1 gap-2"
                    >
                        <FontAwesomeIcon icon={data.icon} className="text-blue-500 text-1xl mb-1" />
                        <h3 className="font-bold text-gray-800 text-[9px]">{data.title}</h3>
                        <p className="text-[9px] text-gray-500 leading-relaxed">{data.content}</p>   
                    </div>      
                ))}
                </div>
            </div>
            <div 
                className="w-[55%] h-full bg-no-repeat bg-contain bg-center p-8 flex flex-col justify-center text-white"
                style={{ backgroundImage: `url(${bg})` }}
            >
            </div>

        </div>
    );
};