import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, 
  Send, 
  MessageSquare, 
  AlertCircle,
  CheckCircle,
  Info,
  Clock,
  Paperclip
} from "lucide-react";
import { toast } from "sonner";

const Communications = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [replyMessage, setReplyMessage] = useState("");

  // Mock communications data - in production, this would come from your backend
  const applicationInfo = {
    id: applicationId,
    courseName: "Artificial Intelligence – AI Now-a-Days",
    universityName: "Metropolia University",
    applicationNumber: "APP-2024-001234"
  };

  const messages = [
    {
      id: "1",
      date: "2024-01-15 10:30 AM",
      type: "success",
      from: "Admissions Office",
      subject: "Congratulations! Application Accepted",
      message: "Dear John Doe,\n\nWe are pleased to inform you that your application to the Artificial Intelligence program has been accepted. Your acceptance letter has been generated and is available for download in your application portal.\n\nPlease review the acceptance letter for important next steps and deadlines.\n\nBest regards,\nAdmissions Office",
      isUnread: false
    },
    {
      id: "2",
      date: "2024-01-14 3:00 PM",
      type: "info",
      from: "Interview Committee",
      subject: "Interview Completed - Thank You",
      message: "Dear John,\n\nThank you for attending the interview today. The committee was impressed with your responses and background. We will review all candidates and notify you of our decision within 24-48 hours.\n\nBest regards,\nInterview Committee",
      isUnread: false
    },
    {
      id: "3",
      date: "2024-01-13 9:00 AM",
      type: "info",
      from: "Admissions Office",
      subject: "Interview Scheduled",
      message: "Dear John,\n\nYour interview has been scheduled for:\n\nDate: January 14, 2024\nTime: 2:00 PM EST\nFormat: Video Call (Zoom)\n\nA calendar invitation with the meeting link has been sent to your email. Please ensure you have a stable internet connection and a quiet environment for the interview.\n\nBest regards,\nAdmissions Office",
      isUnread: false
    },
    {
      id: "4",
      date: "2024-01-12 4:30 PM",
      type: "warning",
      from: "Document Review Team",
      subject: "Additional Document Required",
      message: "Dear John,\n\nWe have reviewed your application and require the following additional document:\n\n- Official English Proficiency Certificate (TOEFL/IELTS)\n\nPlease upload this document to your application portal within 48 hours to avoid delays in processing your application.\n\nThank you,\nDocument Review Team",
      isUnread: false,
      hasReply: true,
      reply: {
        date: "2024-01-12 5:15 PM",
        message: "Thank you for reviewing my application. I have uploaded my TOEFL certificate to the portal. Please confirm receipt.\n\nBest regards,\nJohn Doe"
      }
    },
    {
      id: "5",
      date: "2024-01-11 11:00 AM",
      type: "info",
      from: "Admissions Office",
      subject: "Application Under Review",
      message: "Dear John,\n\nThank you for submitting your application to Metropolia University. Your application is now under review by our admissions committee.\n\nYou will be notified of any updates or if additional information is required. The review process typically takes 5-7 business days.\n\nBest regards,\nAdmissions Office",
      isUnread: false
    },
    {
      id: "6",
      date: "2024-01-10 2:00 PM",
      type: "success",
      from: "Application System",
      subject: "Application Successfully Submitted",
      message: "Your application has been successfully submitted and received. Your application number is APP-2024-001234. Please keep this number for future reference.\n\nNext steps:\n1. Your application will be reviewed by the admissions committee\n2. You may be contacted for an interview\n3. Final decision will be communicated via this portal and email\n\nThank you for applying to Metropolia University!",
      isUnread: false
    }
  ];

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const handleSendReply = () => {
    if (!replyMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }
    
    toast.success("Message sent successfully");
    setReplyMessage("");
  };

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/user/applications')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Applications
        </Button>
        
        <div>
          <h1 className="text-3xl font-bold mb-2">Communications</h1>
          <p className="text-muted-foreground">{applicationInfo.courseName}</p>
          <p className="text-sm text-muted-foreground">{applicationInfo.universityName} • {applicationInfo.applicationNumber}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Messages List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>All communications regarding your application</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="border rounded-lg p-4 space-y-3">
                      {/* Message Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getMessageIcon(message.type)}
                          <div>
                            <h4 className="font-medium">{message.subject}</h4>
                            <p className="text-sm text-muted-foreground">
                              From: {message.from} • {message.date}
                            </p>
                          </div>
                        </div>
                        {message.isUnread && (
                          <Badge variant="default" className="bg-blue-600">New</Badge>
                        )}
                      </div>

                      {/* Message Body */}
                      <div className="pl-8">
                        <p className="text-sm whitespace-pre-line">{message.message}</p>
                      </div>

                      {/* Reply (if exists) */}
                      {message.hasReply && message.reply && (
                        <div className="ml-8 mt-3 p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm font-medium">Your Reply</p>
                            <p className="text-xs text-muted-foreground">• {message.reply.date}</p>
                          </div>
                          <p className="text-sm">{message.reply.message}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Reply Section */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Send Message</CardTitle>
              <CardDescription>Contact the admissions office</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Type your message here..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className="min-h-[150px]"
              />
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleSendReply}
                  className="flex-1"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Quick Actions</h4>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate(`/user/applications/${applicationId}`)}
                  >
                    View Full Application
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => toast.info("Opening support center...")}
                  >
                    Contact Support
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Response Time</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Usually responds within 24-48 hours</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Communications;