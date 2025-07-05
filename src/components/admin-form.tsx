"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Sparkles } from "lucide-react";
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
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBirthdayConfig } from "@/hooks/use-birthday-config";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { generateInvitationText } from "@/ai/flows/generate-invitation-text";
import { generateImage } from "@/ai/flows/generate-image-flow";


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
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("A magical, dreamy landscape with pastel colors");

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


  const handleGenerateText = async () => {
    setIsGenerating(true);
    try {
      const result = await generateInvitationText({
        name: "Sondos",
        style_prompt: "magical and elegant, like a fairytale invitation",
      });
      if (result) {
        form.setValue("title", result.title, { shouldValidate: true });
        form.setValue("poem", result.poem, { shouldValidate: true });
        toast({
          title: "Text Generated!",
          description: "The greeting title and poem have been updated.",
        });
      }
    } catch (error) {
      console.error("Failed to generate text:", error);
      toast({
        title: "Generation Failed",
        description: "Could not generate text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    try {
      const result = await generateImage({ prompt: imagePrompt });
      if (result && result.imageUrl) {
        form.setValue("backgroundImage", result.imageUrl, { shouldValidate: true });
        toast({
          title: "Background Generated!",
          description: "A new background image has been created.",
        });
      }
    } catch (error) {
      console.error("Failed to generate image:", error);
      toast({
        title: "Generation Failed",
        description: "Could not generate the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };


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

            <div className="space-y-4 rounded-lg border bg-card p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h3 className="text-lg font-medium">Invitation Message</h3>
                        <p className="text-sm text-muted-foreground">
                            Generate a greeting using AI, or write your own.
                        </p>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleGenerateText}
                        disabled={isGenerating}
                        className="gap-2"
                    >
                        <Sparkles className="h-4 w-4" />
                        {isGenerating ? "Generating..." : "Generate with AI"}
                    </Button>
                </div>

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
            </div>

            <div className="space-y-4 rounded-lg border bg-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">Background Image</h3>
                  <p className="text-sm text-muted-foreground">
                    Generate a magical background with AI.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateImage}
                  disabled={isGeneratingImage}
                  className="gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  {isGeneratingImage ? "Generating..." : "Generate Background"}
                </Button>
              </div>

              <FormItem>
                <FormLabel>AI Image Prompt</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., A dreamy pastel sky with floating islands"
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                  />
                </FormControl>
              </FormItem>

              <FormField
                control={form.control}
                name="backgroundImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image Preview</FormLabel>
                    <FormControl>
                      <div className="aspect-video w-full rounded-lg border bg-muted flex items-center justify-center">
                        {field.value ? (
                          <Image
                            src={field.value}
                            alt="Generated background"
                            width={1280}
                            height={720}
                            className="object-cover rounded-lg w-full h-full"
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No image generated yet.
                          </p>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit">Save Settings</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
