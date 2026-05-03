/**
 * @fileoverview Application constants and static data
 * @description Centralized data store for suggestions, timeline, FAQs, and quiz questions.
 * Eliminates data duplication and makes the codebase maintainable.
 * @module constants
 */

/** Quick suggestion prompts for the AI chat interface */
export const SUGGESTIONS = [
  { hi: "वोट देने की प्रक्रिया", en: "How to vote?" },
  { hi: "कौन कर सकता है मतदान?", en: "Who can vote?" },
  { hi: "आवश्यक दस्तावेज", en: "Required documents" },
  { hi: "EVM क्या है?", en: "What is EVM?" },
  { hi: "मतदान केंद्र कैसे खोजें?", en: "How to find polling station?" }
];

/** Election timeline phases for 2026 */
export const TIMELINE = [
  { stage: "Voter Registration", date: "01 Jun — 15 Jan 2026", color: "#10B981" },
  { stage: "Nomination", date: "20 Jan — 27 Jan 2026", color: "#3B82F6" },
  { stage: "Campaign Period", date: "28 Jan — 10 Feb 2026", color: "#F59E0B" },
  { stage: "Polling Day", date: "25 Feb 2026", color: "#EF4444" },
  { stage: "Counting & Results", date: "02 March 2026", color: "#8B5CF6" }
];

/** Frequently asked questions data */
export const FAQS_DATA = [
  {
    q: "Who can vote in India?",
    a: "Every Indian citizen who has reached the age of 18 on the qualifying date (usually 1st January of the year) is eligible to be registered as a voter in the constituency where he/she is ordinarily resident."
  },
  {
    q: "How to register as a new voter?",
    a: "You can register online via the Voter's Portal (voters.eci.gov.in) or offline by filling Form 6 and submitting it to the Electoral Registration Officer (ERO) or Booth Level Officer (BLO)."
  },
  {
    q: "What documents are required for registration?",
    a: "You need a passport-sized photograph, an age proof (like a birth certificate or 10th marksheet), and an address proof (like Aadhaar card, electricity bill, or passport)."
  },
  {
    q: "What is an EVM?",
    a: "An Electronic Voting Machine (EVM) is a device used to cast and count votes. It consists of a Balloting Unit and a Control Unit, designed to be 100% tamper-proof and secure."
  },
  {
    q: "How to check if my name is in the voter list?",
    a: "You can check your name on the official Electoral Search portal (search.eci.gov.in) by entering your EPIC number or personal details."
  }
];

/** Quiz questions for the interactive quiz zone */
export const QUIZ_QUESTIONS = [
  {
    question: "What is the minimum age to be eligible to vote in India?",
    options: ["18 years", "21 years", "25 years", "16 years"],
    correct: 0,
    explanation: "As per the Constitution of India, any citizen aged 18 or above is eligible to vote."
  },
  {
    question: "Can an EVM be hacked remotely via Wi-Fi or Bluetooth?",
    options: ["Yes, if signal is strong", "No, EVMs have no network connectivity", "Only by experts", "Yes, during counting"],
    correct: 1,
    explanation: "EVMs are stand-alone machines with no network, Bluetooth, or Wi-Fi connectivity."
  },
  {
    question: "What does VVPAT stand for?",
    options: [
      "Voter Verified Paper Audit Trail",
      "Voter Verification Process and Tracking",
      "Visual Voter Paper Accountability Tool",
      "Voter Validated Polling Access Terminal"
    ],
    correct: 0,
    explanation: "VVPAT stands for Voter Verifiable Paper Audit Trail."
  }
];

/** Supported languages */
export const LANGUAGES = ['English', 'Hindi', 'Telugu'];

/** API base URL — resolved from environment or defaults */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://votesaathi.onrender.com';
