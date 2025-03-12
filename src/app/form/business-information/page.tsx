'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormRoutes } from '@/constants/static';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Rating } from '@/components/ui/rating';
import { useFormContext } from '@/context/form_context';

const formSchema = z.object({
    'businessName': z.string().min(1),
    'businessDescription': z.string().min(10),
    'businessContactEmail': z.string().email(),
    'businessFacebookPageId': z.string().min(1),
    'businessFacebookPageLink': z.string().url(),
    'businessInstagramPageLink': z.string().url(),
    'businessWhatsappLink': z.string().url(),
    'businessGooglePlaceId': z.string().min(20).max(50),
    'businessAverageRating': z.number().min(1),
});
const BusinessInformation = () => {
    const router = useRouter();
    const { formData, setFormData } = useFormContext();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: formData.businessInfo,
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setFormData({ ...formData, businessInfo: values });
            router.push(FormRoutes.BUSINESS_ADDRESS);
        } catch (error) {
            console.error('Form submission error', error);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 w-full pb-10 h-full'>
                <div className='grid grid-cols-12 gap-4'>
                    <div className='col-span-6'>
                        <FormField
                            control={form.control}
                            name='businessName'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-md md:text-lg lg:text-xl font-medium'>Business Name</FormLabel>
                                    <FormControl>
                                        <Input className='h-10' placeholder='Business Name' type='text' {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='col-span-6'>
                        <FormField
                            control={form.control}
                            name='businessContactEmail'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-md md:text-lg lg:text-xl font-medium'>Email address</FormLabel>
                                    <FormControl>
                                        <Input className='h-10' placeholder='Email address' type='email' {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name='businessDescription'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-md md:text-lg lg:text-xl font-medium'>Business Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder='Business Description' className='w-full h-32 text-lg border rounded-lg resize-none' {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className='grid grid-cols-12 gap-4'>
                    <div className='col-span-6'>
                        <FormField
                            control={form.control}
                            name='businessGooglePlaceId'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-md md:text-lg lg:text-xl font-medium'>Google Place ID</FormLabel>
                                    <FormControl>
                                        <Input className='h-10' placeholder='Google Place ID' type='text' {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className='col-span-6'>
                        <FormField
                            control={form.control}
                            name='businessFacebookPageId'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-md md:text-lg lg:text-xl font-medium'>Facebook page ID</FormLabel>
                                    <FormControl>
                                        <Input className='h-10' placeholder='Facebook page ID' type='text' {...field} />
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
                            name='businessFacebookPageLink'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-md md:text-lg lg:text-xl font-medium'>Facebook page link</FormLabel>
                                    <FormControl>
                                        <Input className='h-10' placeholder='Facebook page link' type='url' {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='col-span-6'>
                        <FormField
                            control={form.control}
                            name='businessInstagramPageLink'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-md md:text-lg lg:text-xl font-medium'>Instagram page link</FormLabel>
                                    <FormControl>
                                        <Input className='h-10' placeholder='Instagram page link' type='url' {...field} />
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
                            name='businessWhatsappLink'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-md md:text-lg lg:text-xl font-medium'>WhatsApp Link</FormLabel>
                                    <FormControl>
                                        <Input className='h-10' placeholder='WhatsApp Link' type='url' {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className='col-span-6'>
                        <FormField
                            control={form.control}
                            name='businessAverageRating'
                            render={({ field }) => (
                                <FormItem className='flex flex-col items-start'>
                                    <FormLabel className='text-md md:text-lg lg:text-xl font-medium'>Average Ratings</FormLabel>
                                    <FormControl>
                                        <Rating {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div className='flex justify-end'>
                    <Button type='submit' className='text-md md:text-lg font-medium bg-gray-500 hover:bg-gray-600'>
                        Next
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default BusinessInformation;
