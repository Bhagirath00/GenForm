"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Template } from "@/types/template";
import { getTemplates } from "@/actions/getTemplates";
import { createFormFromTemplate } from "@/actions/createFormFromTemplate";
import TemplateCard from "./TemplateCard";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const TemplateDialog: React.FC<Props> = ({ open, onOpenChange }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      loadTemplates();
    }
  }, [open]);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const result = await getTemplates();
      if (result.success) {
        setTemplates(result.data);
      } else {
        toast.error(result.message || "Failed to load templates");
      }
    } catch (error) {
      console.error("Error loading templates:", error);
      toast.error("Failed to load templates");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTemplate = async (templateId: string) => {
    setIsCreating(true);
    try {
      const result = await createFormFromTemplate(templateId);
      if (result.success) {
        toast.success(result.message);
        onOpenChange(false);
        router.push(`/dashboard/forms/edit/${result.data?.uuid}`);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error creating form from template:", error);
      toast.error("Failed to create form from template");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-600 dark:text-green-400">
            Choose a Template
          </DialogTitle>
          <DialogDescription>
            Select a pre-built template to get started quickly. You can customize it after creation.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No templates available</p>
          </div>
        ) : (
          <div className="grid gap-4 py-4 sm:grid-cols-2">
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={handleSelectTemplate}
                isLoading={isCreating}
              />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TemplateDialog;
