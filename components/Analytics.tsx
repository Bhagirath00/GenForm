import React from "react";
import {
  Card,
  CardContent, 
  CardHeader,
  CardTitle,
} from "./ui/card"; 
import { 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  Send, 
  CheckCircle, 
  BarChart3,
  Activity,
  Clock
} from "lucide-react";
import Link from "next/link";

type AnalyticsData = {
  totalForms: number;
  totalSubmissions: number;
  publishedForms: number;
  avgSubmissionsPerForm: number;
  submissionsByDay: Array<{ date: string; count: number }>;
  topForms: Array<{
    id: string;
    title: string;
    submissions: number;
    published: boolean;
    createdAt: Date;
  }>;
  recentActivity: Array<{
    id: number;
    formTitle: string;
    formId: string;
    createdAt: Date;
  }>;
  growthPercentage: number;
  recentSubmissionsCount: number;
};

type Props = {
  data: AnalyticsData | null;
}

const cardHover =
  "transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.01] hover:shadow-xl dark:hover:shadow-black/40";

const Analytics: React.FC<Props> = ({ data }) => {
  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">No analytics data available</p>
      </div>
    );
  }

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const maxSubmissions = Math.max(...data.submissionsByDay.map(d => d.count), 1);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Track your form performance and engagement
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className={`border-l-4 border-l-green-500 ${cardHover}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Forms
            </CardTitle>
            <FileText className="w-5 h-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.totalForms}</div>
            <p className="text-xs text-gray-500">{data.publishedForms} published</p>
          </CardContent>
        </Card>

        <Card className={`border-l-4 border-l-emerald-500 ${cardHover}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Submissions
            </CardTitle>
            <Send className="w-5 h-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.totalSubmissions}</div>
            <div className="flex items-center gap-1 mt-1">
              {data.growthPercentage >= 0 ? (
                <TrendingUp className="w-3 h-3 text-green-500" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-500" />
              )}
              <p className={`text-xs ${data.growthPercentage >= 0 ? "text-green-500" : "text-red-500"}`}>
                {Math.abs(data.growthPercentage)}% vs last week
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className={`border-l-4 border-l-teal-500 ${cardHover}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Published Forms
            </CardTitle>
            <CheckCircle className="w-5 h-5 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.publishedForms}</div>
            <p className="text-xs text-gray-500">
              {data.totalForms - data.publishedForms} drafts
            </p>
          </CardContent>
        </Card>

        <Card className={`border-l-4 border-l-blue-500 ${cardHover}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Avg per Form
            </CardTitle>
            <BarChart3 className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.avgSubmissionsPerForm}</div>
            <p className="text-xs text-gray-500">submissions/form</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts + Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className={cardHover}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-500" />
              Last 7 Days Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.submissionsByDay.map((day, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs w-16 text-gray-500">{day.date}</span>
                <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-7">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-end pr-2"
                    style={{ width: `${(day.count / maxSubmissions) * 100}%` }}
                  >
                    {day.count > 0 && (
                      <span className="text-xs font-semibold text-white">{day.count}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className={cardHover}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-500" />
              Top Performing Forms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.topForms.length > 0 ? (
              <>
                {data.topForms.map((form, i) => (
                  <Link
                    key={form.id}
                    href={`/dashboard/forms/${form.id}/submissions`}
                    className="block p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-sm font-bold">
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium truncate">{form.title}</p>
                          <p className="text-xs text-gray-500">{form.published ? "Published" : "Draft"}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-500">{form.submissions}</p>
                        <p className="text-xs text-gray-500">responses</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No forms yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className={cardHover}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-500" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.recentActivity.length > 0 ? (
            <>
              {data.recentActivity.map(a => (
                <Link
                  key={a.id}
                  href={`/dashboard/forms/${a.formId}/submissions`}
                  className="flex justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <div>
                    <p className="text-sm font-medium">
                      New submission to <span className="text-green-500">{a.formTitle}</span>
                    </p>
                    <p className="text-xs text-gray-500">{getTimeAgo(a.createdAt)}</p>
                  </div>
                </Link>
              ))}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent activity</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
