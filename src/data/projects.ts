export type DocSection = {
  heading: string
  body?: string
  bullets?: string[]
  steps?: string[]
  table?: { head: string[]; rows: string[][] }
  code?: string
  image?: { src: string; alt: string }
}

export type ProjectDocs = {
  summary: string
  facts: { label: string; value: string }[]
  sections: DocSection[]
}

export type Project = {
  number: string
  name: string
  category: string
  status: string
  role?: string
  description: string
  highlights: string[]
  tags: string[]
  image: string
  imageAlt: string
  imageFit?: 'cover' | 'contain'
  liveUrl?: string
  githubUrl?: string
  privateNote?: string
  featured?: boolean
  docs?: ProjectDocs
}

export const projects: Project[] = [
  {
    number: '01',
    name: 'Maharat — Skilled Worker Marketplace',
    category: 'MOBILE APP · TEAM PROJECT',
    status: 'IN DEVELOPMENT',
    role: 'Developer, TechNest Nova team',
    description:
      'A hyperlocal marketplace app (مہارت) that connects customers with verified electricians, plumbers, mistris, carpenters, painters and labour contractors nearby. Customers post a job, nearby workers send offers, and the customer compares, books and reviews.',
    highlights: [
      'Three roles: customer, individual worker and labour contractor with team management',
      'Proximity-based job matching, so the app works in any city',
      'Simple, large-button worker UI built for low-end Android phones',
    ],
    tags: ['Flutter', 'Dart', 'FastAPI', 'PostgreSQL', 'Android', 'iOS'],
    image: '/images/projects/maharat.jpg',
    imageAlt: 'Maharat app screens: home with categories, offers list and worker profile',
    privateNote: 'Private repository · TechNest Nova',
    featured: true,
  },
  {
    number: '02',
    name: 'AI Resume Analyzer',
    category: 'BACKEND API · AI',
    status: 'BACKEND COMPLETE',
    description:
      'A secure REST API that reads a PDF resume and uses Llama 3.3 70B (via Groq) to return an ATS score out of 100, detected skills and concrete improvement suggestions. Every analysis is saved so users can track their progress.',
    highlights: [
      'JWT authentication with bcrypt-hashed passwords',
      'PDF text extraction with PyMuPDF and structured JSON output from the LLM',
      'PostgreSQL history and stats with SQLAlchemy and Alembic migrations',
    ],
    tags: ['Python', 'FastAPI', 'PostgreSQL', 'SQLAlchemy', 'JWT', 'Groq', 'Llama 3.3'],
    image: '/images/projects/ai-resume-analyzer.jpg',
    imageAlt: 'AI Resume Analyzer API endpoints and a sample ATS score response',
    githubUrl: 'https://github.com/shaaf445/ai-resume-analyzer',
    docs: {
      summary:
        'AI Resume Analyzer helps job seekers improve their resume before applying. A signed-in user uploads a PDF; the API extracts the text, asks Llama 3.3 70B to review it like an Applicant Tracking System, and returns a score out of 100, the technical skills it found and a list of specific fixes. Every result is stored, so the user can re-upload an improved version and compare scores over time.',
      facts: [
        { label: 'Type', value: 'REST API (backend)' },
        { label: 'Language', value: 'Python 3' },
        { label: 'Framework', value: 'FastAPI' },
        { label: 'AI model', value: 'Llama 3.3 70B via Groq' },
        { label: 'Database', value: 'PostgreSQL' },
        { label: 'Auth', value: 'JWT Bearer tokens' },
      ],
      sections: [
        {
          heading: 'Problem and solution',
          body:
            'Most companies filter resumes with Applicant Tracking Systems before a person reads them, and candidates rarely know why they were rejected. This API gives instant, objective feedback: an ATS-style score, the skills a recruiter will see and a short to-do list of improvements, all saved to the user’s history.',
        },
        {
          heading: 'Architecture',
          body: 'A layered FastAPI project: thin route handlers delegate to a services layer, and SQLAlchemy models persist results.',
          code: `Client (Swagger /docs, Postman, frontend) ── Bearer JWT
        │
        ▼
FastAPI routers
  /auth     register · login            (bcrypt + JWT)
  /profile  current user
  /resume   upload · history · delete · stats
        │                           │
        ▼ SQLAlchemy                ▼ services
PostgreSQL                     pdf_service  → PyMuPDF text extraction
  users 1 ─── N resumes        ai_service   → ATS prompt, JSON parsing
  (Alembic migrations)         ats_service  → job-match engine
                                     │
                                     ▼
                               Groq API · llama-3.3-70b-versatile`,
        },
        {
          heading: 'How a resume is analysed',
          steps: [
            'The user signs in at /auth/login and receives a JWT access token (60-minute expiry).',
            'The client uploads a PDF to POST /resume/upload with the token in the Authorization header.',
            'The API checks the file is a PDF, saves it and extracts the text from every page with PyMuPDF.',
            'The text is sent to Llama 3.3 70B with a prompt that asks for a fixed JSON shape: score, skills and suggestions. Temperature 0.2 keeps scores consistent.',
            'The response is cleaned of markdown fences and parsed; a safe fallback is returned if the model replies in an unexpected format.',
            'The result is stored in the resumes table against the signed-in user and returned to the client.',
          ],
        },
        {
          heading: 'API reference',
          table: {
            head: ['Method', 'Endpoint', 'Auth', 'Description'],
            rows: [
              ['POST', '/auth/register', 'No', 'Create an account; the password is bcrypt-hashed and duplicate emails are rejected'],
              ['POST', '/auth/login', 'No', 'Verify credentials and return a JWT access token'],
              ['GET', '/profile/', 'Yes', 'Return the signed-in user’s id, name and email'],
              ['POST', '/resume/upload', 'Yes', 'Upload a PDF, run the AI analysis, save and return the result'],
              ['GET', '/resume/history', 'Yes', 'List all of the user’s previous analyses'],
              ['GET', '/resume/stats', 'Yes', 'Total resumes analysed, average score and best score'],
              ['DELETE', '/resume/delete/{resume_id}', 'Yes', 'Delete one analysis and its stored file (owner only)'],
            ],
          },
        },
        {
          heading: 'Example response',
          body: 'Illustrative output of POST /resume/upload:',
          code: `{
  "filename": "resume.pdf",
  "score": 82.5,
  "skills": ["Python", "FastAPI", "PostgreSQL", "Git"],
  "suggestions": [
    "Add measurable results to each project",
    "Include a short professional summary",
    "List cloud or deployment experience"
  ]
}`,
        },
        {
          heading: 'Data model',
          table: {
            head: ['Table', 'Columns', 'Relationship'],
            rows: [
              ['users', 'id, full_name, email (unique), password (hash), created_at', 'One user has many resumes'],
              ['resumes', 'id, filename, extracted_text, score (float), skills, suggestions, user_id', 'Each resume belongs to one user'],
            ],
          },
        },
        {
          heading: 'Security',
          bullets: [
            'Passwords are hashed with bcrypt (passlib); plain-text passwords are never stored.',
            'JWT tokens signed with a secret key; protected routes resolve the current user through a FastAPI dependency.',
            'Every history, stats and delete query is filtered by the signed-in user’s id, so users only see their own data.',
            'Only .pdf uploads are accepted; secrets live in a .env file, not in code.',
          ],
        },
        {
          heading: 'Run it locally',
          code: `git clone https://github.com/shaaf445/ai-resume-analyzer.git
cd ai-resume-analyzer
python -m venv venv && venv\\Scripts\\activate     # Windows
pip install fastapi uvicorn sqlalchemy psycopg2-binary alembic \\
            python-jose passlib[bcrypt] python-dotenv pymupdf groq python-multipart

# .env
DATABASE_URL=postgresql://user:password@localhost:5432/resume_db
SECRET_KEY=change-me
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
GROQ_API_KEY=your-groq-key

alembic upgrade head
uvicorn app.main:app --reload      # open http://127.0.0.1:8000/docs`,
        },
        {
          heading: 'Roadmap',
          bullets: [
            'Expose the job-description matcher as an endpoint (match %, matched and missing skills).',
            'AI job-fit analysis: send the resume and a job post together for a tailored score.',
            'React dashboard with upload, score history charts and side-by-side comparison.',
            'Downloadable PDF reports, Docker deployment and a pytest + GitHub Actions pipeline.',
          ],
        },
      ],
    },
  },
  {
    number: '03',
    name: 'AI ChatBot',
    category: 'CONVERSATIONAL AI',
    status: 'COMPLETE',
    description:
      'A conversational assistant with a FastAPI backend and a clean web chat interface. It sends each message with the session’s history to Llama 3.1 on Groq, so replies stay in context across the conversation.',
    highlights: [
      'REST endpoint /api/chat with Pydantic request and response models',
      'Per-session conversation memory for context-aware replies',
      'Lightweight HTML/CSS/JS chat UI that talks to the API',
    ],
    tags: ['Python', 'FastAPI', 'Groq', 'Llama 3.1', 'JavaScript'],
    image: '/images/projects/ai-chatbot.jpg',
    imageAlt: 'AI ChatBot web interface showing a conversation about REST APIs and FastAPI',
    githubUrl: 'https://github.com/shaaf445/AI_ChatBot',
    docs: {
      summary:
        'A general-purpose AI assistant: a FastAPI service wraps Groq’s fast Llama 3.1 8B model and keeps the conversation history per session, and a single-page web UI provides the chat experience.',
      facts: [
        { label: 'Type', value: 'Web app + REST API' },
        { label: 'Backend', value: 'FastAPI' },
        { label: 'AI model', value: 'Llama 3.1 8B Instant (Groq)' },
        { label: 'Frontend', value: 'HTML, CSS, JavaScript' },
      ],
      sections: [
        {
          heading: 'How it works',
          steps: [
            'The user types a message in the chat UI and presses Send or Enter.',
            'The browser POSTs { message, session_id } to /api/chat.',
            'The API rejects empty messages, then builds the prompt: a system instruction, the session’s previous messages and the new message.',
            'Groq returns the reply (temperature 0.7, up to 700 tokens); both turns are appended to the session history.',
            'The reply is returned as { response, session_id } and rendered as a chat bubble.',
          ],
        },
        {
          heading: 'API reference',
          table: {
            head: ['Method', 'Endpoint', 'Body', 'Returns'],
            rows: [
              ['GET', '/', '—', 'Health message and available endpoints'],
              ['POST', '/api/chat', '{ "message": "...", "session_id": "default" }', '{ "response": "...", "session_id": "default" }'],
            ],
          },
        },
        {
          heading: 'Run it locally',
          code: `git clone https://github.com/shaaf445/AI_ChatBot.git
cd AI_ChatBot
pip install -r requirements.txt
echo GROQ_API_KEY=your-key > .env
uvicorn app.main:app --reload
# then open static/index.html in the browser`,
        },
        {
          heading: 'Next steps',
          bullets: ['Stream tokens for live typing', 'Persist history in a database', 'Markdown and code rendering in replies', 'Deploy with a public demo link'],
        },
      ],
    },
  },
  {
    number: '04',
    name: 'AI Lead Qualification Automation',
    category: 'AI AUTOMATION · N8N',
    status: 'CLIENT WORKFLOW',
    description:
      'A 31-node n8n workflow that runs every 5 minutes: it picks up new hotel-deal leads, removes duplicates, validates emails with AI, scores each deal 0–100 with GPT-4o-mini and routes it to a fast path or a human reviewer, keeping Supabase and Google Sheets in sync.',
    highlights: [
      'Duplicate detection on 9 property attributes and AI email validation (valid / spam)',
      'Deep AI deal analysis with a weighted 0–100 scoring model and decision bands',
      'Human-in-the-loop approval by email: Confirm, Reject or Review Manually',
    ],
    tags: ['n8n', 'OpenAI GPT-4o-mini', 'Supabase', 'Google Sheets', 'Gmail'],
    image: '/images/projects/lead-qualification.jpg',
    imageAlt: 'Lead Qualification Automation Workflow diagram built with n8n',
    imageFit: 'cover',
    featured: true,
    docs: {
      summary:
        'An AI-assisted intake pipeline for hotel deal leads. Every five minutes it fetches new leads, filters out duplicates and spam, has GPT-4o-mini analyse the deal and score it from 0 to 100, and either fast-tracks strong deals or sends a report to a human reviewer for a decision. Supabase and Google Sheets are updated with the final status at every step.',
      facts: [
        { label: 'Platform', value: 'n8n' },
        { label: 'Nodes', value: '31' },
        { label: 'Schedule', value: 'Every 5 minutes' },
        { label: 'AI model', value: 'OpenAI GPT-4o-mini' },
        { label: 'Storage', value: 'Supabase + Google Sheets' },
        { label: 'Score', value: '0–100 per deal' },
      ],
      sections: [
        { heading: 'Workflow diagram', image: { src: '/images/projects/lead-qualification-diagram.jpg', alt: 'Full Lead Qualification Automation Workflow diagram' } },
        {
          heading: 'Pipeline',
          steps: [
            'Schedule Trigger runs the workflow every 5 minutes.',
            'Fetch New Leads reads every record in the Supabase demo_leads table with status “new”.',
            'Duplicate Check groups leads by 9 property attributes (name, location, type, rooms, price, revenue, NOI, occupancy, ADR); duplicates are logged to a sheet and stopped.',
            'Email Validation: GPT-4o-mini flags test and placeholder domains as spam; spam is saved and stopped.',
            'Deep Lead Analysis: GPT-4o-mini produces a deal report with price per room, price-to-revenue, NOI yield, NOI margin and revenue per room, plus a 0–100 score.',
            'Structured Output converts the AI answer into clean fields: score, decision, confidence, summary, strengths, risks and next action.',
            'Score Check: 90 or above takes the fast path (approved + email); below 90 goes to human review.',
            'The reviewer chooses Confirm, Reject or Review Manually from an HTML email, and Supabase and Sheets are updated accordingly.',
          ],
        },
        {
          heading: 'AI scoring model',
          table: {
            head: ['Factor', 'Weight'],
            rows: [['Performance', '30'], ['Completeness', '20'], ['Documents', '20'], ['Property & contact', '15'], ['Consistency', '15']],
          },
        },
        {
          heading: 'Decision bands',
          bullets: ['90–100: high priority, fast path', '61–89: human review', '0–60: more information needed'],
        },
      ],
    },
  },
  {
    number: '05',
    name: 'Automated Student Admission System',
    category: 'AI AUTOMATION · N8N',
    status: 'WORKFLOW BUILT',
    description:
      'An end-to-end admission workflow in n8n: from the online form through validation, AI application review, eligibility, application ID, fee invoice and payment check, to student ID, course registration, orientation scheduling and a Google Sheets student database — with an email at every step.',
    highlights: [
      'Two decision gates: required documents and AI eligibility review',
      'Auto-generated application ID, fee invoice and student ID',
      'Orientation scheduling, welcome email and 16-column student database',
    ],
    tags: ['n8n', 'OpenAI', 'Gmail', 'Google Sheets', 'JavaScript'],
    image: '/images/projects/student-admission.jpg',
    imageAlt: 'n8n workflow diagram for the Automated Student Admission System',
    githubUrl: 'https://github.com/shaaf445/n8n-Automated-Student-Admission-System',
    docs: {
      summary:
        'This n8n workflow automates a university’s admission journey. A student submits one form; the workflow validates it, checks documents, has AI do an initial review, issues an application ID and fee invoice, waits for payment, then registers the student, enrols them in their programme, schedules orientation and records everything in a Google Sheets database — emailing the student at each milestone.',
      facts: [
        { label: 'Platform', value: 'n8n' },
        { label: 'Trigger', value: 'n8n Form' },
        { label: 'AI', value: 'OpenAI (initial review)' },
        { label: 'Email', value: 'Gmail' },
        { label: 'Database', value: 'Google Sheets' },
        { label: 'Programmes', value: 'BSCS, BSSE, BBA, BSAI, BSDS' },
      ],
      sections: [
        { heading: 'Workflow diagram', image: { src: '/images/projects/student-admission.jpg', alt: 'Student admission n8n workflow' } },
        {
          heading: 'Workflow steps',
          steps: [
            'Student Admission Form collects name, email, phone, date of birth, CNIC, programme, previous qualification and institution, percentage/CGPA, address and documents.',
            'Validate Student Information (Code) checks every required field and sets validationStatus and validationErrors.',
            'Check Required Documents (IF): missing documents trigger a Missing Documents email.',
            'AI Application Review (OpenAI) checks completeness, consistency and basic eligibility and returns PASS or REVIEW_REQUIRED with reasons.',
            'Check Eligibility (IF): REVIEW_REQUIRED sends a review-required email; PASS continues.',
            'Generate Application ID (APP-2026-XXXXXX) and send the admission confirmation email.',
            'Generate Fee Invoice (INV-2026-XXXXXX, status Pending) and email it to the student.',
            'Check Payment Status (IF): unpaid sends a payment reminder; paid continues.',
            'Generate Student ID, register the student and register the course.',
            'Schedule Orientation (7 days after registration, 10:00 AM, Main Campus) and send the welcome email.',
            'Save the student to the Google Sheets database and send the final admission confirmation.',
          ],
        },
        {
          heading: 'Emails sent',
          table: {
            head: ['Email', 'When'],
            rows: [
              ['Missing Documents', 'Documents were not uploaded'],
              ['Review Required', 'AI review did not pass'],
              ['Admission Confirmation', 'Application passed review; includes Application ID'],
              ['Fee Invoice', 'Invoice generated'],
              ['Payment Reminder', 'Invoice is still unpaid'],
              ['Welcome & Orientation', 'Student registered; includes Student ID and orientation details'],
              ['Final Admission Confirmation', 'Record saved to the database'],
            ],
          },
        },
        {
          heading: 'Notes',
          bullets: [
            'The AI review is an initial screening only; it never makes the final admission decision.',
            'Payment is simulated with an invoiceStatus field and is ready to connect to a real payment gateway.',
          ],
        },
      ],
    },
  },
  {
    number: '06',
    name: 'AI Invoice Processing & Priority Alerts',
    category: 'AI AUTOMATION · ZAPIER',
    status: 'LIVE ZAP',
    description:
      'A 12-step Zapier automation that picks up invoice attachments from Gmail, parses them with PDF.co’s AI Invoice Parser, classifies them with AI, logs every invoice in Google Sheets and routes Slack alerts by value.',
    highlights: [
      'Gmail trigger with filter conditions to catch only invoice attachments',
      'AI extraction and classification of invoice data',
      'Paths split into High, Medium and Low value Slack alerts',
    ],
    tags: ['Zapier', 'Gmail', 'PDF.co', 'AI by Zapier', 'Google Sheets', 'Slack'],
    image: '/images/projects/invoice-automation.jpg',
    imageAlt: 'Zapier workflow: Gmail, filter, PDF.co parser, AI, Google Sheets and three Slack paths',
    githubUrl: 'https://github.com/shaaf445/AI-Powered-Invoice-Processing-Priority-Alert-System-',
    docs: {
      summary:
        'Finance teams receive invoices as email attachments and often notice urgent ones too late. This Zap reads every new invoice automatically, extracts its data, records it and alerts the right Slack channel based on the invoice’s value.',
      facts: [
        { label: 'Platform', value: 'Zapier' },
        { label: 'Steps', value: '12' },
        { label: 'Trigger', value: 'Gmail new attachment' },
        { label: 'Parser', value: 'PDF.co AI Invoice Parser' },
      ],
      sections: [
        {
          heading: 'Workflow',
          steps: [
            'Gmail — New Attachment triggers the Zap.',
            'Filter by Zapier lets only invoice emails continue.',
            'PDF.co AI Invoice Parser extracts vendor, amounts, dates and line items.',
            'AI by Zapier classifies the invoice and prepares a summary.',
            'Google Sheets creates a row for every processed invoice.',
            'Paths by Zapier routes High, Medium and Low value invoices, each to its own Slack channel message.',
          ],
        },
        { heading: 'Result', bullets: ['No manual data entry for invoices', 'A complete invoice log in Google Sheets', 'High-value invoices reach the team instantly in Slack'] },
      ],
    },
  },
]
