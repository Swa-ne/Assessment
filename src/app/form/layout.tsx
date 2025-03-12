'use client';

import Sidebar from '@/components/Sidebar';
import { FormRoutes } from '@/constants/static';
import { FormDataType, FormProvider, useFormContext } from '@/context/form_context';
import { useRouter, usePathname } from 'next/navigation';
import React, { ReactNode, useEffect } from 'react';

const FormLayout = ({ children }: { children: ReactNode }) => {
    return (
        <FormProvider>
            <ProtectedLayout>{children}</ProtectedLayout>
        </FormProvider>
    );
};

const ProtectedLayout = ({ children }: { children: ReactNode }) => {
    const { formData } = useFormContext();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const incompleteStep = getFirstIncompleteStep(formData);

        if (incompleteStep && isStepAfter(pathname, incompleteStep)) {
            router.replace(incompleteStep);
        }
    }, [formData, pathname, router]);

    return (
        <div className='w-full h-full lg:w-11/12 lg:h-5/6 flex bg-primary rounded-2xl p-10'>
            <Sidebar />
            <main className='w-2/3 overflow-y-auto scrollbar-hide'>{children}</main>
        </div>
    );
};

const getFirstIncompleteStep = (formData: FormDataType): string | null => {
    const { businessInfo, businessAddress, businessHours, services } = formData;

    if (!businessInfo.businessName || !businessInfo.businessDescription || !businessInfo.businessContactEmail || !businessInfo.businessGooglePlaceId || !businessInfo.businessFacebookPageId || !businessInfo.businessFacebookPageLink || !businessInfo.businessInstagramPageLink || !businessInfo.businessWhatsappLink || !businessInfo.businessAverageRating) {
        return FormRoutes.BUSINESS_INFORMATION;
    }

    if (!businessAddress.buildingNumber || !businessAddress.streetName || !businessAddress.unitNumber || !businessAddress.postalCode || !businessAddress.fullAddress || !businessAddress.latitude || !businessAddress.longitude) {
        return FormRoutes.BUSINESS_ADDRESS;
    }

    if (businessHours.businessHoursData.length === 0) {
        return FormRoutes.BUSINESS_HOURS;
    }

    if (services.servicesData.length === 0) {
        return FormRoutes.SERVICE_OFFERINGS;
    }

    return null;
};

const isStepAfter = (currentStep: string, restrictedStep: string) => {
    const stepOrder: string[] = [FormRoutes.BUSINESS_INFORMATION, FormRoutes.BUSINESS_ADDRESS, FormRoutes.BUSINESS_HOURS, FormRoutes.SERVICE_OFFERINGS];

    return stepOrder.indexOf(currentStep) > stepOrder.indexOf(restrictedStep);
};

export default FormLayout;
