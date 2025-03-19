
import React, { useState } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tariff, createTariff } from "@/services/tariffService";
import { toast } from "sonner";
import { Plus } from "lucide-react";

const newTariffSchema = z.object({
  name: z.string().min(3, {
    message: "Tariff name must be at least 3 characters",
  }),
  type: z.enum(["standard", "tou", "dynamic", "fixed"]),
});

type NewTariffFormValues = z.infer<typeof newTariffSchema>;

interface NewTariffDialogProps {
  onTariffCreated: () => void;
}

const NewTariffDialog = ({ onTariffCreated }: NewTariffDialogProps) => {
  const [open, setOpen] = useState(false);

  const form = useForm<NewTariffFormValues>({
    resolver: zodResolver(newTariffSchema),
    defaultValues: {
      name: "",
      type: "tou",
    },
  });

  const onSubmit = (values: NewTariffFormValues) => {
    // Create a basic template based on tariff type
    let weekdayRates, weekendRates;

    switch (values.type) {
      case "fixed":
        weekdayRates = [{ period: "Off-Peak", startTime: "00:00", endTime: "23:59", rate: 0.15 }];
        weekendRates = [{ period: "Off-Peak", startTime: "00:00", endTime: "23:59", rate: 0.15 }];
        break;
      case "tou":
        weekdayRates = [
          { period: "Off-Peak", startTime: "00:00", endTime: "07:00", rate: 0.08 },
          { period: "Shoulder", startTime: "07:00", endTime: "16:00", rate: 0.15 },
          { period: "Peak", startTime: "16:00", endTime: "20:00", rate: 0.28 },
          { period: "Shoulder", startTime: "20:00", endTime: "23:59", rate: 0.15 },
        ];
        weekendRates = [
          { period: "Off-Peak", startTime: "00:00", endTime: "09:00", rate: 0.07 },
          { period: "Shoulder", startTime: "09:00", endTime: "23:59", rate: 0.12 },
        ];
        break;
      case "dynamic":
        weekdayRates = [{ period: "Off-Peak", startTime: "00:00", endTime: "23:59", rate: 0.10 }];
        weekendRates = [{ period: "Off-Peak", startTime: "00:00", endTime: "23:59", rate: 0.08 }];
        break;
      default:
        weekdayRates = [{ period: "Off-Peak", startTime: "00:00", endTime: "23:59", rate: 0.12 }];
        weekendRates = [{ period: "Off-Peak", startTime: "00:00", endTime: "23:59", rate: 0.12 }];
    }

    const newTariff: Omit<Tariff, 'id'> = {
      name: values.name,
      type: values.type,
      weekdayRates: weekdayRates as any[],
      weekendRates: weekendRates as any[],
      isDefault: false,
    };

    createTariff(newTariff);
    setOpen(false);
    form.reset();
    onTariffCreated();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-1 h-4 w-4" /> Create New Tariff
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Tariff</DialogTitle>
          <DialogDescription>
            Create a new energy tariff plan with customizable rates
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tariff Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter tariff name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Give your tariff a descriptive name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tariff Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tariff type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="tou">Time-of-Use</SelectItem>
                      <SelectItem value="dynamic">Dynamic Pricing</SelectItem>
                      <SelectItem value="fixed">Fixed Rate</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The type of tariff determines the pricing structure
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Create Tariff</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewTariffDialog;
