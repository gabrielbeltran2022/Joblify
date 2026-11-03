import {footerData} from '../../component-data/FooterData'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons';

export const Footer = () => {
    return (
        <footer className='border-t border-slate-200 '>
            {footerData.map((item) => (
                <div key={item.id} className="w-full flex justify-around items-center p-5 ">
                    <div>
                        <ul className="flex gap-6 items-center">
                            {item.links.map((subItem) => (
                                <li key={subItem.id}>
                                    <a 
                                        href={subItem.link} 
                                        className="text-gray-700 hover:text-blue-500 transition-colors"
                                    >
                                        {subItem.text}
                                    </a>
                                </li>
                            ))}
                            <span className="text-sm text-gray-500">{item.copyright}</span>
                        </ul>
                    </div>
                </div>
            ))}
        </footer>
    );
};