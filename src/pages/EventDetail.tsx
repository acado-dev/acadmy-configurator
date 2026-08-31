import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Edit,
  Eye,
  FileText,
  Info,
  ListOrdered,
  MapPin,
  Settings,
  Trophy,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getEvent, getEventResponses, stageTypeLabel } from "@/lib/eventStorage";

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  draft: "secondary",
  active: "default",
  completed: "outline",
  cancelled: "destructive",
};

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" }) : "—";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");

  const event = useMemo(() => getEvent(id), [id]);
  const responses = useMemo(() => (event ? getEventResponses(event.id) : []), [event]);

  if (!event) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="py-16 text-center space-y-4">
            <p className="text-muted-foreground">This event could not be found.</p>
            <Button onClick={() => navigate("/events")}>Back to Events</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stages = [...(event.stages || [])].sort((a, b) => a.order - b.order);

  const stat = (label: string, value: string | number, Icon: typeof Users) => (
    <Card>
      <CardContent className="py-8 flex flex-col items-center gap-2">
        <Icon className="h-6 w-6 text-muted-foreground" />
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );

  const detailRow = (label: string, value?: string | number) => (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value || "—"}</p>
    </div>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardContent className="p-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-xl bg-muted flex items-center justify-center overflow-hidden shrink-0">
              {event.logo ? (
                <img src={event.logo} alt={`${event.title} logo`} className="h-full w-full object-cover" />
              ) : (
                <Calendar className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="space-y-2">
              <Badge variant={statusVariant[event.status] || "default"} className="capitalize">
                {event.status}
              </Badge>
              <h1 className="text-3xl font-bold text-foreground">{event.title}</h1>
              <p className="text-sm text-muted-foreground">{event.conductedBy}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => navigate("/events")} aria-label="Back to events">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Link to={`/events/edit/${event.id}`}>
              <Button className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Event
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {stat("Registrations", event.registrations ?? 0, Users)}
        {stat("Views", event.views ?? 0, Eye)}
        {stat("Completions", event.completions ?? 0, Trophy)}
      </div>

      <Tabs value={tab} onValueChange={setTab} className="space-y-6">
        <TabsList className="w-full grid grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="overview" className="gap-2">
            <FileText className="h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="schedule" className="gap-2">
            <Calendar className="h-4 w-4" /> Schedule
          </TabsTrigger>
          <TabsTrigger value="stages" className="gap-2">
            <ListOrdered className="h-4 w-4" /> Stages ({stages.length})
          </TabsTrigger>
          <TabsTrigger value="registrations" className="gap-2">
            <Users className="h-4 w-4" /> Registrations
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" /> Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About this event</CardTitle>
              <CardDescription>Key details and description</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm leading-relaxed text-foreground">{event.description}</p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {detailRow("Functional domain", event.functionalDomain)}
                {detailRow("Job role", event.jobRole)}
                {detailRow("Difficulty", event.difficultyLevel)}
                {detailRow("Subscription", event.subscriptionType)}
              </div>
              <div className="flex flex-wrap gap-2">
                {(event.categoryTags || []).map((t) => (
                  <Badge key={t} variant="secondary">{t}</Badge>
                ))}
                {(event.skills || []).map((s) => (
                  <Badge key={s} variant="outline">{s}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {(event.whatsInItForYou || event.instructions || event.faq) && (
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { title: "What's in it for you", body: event.whatsInItForYou },
                { title: "Instructions", body: event.instructions },
                { title: "FAQ", body: event.faq },
              ]
                .filter((b) => b.body)
                .map((b) => (
                  <Card key={b.title}>
                    <CardHeader>
                      <CardTitle className="text-base">{b.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed">{b.body}</p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Schedule & mode</CardTitle>
              <CardDescription>Registration window and event timing</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {detailRow("Registration starts", formatDate(event.registrationStartDate))}
              {detailRow("Registration ends", formatDate(event.registrationEndDate))}
              {detailRow("Event date", formatDate(event.eventDate))}
              {detailRow("Event time", event.eventTime)}
              {detailRow("Mode", event.mode)}
              {detailRow("Venue", event.venue || (event.mode === "online" ? "Online" : undefined))}
              {detailRow("Expert", event.expertName)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stage timeline</CardTitle>
              <CardDescription>Planned dates for each activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stages.length === 0 && <p className="text-sm text-muted-foreground">No stages configured yet.</p>}
              {stages.map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{s.title}</p>
                      <p className="text-xs text-muted-foreground">{stageTypeLabel[s.type]}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(s.startDate)} → {formatDate(s.endDate)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stages">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListOrdered className="h-5 w-5" /> Event stages
              </CardTitle>
              <CardDescription>Activities and flow in order</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stages.length === 0 && (
                <p className="text-sm text-muted-foreground">No activities configured for this event yet.</p>
              )}
              {stages.map((s, index) => {
                const stageResponses = responses.filter((r) => r.stageId === s.id);
                return (
                  <div key={s.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full border-2 border-primary flex items-center justify-center font-semibold">
                        {index + 1}
                      </div>
                      {index < stages.length - 1 && <div className="flex-1 w-0.5 bg-border my-2" />}
                    </div>
                    <div className="flex-1 rounded-lg border p-5 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold">{s.title}</h3>
                          <Badge variant="secondary">{stageTypeLabel[s.type]}</Badge>
                          <Badge variant={s.status === "ready" ? "default" : "outline"} className="capitalize">
                            {s.status}
                          </Badge>
                        </div>
                        <Link to={`/events/${event.id}/stages/${s.id}/responses`}>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Eye className="h-4 w-4" />
                            View Responses ({stageResponses.length})
                          </Button>
                        </Link>
                      </div>
                      {s.description && <p className="text-sm text-muted-foreground">{s.description}</p>}
                      <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                        {s.duration ? (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" /> {s.duration} min
                          </span>
                        ) : null}
                        {s.points ? (
                          <span className="flex items-center gap-1">
                            <Trophy className="h-4 w-4" /> {s.points} points
                          </span>
                        ) : null}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" /> {formatDate(s.startDate)} → {formatDate(s.endDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" /> {stageResponses.length} submissions
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="registrations">
          <Card>
            <CardHeader>
              <CardTitle>Registrations</CardTitle>
              <CardDescription>Learners who have engaged with this event</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Learner</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Stages attempted</TableHead>
                      <TableHead>Last activity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.values(
                      responses.reduce<Record<string, { name: string; email: string; count: number; last: string }>>(
                        (acc, r) => {
                          const cur = acc[r.learnerId] || { name: r.learnerName, email: r.learnerEmail, count: 0, last: r.submittedAt };
                          cur.count += 1;
                          if (r.submittedAt > cur.last) cur.last = r.submittedAt;
                          acc[r.learnerId] = cur;
                          return acc;
                        },
                        {}
                      )
                    ).map((l) => (
                      <TableRow key={l.email}>
                        <TableCell className="font-medium">{l.name}</TableCell>
                        <TableCell>{l.email}</TableCell>
                        <TableCell>{l.count}</TableCell>
                        <TableCell>{formatDate(l.last)}</TableCell>
                      </TableRow>
                    ))}
                    {responses.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No registrations with activity yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Registration settings</CardTitle>
              <CardDescription>Approval, seats and fees</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {detailRow("Approval", event.registrationSettings?.approval)}
              {detailRow("Max seats", event.registrationSettings?.maxSeats ?? "Unlimited")}
              {detailRow("Waitlist", event.registrationSettings?.enableWaitlist ? "Enabled" : "Disabled")}
              {detailRow("Event fee", event.registrationSettings?.eventFee ? `₹${event.registrationSettings.eventFee}` : "Free")}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Eligibility</CardTitle>
              <CardDescription>Who can register for this event</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {detailRow("Audience", event.eligibility?.type)}
              {detailRow("Gender restriction", event.eligibility?.genderRestriction)}
              {detailRow("Colleges", event.eligibility?.colleges?.join(", ") || "All")}
              {detailRow("Organizations", event.eligibility?.organizations?.join(", ") || "All")}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" /> Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {detailRow("Created", formatDate(event.createdAt))}
              {detailRow("Updated", formatDate(event.updatedAt))}
              {detailRow("Published", formatDate(event.publishedAt))}
              {detailRow("Created by", event.createdBy)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventDetail;
