"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Printer, Save } from "lucide-react";
import { addTodo } from "../actions";
import { TodoItem } from "@/lib/types";

export default function Component() {
  const [formData, setFormData] = useState<TodoItem>({
    priority: "",
    description: "",
    url: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateTimestamp = () => {
    const now = new Date();
    return now.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await addTodo(formData);

    // Reset form
    setFormData({
      priority: "",
      description: "",
      url: "",
    });

    setIsSubmitting(false);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "HIGH PRIORITY";
      case "medium":
        return "MEDIUM PRIORITY";
      case "low":
        return "LOW PRIORITY";
      default:
        return "NO PRIORITY SET";
    }
  };

  const generateQRCodeUrl = (url: string) => {
    if (!url) return null;
    return `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
      url
    )}`;
  };

  const formatDescriptionForReceipt = (
    text: string,
    lineLength: number = 48
  ) => {
    if (!text) {
      return "No task description entered";
    }

    const lines: string[] = [];
    const textLines = text.split("\n");

    for (let textLine of textLines) {
      if (textLine.length === 0) {
        lines.push("");
        continue;
      }
      while (textLine.length > lineLength) {
        const chunk = textLine.substring(0, lineLength);
        const lastSpace = chunk.lastIndexOf(" ");
        if (lastSpace !== -1) {
          lines.push(textLine.substring(0, lastSpace));
          textLine = textLine.substring(lastSpace + 1);
        } else {
          lines.push(textLine.substring(0, lineLength));
          textLine = textLine.substring(lineLength);
        }
      }
      lines.push(textLine);
    }

    return lines.join("\n");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Todo Receipt Organizer
          </h1>
          <p className="text-gray-600">
            Create task receipts with QR codes and priority levels. Yes actual
            receipts.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Save className="w-5 h-5" />
                Create New Task
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="urgency">Priority Level</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, priority: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">🔴 High Priority</SelectItem>
                      <SelectItem value="medium">🟡 Medium Priority</SelectItem>
                      <SelectItem value="low">🟢 Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="text">Task Description</Label>
                  <Textarea
                    id="text"
                    placeholder="Enter your task description..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webpageLink">
                    Related Webpage (Optional)
                  </Label>
                  <Input
                    id="webpageLink"
                    type="url"
                    placeholder="https://example.com"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        url: e.target.value,
                      }))
                    }
                  />
                  <p className="text-sm text-gray-500">
                    A QR code will be generated for this link on the receipt
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || !formData.description.trim()}
                >
                  {isSubmitting ? "Saving..." : "Save Task Receipt"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Receipt Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Printer className="w-5 h-5" />
                Receipt Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white border-2 border-dashed border-gray-300 p-6 font-mono text-sm">
                {/* Receipt Header */}
                <div className="text-center mb-4">
                  <div className="text-lg font-bold">TASK RECEIPT</div>
                  <div className="text-xs">Todo Organizer System</div>
                  <Separator className="my-2" />
                </div>

                {/* Timestamp */}
                <div className="mb-4">
                  <div className="text-xs text-gray-600">ISSUED:</div>
                  <div className="font-bold">{generateTimestamp()}</div>
                </div>

                {/* Priority Badge */}
                {formData.priority && (
                  <div className="mb-4">
                    <div className="text-xs text-gray-600 mb-1">PRIORITY:</div>
                    <Badge
                      variant={getUrgencyColor(formData.priority)}
                      className="font-mono text-xs"
                    >
                      {getUrgencyLabel(formData.priority)}
                    </Badge>
                  </div>
                )}

                <Separator className="my-4" />

                {/* Task Description */}
                <div className="mb-4">
                  <div className="text-xs text-gray-600 mb-1">TASK:</div>
                  <div className="whitespace-pre-wrap break-words text-center">
                    {formatDescriptionForReceipt(formData.description, 44)}
                  </div>
                </div>

                {/* QR Code Section */}
                {formData.url && (
                  <>
                    <Separator className="my-4" />
                    <div className="text-center">
                      <div className="text-xs text-gray-600 mb-2">
                        RELATED LINK:
                      </div>
                      <div className="flex justify-center mb-2">
                        <img
                          src={generateQRCodeUrl(formData.url) || ""}
                          alt="QR Code"
                          className="border"
                        />
                      </div>
                      <div className="text-xs break-all">{formData.url}</div>
                    </div>
                  </>
                )}
              </div>

              {/* Print Button */}
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => window.print()}
              >
                <Printer className="w-4 h-4 mr-2" />
                Print Receipt
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
