'use client';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { FormRoutes } from '@/constants/static';
import { useEffect } from 'react';
import { useFormContext } from '@/context/form_context';

const formSchema = z.object({
    'buildingNumber': z.string().min(1),
    'streetName': z.string().min(1),
    'unitNumber': z.string().min(1),
    'postalCode': z.string().min(1),
    'fullAddress': z.string().min(1),
    'latitude': z.coerce.number().min(1),
    'longitude': z.coerce.number().min(1),
});

const BusinessAddress = () => {
    const router = useRouter();
    const { formData, setFormData } = useFormContext();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: formData.businessAddress,
    });

    const buildingNumber = useWatch({ control: form.control, name: 'buildingNumber' }) ?? '';
    const streetName = useWatch({ control: form.control, name: 'streetName' }) ?? '';
    const unitNumber = useWatch({ control: form.control, name: 'unitNumber' }) ?? '';
    const postalCode = useWatch({ control: form.control, name: 'postalCode' }) ?? '';

    useEffect(() => {
        const fullAddress = `${streetName ? `${streetName}, ` : ''}${unitNumber ? `${unitNumber}, ` : ''}${buildingNumber ? `${buildingNumber}, Singapore ` : ''}${postalCode}`;
        form.setValue('fullAddress', fullAddress);
    }, [buildingNumber, streetName, unitNumber, postalCode, form]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setFormData({ ...formData, businessAddress: values });
            router.push(FormRoutes.BUSINESS_HOURS);
        } catch (error) {
            console.error('Form submission error', error);
        }
    }
    function goBack() {
        router.push(FormRoutes.BUSINESS_INFORMATION);
    }
    function getLatLang() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                form.setValue('latitude', latitude);
                form.setValue('longitude', longitude);
            },
            (error) => console.error('Error getting location', error)
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-12 max-w-3xl mx-auto py-10'>
                <div className='grid grid-cols-12 gap-4'>
                    <div className='col-span-6'>
                        <FormField
                            control={form.control}
                            name='buildingNumber'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Building Name/Number</FormLabel>
                                    <FormControl>
                                        <Input className='h-10' placeholder='Building Name/Number' type='text' {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className='col-span-6'>
                        <FormField
                            control={form.control}
                            name='streetName'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Street Name</FormLabel>
                                    <FormControl>
                                        <Input className='h-10' placeholder='Street Name' type='text' {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className='grid grid-cols-12 gap-4'>
                    <div className='col-span-6'>
                        <FormField
                            control={form.control}
                            name='unitNumber'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Unit Number</FormLabel>
                                    <FormControl>
                                        <Input className='h-10' placeholder='Unit Number' type='text' {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className='col-span-6'>
                        <FormField
                            control={form.control}
                            name='postalCode'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Postal Code</FormLabel>
                                    <FormControl>
                                        <Input className='h-10 no-arrows' placeholder='Postal Code' type='number' {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name='fullAddress'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Address</FormLabel>
                            <FormControl>
                                <Input className='h-10' placeholder='Full Address' disabled type='text' {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className='grid grid-cols-12 gap-4'>
                    <div className='col-span-4'>
                        <FormField
                            control={form.control}
                            name='latitude'
                            render={({ field }) => (
                                <>
                                    <FormItem>
                                        <FormLabel>latitude</FormLabel>
                                        <FormControl>
                                            <Input className='h-10 no-arrows' placeholder='latitude' type='number' {...field} />
                                        </FormControl>
                                    </FormItem>
                                    <FormMessage />
                                </>
                            )}
                        />
                    </div>

                    <div className='col-span-4'>
                        <FormField
                            control={form.control}
                            name='longitude'
                            render={({ field }) => (
                                <>
                                    <FormItem>
                                        <FormLabel>longitude</FormLabel>
                                        <FormControl>
                                            <Input className='h-10 no-arrows' placeholder='longitude' type='number' {...field} />
                                        </FormControl>
                                    </FormItem>
                                    <FormMessage />
                                </>
                            )}
                        />
                    </div>

                    <div className='col-span-2 flex items-end'>
                        <Button className='bg-secondary hover:bg-[rgba(0,0,0,0.5)] h-10' type='button' onClick={getLatLang}>
                            Locate Me
                        </Button>
                    </div>
                </div>
                <div className='flex justify-end'>
                    <Button className='text-md md:text-lg font-medium bg-gray-500 hover:bg-gray-600' type='button' onClick={goBack}>
                        Back
                    </Button>
                    <Button className='text-md md:text-lg font-medium bg-gray-500 hover:bg-gray-600' type='submit'>
                        Next
                    </Button>
                </div>
            </form>
        </Form>
    );
};
export default BusinessAddress;
