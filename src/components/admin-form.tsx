"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

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
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBirthdayConfig } from "@/hooks/use-birthday-config";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";


const formSchema = z.object({
  date: z.date({
    required_error: "A date is required.",
  }),
  password: z.string().min(1, "Password cannot be empty."),
  title: z.string().min(1, "Title cannot be empty."),
  poem: z.string().min(1, "Poem cannot be empty."),
  backgroundImage: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminForm() {
  const { config, saveConfig, isLoaded } = useBirthdayConfig();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        password: '',
        title: '',
        poem: '',
        backgroundImage: '',
    },
  });

  useEffect(() => {
    if (isLoaded) {
      form.reset({
        date: new Date(config.date),
        password: config.password,
        title: config.title,
        poem: config.poem.replace(/<br \/>/g, "\n"),
        backgroundImage: config.backgroundImage,
      });
    }
  }, [isLoaded, config, form]);

  function onSubmit(values: FormValues) {
    const newConfig = {
      ...values,
      date: values.date.toISOString(),
      poem: values.poem.replace(/\n/g, "<br />"),
      backgroundImage: values.backgroundImage || "",
    };
    saveConfig(newConfig);
    toast({
      title: "Success!",
      description: "Your settings have been saved.",
    });
  }

  if (!isLoaded) {
    return <div>Loading admin settings...</div>;
  }

  return (
    <Card className="w-full max-w-2xl animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle>Admin Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                            "w-[240px] pl-3 text-left font-normal",
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
                    The date when the surprise will be unlocked.
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
            <Button type="submit">Save Settings</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
