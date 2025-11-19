"use client";

import { Download } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { getSubmissionsData } from "@/actions/exportSubmissions";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";

interface ExportButtonProps {
  formId: string;
}

export default function ExportButton({ formId }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      toast.loading("Preparing your export...", { id: "export" });

      const result = await getSubmissionsData(formId);

      if (!result.success || !result.data) {
        toast.error(result.message || "Failed to export data", { id: "export" });
        return;
      }

      // Create workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(result.data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Responses");

      // Auto-size columns
      const maxWidth = 50;
      const colWidths = Object.keys(result.data[0] || {}).map((key) => {
        const maxLength = Math.max(
          key.length,
          ...result.data.map((row: any) => String(row[key] || "").length)
        );
        return { wch: Math.min(maxLength + 2, maxWidth) };
      });
      worksheet["!cols"] = colWidths;

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `${result.formTitle.replace(/[^a-z0-9]/gi, "_")}_${timestamp}.xlsx`;

      // Download file
      XLSX.writeFile(workbook, filename);

      toast.success(`Exported ${result.data.length} responses!`, { id: "export" });
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data", { id: "export" });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting}
      className="gap-2"
      variant="outline"
    >
      <Download className="h-4 w-4" />
      {isExporting ? "Exporting..." : "Export to Excel"}
    </Button>
  );
}
