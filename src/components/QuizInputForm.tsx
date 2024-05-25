// src/components/QuizInputForm.tsx

import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { QuizInfoSchema } from "~/types";

const formSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  subject: z.string().min(1, "Subject is required"),
  level: z.string().min(1, "Level is required"),
  length: z.string().min(1, "Length is required"),
});

type FormData = z.infer<typeof formSchema>;

if (
  JSON.stringify(Object.keys(formSchema.shape)) !==
  JSON.stringify(Object.keys(QuizInfoSchema.shape))
) {
  throw new Error("FormData and QuizInfoData must have the exact same fields");
}

interface QuizInputFormProps {
  onSubmit: SubmitHandler<FormData>;
  isDisabled: boolean;
}

enum Subjects {
  All = "All",
  ComputerScience = "Computer Science",
  Biology = "Biology",
  Chemistry = "Chemistry",
  Physics = "Physics",
  Mathematics = "Mathematics",
  History = "History",
  Economics = "Economics",
  SocialStudies = "Social Studies",
}

enum Levels {
  MiddleSchool = "Middle School",
  HighSchool = "High School",
  College = "College",
}

enum Lengths {
  Short = "Short",
  Medium = "Medium",
  Long = "Long",
}

const subjectOptions = Object.values(Subjects);
const levelOptions = Object.values(Levels);
const lengthOptions = Object.values(Lengths);

const QuizInputForm: React.FC<QuizInputFormProps> = ({
  onSubmit,
  isDisabled,
}) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      subject: Subjects.All,
      level: Levels.HighSchool,
      length: Lengths.Medium,
    },
  });

  return (
    <Form {...form}>
      <form
        className="w-full max-w-xl lg:max-w-3xl"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Topic</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Get quizzed on..."
                  {...field}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-300 focus:outline-none focus:ring"
                  disabled={isDisabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Collapsible>
          <div className="my-2 flex justify-end">
            <CollapsibleTrigger className="text-sm text-gray-500 hover:underline">
              Additional Options
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <div className="mb-4 flex space-x-4">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isDisabled}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjectOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Level</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isDisabled}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Level" />
                        </SelectTrigger>
                        <SelectContent>
                          {levelOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="length"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Length</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isDisabled}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Length" />
                        </SelectTrigger>
                        <SelectContent>
                          {lengthOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
        <Button type="submit" className="w-full" disabled={isDisabled}>
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default QuizInputForm;
