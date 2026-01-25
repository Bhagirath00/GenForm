import SubmissionsDetails from "@/components/SubmissionsDetails";
import ExportButton from "@/components/ExportButton";
import prisma from "@/lib/prisma";
import React from "react";

const Submisions = async ({
  params,
}: {
  params: Promise<{ formId: string }>;
}) => {
  const formId = (await params).formId;

  // First find the form by UUID to get its internal ID
  const form = await prisma.form.findUnique({
    where: {
      uuid: formId,
    },
  });

  if (!form) {
    return <h1>Form not found</h1>;
  }

  const submissions = await prisma.submissions.findMany({
    where: {
      formId: form.id,
    },
    include: {
      Form: true,
    },
  });
  
  if (!submissions || submissions.length === 0) {
    return <h1>No submissions found for form id {formId}</h1>;
  }

  // Parse form content to get field labels
  const formContent = typeof form.content === 'string' 
    ? JSON.parse(form.content) 
    : form.content;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Form Submissions ({submissions.length})</h1>
        <ExportButton formId={formId} />
      </div>
      <div>
        {submissions.map((submission : any, index: number) => (
          <SubmissionsDetails 
            key={index} 
            submission={submission} 
            index={index}
            formFields={formContent.formFields}
          />
        ))}
      </div>
    </div>
  );
};

export default Submisions;