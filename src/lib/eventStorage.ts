import { Event, EventStage } from "@/types/event";

export const EVENTS_KEY = "events";
export const EVENT_RESPONSES_KEY = "eventActivityResponses";

export type EventResponseStatus = "in_progress" | "submitted" | "evaluated";

export interface EventAnswer {
  questionId: string;
  question: string;
  type: "mcq_single" | "mcq_multiple" | "true_false" | "descriptive";
  options?: string[];
  selected?: string[];
  correct?: string[];
  answerText?: string;
  marks: number;
  awarded?: number;
}

export interface EventActivityResponse {
  id: string;
  eventId: string;
  stageId: string;
  activityKind: "assessment" | "assignment" | "interview" | "generic";
  learnerId: string;
  learnerName: string;
  learnerEmail: string;
  submittedAt: string;
  status: EventResponseStatus;
  score?: number;
  maxScore?: number;
  result?: "pass" | "fail" | "pending";
  answers?: EventAnswer[];
  submission?: {
    text?: string;
    fileName?: string;
    fileUrl?: string;
    submittedLate?: boolean;
  };
  interview?: {
    platform?: string;
    meetingLink?: string;
    videoUrl?: string;
    interviewer?: string;
    rating?: number;
    notes?: string;
    questions?: { question: string; answer: string; marks?: number; awarded?: number }[];
  };
  remarks?: string;
}

const read = <T,>(key: string): T[] => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
};

const write = <T,>(key: string, value: T[]) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const iso = (daysFromNow: number, hour = 10) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

const stage = (
  id: string,
  type: EventStage["type"],
  title: string,
  description: string,
  order: number,
  duration?: number,
  points?: number
): EventStage => ({
  id,
  type,
  title,
  description,
  order,
  status: "ready",
  duration,
  points,
  startDate: iso(order - 4, 10),
  endDate: iso(order - 2, 18),
  createdAt: iso(-20),
  updatedAt: iso(-6),
});

const LEARNERS = [
  { id: "lrn-1", name: "Aarav Sharma", email: "aarav.sharma@example.com" },
  { id: "lrn-2", name: "Diya Patel", email: "diya.patel@example.com" },
  { id: "lrn-3", name: "Rohan Mehta", email: "rohan.mehta@example.com" },
  { id: "lrn-4", name: "Ananya Iyer", email: "ananya.iyer@example.com" },
  { id: "lrn-5", name: "Kabir Singh", email: "kabir.singh@example.com" },
];

