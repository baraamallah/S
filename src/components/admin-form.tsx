
"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { fromZonedTime, zonedTimeToUtc } from "date-fns-tz";
import { Calendar as CalendarIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useBirthdayConfig, BirthdayConfig } from "@/hooks/use-birthday-config";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "./ui/separator";

const commonTimezones = [
  "UTC",
  "America/New_York",   // Eastern Time
  "America/Chicago",    // Central Time
  "America/Denver",     // Mountain Time
  "America/Los_Angeles",// Pacific Time
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Australia/Sydney",
];

const formSchema = z.object({
  // Security
  adminPassword: z.string().min(1, "Admin password cannot be empty."),

  // Main Greeting Page
  date: z.date({
    required_error: "A date is required.",
  }),
  hour: z.coerce.number().min(0, "Hour must be between 0-23").max(23, "Hour must be between 0-23"),
  minute: z.coerce.number().min(0, "Minute must be between 0-59").max(59, "Minute must be between 0-59"),
  timezone: z.string().min(1, "Timezone cannot be empty."),
  password: z.string().min(1, "Password cannot be empty."),
  title: z.string().min(1, "Greeting title cannot be empty."),
  poem: z.string().min(1, "Poem cannot be empty."),
  backgroundImage: z.string().optional(),
  photoGallery: z.string().optional(),
  cakeText: z.string().min(1, "Cake text cannot be empty."),
  
  // Entry Page
  entryTitle: z.string().min(1, "Entry title cannot be empty."),
  entrySubtitle: z.string().min(1, "Entry subtitle cannot be empty."),
  entryButtonText: z.string().min(1, "Entry button text cannot be empty."),

  // Password Gate
  gateTitle: z.string().min(1, "Gate title cannot be empty."),
  gateSubtitle: z.string().min(1, "Gate subtitle cannot be empty."),
  gateTimerText: z.string().min(1, "Timer text cannot be empty."),
  gatePromptNow: z.string().min(1, "Prompt for 'time is up' cannot be empty."),
  gatePromptLater: z.string().min(1, "Prompt for 'early peek' cannot be empty."),
  gateButtonNow: z.string().min(1, "Button text for 'time is up' cannot be empty."),
  gateButtonLater: z.string().min(1, "Button text for 'early peek' cannot be empty."),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminForm() {
  const { config, saveConfig, isLoaded } = useBirthdayConfig();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        password: '',
        adminPassword: '',
        title: '',
        poem: '',
        backgroundImage: '',
        photoGallery: '',
        entryTitle: '',
        entrySubtitle: '',
        entryButtonText: '',
        gateTitle: '',
        gateSubtitle: '',
        gateTimerText: '',
        gatePromptNow: '',
        gatePromptLater: '',
        gateButtonNow: '',
        gateButtonLater: '',
        cakeText: '',
        hour: 0,
        minute: 0,
        timezone: 'America/New_York'
    },
  });

  useEffect(() => {
    if (isLoaded) {
      // The stored date is in UTC. We need to convert it to the "wall clock" time
      // in the stored timezone to display it correctly in the form.
      const savedUtcDate = new Date(config.date);
      const zonedDate = fromZonedTime(savedUtcDate, config.timezone);

      form.reset({
        ...config,
        date: zonedDate,
        hour: zonedDate.getHours(),
        minute: zonedDate.getMinutes(),
        timezone: config.timezone,
        poem: config.poem.replace(/<br \/>/g, "\n"),
        photoGallery: (config.photoGallery || []).join("\n"),
      });
    }
  }, [isLoaded, config, form]);

  async function onSubmit(values: FormValues) {
    // Take the "wall clock" time from the form...
    const wallClockDate = new Date(values.date);
    wallClockDate.setHours(values.hour);
    wallClockDate.setMinutes(values.minute);
    wallClockDate.setSeconds(0);
    wallClockDate.setMilliseconds(0);

    // ...and convert it from the selected timezone into a UTC date object.
    const utcDate = zonedTimeToUtc(wallClockDate, values.timezone);

    const newConfig: BirthdayConfig = {
      ...config,
      ...values,
      date: utcDate.toISOString(), // Store the correct, absolute UTC time
      timezone: values.timezone,
      poem: values.poem.replace(/\n/g, "<br />"),
      backgroundImage: values.backgroundImage || "",
      photoGallery: values.photoGallery ? values.photoGallery.split('\n').map(url => url.trim()).filter(url => url) : [],
    };
    
    try {
      await saveConfig(newConfig);
      toast({
        title: "Success!",
        description: "Your settings have been saved.",
      });
    } catch (error) {
      console.error("Firebase save error:", error);
      toast({
        title: "Error Saving Settings",
        description: "Could not save settings. Please check Firestore permissions and console for details.",
        variant: "destructive",
      });
    }
  }

  if (!isLoaded) {
    return <div>Loading admin settings...</div>;
  }

  return (
    <Card className="w-full max-w-2xl animate-in fade-in-50 duration-500 mb-8">
      <CardHeader>
        <CardTitle>Admin Settings</CardTitle>
        <CardDescription>Customize every part of the birthday surprise here.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            {/* Security Settings */}
            <div>
              <h3 className="text-lg font-medium mb-4">Security</h3>
              <div className="space-y-4">
                 <FormField control={form.control} name="adminPassword" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Page Password</FormLabel>
                    <FormControl><Input type="password" {...field} /></FormControl>
                    <FormDescription>The password to access this admin settings page.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>
            <Separator />
            
            {/* Entry Page Settings */}
            <div>
              <h3 className="text-lg font-medium mb-4">Entry Page</h3>
              <div className="space-y-4">
                <FormField control={form.control} name="entryTitle" render={({ field }) => (
                  <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="entrySubtitle" render={({ field }) => (
                  <FormItem><FormLabel>Subtitle</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="entryButtonText" render={({ field }) => (
                  <FormItem><FormLabel>Button Text</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            </div>
            <Separator />

            {/* Password Gate Settings */}
            <div>
              <h3 className="text-lg font-medium mb-4">Password Gate</h3>
              <div className="space-y-4">
                 <FormField control={form.control} name="gateTitle" render={({ field }) => (
                  <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="gateSubtitle" render={({ field }) => (
                  <FormItem><FormLabel>Subtitle</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="gateTimerText" render={({ field }) => (
                  <FormItem><FormLabel>Countdown Text</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="gatePromptLater" render={({ field }) => (
                  <FormItem><FormLabel>Early Peek Prompt</FormLabel><FormControl><Input {...field} /></FormControl><FormDescription>The text shown when the countdown is active.</FormDescription><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="gateButtonLater" render={({ field }) => (
                  <FormItem><FormLabel>Early Peek Button Text</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="gatePromptNow" render={({ field }) => (
                  <FormItem><FormLabel>Unlock Prompt</FormLabel><FormControl><Input {...field} /></FormControl><FormDescription>The text shown when the countdown has finished.</FormDescription><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="gateButtonNow" render={({ field }) => (
                  <FormItem><FormLabel>Unlock Button Text</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            </div>
            <Separator />
            
            {/* Greeting Page Settings */}
            <div>
              <h3 className="text-lg font-medium mb-4">Main Greeting Page</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Birthday Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full max-w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        The date the surprise will be unlocked.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <div className="flex items-center gap-4">
                    <FormField control={form.control} name="hour" render={({ field }) => (
                        <FormItem><FormLabel>Hour (0-23)</FormLabel><FormControl><Input type="number" min="0" max="23" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="minute" render={({ field }) => (
                        <FormItem><FormLabel>Minute (0-59)</FormLabel><FormControl><Input type="number" min="0" max="59" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                 <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timezone</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a timezone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {commonTimezones.map(tz => (
                                <SelectItem key={tz} value={tz}>{tz.replace(/_/g, ' ')}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The timezone for the unlock time. Daylight Saving is handled automatically.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Magic Word (Password)</FormLabel>
                      <FormControl>
                        <Input placeholder="best friend" {...field} />
                      </FormControl>
                      <FormDescription>
                        The password to unlock the surprise.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Greeting Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Happy Birthday, Sondos!" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="poem"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Greeting Poem</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A year of moments..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="backgroundImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Background Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://placehold.co/1280x720.png" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormDescription>
                        Provide a URL for a background image. Leave empty for a plain color.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="photoGallery"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Photo Gallery URLs</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="One photo URL per line..."
                          className="min-h-[100px]"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormDescription>
                        Add image URLs for the photo gallery, one per line.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cakeText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cake Message</FormLabel>
                      <FormControl>
                        <Input placeholder="Thank You!" {...field} />
                      </FormControl>
                       <FormDescription>
                        The short message that appears on the cake.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button type="submit" className="w-full">Save All Settings</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
