import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Eye, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getEvent, getEventResponses, stageTypeLabel } from "@/lib/eventStorage";

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const EventActivityResponses = () => {
  const { id, stageId } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const event = useMemo(() => getEvent(id), [id]);
  const stage = event?.stages?.find((s) => s.id === stageId);
  const responses = useMemo(
    () => (event && stageId ? getEventResponses(event.id, stageId) : []),
    [event, stageId]
  );

  if (!event || !stage) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="py-16 text-center space-y-4">
            <p className="text-muted-foreground">This activity could not be found.</p>
            <Button onClick={() => navigate("/events")}>Back to Events</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filtered = responses.filter((r) => {
    const q = query.toLowerCase();
    const matchesQuery =
      !q || r.learnerName.toLowerCase().includes(q) || r.learnerEmail.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-start gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(`/events/${event.id}`)} aria-label="Back to event">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <p className="text-sm text-muted-foreground">{event.title}</p>
          <h1 className="text-3xl font-bold text-foreground">{stage.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary">{stageTypeLabel[stage.type]}</Badge>
            <Badge variant="outline">{responses.length} submissions</Badge>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Learner responses</CardTitle>
          <CardDescription>Learners who attempted or submitted this activity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by learner name or email..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="evaluated">Evaluated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Learner</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Submitted on</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Score / Result</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No responses recorded for this activity yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.learnerName}</TableCell>
                      <TableCell>{r.learnerEmail}</TableCell>
                      <TableCell>{formatDateTime(r.submittedAt)}</TableCell>
                      <TableCell>
                        <Badge variant={r.status === "evaluated" ? "default" : "secondary"} className="capitalize">
                          {r.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {r.score !== undefined ? (
                          <span className="font-medium">
                            {r.score}/{r.maxScore}{" "}
                            <Badge
                              variant={r.result === "pass" ? "default" : r.result === "fail" ? "destructive" : "outline"}
                              className="ml-1 capitalize"
                            >
                              {r.result}
                            </Badge>
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Pending evaluation</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link to={`/events/${event.id}/stages/${stage.id}/responses/${r.id}`}>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Eye className="h-4 w-4" />
                            View Response
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <p className="text-sm text-muted-foreground">
            Showing {filtered.length} of {responses.length} responses
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventActivityResponses;
