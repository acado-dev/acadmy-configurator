import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, FileText, Link2, Star, Video, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EventAnswer, getEvent, getEventResponse, stageTypeLabel } from "@/lib/eventStorage";

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const isCorrect = (a: EventAnswer) =>
  !!a.selected &&
  !!a.correct &&
  a.selected.length === a.correct.length &&
  a.selected.every((s) => a.correct?.includes(s));

const EventResponseDetail = () => {
  const { id, stageId, responseId } = useParams();
  const navigate = useNavigate();

  const event = useMemo(() => getEvent(id), [id]);
  const stage = event?.stages?.find((s) => s.id === stageId);
  const response = useMemo(() => getEventResponse(responseId), [responseId]);

  if (!event || !stage || !response) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="py-16 text-center space-y-4">
            <p className="text-muted-foreground">This response could not be found.</p>
            <Button onClick={() => navigate("/events")}>Back to Events</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const correctCount = (response.answers || []).filter((a) => a.type !== "descriptive" && isCorrect(a)).length;
  const objectiveCount = (response.answers || []).filter((a) => a.type !== "descriptive").length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-start gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(`/events/${event.id}/stages/${stage.id}/responses`)}
          aria-label="Back to responses"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <p className="text-sm text-muted-foreground">
            {event.title} · {stage.title}
          </p>
          <h1 className="text-3xl font-bold text-foreground">{response.learnerName}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant="secondary">{stageTypeLabel[stage.type]}</Badge>
            <Badge variant="outline">{response.learnerEmail}</Badge>
            <Badge variant={response.status === "evaluated" ? "default" : "secondary"} className="capitalize">
              {response.status.replace("_", " ")}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="py-6">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Score</p>
            <p className="text-2xl font-bold mt-1">
              {response.score !== undefined ? `${response.score}/${response.maxScore}` : "Pending"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Result</p>
            <p className="text-2xl font-bold mt-1 capitalize">{response.result || "Pending"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Submitted on</p>
            <p className="text-2xl font-bold mt-1">{formatDateTime(response.submittedAt)}</p>
          </CardContent>
        </Card>
      </div>

      {response.activityKind === "assessment" && response.answers && (
        <Card>
          <CardHeader>
            <CardTitle>Assessment attempt</CardTitle>
            <CardDescription>
              {correctCount} of {objectiveCount} objective questions answered correctly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {response.answers.map((a, index) => {
              const objective = a.type !== "descriptive";
              const correct = objective && isCorrect(a);
              return (
                <div key={a.questionId} className="rounded-lg border p-5 space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <p className="font-medium text-foreground">
                      Q{index + 1}. {a.question}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{a.marks} marks</Badge>
                      {objective ? (
                        correct ? (
                          <Badge className="gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Correct
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="gap-1">
                            <XCircle className="h-3 w-3" /> Incorrect
                          </Badge>
                        )
                      ) : (
                        <Badge variant="secondary">Subjective</Badge>
                      )}
                    </div>
                  </div>

                  {a.options && (
                    <div className="space-y-2">
                      {a.options.map((opt) => {
                        const selected = a.selected?.includes(opt);
                        const right = a.correct?.includes(opt);
                        return (
                          <div
                            key={opt}
                            className={`flex items-center justify-between rounded-md border px-4 py-2 text-sm ${
                              right ? "border-primary bg-primary-light" : selected ? "border-destructive" : ""
                            }`}
                          >
                            <span>{opt}</span>
                            <span className="flex gap-2">
                              {selected && <Badge variant="secondary">Learner's answer</Badge>}
                              {right && <Badge variant="outline">Correct answer</Badge>}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {a.type === "descriptive" && (
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Learner's answer</p>
                      <p className="text-sm leading-relaxed rounded-md bg-muted p-4">{a.answerText || "No answer submitted."}</p>
                    </div>
                  )}

                  <Separator />
                  <p className="text-sm text-muted-foreground">
                    Marks awarded: <span className="font-medium text-foreground">{a.awarded ?? 0}</span> / {a.marks}
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {response.activityKind === "assignment" && response.submission && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" /> Assignment submission
            </CardTitle>
            <CardDescription>
              {response.submission.submittedLate ? "Submitted after the deadline" : "Submitted within the deadline"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {response.submission.text && (
              <p className="text-sm leading-relaxed rounded-md bg-muted p-4">{response.submission.text}</p>
            )}
            {response.submission.fileName && (
              <div className="flex items-center justify-between rounded-md border px-4 py-3">
                <span className="text-sm font-medium">{response.submission.fileName}</span>
                <Badge variant="outline" className="gap-1">
                  <Link2 className="h-3 w-3" /> Attachment
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {response.activityKind === "interview" && response.interview && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" /> Interview response
            </CardTitle>
            <CardDescription>
              {response.interview.platform ? `${response.interview.platform} session` : "Interview session"}
              {response.interview.interviewer ? ` · ${response.interview.interviewer}` : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-md border p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Meeting link</p>
                <p className="text-sm font-medium break-all">{response.interview.meetingLink || "—"}</p>
              </div>
              <div className="rounded-md border p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Rating</p>
                <p className="text-sm font-medium flex items-center gap-1">
                  <Star className="h-4 w-4 text-primary" />
                  {response.interview.rating ? `${response.interview.rating} / 5` : "Not rated"}
                </p>
              </div>
            </div>

            {(response.interview.questions || []).map((q, i) => (
              <div key={i} className="rounded-lg border p-5 space-y-2">
                <p className="font-medium">
                  Q{i + 1}. {q.question}
                </p>
                <p className="text-sm leading-relaxed rounded-md bg-muted p-4">{q.answer}</p>
              </div>
            ))}

            {response.interview.notes && (
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Interviewer notes</p>
                <p className="text-sm leading-relaxed">{response.interview.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {response.activityKind === "generic" && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground text-sm">
            This activity type does not collect learner responses.
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EventResponseDetail;
