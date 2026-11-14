import { NavLink } from "react-router-dom";
import { EmployerNavData } from "../../component-data/Employer";

export const EmployerNav = () => {

    const logoItem = EmployerNavData.find((item) => item.img);
    const navLinks = EmployerNavData.filter((item) => !item.img);

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            
                {logoItem && (
                    <NavLink 
                        to={logoItem.link || "/"} 
                        title={logoItem.title}
                        className="flex items-center shrink-0"
                    >
                        <img 
                            src={logoItem.img} 
                            alt={logoItem.title} 
                            className="h-16 w-auto object-contain" 
                        />
                    </NavLink>
                )}

                {/* Right Side: Navigation Links */}
                <div className="flex items-center space-x-2 sm:space-x-6">
                    {navLinks.map((item) => (
                        <NavLink
                            key={item.id}
                            to={item.link}
                            title={item.title}
                            className={({ isActive }) =>
                                `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                                    isActive
                                        ? "bg-blue-50 text-blue-600 font-semibold"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                }`
                            }
                        >
                            {item.title}
                        </NavLink>
                    ))}
                </div>

            </nav>
        </header>
    );
};