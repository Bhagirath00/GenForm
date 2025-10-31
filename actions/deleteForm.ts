"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache";

export const deleteForm = async (formUuid:string) => {
    // First, find the form to get its id
    const formToDelete = await prisma.form.findUnique({
        where: {
            uuid: formUuid
        }
    });

    if(!formToDelete){
        return {success:false, message:"Form not found"}
    }

    // Delete all submissions for this form using the form's id
    await prisma.submissions.deleteMany({
        where: {
            formId: formToDelete.id
        }
    });

    // Then delete the form
    const form = await prisma.form.delete({
        where:{
            uuid:formUuid
        }
    });

    if(!form){
        return {success:false, message:"Form not found"}
    }

    // make sure update the form list
    revalidatePath("/dashboard/forms");

    return {
        success:true,
        message:"Form deleted successfully."
    }
}