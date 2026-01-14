// This file exports all templates as a constant array
// This ensures templates are bundled with the app during build

import jobTemplate from "@/templates/Job_Template/1.json";
import studentTemplate from "@/templates/Student_Template/1.json";
import orderTemplate from "@/templates/Order_Template/1.json";
import contactUsTemplate from "@/templates/ContactUs_Template/1.json";
import feedbackTemplate1 from "./Feedback_Template/1.json";


import { Template } from "@/types/template";

// All templates in one array - automatically included in build
export const ALL_TEMPLATES: Template[] = [
  jobTemplate as Template,
  studentTemplate as Template,
  orderTemplate as Template,
  contactUsTemplate as Template,
  feedbackTemplate1 as Template,
];

// Add new templates here as they are contributed:
// import healthcareTemplate from "@/templates/Healthcare_Template/1.json";
// Then add to array: healthcareTemplate as Template,
