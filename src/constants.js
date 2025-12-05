// src/constants.js

// Investor model assumptions (same as your vanilla JS version)
export const INVESTOR_CONSTANTS = {
  paris: {
    revenuePerCase: 1370, // €
    costPerCase: 480,     // €
  },
  dubai: {
    sharePct: 0.5,
    costPerCase: 525      // €
  }
};

// Preset profiles for each region
// values are casesPerMonth & patientFee
export const PRESETS = {
  dubai: {
    conservative: { cases: 10, fee: 2600 },
    realistic:    { cases: 20, fee: 2800 },
    ambitious:    { cases: 40, fee: 3200 }
  },
  paris: {
    conservative: { cases: 10, fee: 2000 },
    realistic:    { cases: 20, fee: 2200 },
    ambitious:    { cases: 40, fee: 2500 }
  }
};

// Dentist assumptions
export const DENTIST_CONSTANTS = {
  timeSavedPerCaseHours: 0.5,
  avoidedInvestmentMin: 80000,
  avoidedInvestmentMax: 100000,
};

// G – full workflow steps for the process card
export const DENTIST_WORKFLOW = [
  {
    id: "lead",
    title: "1. Lead & Case Arrival",
    bullets: [
      "Patient is referred or generated as a lead for your clinic.",
      "You keep the relationship with the patient from A to Z.",
    ],
  },
  {
    id: "scans",
    title: "2. CBCT + Intraoral Scans",
    bullets: [
      "CBCT and intraoral scans are sent/uploaded to Ecodent360.",
      "All imaging & data processing handled by our digital team.",
    ],
  },
  {
    id: "planning",
    title: "3. 3D Planning & Guided Surgery",
    bullets: [
      "Prosthetic-driven 3D planning of the implants.",
      "Safe entry points, angulation and depth mapping validated.",
      "Guided surgery plan prepared and approved with you.",
    ],
  },
  {
    id: "kit",
    title: "4. Surgical Kit, Guides & Implants",
    bullets: [
      "Surgical guide is designed and 3D-printed.",
      "MSI France implants + components prepared (scan bodies, MU, Ti-base, screws…).",
      "Full kit is delivered ready-to-use for the surgery day.",
    ],
  },
  {
    id: "surgery",
    title: "5. Surgery in Your Clinic",
    bullets: [
      "You perform the surgery with the digital plan and full kit.",
      "Guided protocol reduces errors and chair time.",
    ],
  },
  {
    id: "lab",
    title: "6. Post-Surgery – Lab & Crown",
    bullets: [
      "Post-op STL / CAD files managed with the lab.",
      "Crown or prosthetic work is delivered, plug-and-play on Ecodent360 components.",
    ],
  },
];
