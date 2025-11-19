"use server"
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server"

export const submitForm = async (formUuid: string, formData: any) => {
    try {
        const user = await currentUser();

        if (!user) {
            return { success: false, message: "User not found" }
        }
        if (!formUuid) {
            return { success: false, message: "Form id not found" }
        }
        const form = await prisma.form.findUnique({
            where: {
                uuid: formUuid
            }
        });
        if (!form) {
            return { success: false, message: "form not found" }
        }
        await prisma.submissions.create({
            data: {
                formId: form.id,
                content: JSON.stringify(formData)
            }
        });

        await prisma.form.update({
            where: {
                uuid: formUuid
            },
            data: {
                submissions: {
                    increment: 1
                }
            }

        });
        return { success: true, message: "Form submitted successsfully." }
    } catch (error) {
        console.log(error);
        return { success: false, message: "An error occurred" }
    }
}