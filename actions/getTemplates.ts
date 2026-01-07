"use server";

import { getAllTemplates } from "@/lib/templates";

export const getTemplates = async () => {
  try {
    const templates = await getAllTemplates();
    
    return {
      success: true,
      data: templates,
    };
  } catch (error) {
    console.error("Error fetching templates:", error);
    return {
      success: false,
      message: "Failed to load templates",
      data: [],
    };
  }
};
