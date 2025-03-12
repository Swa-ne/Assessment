'use client';
import { useFormContext } from '@/context/form_context';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { FormRoutes } from '@/constants/static';
import { useState } from 'react';

const Complete = () => {
    const router = useRouter();
    const { formData } = useFormContext();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const goBack = () => {
        router.push(FormRoutes.SERVICE_OFFERINGS);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);

        try {
            const payload = {
                businessInfo: formData.businessInfo,
                businessAddress: formData.businessAddress,
                businessHours: formData.businessHours,
                services: formData.services,
            };

            const response = await fetch('/api/form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to submit form');
            }

            const result = await response.json();
            console.log('Form submitted successfully:', result);

            router.push('/success');
        } catch (error) {
            console.error('Error submitting form:', error);
            setError('An error occurred while submitting the form. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='max-w-4xl mx-auto p-6 space-y-8'>
            <h1 className='text-2xl font-bold'>Business Information Summary</h1>

            <Card className='bg-primary border-primary text-text shadow-accent'>
                <CardHeader>
                    <CardTitle className='text-xl font-semibold'>Business Information</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <p>
                        <strong>Name:</strong> {formData.businessInfo.businessName}
                    </p>
                    <p>
                        <strong>Description:</strong> {formData.businessInfo.businessDescription}
                    </p>
                    <p>
                        <strong>Contact Email:</strong> {formData.businessInfo.businessContactEmail}
                    </p>
                    <p>
                        <strong>Google Place ID:</strong> {formData.businessInfo.businessGooglePlaceId}
                    </p>
                    <p>
                        <strong>Facebook Page ID:</strong> {formData.businessInfo.businessFacebookPageId}
                    </p>
                    <p>
                        <strong>Facebook Link:</strong> {formData.businessInfo.businessFacebookPageLink}
                    </p>
                    <p>
                        <strong>Instagram Link:</strong> {formData.businessInfo.businessInstagramPageLink}
                    </p>
                    <p>
                        <strong>WhatsApp Link:</strong> {formData.businessInfo.businessWhatsappLink}
                    </p>
                    <p>
                        <strong>Average Rating:</strong> {formData.businessInfo.businessAverageRating}
                    </p>
                </CardContent>
            </Card>

            <Card className='bg-primary border-primary text-text shadow-accent'>
                <CardHeader>
                    <CardTitle className='text-xl font-semibold'>Business Address</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <p>
                        <strong>Building Number:</strong> {formData.businessAddress.buildingNumber}
                    </p>
                    <p>
                        <strong>Street Name:</strong> {formData.businessAddress.streetName}
                    </p>
                    <p>
                        <strong>Unit Number:</strong> {formData.businessAddress.unitNumber}
                    </p>
                    <p>
                        <strong>Postal Code:</strong> {formData.businessAddress.postalCode}
                    </p>
                    <p>
                        <strong>Full Address:</strong> {formData.businessAddress.fullAddress}
                    </p>
                    <p>
                        <strong>Latitude:</strong> {formData.businessAddress.latitude}
                    </p>
                    <p>
                        <strong>Longitude:</strong> {formData.businessAddress.longitude}
                    </p>
                    <p>
                        <strong>ISO Code:</strong> {formData.businessAddress.iso_code}
                    </p>
                    <p>
                        <strong>Planning Area:</strong> {formData.businessAddress.planningAreaName}
                    </p>
                </CardContent>
            </Card>

            <Card className='bg-primary border-primary text-text shadow-accent'>
                <CardHeader>
                    <CardTitle className='text-xl font-semibold'>Business Hours</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                    {formData.businessHours.businessHoursData.map((hour, index) => (
                        <div key={index}>
                            <p>
                                <strong>{hour.day_name}:</strong> {hour.open_time} - {hour.close_time}
                            </p>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card className='bg-primary border-primary text-text shadow-accent'>
                <CardHeader>
                    <CardTitle className='text-xl font-semibold'>Services</CardTitle>
                </CardHeader>
                <CardContent className='space-y-6'>
                    {formData.services.servicesData.map((service, index) => (
                        <div key={index} className='border-b pb-4 last:border-b-0'>
                            <p>
                                <strong>Service Name:</strong> {service.name}
                            </p>
                            <p>
                                <strong>Description:</strong> {service.description}
                            </p>
                            <p>
                                <strong>Tags:</strong> {service.tags.join(', ')}
                            </p>
                            <p>
                                <strong>Price:</strong> {service.pricing.price} {service.pricing.currency}
                            </p>
                            <p>
                                <strong>Unit:</strong> {service.pricing.pricing_unit}
                            </p>
                            <p>
                                <strong>Variant:</strong> {service.pricing.variant_name}
                            </p>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {error && <div className='text-red-500 text-center'>{error}</div>}

            <div className='flex justify-end gap-4'>
                <Button className='text-md md:text-lg font-medium bg-gray-500 hover:bg-gray-600' type='button' onClick={goBack} disabled={isSubmitting}>
                    Back
                </Button>
                <Button className='text-md md:text-lg font-medium bg-text text-primary ml-2.5 hover:bg-[rgba(0,0,0,0.5)]' type='button' onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
            </div>
        </div>
    );
};

export default Complete;
