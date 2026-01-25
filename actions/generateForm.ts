"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Import Gemini SDK

const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Ensure the Gemini API key is set in your environment variables

export const generateForm = async (prevState: unknown, formData: FormData) => {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, message: "User not found" };
    }

    // Define schema for validation
    const schema = z.object({
      description: z.string().min(1, "Description is required"),
    });

    const validationResult = schema.safeParse({
      description: formData.get("description") as string,
    });

    if (!validationResult.success) {
      return {
        success: false,
        message: "Invalid form data",
        error: validationResult.error.errors,
      };
    }

    const description = validationResult.data.description;

    if (!GEMINI_API_KEY) {
      return { success: false, message: "Gemini API key not found" };
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    // Using gemini-2.5-flash (newer model with better limits)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const generationConfig = {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 2048,
    };

    // Start a chat session and send the prompt
    const chatSession = model.startChat({ generationConfig, history: [] });

    const prompt = `Generate a JSON response for a form with the following structure. Ensure the keys and format remain constant in every response.
{
  "formTitle": "string", // The title of the form
  "formFields": [        // An array of fields in the form
    {
      "label": "string", // The label to display for the field
      "name": "string",  // The unique identifier for the field (used for form submissions)
      "placeholder": "string", // The placeholder text for the field
      "type": "string", // Field type: "text", "email", "number", "textarea", "select", "radio", "checkbox", "date", "time", "datetime-local"
      "options": ["option1", "option2"] // Only for select, radio, checkbox types (optional for others)
    }
  ]
}

Available field types and when to use them:
- "text": For general text input (names, titles, etc.)
- "email": For email addresses
- "number": For numeric input (age, quantity, etc.) 
- "textarea": For long text (comments, descriptions, etc.)
- "select": For dropdown menus (country, category selection, etc.)
- "radio": For single choice from multiple options (gender, priority level, etc.)
- "checkbox": For multiple choice selections (interests, preferences, etc.)
- "date": For date selection (birth date, event date, etc.)
- "time": For time selection (appointment time, etc.)
- "datetime-local": For date and time together (event datetime, etc.)

Requirements:
- Use only the given keys: "formTitle", "formFields", "label", "name", "placeholder", "type", "options".
- Always include at least 3-5 fields in the "formFields" array.
- Choose appropriate field types based on the form's purpose.
- For select, radio, and checkbox fields, always include an "options" array with 2-4 meaningful options.
- For other field types, you can omit the "options" field or set it to an empty array.
- Provide meaningful placeholder text for each field based on its label and type.
- Make field names lowercase and use underscores (e.g., "first_name", "email_address").`;

    // Retry logic with exponential backoff for rate limiting
    let result;
    let lastError;
    const maxRetries = 3;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        result = await chatSession.sendMessage(`${description} ${prompt}`);
        break; // Success! Exit the retry loop
      } catch (error: any) {
        lastError = error;
        
        // Check if it's a rate limit error
        if (error?.status === 429) {
          // If this is not the last attempt, wait and retry
          if (attempt < maxRetries - 1) {
            const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff: 1s, 2s, 4s
            console.log(`Rate limit hit. Retrying in ${waitTime}ms... (Attempt ${attempt + 1}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          }
        }
        
        // If it's not a rate limit error, or it's the last attempt, throw the error
        throw error;
      }
    }
    
    // If we exhausted all retries
    if (!result) {
      throw lastError;
    }
    const responseText = result.response.text();
    
    // Extract JSON from response (gemini-pro might wrap it in markdown)
    let formContent = responseText;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      formContent = jsonMatch[0];
    }

    if (!formContent) {
      return { success: false, message: "No form content generated" };
    }

    console.log("Generated form ->", formContent);

    // Save the generated form to the database
    const form = await prisma.form.create({
      data: {
        ownerId: user.id,
        content: formContent,
        description: description, // Save the user's prompt as description
      },
    });

    revalidatePath("/dashboard/forms"); // Optionally revalidate a path if necessary

    return {
      success: true,
      message: "Form generated successfully.",
      data: form,
    };
  } catch (error: any) {
    console.error("Error generating form:", error);
    
    // Handle rate limit error specifically
    if (error?.status === 429 || error?.statusText === 'Too Many Requests') {
      return {
        success: false,
        message: "API rate limit reached. This could mean:\n1. You've used up your free tier quota\n2. Too many requests in a short time\n\nPlease wait a few moments and try again. If this persists, check your Google AI API quota at: https://ai.google.dev/gemini-api/docs/rate-limits",
      };
    }
    
    // Handle other API errors
    if (error?.status) {
      return {
        success: false,
        message: `API Error (${error.status}): ${error.statusText || 'Failed to generate form'}. Please check your API key and try again.`,
      };
    }
    
    return {
      success: false,
      message: "An error occurred while generating the form. Please try again.",
    };
  }
};
