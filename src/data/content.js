// Centralised content for the portfolio. Edit here, not in components.

export const PROFILE = {
    name: "Souvik Sarkar",
    firstName: "Souvik",
    role: "Associate Product Manager",
    company: "Fyn Mobility",
    location: "Bengaluru, India",
    email: "svksarkar36@gmail.com",
    phone: "+91 8974105592",
    linkedin: "https://www.linkedin.com/in/souvik-sarkar-81a573211/",
    github: "https://github.com/svksarkar36-web",
    resumeUrl: "/assets/SouvikSarkar_Resume.pdf",
    tagline: "Building scalable, human-centred products at the intersection of AI, operations & logistics.",
    intro: "Four years turning messy operations into elegant product surfaces — across fleet tech, drone-assisted inspection and AI-enabled workflows.",
};

export const METRICS = [
    { label: "Onboarding Efficiency", value: 50, suffix: "%", prefix: "+", note: "driver module @ Fyn" },
    { label: "MRR Impact", value: 20, suffix: "L", prefix: "₹", note: "B2B + B2C initiatives" },
    { label: "Years Shipping", value: 4, suffix: "+", prefix: "", note: "ops → product" },
    { label: "Products Scaled", value: 6, suffix: "", prefix: "", note: "platforms & modules" },
];

export const EXPERIENCE = [
    {
        period: "Sep 2025 — Now",
        role: "Product Specialist",
        company: "Fyn Mobility",
        location: "Bengaluru",
        bullets: [
            "End-to-end product lifecycle for fleet ops, driver management & logistics workflows.",
            "Partnering with Eng, AI/ML & Design to ship intelligent automation across payments, compliance & incentives.",
            "Defining PRDs, prioritising backlog, instrumenting success metrics with Mixpanel & SQL.",
        ],
        impact: ["50% faster driver onboarding", "₹20L recurring MRR", "Fyn Guide multilingual KB"],
    },
    {
        period: "Apr 2024 — Sep 2025",
        role: "Operations Team Lead",
        company: "Zeitview",
        location: "Bengaluru · APAC",
        bullets: [
            "Directed APAC operational delivery programs, owning SLAs & timelines.",
            "Strategic liaison between Operations, Product & Engineering — translated ops insights into roadmap.",
            "Built automation initiatives that improved scalability and reduced manual QC.",
        ],
        impact: ["Cross-functional roadmap influence", "Automation rollout", "Process-quality wins"],
    },
    {
        period: "Feb 2023 — Mar 2024",
        role: "Senior Engineer",
        company: "Zeitview",
        location: "Bengaluru",
        bullets: [
            "Collaborated on AI-assisted inspection platforms — fed business insights to product.",
            "Led process improvement focused on automation, operational efficiency & data quality.",
            "Improved annotation pipelines feeding ML models.",
        ],
        impact: ["ML data-quality boost", "Workflow automation", "Platform usability uplift"],
    },
    {
        period: "Jul 2022 — Jan 2023",
        role: "GIS Analyst",
        company: "Zeitview (formerly DroneBase)",
        location: "Bengaluru",
        bullets: [
            "Geospatial analysis & QC for drone-captured imagery on US solar assets (CASS).",
            "Built repeatable QC workflows that reduced rework downstream.",
        ],
        impact: ["California solar inspection", "GIS QC pipeline"],
    },
];

export const CASE_STUDIES = [
    {
        id: "fyn-guide",
        title: "Fyn Guide",
        subtitle: "Multilingual enterprise knowledge platform",
        tag: "AI · Knowledge",
        span: "lg:col-span-7 lg:row-span-2",
        image: "https://images.pexels.com/photos/3850263/pexels-photo-3850263.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=1200",
        summary: "Designed a self-serve knowledge platform that gives 1000+ drivers instant answers in their native language — reducing support tickets and onboarding friction.",
        results: ["Multilingual coverage", "Self-serve adoption", "Lower support load"],
    },
    {
        id: "website-redesign",
        title: "Fyn · Website Redesign",
        subtitle: "Digital presence & engagement uplift",
        tag: "UX · Web",
        span: "lg:col-span-5 lg:row-span-2",
        image: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&w=1400&q=80",
        summary: "Led the company website redesign — sharper narrative, faster conversions, cleaner UX. Strengthened the brand surface for B2B prospects.",
        results: ["Stronger narrative", "Better engagement", "B2B-ready surface"],
    },
];

export const NOTABLE_WORK = [
    {
        id: "driver-onboarding",
        title: "Driver Onboarding Revamp",
        metric: "+50%",
        metricLabel: "efficiency",
        tag: "Workflow · Fyn",
        summary: "Re-architected the driver onboarding flow end-to-end. Removed redundant steps, added smart validation, shipped a 50% efficiency gain with zero added headcount.",
        chips: ["+50% efficiency", "Fewer drop-offs", "Compliant by default"],
    },
    {
        id: "cass-drone",
        title: "CASS · Solar Inspection",
        metric: "1000s",
        metricLabel: "assets QC'd",
        tag: "Drone · GIS · Zeitview",
        summary: "Built the QC pipeline for California-based renewable-energy asset inspection — handling thermal imagery from drones and aeroplanes at scale.",
        chips: ["Thermal imagery", "Repeatable pipeline", "ML training data"],
    },
    {
        id: "mrr-impact",
        title: "₹20L+ MRR Impact",
        metric: "₹20L",
        metricLabel: "monthly recurring",
        tag: "Revenue · Fyn",
        summary: "Drove ~₹20 lakhs in recurring monthly revenue through a portfolio of B2B & B2C product initiatives — payments, compliance, incentives, fleet lifecycle modules.",
        chips: ["B2B + B2C", "Payments & incentives", "Compounding revenue"],
    },
];

export const SKILLS = {
    product: [
        "Product Lifecycle",
        "Roadmap Strategy",
        "AI Product Mgmt",
        "User Journey Mapping",
        "Agile / Scrum",
        "PRDs & Specs",
        "Discovery",
        "Stakeholder Mgmt",
    ],
    data: ["SQL", "Mixpanel", "Power BI", "Python", "Excel"],
    tools: ["Jira", "Figma", "Miro", "Confluence", "Canva"],
};

export const EDUCATION = [
    {
        period: "2024 — 2025",
        title: "Certified Associate Product Manager",
        org: "Institute of Product Leadership",
    },
    {
        period: "2021 — 2022",
        title: "PG Diploma · Applied Geoinformatics",
        org: "Jadavpur University",
    },
    {
        period: "2019 — 2021",
        title: "M.Sc · Geoinformatics",
        org: "Adamas University",
    },
    {
        period: "2016 — 2019",
        title: "B.Sc · Environmental Science",
        org: "Maharaja Bir Bikram College",
    },
];

export const CERTS = [
    "Product Strategy — Product School",
    "Product Discovery — Product School",
    "Product Analytics — Product School",
    "Foundations of PM — Google",
    "Vibe Coding",
];