const sampleEvents = (): Event[] => [
  {
    id: "event-sample-1",
    title: "Global MBA Admission Bootcamp",
    categoryTags: ["Admissions", "MBA"],
    conductedBy: "Acado",
    functionalDomain: "Management",
    jobRole: "Business Analyst",
    skills: ["Case Solving", "Communication"],
    difficultyLevel: "intermediate",
    subscriptionType: "free",
    isPopular: true,
    description:
      "A three day bootcamp preparing candidates for global MBA admissions with assessments, assignments and a panel interview.",
    whatsInItForYou: "Personalised feedback, mock interview and a shortlist for partner universities.",
    instructions: "Attend all stages in sequence. Submissions after the deadline are not evaluated.",
    faq: "Q: Is the bootcamp free? A: Yes, for registered learners.",
    registrationStartDate: iso(-25),
    registrationEndDate: iso(-8),
    eventDate: iso(-5),
    eventTime: "10:00",
    mode: "online",
    expertName: "Dr. Meera Kapoor",
    additionalInfo: "Sessions are recorded and shared with participants.",
    eligibility: { type: "students", genderRestriction: "all" },
    registrationSettings: { approval: "auto", maxSeats: 200, enableWaitlist: true },
    stages: [
      stage("stg-1-1", "notes", "Orientation & Guidelines", "Read the bootcamp handbook before starting.", 1, 20, 0),
      stage("stg-1-2", "assessment", "Aptitude Assessment", "Quantitative, verbal and logical reasoning test.", 2, 60, 100),
      stage("stg-1-3", "submission", "Case Study Assignment", "Submit a 1000 word case analysis.", 3, 120, 50),
      stage("stg-1-4", "video", "Video Introduction", "Record a 2 minute self introduction.", 4, 10, 20),
      stage("stg-1-5", "live_session", "Panel Interview", "Live interview with the admissions panel.", 5, 30, 30),
    ],
    status: "completed",
    createdAt: iso(-30),
    updatedAt: iso(-5),
    publishedAt: iso(-26),
    createdBy: "admin",
    registrations: 148,
    views: 2140,
    completions: 96,
  },
  {
    id: "event-sample-2",
    title: "Data Science Career Launchpad",
    categoryTags: ["Technology", "Careers"],
    conductedBy: "Acado Skills Lab",
    functionalDomain: "Analytics",
    jobRole: "Data Analyst",
    skills: ["Python", "SQL", "Statistics"],
    difficultyLevel: "beginner",
    subscriptionType: "paid",
    isPopular: true,
    description:
      "Hands-on hybrid event covering the data science hiring funnel with a screening assessment and a portfolio assignment.",
    whatsInItForYou: "Portfolio review and referrals to hiring partners.",
    instructions: "Bring a laptop with Python installed for the offline day.",
    registrationStartDate: iso(-12),
    registrationEndDate: iso(4),
    eventDate: iso(9),
    eventTime: "14:30",
    mode: "hybrid",
    venue: "Acado Campus, Bengaluru",
    expertName: "Rahul Verma",
    eligibility: { type: "everyone", genderRestriction: "all" },
    registrationSettings: { approval: "manual", maxSeats: 120, enableWaitlist: false, eventFee: 999 },
    stages: [
      stage("stg-2-1", "assessment", "Python & SQL Screening", "Screening test on Python basics and SQL joins.", 1, 45, 60),
      stage("stg-2-2", "submission", "Portfolio Assignment", "Share a notebook analysing the provided dataset.", 2, 180, 40),
      stage("stg-2-3", "live_session", "Mentor Interview", "Technical discussion with a mentor.", 3, 25, 30),
    ],
    status: "active",
    createdAt: iso(-14),
    updatedAt: iso(-2),
    publishedAt: iso(-12),
    createdBy: "admin",
    registrations: 87,
    views: 1310,
    completions: 21,
  },
  {
    id: "event-sample-3",
    title: "Design Thinking Sprint",
    categoryTags: ["Design", "Workshop"],
    conductedBy: "Acado Creative Studio",
    functionalDomain: "Design",
    jobRole: "Product Designer",
    skills: ["Ideation", "Prototyping"],
    difficultyLevel: "advanced",
    subscriptionType: "free",
    isPopular: false,
    description: "A one day offline sprint where teams move from problem framing to a clickable prototype.",
    registrationStartDate: iso(2),
    registrationEndDate: iso(20),
    eventDate: iso(26),
    eventTime: "09:30",
    mode: "offline",
    venue: "Design Lab, Mumbai",
    eligibility: { type: "professionals", genderRestriction: "all" },
    registrationSettings: { approval: "auto", enableWaitlist: true },
    stages: [
      stage("stg-3-1", "notes", "Pre-read: Sprint Playbook", "Sprint methodology primer.", 1, 30, 0),
      stage("stg-3-2", "submission", "Problem Statement Submission", "Submit the problem your team will solve.", 2, 60, 20),
    ],
    status: "draft",
    createdAt: iso(-4),
    updatedAt: iso(-1),
    createdBy: "admin",
    registrations: 0,
    views: 42,
    completions: 0,
  },
];

