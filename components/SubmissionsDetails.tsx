import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

type Props = {
  submission: any;
  index: number;
  formFields: any[];
};

const SubmissionsDetails: React.FC<Props> = ({ submission, index, formFields }) => {
  // Create a map of field names to labels
  const fieldMap = formFields.reduce((acc: any, field: any) => {
    acc[field.name] = field.label;
    return acc;
  }, {});

  // Get submission content
  const submissionData = typeof submission.content === 'string' 
    ? JSON.parse(submission.content) 
    : submission.content;
 
  return (
    <div>
      <h1 className="font-bold text-2xl mb-4">Response - {index + 1}</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Questions</TableHead>
            <TableHead>Answer</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(submissionData).map(([key, value], idx:number) => ( 
            <TableRow key={idx}>
              <TableCell className="font-medium">{fieldMap[key] || key}</TableCell>
              <TableCell>{Array.isArray(value) ? value.join(", ") : String(value)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SubmissionsDetails;