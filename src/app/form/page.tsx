import { FormRoutes } from '@/constants/static';
import { redirect } from 'next/navigation';

const FormPage = () => {
    redirect(FormRoutes.BUSINESS_INFORMATION);
};

export default FormPage;
