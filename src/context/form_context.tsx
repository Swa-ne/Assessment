'use client';

import { createContext, useContext, useState } from 'react';

export type FormDataType = {
    businessInfo: {
        businessName: string;
        businessDescription: string;
        businessContactEmail: string;
        businessGooglePlaceId: string;
        businessFacebookPageId: string;
        businessFacebookPageLink: string;
        businessInstagramPageLink: string;
        businessWhatsappLink: string;
        businessAverageRating: number;
    };
    businessAddress: {
        buildingNumber: string;
        streetName: string;
        unitNumber: string;
        postalCode: string;
        fullAddress: string;
        latitude: number;
        longitude: number;
        iso_code?: 'SG-01';
        planningAreaName?: 'Bishan';
    };
    businessHours: {
        businessHoursData: {
            day_name: string;
            open_time: string;
            close_time: string;
        }[];
    };
    services: {
        servicesData: {
            name: string;
            description: string;
            tags: string[];
            pricing: {
                price: string;
                currency?: string;
                pricing_unit?: string;
                variant_name?: string;
            };
        }[];
    };
};

export type ServicesType = FormDataType['services']['servicesData'][0];
type FormContextType = {
    formData: FormDataType;
    setFormData: (data: FormDataType | ((prevData: FormDataType) => FormDataType)) => void;
};
const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({ children }: { children: React.ReactNode }) => {
    const [formData, setFormData] = useState<FormDataType>({
        businessInfo: {
            businessName: '',
            businessDescription: '',
            businessContactEmail: '',
            businessGooglePlaceId: '',
            businessFacebookPageId: '',
            businessFacebookPageLink: '',
            businessInstagramPageLink: '',
            businessWhatsappLink: '',
            businessAverageRating: 0,
        },
        businessAddress: {
            buildingNumber: '',
            streetName: '',
            unitNumber: '',
            postalCode: '',
            fullAddress: '',
            latitude: 0,
            longitude: 0,
            iso_code: 'SG-01',
            planningAreaName: 'Bishan',
        },
        businessHours: {
            businessHoursData: [],
        },
        services: {
            servicesData: [],
        },
    });
    const updateFormData: FormContextType['setFormData'] = (data) => {
        setFormData((prevData) => (typeof data === 'function' ? data(prevData) : data));
    };
    return <FormContext.Provider value={{ formData, setFormData: updateFormData }}>{children}</FormContext.Provider>;
};

export const useFormContext = () => {
    const context = useContext(FormContext);
    if (!context) {
        throw new Error('useFormContext must be used within a FormProvider');
    }
    return context;
};
