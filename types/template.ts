import { Content } from "./form";

export type TemplateMetadata = {
  id: string;
  category: string;
  name: string;
  description: string;
  thumbnail?: string;
  tags?: string[];
};

export type Template = TemplateMetadata & {
  content: Content;
};

export type TemplateCategory = {
  name: string;
  description: string;
  templates: TemplateMetadata[];
};
