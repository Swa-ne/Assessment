'use client';
import { FormRoutes } from '@/constants/static';
import { usePathname } from 'next/navigation';
import path from 'path';

const pages = [
    {
        title: 'BUSINESS INFORMATION',
        link: FormRoutes.BUSINESS_INFORMATION,
    },
    {
        title: 'BUSINESS ADDRESS',
        link: FormRoutes.BUSINESS_ADDRESS,
    },
    {
        title: 'BUSINESS HOURS',
        link: FormRoutes.BUSINESS_HOURS,
    },
    {
        title: 'SERVICE OFFERINGS',
        link: FormRoutes.SERVICE_OFFERINGS,
    },
    {
        title: 'COMPLETE',
        link: FormRoutes.COMPLETE,
    },
];

const ListFormBar = () => {
    const pathname = usePathname();
    const currentPath = path.basename(pathname);

    return (
        <div className='h-4/6 space-y-6'>
            {pages.map((page, i) => (
                <div className='flex items-center group' key={i + page.title}>
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors duration-200 lg:h-10 lg:w-10 lg:text-lg ${`/form/${currentPath}` === page.link ? 'border-accent-500 bg-accent-500 text-white' : 'border-gray-300 bg-gray-100 text-gray-500 group-hover:border-accent-500 group-hover:text-accent-500'}`}>{i + 1}</span>
                    <span className={`text-md md:text-lg ml-4 transition-colors duration-200 ${`/form/${currentPath}` === page.link ? 'font-bold text-text' : 'font-light text-text group-hover:text-text'}`}>{page.title}</span>
                </div>
            ))}
        </div>
    );
};

export default ListFormBar;
