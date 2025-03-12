'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { FormDataType, ServicesType, useFormContext } from '@/context/form_context';
import { FormRoutes } from '@/constants/static';

type PricingLookup = {
    [level: string]: {
        [classSize: string]: string;
    };
};

const pricingLookup: PricingLookup = {
    'Primary 1': { 'Big Group': '20', 'Small Group': '36.67', '1 to 1': '45' },
    'Primary 2': { 'Big Group': '20', 'Small Group': '36.67', '1 to 1': '45' },
    'Primary 3': { 'Big Group': '20', 'Small Group': '36.67', '1 to 1': '45' },
    'Primary 4': { 'Big Group': '25', 'Small Group': '40', '1 to 1': '45' },
    'Primary 5': { 'Big Group': '25', 'Small Group': '40', '1 to 1': '45' },
    'Primary 6': { 'Big Group': '25', 'Small Group': '40', '1 to 1': '45' },
    'Secondary 1': { 'Big Group': '25', 'Small Group': '40', '1 to 1': '50' },
    'Secondary 2': { 'Big Group': '25', 'Small Group': '40', '1 to 1': '50' },
    'Secondary 3': { 'Big Group': '30', 'Small Group': '45', '1 to 1': '55' },
    'Secondary 4': { 'Big Group': '30', 'Small Group': '45', '1 to 1': '55' },
    'Secondary 5': { 'Big Group': '30', 'Small Group': '45', '1 to 1': '55' },
    'Junior College 1': { 'Big Group': '40', 'Small Group': '60', '1 to 1': '100' },
    'Junior College 2': { 'Big Group': '40', 'Small Group': '60', '1 to 1': '100' },
};

const formSchema = z.object({
    level: z.string().min(1, { message: 'Level is required' }),
    subject: z.string().min(1, { message: 'Subject is required' }),
    stream: z.string().min(1, { message: 'Stream is required' }),
    classSize: z.string().min(1, { message: 'Class size is required' }),
    deliveryMode: z.string().min(1, { message: 'Delivery mode is required' }),
    price: z.string().min(1, { message: 'Price is required' }),
});

