"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const getSubmissionsData = async (formId: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, message: "User not found" };
    }

    // Find the form by UUID
    const form = await prisma.form.findUnique({
      where: {
        uuid: formId,
        ownerId: user.id, // Ensure user owns the form
      },
    });

    if (!form) {
      return { success: false, message: "Form not found" };
    }

    // Get all submissions
    const submissions = await prisma.submissions.findMany({
      where: {
        formId: form.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!submissions || submissions.length === 0) {
      return { success: false, message: "No submissions found" };
    }

    // Parse form content to get field labels
    const rawContent = form.content;
    const formContent: any = (rawContent && typeof rawContent === "string")
      ? JSON.parse(rawContent)
      : (rawContent ?? { formTitle: "", formFields: [] });

    // Transform submissions data for export
    const exportData = submissions.map((submission) => {
      // Handle both string and object content from Prisma
      let submissionData;
      if (typeof submission.content === 'string') {
        submissionData = JSON.parse(submission.content);
      } else {
        // If it's already an object (Prisma returns JSON as object)
        submissionData = submission.content;
      }
      
      const row: any = {
        "Submission ID": submission.id,
        "Submitted At": new Date(submission.createdAt).toLocaleString(),
      };

      // Add each field's data with proper labels
      formContent.formFields.forEach((field: any) => {
        const value = submissionData[field.name];
        row[field.label] = Array.isArray(value) ? value.join(", ") : (value || "N/A");
      });

      return row;
    });

    return {
      success: true,
      data: exportData,
      formTitle: formContent.formTitle || "Form Responses",
    };
  } catch (error) {
    console.error("Error fetching submissions data:", error);
    return {
      success: false,
      message: "An error occurred while fetching submissions data.",
    };
  }
};
