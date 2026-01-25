"use server";

import prisma from "@/lib/prisma";
import { getTemplateById } from "@/lib/templates";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

export const createFormFromTemplate = async (templateId: string) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    // Get the template by ID
    const template = await getTemplateById(templateId);

    if (!template) {
      return {
        success: false,
        message: "Template not found",
      };
    }

    const formUuid = uuidv4();

    // Create a new form with the template content
    const newForm = await prisma.form.create({
      data: {
        ownerId: userId,
        content: JSON.stringify(template.content),
        published: false,
        uuid: formUuid,
        shareUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/forms/${formUuid}`,
      },
    });

    revalidatePath("/dashboard/forms");

    return {
      success: true,
      message: `Form created from template: ${template.name}`,
      data: {
        uuid: newForm.uuid,
        id: newForm.id,
      },
    };
  } catch (error) {
    console.error("Error creating form from template:", error);
    return {
      success: false,
      message: "Failed to create form from template",
    };
  }
};