const assessmentAnswers = (variant: number): EventAnswer[] => {
  const base: EventAnswer[] = [
    {
      questionId: "q1",
      question: "If a train travels 240 km in 3 hours, what is its average speed?",
      type: "mcq_single",
      options: ["60 km/h", "70 km/h", "80 km/h", "90 km/h"],
      correct: ["80 km/h"],
      marks: 10,
    },
    {
      questionId: "q2",
      question: "Select all measures of central tendency.",
      type: "mcq_multiple",
      options: ["Mean", "Median", "Variance", "Mode"],
      correct: ["Mean", "Median", "Mode"],
      marks: 10,
    },
    {
      questionId: "q3",
      question: "A correlation of 0 always implies there is no relationship between two variables.",
      type: "true_false",
      options: ["True", "False"],
      correct: ["False"],
      marks: 5,
    },
    {
      questionId: "q4",
      question: "Describe a decision you made using data and the outcome it produced.",
      type: "descriptive",
      marks: 15,
    },
  ];

  const picks: Record<number, (string[] | undefined)[]> = {
    0: [["80 km/h"], ["Mean", "Median", "Mode"], ["False"], undefined],
    1: [["70 km/h"], ["Mean", "Median"], ["False"], undefined],
    2: [["80 km/h"], ["Mean", "Variance"], ["True"], undefined],
  };
  const texts = [
    "While running our college fest, I tracked ticket sales daily and shifted the promotion budget to Instagram after seeing it drive 60% of conversions. Sales grew 35% in the final week.",
    "I analysed our club's attendance sheet and moved sessions to Saturday mornings, which lifted average attendance from 12 to 21 members.",
    "I used a simple spreadsheet to compare vendor quotes for our workshop and saved about 18% of the budget.",
  ];

  const set = picks[variant % 3];
  return base.map((q, i) => {
    if (q.type === "descriptive") {
      return { ...q, answerText: texts[variant % 3], awarded: [12, 9, 7][variant % 3] };
    }
    const selected = set[i];
    const isCorrect =
      !!selected &&
      selected.length === (q.correct?.length ?? 0) &&
      selected.every((s) => q.correct?.includes(s));
    return { ...q, selected, awarded: isCorrect ? q.marks : 0 };
  });
};

const sampleResponses = (): EventActivityResponse[] => {
  const rows: EventActivityResponse[] = [];

  const assessmentStages = [
    { eventId: "event-sample-1", stageId: "stg-1-2", maxScore: 40 },
    { eventId: "event-sample-2", stageId: "stg-2-1", maxScore: 40 },
  ];

  assessmentStages.forEach((s, si) => {
    LEARNERS.slice(0, 4).forEach((l, i) => {
      const answers = assessmentAnswers(i + si);
      const score = answers.reduce((sum, a) => sum + (a.awarded ?? 0), 0);
      rows.push({
        id: `resp-${s.stageId}-${l.id}`,
        eventId: s.eventId,
        stageId: s.stageId,
        activityKind: "assessment",
        learnerId: l.id,
        learnerName: l.name,
        learnerEmail: l.email,
        submittedAt: iso(-(4 - i), 11 + i),
        status: i === 3 ? "submitted" : "evaluated",
        score,
        maxScore: s.maxScore,
        result: score >= s.maxScore * 0.5 ? "pass" : "fail",
        answers,
      });
    });
  });

  const assignmentStages = [
    { eventId: "event-sample-1", stageId: "stg-1-3", maxScore: 50 },
    { eventId: "event-sample-2", stageId: "stg-2-2", maxScore: 40 },
    { eventId: "event-sample-3", stageId: "stg-3-2", maxScore: 20 },
  ];

  assignmentStages.forEach((s, si) => {
    LEARNERS.slice(0, 3).forEach((l, i) => {
      rows.push({
        id: `resp-${s.stageId}-${l.id}`,
        eventId: s.eventId,
        stageId: s.stageId,
        activityKind: "assignment",
        learnerId: l.id,
        learnerName: l.name,
        learnerEmail: l.email,
        submittedAt: iso(-(3 - i), 15),
        status: i === 2 ? "submitted" : "evaluated",
        score: i === 2 ? undefined : [44, 38, 0][i] - si * 2,
        maxScore: s.maxScore,
        result: i === 2 ? "pending" : "pass",
        submission: {
          text:
            "My analysis focuses on the declining renewal rate in the tier-2 segment. I segmented customers by tenure, identified onboarding gaps in the first 30 days and proposed a guided activation checklist with a projected 6 point retention lift.",
          fileName: `${l.name.split(" ")[0].toLowerCase()}-submission.pdf`,
          fileUrl: "#",
          submittedLate: i === 1,
        },
      });
    });
  });

  const interviewStages = [
    { eventId: "event-sample-1", stageId: "stg-1-5", maxScore: 30 },
    { eventId: "event-sample-2", stageId: "stg-2-3", maxScore: 30 },
  ];

  interviewStages.forEach((s) => {
    LEARNERS.slice(0, 3).forEach((l, i) => {
      rows.push({
        id: `resp-${s.stageId}-${l.id}`,
        eventId: s.eventId,
        stageId: s.stageId,
        activityKind: "interview",
        learnerId: l.id,
        learnerName: l.name,
        learnerEmail: l.email,
        submittedAt: iso(-(2 - i), 12 + i),
        status: i === 2 ? "submitted" : "evaluated",
        score: i === 2 ? undefined : [26, 21][i],
        maxScore: s.maxScore,
        result: i === 2 ? "pending" : "pass",
        interview: {
          platform: "Zoom",
          meetingLink: "https://zoom.us/j/9876543210",
          videoUrl: "#",
          interviewer: "Dr. Meera Kapoor",
          rating: [4.5, 3.5, 0][i] || undefined,
          notes:
            i === 2
              ? "Interview completed, evaluation pending."
              : "Clear structure while answering, strong on motivation, needs more depth on quantitative examples.",
          questions: [
            { question: "Why this programme and why now?", answer: "I want to move from an analyst role into product strategy and this programme offers the case-based rigour I need." },
            { question: "Describe a time you led a team through conflict.", answer: "During our capstone project two members disagreed on scope, so I ran a prioritisation session and we shipped the reduced scope on time." },
            { question: "Where do you see yourself in five years?", answer: "Leading a product line in the education technology space." },
          ],
        },
      });
    });
  });

  return rows;
};

