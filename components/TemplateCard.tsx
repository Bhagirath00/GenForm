"use client";

import React from "react";
import { Template } from "@/types/template";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Props = {
  template: Template;
  onSelect: (templateId: string) => void;
  isLoading?: boolean;
};

const TemplateCard: React.FC<Props> = ({ template, onSelect, isLoading }) => {
  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg hover:border-green-500 dark:hover:border-green-400 cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
              {template.name}
            </CardTitle>
            <Badge variant="secondary" className="mt-1 text-xs">
              {template.category}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm mb-4 line-clamp-2">
          {template.description}
        </CardDescription>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {template.content.formFields.length} fields
          </span>
          <Button
            onClick={() => onSelect(template.id)}
            disabled={isLoading}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Use Template
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateCard;
