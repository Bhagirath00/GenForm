"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

export const createBlankForm = async () => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    // Create a blank form with minimal fields
    const blankFormContent = {
      formTitle: "Untitled Form",
      formDescription: "",
      formFields: [
        {
          id: `field-${Date.now()}`,
          name: "field_1",
          label: "Question 1",
          placeholder: "Enter your answer",
          type: "text",
          required: false,
        },
      ],
    };

    const formUuid = uuidv4();

    const newForm = await prisma.form.create({
      data: {
        ownerId: userId,
        content: JSON.stringify(blankFormContent),
        description: "", // Blank forms have no description
        published: false,
        uuid: formUuid,
        shareUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/forms/${formUuid}`,
      },
    });

    revalidatePath("/dashboard/forms");

    return {
      success: true,
      message: "Blank form created successfully!",
      data: {
        uuid: newForm.uuid,
        id: newForm.id,
      },
    };
  } catch (error) {
    console.error("Error creating blank form:", error);
    return {
      success: false,
      message: "Failed to create blank form",
    };
  }
};