export const ensureEventSeed = () => {
  const existing = read<Event>(EVENTS_KEY);
  const samples = sampleEvents();
  const missing = samples.filter((s) => !existing.some((e) => e.id === s.id));
  if (missing.length) write(EVENTS_KEY, [...missing, ...existing]);

  if (read<EventActivityResponse>(EVENT_RESPONSES_KEY).length === 0) {
    write(EVENT_RESPONSES_KEY, sampleResponses());
  }
};

export const getEvents = (): Event[] => {
  ensureEventSeed();
  return read<Event>(EVENTS_KEY);
};

export const saveEvents = (events: Event[]) => write(EVENTS_KEY, events);

export const getEvent = (id?: string): Event | undefined =>
  getEvents().find((e) => e.id === id);

export const getEventResponses = (eventId: string, stageId?: string) => {
  ensureEventSeed();
  return read<EventActivityResponse>(EVENT_RESPONSES_KEY).filter(
    (r) => r.eventId === eventId && (!stageId || r.stageId === stageId)
  );
};

export const getEventResponse = (id?: string) => {
  ensureEventSeed();
  return read<EventActivityResponse>(EVENT_RESPONSES_KEY).find((r) => r.id === id);
};

export const updateEventResponse = (
  id: string,
  data: Partial<EventActivityResponse>
): EventActivityResponse | undefined => {
  ensureEventSeed();
  const all = read<EventActivityResponse>(EVENT_RESPONSES_KEY);
  const next = all.map((r) => (r.id === id ? { ...r, ...data } : r));
  write(EVENT_RESPONSES_KEY, next);
  return next.find((r) => r.id === id);
};


export const activityKindForStage = (
  type: EventStage["type"]
): EventActivityResponse["activityKind"] => {
  if (type === "assessment") return "assessment";
  if (type === "submission") return "assignment";
  if (type === "live_session" || type === "video") return "interview";
  return "generic";
};

export const stageTypeLabel: Record<EventStage["type"], string> = {
  assessment: "Assessment",
  submission: "Assignment",
  video: "Video Task",
  notes: "Notes / Reading",
  live_session: "Interview / Live Session",
};
