"use server"
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const getFormStats = async () => {
    const user = await currentUser();
 
    if(!user || !user.id){
        console.log("User not found");
        return null;
    }

    // Get all forms for the user
    const forms = await prisma.form.findMany({
        where: {
            ownerId: user.id as string
        },
        include: {
            Submissions: {
                select: {
                    createdAt: true,
                    id: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    // Calculate total submissions
    const totalSubmissions = forms.reduce((acc, form) => acc + form.submissions, 0);
    
    // Calculate published forms
    const publishedForms = forms.filter(form => form.published).length;
    
    // Calculate average submissions per form
    const avgSubmissionsPerForm = forms.length > 0 ? Math.round(totalSubmissions / forms.length) : 0;

    // Get submissions from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentSubmissions = await prisma.submissions.findMany({
        where: {
            Form: {
                ownerId: user.id as string
            },
            createdAt: {
                gte: sevenDaysAgo
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    // Calculate submissions for last 7 days (day by day)
    const submissionsByDay = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        date.setHours(0, 0, 0, 0);
        
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        
        const count = recentSubmissions.filter(sub => {
            const subDate = new Date(sub.createdAt);
            return subDate >= date && subDate < nextDay;
        }).length;
        
        return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            count
        };
    });

    // Get top 5 performing forms
    const topForms = forms
        .sort((a, b) => b.submissions - a.submissions)
        .slice(0, 5)
        .map(form => {
            const formContent = typeof form.content === 'string' ? JSON.parse(form.content) : form.content;
            return {
                id: form.uuid,
                title: formContent.formTitle || 'Untitled Form',
                submissions: form.submissions,
                published: form.published,
                createdAt: form.createdAt
            };
        });

    // Get recent activity (last 5 submissions with form details)
    const recentActivity = await prisma.submissions.findMany({
        where: {
            Form: {
                ownerId: user.id as string
            }
        },
        include: {
            Form: true
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 5
    });

    const recentActivityFormatted = recentActivity.map(submission => {
        const formContent = typeof submission.Form.content === 'string' 
            ? JSON.parse(submission.Form.content) 
            : submission.Form.content;
        
        return {
            id: submission.id,
            formTitle: formContent.formTitle || 'Untitled Form',
            formId: submission.Form.uuid,
            createdAt: submission.createdAt
        };
    });

    // Calculate growth (compare last 7 days with previous 7 days)
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    
    const previousWeekSubmissions = await prisma.submissions.count({
        where: {
            Form: {
                ownerId: user.id as string
            },
            createdAt: {
                gte: fourteenDaysAgo,
                lt: sevenDaysAgo
            }
        }
    });

    const growthPercentage = previousWeekSubmissions > 0 
        ? Math.round(((recentSubmissions.length - previousWeekSubmissions) / previousWeekSubmissions) * 100)
        : recentSubmissions.length > 0 ? 100 : 0;

    return {
        totalForms: forms.length,
        totalSubmissions,
        publishedForms,
        avgSubmissionsPerForm,
        submissionsByDay,
        topForms,
        recentActivity: recentActivityFormatted,
        growthPercentage,
        recentSubmissionsCount: recentSubmissions.length
    };
}