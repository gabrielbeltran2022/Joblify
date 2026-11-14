import { footerData } from '../../component-data/FooterData';

export const Footer = () => {
    return (
        <footer className="border-t border-slate-200">
            {footerData.map((item) => (
                <div
                    key={item.id}
                    className="w-full flex flex-col items-center gap-4 px-4 py-5 sm:px-6 md:flex-row md:justify-between lg:px-8"
                >
                    <ul className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
                        {item.links.map((subItem) => (
                            <li key={subItem.id}>
                                <a
                                    href={subItem.link}
                                    className="text-sm sm:text-base text-gray-700 hover:text-blue-500 transition-colors"
                                >
                                    {subItem.text}
                                </a>
                            </li>
                        ))}
                    </ul>

                    <span className="text-sm text-gray-500 text-center md:text-right">
                        {item.copyright}
                    </span>
                </div>
            ))}
        </footer>
    );
};