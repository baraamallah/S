
"use client";

import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { Calendar as CalendarIcon, Trash2 } from "lucide-react";

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
import { cn, convertGoogleDriveUrl } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";

const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

const letterSchema = z.object({
    id: z.string(),
    magicWord: z.string().min(1, "Magic word cannot be empty."),
    title: z.string().min(1, "Letter title cannot be empty."),
    content: z.string().min(1, "Letter content cannot be empty."),
    isActive: z.boolean(),
    showBalloons: z.boolean(),
    showFireworks: z.boolean(),
    showCakeAndCats: z.boolean(),
});

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
  
  letters: z.array(letterSchema).min(1, "You must have at least one letter."),

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
  
  // Theme Colors
  primaryColor: z.string().regex(hexColorRegex, 'Invalid hex color').optional().or(z.literal('')),
  accentColor: z.string().regex(hexColorRegex, 'Invalid hex color').optional().or(z.literal('')),
  backgroundColor: z.string().regex(hexColorRegex, 'Invalid hex color').optional().or(z.literal('')),
  foregroundColor: z.string().regex(hexColorRegex, 'Invalid hex color').optional().or(z.literal('')),
  cardColor: z.string().regex(hexColorRegex, 'Invalid hex color').optional().or(z.literal('')),
  borderColor: z.string().regex(hexColorRegex, 'Invalid hex color').optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminForm() {
  const { config, saveConfig, isLoaded } = useBirthdayConfig();
  const { toast } = useToast();

  const allTimezones = useMemo(() => {
    try {
      return Intl.supportedValuesOf("timeZone");
    } catch (e) {
      console.warn("Intl.supportedValuesOf is not available, falling back to a common list of timezones.");
      return [
        "UTC",
        "America/New_York",
        "America/Chicago",
        "America/Denver",
        "America/Los_Angeles",
        "Europe/London",
        "Europe/Paris",
        "Asia/Tokyo",
        "Australia/Sydney",
      ];
    }
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        adminPassword: '',
        letters: [],
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
        timezone: 'America/New_York',
        primaryColor: '',
        accentColor: '',
        backgroundColor: '',
        foregroundColor: '',
        cardColor: '',
        borderColor: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "letters"
  });

  useEffect(() => {
    if (isLoaded) {
      const savedUtcDate = new Date(config.date);
      const zonedDate = toZonedTime(savedUtcDate, config.timezone);

      const lettersWithDefaults = config.letters.map(letter => ({
        ...letter,
        content: letter.content.replace(/<br \/>/g, "\n"),
        showBalloons: letter.showBalloons !== false, // default to true
        showFireworks: letter.showFireworks !== false, // default to true
        showCakeAndCats: letter.showCakeAndCats !== false, // default to true
      }));

      form.reset({
        ...config,
        date: zonedDate,
        hour: zonedDate.getHours(),
        minute: zonedDate.getMinutes(),
        timezone: config.timezone,
        letters: lettersWithDefaults,
        photoGallery: (config.photoGallery || []).join("\n"),
      });
    }
  }, [isLoaded, config, form]);

  async function onSubmit(values: FormValues) {
    const wallClockDate = new Date(values.date);
    wallClockDate.setHours(values.hour);
    wallClockDate.setMinutes(values.minute);
    wallClockDate.setSeconds(0);
    wallClockDate.setMilliseconds(0);

    const utcDate = fromZonedTime(wallClockDate, values.timezone);

    const processedLetters = values.letters.map(letter => ({
      ...letter,
      content: letter.content.replace(/\n/g, "<br />"),
    }));

    const newConfig: BirthdayConfig = {
      ...config,
      ...values,
      date: utcDate.toISOString(),
      timezone: values.timezone,
      letters: processedLetters,
      backgroundImage: values.backgroundImage ? convertGoogleDriveUrl(values.backgroundImage) : "",
      photoGallery: values.photoGallery ? values.photoGallery.split('\n').map(url => url.trim()).filter(url => url).map(convertGoogleDriveUrl) : [],
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

            {/* Theme & Colors */}
            <div>
              <h3 className="text-lg font-medium mb-4">Theme &amp; Colors</h3>
              <FormDescription className="mb-4">Customize the main colors of the site. The changes will apply live.</FormDescription>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="primaryColor" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Primary Color</FormLabel>
                        <div className="flex items-center gap-2">
                            <FormControl><Input type="color" {...field} value={field.value ?? '#000000'} className="p-1 h-10 w-10 shrink-0" /></FormControl>
                            <FormControl><Input type="text" {...field} placeholder="#f56e88" /></FormControl>
                        </div>
                        <FormDescription>Buttons, links, highlights.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="accentColor" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Accent Color</FormLabel>
                        <div className="flex items-center gap-2">
                            <FormControl><Input type="color" {...field} value={field.value ?? '#000000'} className="p-1 h-10 w-10 shrink-0" /></FormControl>
                            <FormControl><Input type="text" {...field} placeholder="#f5b3c2" /></FormControl>
                        </div>
                        <FormDescription>Balloons, decorations.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="backgroundColor" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Background Color</FormLabel>
                        <div className="flex items-center gap-2">
                            <FormControl><Input type="color" {...field} value={field.value ?? '#000000'} className="p-1 h-10 w-10 shrink-0" /></FormControl>
                            <FormControl><Input type="text" {...field} placeholder="#f9f8f6" /></FormControl>
                        </div>
                        <FormDescription>Main page background.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="foregroundColor" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Foreground Color</FormLabel>
                        <div className="flex items-center gap-2">
                            <FormControl><Input type="color" {...field} value={field.value ?? '#000000'} className="p-1 h-10 w-10 shrink-0" /></FormControl>
                            <FormControl><Input type="text" {...field} placeholder="#4a4540" /></FormControl>
                        </div>
                        <FormDescription>Main text color.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="cardColor" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Card Color</FormLabel>
                        <div className="flex items-center gap-2">
                            <FormControl><Input type="color" {...field} value={field.value ?? '#000000'} className="p-1 h-10 w-10 shrink-0" /></FormControl>
                            <FormControl><Input type="text" {...field} placeholder="#ffffff" /></FormControl>
                        </div>
                        <FormDescription>Background of cards.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="borderColor" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Border Color</FormLabel>
                        <div className="flex items-center gap-2">
                            <FormControl><Input type="color" {...field} value={field.value ?? '#000000'} className="p-1 h-10 w-10 shrink-0" /></FormControl>
                            <FormControl><Input type="text" {...field} placeholder="#efd9de" /></FormControl>
                        </div>
                        <FormDescription>Borders and separators.</FormDescription>
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
            
            {/* Main Content Settings */}
            <div>
              <h3 className="text-lg font-medium mb-4">Main Content Settings</h3>
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
                          <SelectContent className="max-h-96">
                            {allTimezones.map(tz => (
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
                  name="backgroundImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Background Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://placehold.co/1280x720.png" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormDescription>
                        Provide a URL for a background image. Supports Google Drive links. Leave empty for a plain color.
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
                        Add image URLs for the photo gallery, one per line. Supports Google Drive links.
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
            <Separator />
            
            {/* Letters and Magic Words */}
            <div>
              <h3 className="text-lg font-medium mb-4">Magic Words & Letters</h3>
              <div className="space-y-6">
                {fields.map((field, index) => (
                    <Card key={field.id} className="relative bg-muted/50 p-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start gap-4">
                          <h4 className="font-medium pt-2">Letter #{index + 1}</h4>
                          <div className="flex items-center gap-4">
                            <FormField
                              control={form.control}
                              name={`letters.${index}.isActive`}
                              render={({ field }) => (
                                <FormItem className="flex items-center gap-2 space-y-0">
                                  <FormLabel>Active</FormLabel>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => remove(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                               <span className="sr-only">Remove Letter</span>
                            </Button>
                          </div>
                        </div>

                        <FormField
                          control={form.control}
                          name={`letters.${index}.magicWord`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Magic Word</FormLabel>
                              <FormControl><Input placeholder="e.g., Sunflower" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`letters.${index}.title`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Letter Title</FormLabel>
                              <FormControl><Input placeholder="A special message for you" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`letters.${index}.content`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Letter Content / Poem</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Your heartfelt message..."
                                  className="min-h-[120px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div>
                            <FormLabel className="text-base font-medium">Decorations</FormLabel>
                            <div className="space-y-2 mt-2">
                                <FormField
                                  control={form.control}
                                  name={`letters.${index}.showBalloons`}
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background">
                                      <FormLabel className="font-normal">Show Balloons</FormLabel>
                                      <FormControl>
                                        <Switch
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`letters.${index}.showFireworks`}
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background">
                                      <FormLabel className="font-normal">Show Fireworks</FormLabel>
                                      <FormControl>
                                        <Switch
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`letters.${index}.showCakeAndCats`}
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background">
                                      <FormLabel className="font-normal">Show Cake & Cats</FormLabel>
                                      <FormControl>
                                        <Switch
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                            </div>
                        </div>

                      </div>
                    </Card>
                ))}
                 <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({ 
                    id: `letter-${Date.now()}`, 
                    magicWord: '', 
                    title: '', 
                    content: '', 
                    isActive: true,
                    showBalloons: true,
                    showFireworks: true,
                    showCakeAndCats: true,
                  })}
                >
                  Add Another Letter
                </Button>
                <FormField
                  control={form.control}
                  name="letters"
                  render={() => (
                    <FormItem>
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
