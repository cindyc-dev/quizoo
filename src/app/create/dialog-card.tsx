/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogClose,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { Input } from "~/components/ui/input";
import { GoPencil } from "react-icons/go";
import { Button } from "~/components/ui/button";
import { FaSave } from "react-icons/fa";
import { z } from "zod";
import {
  type Card,
  ZodCardTypeEnum,
  MUST_HAVE_ANSWER_CARD_TYPES,
  CARD_TYPE,
  CARD_RENDER,
  CardType,
} from "./columns";
import { useForm } from "react-hook-form";
import { Textarea } from "~/components/ui/textarea";
import { useCallback, useEffect, useState } from "react";
import { Checkbox } from "~/components/ui/checkbox";
import { FaTrash } from "react-icons/fa6";

const formSchema = z.object({
  type: ZodCardTypeEnum,
  text: z.string().min(0),
  answerOptions: z.array(z.string()),
  timeLimit: z.number(),
  correctAnswer: z.union([z.array(z.string()), z.array(z.number())]),
});

type ResolverReturnType = {
  errors: Record<string, string>;
  values: z.infer<typeof formSchema> | Record<string, never>;
};

// To validate custom logic of
const useCustomResolver = () =>
  useCallback(
    async (data: z.infer<typeof formSchema>): Promise<ResolverReturnType> => {
      try {
        // Validate data using Zod schema
        await formSchema.parseAsync(data);

        // Custom Validations
        if (
          MUST_HAVE_ANSWER_CARD_TYPES.includes(data.type) &&
          !data.correctAnswer
        ) {
          return {
            errors: {
              correctAnswer:
                "Correct answer is required if the card type is not a Slide or Type-out Answer",
            },
            values: {},
          };
        }
        return { errors: {}, values: data };
      } catch (error) {
        // Catching Zod Errors
        if (error instanceof z.ZodError) {
          return {
            errors: error.errors.reduce((allErrors, currentError) => {
              const fieldName = currentError.path[0]! as string;
              return {
                ...allErrors,
                [fieldName]: currentError.message,
              };
            }, {}),
            values: {},
          };
        }

        console.error("Some other error occured during form validation");
        return {
          errors: {
            _error: "An unexpected error occurred during validation.",
          },
          values: {},
        };
      }
    },
    [],
  );

interface DialogCardProps {
  card: Card;
}

export default function DialogCard({ card }: DialogCardProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: useCustomResolver(),
    defaultValues: {
      type: card.type,
      text: card.text,
      answerOptions: card.answerOptions,
      timeLimit: card.timeLimit,
      correctAnswer: card.correctAnswer,
    },
  });

  useEffect(() => {
    // TODO #code-cleanup - set it more effeciently
    form.setValue("type", card.type);
    form.setValue("text", card.text);
    form.setValue("answerOptions", card.answerOptions ?? []);
    form.setValue("timeLimit", card.timeLimit ?? 0);
    form.setValue("correctAnswer", card.correctAnswer ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log({ values });
  };

  const correctAnswer = form.watch("correctAnswer");
  const cardType = form.watch("type");
  const answerOptions = form.watch("answerOptions");

  // Update correctAnswer and answerOptions when cardType changes
  useEffect(() => {
    if (
      (cardType === "MCQ" &&
        correctAnswer.length &&
        typeof correctAnswer[0] !== "number") ||
      (cardType === "Type" &&
        correctAnswer.length &&
        typeof correctAnswer[0] !== "string")
    ) {
      form.setValue("correctAnswer", []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardType]);

  const AnswerOptions = () => {
    // Used to determine if an option has been focused on
    const [focusedOptionOriValue, setEditOptionValue] = useState("");

    const handleDeleteOption = (index: number) => {
      // Update answer indexes
      const newCorrectAnswer: number[] = [];
      (correctAnswer as number[]).forEach((i) => {
        if (i < index) {
          newCorrectAnswer.push(i);
        } else if (i > index) {
          newCorrectAnswer.push(i - 1);
        }
      });
      form.setValue("correctAnswer", newCorrectAnswer);
      const newAnswerOptions = answerOptions;
      newAnswerOptions.splice(index, 1);
      form.setValue("answerOptions", newAnswerOptions);
    };

    const handleToggleCorrect = (newValue: boolean, index: number) => {
      let newCorrectAnswer = correctAnswer as number[];
      if (newValue) {
        newCorrectAnswer = [...newCorrectAnswer, index];
      } else {
        newCorrectAnswer = newCorrectAnswer.filter((i) => i !== index);
      }
      form.setValue("correctAnswer", newCorrectAnswer);
    };
    return (
      <FormField
        control={form.control}
        name="answerOptions"
        render={({ field }) => (
          <FormItem>
            <div className="flex justify-between">
              <FormLabel>Answer Options</FormLabel>
              <Button
                className="text-xs font-normal"
                variant="redLink"
                onClick={() => form.setValue("answerOptions", [""])}
              >
                Delete All Options
              </Button>
            </div>

            <FormControl>
              <div className="flex flex-col gap-2">
                {field.value.map((option, index) => {
                  const isAnswer = (correctAnswer as number[]).includes(index);
                  return (
                    <div
                      key={option}
                      className="flex items-center justify-between gap-2 rounded-md border border-slate-800 px-2 py-1 text-sm"
                    >
                      <div className="flex w-full items-center gap-2">
                        {cardType === "MCQ" && (
                          <Checkbox
                            checked={isAnswer}
                            onCheckedChange={(newValue: boolean) =>
                              handleToggleCorrect(newValue, index)
                            }
                          />
                        )}
                        <Input
                          className="m-0 text-xs"
                          placeholder="Answer option..."
                          value={option}
                          onChange={(e) => {
                            console.log("Changes happenning for textarea");
                          }}
                          // onFocus={() => {

                          // }}
                          onBlur={(props) => {
                            console.log("onBlur");
                            console.log({ props });
                          }}
                        />
                      </div>
                      <Button
                        variant="transparent"
                        className="m-0 h-fit p-0"
                        onClick={() => handleDeleteOption(index)}
                      >
                        <FaTrash className="h-4 w-4 text-red-400 transition-transform duration-100 hover:scale-x-125 hover:cursor-pointer active:scale-x-110" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </FormControl>
          </FormItem>
        )}
      />
    );
  };

  // TODO display form errors

  return (
    <DialogContent className="">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <GoPencil /> Edit your card
        </DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          {/* Card Type */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Card Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Card Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {CARD_TYPE.map((cardType) => (
                        <SelectItem value={cardType} key={cardType}>
                          {CARD_RENDER[cardType] ?? cardType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Question/Text */}
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {cardType === "Slide" ? "Text" : "Question"}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Type you question here..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Answer Options */}
          {cardType !== "Slide" && <AnswerOptions />}

          {/* Type-out Answer */}

          {/* Correct Answer */}
          {/* Time Limit */}
          <FormField
            control={form.control}
            name="timeLimit"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Time Limit</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Time Limit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={0}>No Time Limit</SelectItem>
                      <SelectItem value={30}>30s</SelectItem>
                      <SelectItem value={60}>60s</SelectItem>
                      <SelectItem value={90}>90s</SelectItem>
                      <SelectItem value={120}>120s (2min)</SelectItem>
                      <SelectItem value={180}>180s (3min)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button type="submit" className="mt-2 bg-slate-50 text-slate-900">
                Save <FaSave className="ml-2 h-4 w-4" />
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
