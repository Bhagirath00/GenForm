// This file exports all templates as a constant array
// This ensures templates are bundled with the app during build

import jobTemplate from "@/templates/Job_Template/1.json";
import studentTemplate from "@/templates/Student_Template/1.json";
import orderTemplate from "@/templates/Order_Template/1.json";
import contactUsTemplate from "@/templates/ContactUs_Template/1.json";
import feedbackTemplate1 from "./Feedback_Template/1.json";
import eventTemplate from "@/templates/Event_Template/1.json";
import volunteerTemplate from "@/templates/Volunteer_Template/1.json";
import healthcareTemplate from "@/templates/Healthcare_Template/1.json";
import generalSurveyTemplate from "@/templates/General_Survey_Template/1.json";


import { Template } from "@/types/template";

// All templates in one array - automatically included in build
export const ALL_TEMPLATES: Template[] = [
  jobTemplate as Template,
  studentTemplate as Template,
  orderTemplate as Template,
  contactUsTemplate as Template,
  feedbackTemplate1 as Template,
  eventTemplate as Template,
  volunteerTemplate as Template,
  healthcareTemplate as Template,
  generalSurveyTemplate as Template,
];

// Add new templates here as they are contributed:
// import healthcareTemplate from "@/templates/Healthcare_Template/1.json";
// Then add to array: healthcareTemplate as Template,
