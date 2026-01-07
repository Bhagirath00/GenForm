"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, FileEdit, Loader2, Plus } from "lucide-react";
import GenerateFormInput from "./GenerateFormInput";
import TemplateDialog from "./TemplateDialog";
import { createBlankForm } from "@/actions/createBlankForm";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Props = {
  totalForms: number;
  isSubscribed: boolean;
};

const CreateFormDialog: React.FC<Props> = ({
  totalForms,
  isSubscribed,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<"ai" | "manual" | "template" | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const router = useRouter();

  const handleManualCreate = async () => {
    setIsCreating(true);
    try {
      const result = await createBlankForm();
      if (result.success) {
        toast.success(result.message);
        setOpen(false);
        router.push(`/dashboard/forms/edit/${result.data?.uuid}`);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to create form");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) setSelectedOption(null);
      }}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus /> Create New Form
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Create New Form
          </DialogTitle>
          <DialogDescription>
            Choose how you want to create your form
          </DialogDescription>
        </DialogHeader>

        {!selectedOption && (
          <div className="grid gap-4 py-4">
            {/* AI Option */}
            <button
              onClick={() => setSelectedOption("ai")}
              className="group relative overflow-hidden rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6 text-left transition-all hover:border-green-500 dark:hover:border-green-400 hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-gradient-to-br from-green-500 to-blue-600 p-3 shadow-lg group-hover:scale-110 transition-transform">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    Create with AI
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Describe your form and let AI generate it for you instantly. Perfect for quick setups.
                  </p>
                  <div className="mt-3 inline-flex items-center text-xs font-semibold text-green-600 dark:text-green-400">
                    Limited by plan →
                  </div>
                </div>
              </div>
            </button>

            {/* Manual Option */}
            <button
              onClick={() => setSelectedOption("manual")}
              className="group relative overflow-hidden rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6 text-left transition-all hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 p-3 shadow-lg group-hover:scale-110 transition-transform">
                  <FileEdit className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Create Manually
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Start with a blank form and build it yourself. Full control over every field and option.
                  </p>
                  <div className="mt-3 inline-flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400">
                    Unlimited forms →
                  </div>
                </div>
              </div>
            </button>

            {/* Template Option */}
            <button
              onClick={() => {
                setTemplateDialogOpen(true);
                setOpen(false);
              }}
              className="group relative overflow-hidden rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6 text-left transition-all hover:border-green-500 dark:hover:border-green-400 hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-green-500 p-3 shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    Use Template
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Choose from pre-built templates and customize them to your needs.
                  </p>
                  <div className="mt-3 inline-flex items-center text-xs font-semibold text-green-600 dark:text-green-400">
                    Quick start →
                  </div>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* AI Form Generation */}
        {selectedOption === "ai" && (
          <div className="py-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedOption(null)}
              className="mb-4"
            >
              ← Back to options
            </Button>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg p-4 mb-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-green-600" />
                AI Form Generator
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Write a clear prompt describing your form. For example: &quot;Create a contact form with name, email, and message&quot;
              </p>
            </div>
            <GenerateFormInput
              text=""
              totalForms={totalForms}
              isSubscribed={isSubscribed}
            />
          </div>
        )}

        {/* Manual Form Creation */}
        {selectedOption === "manual" && (
          <div className="py-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedOption(null)}
              className="mb-4"
            >
              ← Back to options
            </Button>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FileEdit className="h-5 w-5 text-blue-600" />
                Create Blank Form
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Start with a blank form and add fields manually. You&apos;ll be redirected to the form editor where you can:
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                  Add unlimited fields of any type
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                  Customize labels, placeholders, and options
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                  Full control over your form structure
                </li>
              </ul>
              <Button
                onClick={handleManualCreate}
                disabled={isCreating}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating form...
                  </>
                ) : (
                  <>
                    <FileEdit className="mr-2 h-4 w-4" />
                    Create Blank Form
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
    
    {/* Template Selection Dialog */}
    <TemplateDialog 
      open={templateDialogOpen} 
      onOpenChange={(isOpen) => {
        setTemplateDialogOpen(isOpen);
        // Re-open main dialog when template dialog closes
        if (!isOpen) {
          setOpen(true);
        }
      }} 
    />
    </>
  );
};

export default CreateFormDialog;
