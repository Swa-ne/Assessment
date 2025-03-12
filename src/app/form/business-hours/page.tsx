'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useRouter } from 'next/navigation';
import { FormRoutes } from '@/constants/static';
import { useFormContext } from '@/context/form_context';

const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Invalid time format (HH:MM)');

const formSchema = z.object({
    MondayOpeningTime: timeSchema,
    MondayClosingTime: timeSchema,
    TuesdayOpeningTime: timeSchema,
    TuesdayClosingTime: timeSchema,
    WednesdayOpeningTime: timeSchema,
    WednesdayClosingTime: timeSchema,
    ThursdayOpeningTime: timeSchema,
    ThursdayClosingTime: timeSchema,
    FridayOpeningTime: timeSchema,
    FridayClosingTime: timeSchema,
    SaturdayOpeningTime: timeSchema,
    SaturdayClosingTime: timeSchema,
    SundayOpeningTime: timeSchema,
    SundayClosingTime: timeSchema,
});

type FormSchemaKeys = keyof z.infer<typeof formSchema>;

const BusinessHoursForm = () => {
    const router = useRouter();
    const { formData, setFormData } = useFormContext();

    const defaultValues = formData.businessHours.businessHoursData.reduce((acc, dayData) => {
        const dayName = dayData.day_name;
        acc[`${dayName}OpeningTime` as FormSchemaKeys] = dayData.open_time.slice(0, 5);
        acc[`${dayName}ClosingTime` as FormSchemaKeys] = dayData.close_time.slice(0, 5);
        return acc;
    }, {} as Record<FormSchemaKeys, string>);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const businessHoursData = Object.keys(values).reduce((acc, key) => {
                const day = key.replace(/OpeningTime|ClosingTime/, '');
                const type = key.includes('OpeningTime') ? 'open_time' : 'close_time';
                const time = values[key as FormSchemaKeys];

                const existingDayIndex = acc.findIndex((item) => item.day_name === day);
                if (existingDayIndex !== -1) {
                    acc[existingDayIndex][type] = time + ':00';
                } else {
                    acc.push({ day_name: day, open_time: '', close_time: '', [type]: time + ':00' });
                }
                return acc;
            }, [] as { day_name: string; open_time: string; close_time: string }[]);

            setFormData({ ...formData, businessHours: { businessHoursData } });
            router.push(FormRoutes.SERVICE_OFFERINGS);
        } catch (error) {
            console.error('Form submission error', error);
        }
    }

    function goBack() {
        router.push(FormRoutes.BUSINESS_ADDRESS);
    }

    function handleTimeChange(type: 'hour' | 'minute', value: string, key: string) {
        const currentTime = form.getValues(key as FormSchemaKeys) || '00:00';
        const [currentHour, currentMinute] = currentTime.split(':');

        let newHour = currentHour;
        let newMinute = currentMinute;

        if (type === 'hour') {
            newHour = value.padStart(2, '0');
        } else if (type === 'minute') {
            newMinute = value.padStart(2, '0');
        }

        const newTime = `${newHour}:${newMinute}`;
        form.setValue(key as FormSchemaKeys, newTime);
    }

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='w-full max-w-4xl mx-auto py-10'>
                <div className='space-y-8'>
                    {daysOfWeek.map((day) => {
                        const openingTimeKey = `${day}OpeningTime` as FormSchemaKeys;
                        const closingTimeKey = `${day}ClosingTime` as FormSchemaKeys;

                        return (
                            <div key={day} className='grid grid-cols-1 md:grid-cols-3 gap-6 items-center'>
                                <h3 className='text-lg font-semibold'>{day}</h3>
                                <div className='space-y-2'>
                                    <FormField
                                        control={form.control}
                                        name={openingTimeKey}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Opening Time</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button className={`w-full justify-between text-left font-normal border border-gray-400 hover:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 ${!field.value && 'text-muted-foreground'}`}>
                                                                {field.value ? field.value : <span>HH:mm</span>}
                                                                <CalendarIcon className='h-4 w-4 opacity-50' />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className='w-auto p-0'>
                                                        <div className='flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x'>
                                                            <ScrollArea className='w-64 sm:w-auto'>
                                                                <div className='flex sm:flex-col p-2'>
                                                                    {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                                                                        <Button key={hour} size='icon' variant={field.value?.startsWith(String(hour).padStart(2, '0')) ? 'default' : 'ghost'} className='sm:w-full shrink-0 aspect-square' onClick={() => handleTimeChange('hour', hour.toString(), openingTimeKey)}>
                                                                            {String(hour).padStart(2, '0')}
                                                                        </Button>
                                                                    ))}
                                                                </div>
                                                                <ScrollBar orientation='horizontal' className='sm:hidden' />
                                                            </ScrollArea>
                                                            <ScrollArea className='w-64 sm:w-auto'>
                                                                <div className='flex sm:flex-col p-2'>
                                                                    {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                                                                        <Button key={minute} size='icon' variant={field.value?.endsWith(String(minute).padStart(2, '0')) ? 'default' : 'ghost'} className='sm:w-full shrink-0 aspect-square' onClick={() => handleTimeChange('minute', String(minute), openingTimeKey)}>
                                                                            {String(minute).padStart(2, '0')}
                                                                        </Button>
                                                                    ))}
                                                                </div>
                                                                <ScrollBar orientation='horizontal' className='sm:hidden' />
                                                            </ScrollArea>
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <FormField
                                        control={form.control}
                                        name={closingTimeKey}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Closing Time</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button className={`w-full justify-between text-left font-normal border border-gray-400 hover:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 ${!field.value && 'text-muted-foreground'}`}>
                                                                {field.value ? field.value : <span>HH:mm</span>}
                                                                <CalendarIcon className='h-4 w-4 opacity-50' />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className='w-auto p-0'>
                                                        <div className='flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x'>
                                                            <ScrollArea className='w-64 sm:w-auto'>
                                                                <div className='flex sm:flex-col p-2'>
                                                                    {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                                                                        <Button key={hour} size='icon' variant={field.value?.startsWith(String(hour).padStart(2, '0')) ? 'default' : 'ghost'} className='sm:w-full shrink-0 aspect-square' onClick={() => handleTimeChange('hour', hour.toString(), closingTimeKey)}>
                                                                            {String(hour).padStart(2, '0')}
                                                                        </Button>
                                                                    ))}
                                                                </div>
                                                                <ScrollBar orientation='horizontal' className='sm:hidden' />
                                                            </ScrollArea>
                                                            <ScrollArea className='w-64 sm:w-auto'>
                                                                <div className='flex sm:flex-col p-2'>
                                                                    {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                                                                        <Button key={minute} size='icon' variant={field.value?.endsWith(String(minute).padStart(2, '0')) ? 'default' : 'ghost'} className='sm:w-full shrink-0 aspect-square' onClick={() => handleTimeChange('minute', String(minute), closingTimeKey)}>
                                                                            {String(minute).padStart(2, '0')}
                                                                        </Button>
                                                                    ))}
                                                                </div>
                                                                <ScrollBar orientation='horizontal' className='sm:hidden' />
                                                            </ScrollArea>
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className='flex justify-end gap-4 mt-8'>
                    <Button type='button' onClick={goBack} className='text-md md:text-lg font-medium bg-gray-500 hover:bg-gray-600'>
                        Back
                    </Button>
                    <Button type='submit' className='text-md md:text-lg font-medium bg-gray-500 hover:bg-gray-600'>
                        Next
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default BusinessHoursForm;
