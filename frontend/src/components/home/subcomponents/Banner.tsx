import bg from '../../../assets/bg.jpg';
import { headingData, cardsData, midContentData } from '../../../component-data/BannerData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Banner = () => {
    return (
        <div className="flex flex-col lg:flex-row w-full min-h-96">
            {/* Content column */}
            <div className="w-full min-w-0 lg:w-[45%] flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
                {/* Heading */}
                <div className="flex items-center">
                    {headingData.map((data) => (
                        <div key={data.id} className="text-3xl sm:text-4xl lg:text-5xl font-sans leading-tight">
                            <h5>{data.title}</h5>
                        </div>
                    ))}
                </div>

                {/* Mid content */}
                <div className="flex items-center">
                    {midContentData.map((data) => (
                        <div key={data.id} className="text-sm sm:text-base font-sans">
                            <h5>{data.title}</h5>
                        </div>
                    ))}
                </div>

                {/* Cards: 2 -> 4 -> 2 -> 4 */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3">
                    {cardsData.map((data) => (
                        <div
                            key={data.id}
                            className="h-full bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col justify-center items-center text-center p-3 sm:p-4 gap-2"
                        >
                            <FontAwesomeIcon icon={data.icon} className="text-blue-500 text-xl mb-1" />
                            <h3 className="font-bold text-gray-800 text-xs">{data.title}</h3>
                            <p className="text-xs text-gray-500 leading-relaxed">{data.content}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Image column */}
            <div
                className="w-full lg:w-[55%] h-64 sm:h-80 lg:h-auto bg-no-repeat bg-contain bg-center order-first lg:order-none"
                style={{ backgroundImage: `url(${bg})` }}
                role="img"
                aria-label="Banner illustration"
            />
        </div>
    );
};