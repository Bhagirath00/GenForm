import { Template } from "@/types/template";
import fs from "fs";
import path from "path";

const TEMPLATES_DIR = path.join(process.cwd(), "templates");

/**
 * Get all available templates from the templates directory
 */
export async function getAllTemplates(): Promise<Template[]> {
  try {
    const templates: Template[] = [];
    
    // Check if templates directory exists
    if (!fs.existsSync(TEMPLATES_DIR)) {
      console.error(`Templates directory not found at: ${TEMPLATES_DIR}`);
      console.error(`Current working directory: ${process.cwd()}`);
      return [];
    }
    
    // Read all category folders
    const categories = fs.readdirSync(TEMPLATES_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    console.log(`Found ${categories.length} template categories:`, categories);

    // Read templates from each category
    for (const category of categories) {
      const categoryPath = path.join(TEMPLATES_DIR, category);
      const files = fs.readdirSync(categoryPath)
        .filter(file => file.endsWith('.json'));

      console.log(`Category ${category}: Found ${files.length} templates`);

      for (const file of files) {
        const filePath = path.join(categoryPath, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const template = JSON.parse(content) as Template;
        templates.push(template);
      }
    }

    console.log(`Total templates loaded: ${templates.length}`);
    return templates;
  } catch (error) {
    console.error("Error reading templates:", error);
    console.error("Templates directory path:", TEMPLATES_DIR);
    console.error("Current working directory:", process.cwd());
    return [];
  }
}

/**
 * Get a specific template by ID
 */
export async function getTemplateById(id: string): Promise<Template | null> {
  try {
    const allTemplates = await getAllTemplates();
    return allTemplates.find(template => template.id === id) || null;
  } catch (error) {
    console.error("Error getting template by ID:", error);
    return null;
  }
}

/**
 * Get templates by category
 */
export async function getTemplatesByCategory(category: string): Promise<Template[]> {
  try {
    const allTemplates = await getAllTemplates();
    return allTemplates.filter(template => template.category === category);
  } catch (error) {
    console.error("Error getting templates by category:", error);
    return [];
  }
}

/**
 * Get all unique template categories
 */
export async function getTemplateCategories(): Promise<string[]> {
  try {
    const allTemplates = await getAllTemplates();
    const categories = new Set(allTemplates.map(template => template.category));
    return Array.from(categories);
  } catch (error) {
    console.error("Error getting template categories:", error);
    return [];
  }
}
