import { CyberCrime, QuizQuestion } from './types';

export const CYBER_CRIMES: CyberCrime[] = [
  {
    id: 'phishing',
    title: 'Phishing & Vishing',
    icon: 'fa-link',
    shortDesc: 'Deceptive emails and calls to steal sensitive credentials.',
    whatIsIt: 'Phishing involves fake emails/sites, while Vishing (Voice Phishing) uses phone calls where attackers pretend to be bank officials.',
    howItHappens: 'Attackers create urgency (e.g., "Your account is blocked") to trick you into sharing OTPs, PINs, or passwords.',
    example: 'Receiving a call from "Bank Support" asking for a "verification OTP" to stop a fake unauthorized transaction.',
    prevention: [
      'Banks never ask for OTP/PIN over phone/email.',
      'Check URLs for "https" and the correct spelling of bank names.',
      'Use official bank apps for all verifications.',
      'Report suspicious numbers to 1930.'
    ]
  },
  {
    id: 'grooming',
    title: 'Cyber Grooming',
    icon: 'fa-user-clock',
    shortDesc: 'Building emotional bonds with minors for exploitation.',
    whatIsIt: 'A practice where an offender builds a relationship and emotional bond with a child/teen to gain trust for sexual abuse or exploitation.',
    howItHappens: 'Starts with compliments and gifts in games or social media, eventually moving to secret conversations and requests for explicit photos.',
    example: 'An "online friend" from a gaming lobby asking to move the chat to a private platform and keep it secret from parents.',
    prevention: [
      'Follow the "Turn, Run and Tell" rule: Turn away from bad content, Run/get away, and Tell a trusted adult.',
      'Never meet online "friends" in person alone.',
      'Keep profiles private and don\'t share location.',
      'Be wary of strangers who get "unreasonably nice" instantly.'
    ]
  },
  {
    id: 'gaming',
    title: 'Online Gaming Risks',
    icon: 'fa-gamepad',
    shortDesc: 'Bullying, cheating, and malware in gaming environments.',
    whatIsIt: 'Risks include aggressive players (trolls), scammers asking for "points/coins" purchases, and malware hidden in pirated game files.',
    howItHappens: 'Offenders befriending children through games, or using voice chat to harass and steal identity details.',
    example: 'A player offering "free legendary skins" in exchange for your parent\'s credit card details.',
    prevention: [
      'Never share real names or phone numbers with players.',
      'Use a headset but avoid sharing personal life details.',
      'Never install "cracked" games or unofficial mods.',
      'Limit screen time and play in common areas.'
    ]
  },
  {
    id: 'bullying',
    title: 'Cyber Bullying & Trolling',
    icon: 'fa-comments',
    shortDesc: 'Digital harassment and intentional provocation.',
    whatIsIt: 'Using technology to intentionally harass, threaten, or shame. Trolling involves posting off-topic, condescending remarks to provoke reactions.',
    howItHappens: 'Spreading rumors, posting embarrassing photos, or sending mean messages via social media and chat apps.',
    example: 'A group chat where several classmates post edited "memes" of a student to humiliate them.',
    prevention: [
      'Don\'t "Feed the Trolls"—ignore and block them.',
      'Save evidence (screenshots) for legal action.',
      'Report content to the platform provider (Instagram/FB).',
      'Inform parents or teachers immediately if threatened.'
    ]
  },
  {
    id: 'fakenews',
    title: 'Fake News & Hoaxes',
    icon: 'fa-newspaper',
    shortDesc: 'Misleading information designed to cause panic or hate.',
     whatIsIt: 'Content created to manipulate public opinion or cause social unrest, often using clickbait headlines.',
    howItHappens: 'Viral messages/images circulated multiple times on WhatsApp/Twitter without verification.',
    example: 'A forwarded message claiming "Emergency Lockdown in your city" with a fake government circular.',
    prevention: [
      'Use the 5W\'s: WHO spread it? WHY is it being spread? WHERE can I fact check? WHEN did it start? WHAT is the false content?',
      'Use official fact-check portals like factcheck.telangana.gov.in.',
      'Perform a reverse image search for viral photos.',
      'Don\'t forward unless 100% sure of the source.'
    ]
  },
  {
    id: 'financial',
    title: 'Online Transaction Fraud',
    icon: 'fa-credit-card',
    shortDesc: 'Illegal withdrawal or transfer of money via digital means.',
    whatIsIt: 'Includes UPI scams, SIM swapping, and credit card cloning to steal funds from your account.',
    howItHappens: 'Criminals use fake loan apps, QR code scams ("Scan to receive money"), or block your SIM to gain access to mobile banking.',
    example: 'Scanning a QR code provided by a "buyer" on a marketplace, only to have money debited instead of credited.',
    prevention: [
      'PIN is required only for PAYING money, not receiving.',
      'Disable International transactions on cards when not needed.',
      'Never share CVV or Expiry date with anyone.',
      'If scammed, dial 1930 within the "Golden Hour" (first 2 hours).'
    ]
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "If an online friend asks you to keep your conversation a secret from your parents, what should you do?",
    options: ["Keep it secret to stay friends", "Inform your parents immediately", "Only tell your best friend", "Stop talking but don't tell anyone"],
    answer: 1,
    explanation: "Secrecy is a major sign of Cyber Grooming. Always tell a trusted adult."
  },
  {
    id: 2,
    question: "What are the '5W's' for checking Fake News?",
    options: ["Who, What, Where, When, Why", "Wait, Watch, Win, Work, Wall", "Wealth, Work, Website, Wifi, Word", "Why, What, Who, Wifi, Website"],
    answer: 0,
    explanation: "Who spread it? Why? Where can I fact check? When did it start? What is the content?"
  },
  {
    id: 3,
    question: "You receive a QR code to 'receive' a prize money. To get the money, you must scan it and enter your UPI PIN. Is this safe?",
    options: ["Yes, if the person is nice", "No, PIN is only needed to SEND money", "Yes, but only for small amounts", "Only if it is a government prize"],
    answer: 1,
    explanation: "You NEVER need to enter your UPI PIN to receive money. This is a common scam."
  },
  {
    id: 4,
    question: "What is the official National Cybercrime Helpline number in India?",
    options: ["100", "101", "1930", "1098"],
    answer: 2,
    explanation: "1930 is the dedicated helpline for reporting cyber financial frauds."
  },
  {
    id: 5,
    question: "Which rule should children follow if they see something bad or inappropriate online?",
    options: ["Turn, Run and Tell", "Click, Save and Share", "Hide, Watch and Delete", "Wait, Watch and Ignore"],
    answer: 0,
    explanation: "Turn away from the picture, Run/get away from the device, and Tell a trusted adult."
  },
  {
    id: 6,
    question: "Is it safe to use your Date of Birth or Name as your password?",
    options: ["Yes, it's easy to remember", "No, it's too easy for hackers to guess", "Yes, if you add one number", "Only if you have an antivirus"],
    answer: 1,
    explanation: "Personal details are easily found by attackers. Use complex, unique passphrases."
  },
  {
    id: 7,
    question: "If you are being cyber-bullied, what is the first thing you should NOT do?",
    options: ["Save screenshots", "Block the bully", "Retaliate or get back at them", "Report to the platform"],
    answer: 2,
    explanation: "Never retaliate. It feeds the bully and can turn you into a bully too. Block and report instead."
  },
  {
    id: 8,
    question: "What is 'SIM Swapping'?",
    options: ["Changing your phone case", "Attackers blocking your SIM to get a duplicate for OTPs", "Updating your phone software", "Sharing your hotspot"],
    answer: 1,
    explanation: "Attackers trick mobile providers into issuing a duplicate SIM to steal your banking OTPs."
  },
  {
    id: 9,
    question: "What should you do before forwarding a viral message on WhatsApp?",
    options: ["Forward to 5 groups immediately", "Check if it has a 'Forwarded' tag", "Verify from official sources/fact-check sites", "Delete it and block the sender"],
    answer: 2,
    explanation: "Always verify viral news before spreading it to avoid causing panic or misinformation."
  },
  {
    id: 10,
    question: "After reporting on the portal, within how many hours must you complete full registration?",
    options: ["1 hour", "12 hours", "24 hours", "48 hours"],
    answer: 2,
    explanation: "Registration must be completed on the National Cybercrime Portal within 24 hours of getting an acknowledgement ID."
  },
  {
    id: 11,
    question: "What is 'DDoS' (Distributed Denial of Service)?",
    options: ["A way to download games faster", "Flooding a server with traffic to crash it", "A type of secure password", "A digital currency"],
    answer: 1,
    explanation: "DDoS attacks aim to make a service unavailable by overwhelming it with fake traffic."
  },
  {
    id: 12,
    question: "You find a 'cracked' version of a premium game for free. What is the biggest risk?",
    options: ["Low frame rates", "It might contain Malware or Ransomware", "It might not have sound", "The colors might be wrong"],
    answer: 1,
    explanation: "Pirated software is a primary delivery method for malware and data-stealing viruses."
  },
  {
    id: 13,
    question: "What does 'HTTPS' in a URL indicate?",
    options: ["Hyper Text Transfer Protocol Static", "The site is 100% immune to hacking", "Communications between browser and site are encrypted", "The site is owned by a government"],
    answer: 2,
    explanation: "The 'S' stands for Secure, meaning data like passwords sent to the site is encrypted."
  },
  {
    id: 14,
    question: "What is 'Shoulder Surfing'?",
    options: ["Surfing on a beach", "Looking over someone's shoulder to steal PINs/Passwords", "A type of fast internet connection", "Using two monitors at once"],
    answer: 1,
    explanation: "Attackers watch you enter codes in public places like ATMs or while unlocking your phone."
  },
  {
    id: 15,
    question: "What should you do if your computer files are suddenly encrypted and someone asks for money to unlock them?",
    options: ["Pay the money immediately", "Delete everything and buy a new PC", "Do not pay; seek help from cyber experts", "Try to guess the password"],
    answer: 2,
    explanation: "This is Ransomware. Paying doesn't guarantee your files back and encourages more crime."
  },
  {
    id: 16,
    question: "What is 'Two-Factor Authentication' (2FA)?",
    options: ["Having two different passwords", "A secondary check (like an OTP) after your password", "Using two different computers", "Logging in with two people"],
    answer: 1,
    explanation: "2FA adds an extra layer of security, making it much harder for hackers to access accounts."
  },
  {
    id: 17,
    question: "What is 'Juice Jacking'?",
    options: ["Stealing a charger", "Malware spread via public USB charging ports", "Drinking juice while gaming", "Overcharging a phone battery"],
    answer: 1,
    explanation: "Public USB ports can be used to steal data or install malware. Use your own adapter or a 'USB data blocker'."
  },
  {
    id: 18,
    question: "A stranger on social media offers you a high-paying 'work from home' job requiring an initial 'security deposit'. This is likely:",
    options: ["A great opportunity", "A typical employment scam", "A test for new employees", "A government-backed initiative"],
    answer: 1,
    explanation: "Real employers never ask you to pay money to get a job. This is an advance-fee fraud."
  },
  {
    id: 19,
    question: "Why should you avoid using public Wi-Fi for banking?",
    options: ["It is usually too slow", "It might disconnect randomly", "Hackers can intercept your data on open networks", "It drains the phone battery faster"],
    answer: 2,
    explanation: "Open Wi-Fi is unencrypted, allowing attackers on the same network to 'sniff' your sensitive traffic."
  },
  {
    id: 20,
    question: "What is a 'Botnet'?",
    options: ["A network for robots only", "A collection of compromised computers controlled by an attacker", "A net used to catch computer bugs", "A type of internet browser"],
    answer: 1,
    explanation: "Botnets are used to send spam, launch DDoS attacks, and spread more malware."
  }
];