const ServiceOfferings = () => {
    const router = useRouter();
    const { formData, setFormData } = useFormContext();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            level: formData.services.servicesData[0]?.tags.find((tag: string) => tag.startsWith('Primary') || tag.startsWith('Secondary') || tag.startsWith('Junior College')) || '',
            subject: formData.services.servicesData[0]?.tags.find((tag: string) => ['Math', 'English', 'Science', 'Physics', 'Chemistry', 'Biology'].includes(tag)) || '',
            stream: formData.services.servicesData[0]?.tags.find((tag: string) => ['G1', 'G2', 'G3', 'Express', 'NA', 'NT'].includes(tag)) || '',
            classSize: formData.services.servicesData[0]?.tags.find((tag: string) => ['Big Group', 'Small Group', '1 to 1'].includes(tag)) || '',
            deliveryMode: formData.services.servicesData[0]?.tags.find((tag: string) => ['Onsite', 'Online', 'Hybrid'].includes(tag)) || '',
            price: formData.services.servicesData[0]?.pricing.price || '',
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        try {
            const newService = {
                name: `${values.level} ${values.subject} Tuition`,
                description: `${values.level} ${values.subject} Tuition`,
                tags: [values.level, values.subject, values.stream, values.classSize, values.deliveryMode],
                pricing: {
                    price: values.price,
                    currency: 'SGD',
                    pricing_unit: 'hour',
                    variant_name: 'Standard Rate',
                },
            } as ServicesType;

            setFormData(
                (prevData: FormDataType): FormDataType => ({
                    ...prevData,
                    services: {
                        ...prevData.services,
                        servicesData: [...prevData.services.servicesData, newService],
                    },
                })
            );

            form.reset();
        } catch (error) {
            console.error('Form submission error', error);
        }
    };

    const calculatePrice = () => {
        const level = form.getValues('level');
        const classSize = form.getValues('classSize');
        const price = pricingLookup[level]?.[classSize] || '';
        form.setValue('price', price);
    };

    const goBack = () => {
        router.push(FormRoutes.BUSINESS_HOURS);
    };
    const goNext = () => {
        router.push(FormRoutes.COMPLETE);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 max-w-3xl mx-auto py-10'>
                <div className='grid grid-cols-12 gap-6'>
                    <FormField
                        control={form.control}
                        name='level'
                        render={({ field }) => (
                            <FormItem className='space-y-2 col-span-12 md:col-span-4'>
                                <Label htmlFor='level' className='text-md md:text-lg font-medium'>
                                    Level
                                </Label>
                                <Select
                                    value={field.value}
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        calculatePrice();
                                    }}
                                >
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder='Select level' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='Primary 1'>Primary 1</SelectItem>
                                        <SelectItem value='Primary 2'>Primary 2</SelectItem>
                                        <SelectItem value='Secondary 1'>Secondary 1</SelectItem>
                                        <SelectItem value='Secondary 2'>Secondary 2</SelectItem>
                                        <SelectItem value='Junior College 1'>Junior College 1</SelectItem>
                                        <SelectItem value='Junior College 2'>Junior College 2</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='subject'
                        render={({ field }) => (
                            <FormItem className='space-y-2 col-span-12 md:col-span-4'>
                                <Label htmlFor='subject' className='text-md md:text-lg font-medium'>
                                    Subject
                                </Label>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder='Select subject' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='Math'>Math</SelectItem>
                                        <SelectItem value='English'>English</SelectItem>
                                        <SelectItem value='Science'>Science</SelectItem>
                                        <SelectItem value='Physics'>Physics</SelectItem>
                                        <SelectItem value='Chemistry'>Chemistry</SelectItem>
                                        <SelectItem value='Biology'>Biology</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='stream'
                        render={({ field }) => (
                            <FormItem className='space-y-2 col-span-12 md:col-span-4'>
                                <Label htmlFor='stream' className='text-md md:text-lg font-medium'>
                                    Stream
                                </Label>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder='Select stream' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='G1'>G1</SelectItem>
                                        <SelectItem value='G2'>G2</SelectItem>
                                        <SelectItem value='G3'>G3</SelectItem>
                                        <SelectItem value='Express'>Express</SelectItem>
                                        <SelectItem value='NA'>NA</SelectItem>
                                        <SelectItem value='NT'>NT</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className='grid grid-cols-12 gap-6'>
                    <FormField
                        control={form.control}
                        name='classSize'
                        render={({ field }) => (
                            <FormItem className='col-span-12 md:col-span-6'>
                                <div className='space-y-2'>
                                    <Label htmlFor='classSize' className='text-md md:text-lg font-medium'>
                                        Class Size
                                    </Label>
                                    <Select
                                        value={field.value}
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            calculatePrice();
                                        }}
                                    >
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select class size' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='Big Group'>Big Group</SelectItem>
                                            <SelectItem value='Small Group'>Small Group</SelectItem>
                                            <SelectItem value='1 to 1'>1 to 1</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='deliveryMode'
                        render={({ field }) => (
                            <FormItem className='col-span-12 md:col-span-6'>
                                <div className='space-y-2'>
                                    <Label htmlFor='deliveryMode' className='text-md md:text-lg font-medium'>
                                        Mode of Delivery
                                    </Label>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select mode of delivery' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='Onsite'>Onsite</SelectItem>
                                            <SelectItem value='Online'>Online</SelectItem>
                                            <SelectItem value='Hybrid'>Hybrid</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name='price'
                    render={({ field }) => (
                        <FormItem className='space-y-2'>
                            <Label htmlFor='price' className='text-md md:text-lg font-medium'>
                                Price
                            </Label>
                            <FormControl>
                                <Input id='price' {...field} readOnly placeholder='Price will be calculated automatically' className='text-md md:text-lg' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className='flex justify-between gap-4'>
                    <Button type='submit' className='text-md md:text-lg font-medium bg-text text-primary ml-2.5 hover:bg-[rgba(0,0,0,0.5)]'>
                        Add Service
                    </Button>
                    <div className='flex justify-end gap-4'>
                        <Button className='text-md md:text-lg font-medium bg-gray-500 hover:bg-gray-600' type='button' onClick={goBack}>
                            Back
                        </Button>
                        <Button className='text-md md:text-lg font-medium bg-gray-500 hover:bg-gray-600' type='button' onClick={goNext}>
                            Next
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
};

export default ServiceOfferings;
