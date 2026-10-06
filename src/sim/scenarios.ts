// Training scenarios for the player's calls. Each one is modelled on a contact type
// that real telecom contact centres handle every day, with the policy an agent would
// see in the knowledge base and the mistakes QA teams most often mark down.

export type QueueName = 'Billing' | 'Technical' | 'Accounts' | 'Retention' | 'Collections' | 'Complaints'

export type QaCategory = 'verification' | 'empathy' | 'discovery' | 'resolution' | 'compliance' | 'closing'

export const QA_LABELS: Record<QaCategory, string> = {
  verification: 'Opening and verification',
  empathy: 'Empathy and tone',
  discovery: 'Listening and discovery',
  resolution: 'Resolution',
  compliance: 'Policy and compliance',
  closing: 'Closing and next steps',
}

export interface Option {
  text: string
  /** 2 = best practice, 1 = acceptable, 0 = poor */
  q: 0 | 1 | 2
  /** change in customer mood, -20..+15 */
  mood: number
  reply: string
  /** set when the reply is narration rather than the customer speaking */
  narrated?: boolean
  note: string
  /** a breach that fails the whole call on a real QA form */
  critical?: boolean
  /** extra handle time this choice costs, in seconds */
  sec?: number
}

export interface Step {
  category: QaCategory
  /** what the agent sees or needs to know before answering */
  prompt?: string
  options: Option[]
}

export interface Scenario {
  id: string
  title: string
  queue: QueueName
  difficulty: 1 | 2 | 3
  customer: { name: string; account: string; tenure: string; product: string }
  /** what the CRM and knowledge base show for this contact */
  crm: string[]
  policy: string[]
  startMood: number
  targetAht: number
  opening: string
  steps: Step[]
  /** first entry is the correct wrap-up code */
  dispositions: string[]
  /** fraud attempts and similar: the caller's satisfaction is not a goal */
  csatExempt?: boolean
  takeaway: string
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'roaming-bill-shock',
    title: 'Bill shock after a holiday',
    queue: 'Billing',
    difficulty: 2,
    customer: { name: 'Daniel Okafor', account: 'HM-4471-2086', tenure: '8 years', product: 'Mobile 20GB, €24 a month' },
    crm: [
      'Latest bill €186.40 (usual bill €24.00)',
      '€162.40 is roaming data: 1.4 GB used in Türkiye, 12–19 Sep',
      '13 Sep: €50 roaming limit text sent. Reply received from handset: CONTINUE',
      'No goodwill credits on the account in 8 years',
    ],
    policy: [
      'Roaming charges after an opt-out are valid and are not removed in full',
      'First bill-shock contact: agent may credit up to 50% of the roaming charge as goodwill',
      'Balance can be spread over up to 3 bills',
      'Travel Pass: €6 a day, add in the app before travelling',
    ],
    startMood: 30,
    targetAht: 420,
    opening:
      "Hi. I've just opened my bill and it's a hundred and eighty-six euros. I pay twenty-four. Somebody has made a mistake and I want it fixed today.",
    steps: [
      {
        category: 'verification',
        options: [
          {
            text: "That's a big jump from your usual bill, so I can see why you rang straight away. I'll go through it with you line by line. Can I take your full name and the first line of your address to open the account?",
            q: 2, mood: 8,
            reply: 'Daniel Okafor, 14 Marsh Lane. Okay. So what is it?',
            note: 'Acknowledges the problem before asking for anything, then verifies. The customer hears that you are on his side within ten seconds.',
          },
          {
            text: 'Can I take your full name and the first line of your address, please?',
            q: 1, mood: -3,
            reply: 'Daniel Okafor, 14 Marsh Lane. Are you going to sort this out or not?',
            note: 'Verification is correct, but skipping any acknowledgement makes an upset caller repeat himself louder.',
          },
          {
            text: "Our bills are generated automatically, so it's unlikely to be a mistake. What's your name?",
            q: 0, mood: -14,
            reply: "Unlikely? You haven't even looked. Daniel Okafor, 14 Marsh Lane.",
            note: 'Defending the company before looking at the account tells the customer he is not believed. It also skipped the address check.',
          },
        ],
      },
      {
        category: 'discovery',
        prompt: 'The bill breakdown shows €162.40 of roaming data.',
        options: [
          {
            text: 'I can see what the difference is: €162 of it is mobile data used abroad between 12 and 19 September. Were you travelling then?',
            q: 2, mood: 4,
            reply: 'I was in Antalya for a week, yes. But nobody told me it would cost that much. I used maps and a bit of WhatsApp.',
            note: 'Plain numbers, plain dates, and a question that lets him connect it to the trip himself.',
          },
          {
            text: "It's roaming charges. You used data abroad.",
            q: 1, mood: -4,
            reply: 'In Antalya, sure, for a week. But nobody told me it would cost that much!',
            note: 'Accurate but abrupt. Give the amount and the dates so the customer can check it against his own memory.',
          },
          {
            text: "You've used 1.4 GB outside your allowance, which is charged at the standard rate under the terms you agreed to.",
            q: 0, mood: -12,
            reply: 'Terms I agreed to? I was in Antalya for a week and nobody told me a thing!',
            note: 'Quoting terms and conditions at an upset customer reads as blame. Explain first; the contract is a last resort.',
          },
        ],
      },
      {
        category: 'empathy',
        prompt: 'The account shows the €50 limit text on 13 Sep and a CONTINUE reply from his phone.',
        options: [
          {
            text: "A bill like that after a holiday is a horrible surprise. I want to be straight with you about what I can see: we sent a text on 13 September when you reached the €50 roaming limit, and a reply came back from your phone to keep data on. Do you remember that message?",
            q: 2, mood: 6,
            reply: "…I remember some text. I thought it was a welcome message, I tapped whatever made it go away. So I'm stuck with it?",
            note: 'Empathy and honesty together. You state the awkward fact without accusing him and let him respond.',
          },
          {
            text: 'We sent you a warning text on the 13th and you replied to continue, so the charges are valid.',
            q: 1, mood: -8,
            reply: "I tapped something to make it go away. So that's it, I'm stuck with it?",
            note: 'True, and he does need to hear it, but delivered as a verdict. He now expects a fight.',
          },
          {
            text: "Don't worry, I'll get those charges removed for you.",
            q: 0, mood: 6,
            reply: 'Really? All of it? Hold on, your colleague told my wife last year you can’t just do that. Are you sure?',
            note: 'You promised something outside your authority. The mood lifts for a moment and collapses when the credit does not arrive, and it creates a repeat contact and a complaint.',
            critical: true,
          },
        ],
      },
      {
        category: 'resolution',
        options: [
          {
            text: "The charges are valid, so I can't remove all of them. What I can do, because this is the first time in eight years with us, is credit half of the roaming today, that's €81, and spread the rest over your next three bills. Shall I do that?",
            q: 2, mood: 14,
            reply: "Half… that's better than I expected, honestly. Yes, spread it. I don't want this ever happening again, though.",
            note: 'Uses the full goodwill authority, explains why he qualifies, and offers the payment spread without being asked.',
          },
          {
            text: 'I can spread the full amount over three months for you.',
            q: 1, mood: -8,
            reply: "So I still pay all of it. Eight years, and that's the best you can do? Fine. How do I stop it happening again?",
            note: 'A valid option, but you had 50% goodwill available for a first-time case and did not use it. Expect a complaint or a cancellation.',
          },
          {
            text: "If you want to dispute it you'd need to put a complaint in writing.",
            q: 0, mood: -16,
            reply: "In writing? I'm on the phone with you now. Unbelievable. Just tell me how I stop it happening again.",
            note: 'Pushing a solvable call into the complaints process costs more and loses the customer. Resolve at first contact when policy lets you.',
          },
        ],
      },
      {
        category: 'closing',
        options: [
          {
            text: "Two things. I've switched your roaming limit back on, so data stops at €50 unless you call us. And before your next trip you can add a Travel Pass in the app for €6 a day. You'll get a text confirming the €81 credit within the hour. Is there anything else I can help with?",
            q: 2, mood: 8,
            reply: "No, that's everything. Thanks for being straight with me.",
            note: 'Fixes the cause, gives a specific confirmation he can check, and closes properly.',
          },
          {
            text: 'Just buy a Travel Pass next time. Anything else?',
            q: 1, mood: -2,
            reply: "Right. No, that's it.",
            note: 'The advice is correct but there is no recap of what you did today or when he will see it.',
          },
          {
            text: 'Turn data roaming off in your settings. Thanks for calling Halden, goodbye.',
            q: 0, mood: -8,
            reply: '…Okay. Bye.',
            note: 'No recap, no confirmation and no check for further questions. He will call back to ask whether the credit was applied.',
          },
        ],
      },
    ],
    dispositions: [
      'Billing: dispute, goodwill credit applied',
      'Billing: duplicate payment, refund raised',
      'Complaint: escalated to team leader',
      'General enquiry',
    ],
    takeaway: 'Be honest about what happened, then use the authority you have. Customers accept a fair partial outcome far better than a vague promise.',
  },

  {
    id: 'broadband-outage',
    title: 'Broadband down while working from home',
    queue: 'Technical',
    difficulty: 2,
    customer: { name: 'Sofia Lindqvist', account: 'HB-9034-5512', tenure: '2 years', product: 'Fibre 500 broadband' },
    crm: [
      'Router HL-6: no sync since 08:42 today',
      'No area outage reported for her postcode',
      'Linked Halden mobile on the same account',
      'Earliest engineer slot: tomorrow 08:00–12:00',
    ],
    policy: [
      'Run a remote line test before asking the customer to reset anything',
      'Never ask for a factory reset when the line test shows an external fault',
      'Total loss of service: offer a free unlimited data boost on a linked mobile (instant)',
      'Automatic compensation: €5.50 per full day once service has been down 2 full days',
    ],
    startMood: 40,
    targetAht: 480,
    opening:
      "Hi, my internet's been down since before nine. I work from home and I've got a client presentation at two. I've already restarted the router twice.",
    steps: [
      {
        category: 'verification',
        options: [
          {
            text: "I'm sorry, that's the worst timing with a presentation at two. Let's get you a way to be online for it. Can I take your name and postcode to bring up the line?",
            q: 2, mood: 8,
            reply: 'Sofia Lindqvist, postcode ending 4QT. Thank you.',
            note: 'Picks up her deadline, which is what matters to her, and frames the call around it.',
          },
          {
            text: 'Sorry to hear that. Can I take your name and postcode?',
            q: 1, mood: 0,
            reply: 'Sofia Lindqvist, postcode ending 4QT.',
            note: 'Fine, but she gave you a deadline and you did not show you heard it.',
          },
          {
            text: 'Okay. Before anything else, can you switch the router off at the wall for thirty seconds and back on?',
            q: 0, mood: -12,
            reply: "I just told you I've done that twice. Sofia Lindqvist, 4QT. Can you actually look at the line?",
            note: 'She told you what she had tried. Making a customer repeat steps signals you are reading a script, and you had not verified her.',
          },
        ],
      },
      {
        category: 'discovery',
        options: [
          {
            text: "Thanks, Sofia. You've restarted twice already, so I won't ask you to do that again. What lights are showing on the front of the router right now?",
            q: 2, mood: 5,
            reply: "The power one is green and the one with the globe is red. It's been red all morning.",
            note: 'Credits what she has done and asks the one question that narrows the fault.',
          },
          {
            text: 'Is it all your devices or just your laptop?',
            q: 1, mood: 0,
            reply: 'Everything. The globe light on the router is red, if that helps.',
            note: 'A reasonable question, though the router status on your screen already shows no sync.',
          },
          {
            text: "Have you paid your last bill? Sometimes service is restricted for non-payment.",
            q: 0, mood: -14,
            reply: "Yes, I've paid my bill. The globe light on the router is red. Is that not on your screen?",
            note: 'The account status is in front of you. Asking an up-to-date customer about payment is insulting and wastes time.',
          },
        ],
      },
      {
        category: 'resolution',
        prompt: 'A red globe light means no signal is reaching the router. You can run a remote line test (about 40 seconds).',
        options: [
          {
            text: "A red globe means no signal is reaching the router, so I'm going to test the line from here. It takes about forty seconds and I'll stay with you while it runs.",
            q: 2, mood: 4, sec: 40,
            reply: "Okay… and? What does it say?",
            note: 'Right tool first, and she knows how long the silence will last and why.',
          },
          {
            text: "I'll just pop you on hold while I check something.",
            q: 1, mood: -5, sec: 90,
            reply: 'Hello? …Right, you’re back. What did you find?',
            note: 'The test is right, the hold is not. Unexplained holds are one of the biggest drivers of low satisfaction scores; say what you are doing and for how long.',
          },
          {
            text: 'Can you find the small reset hole on the back and hold it in with a paperclip for ten seconds? That restores factory settings.',
            q: 0, mood: -10, sec: 150,
            reply: "Done. Now it's asking me for a setup password and the globe is still red. This is worse.",
            note: 'A factory reset cannot fix an external line fault and it wiped her Wi-Fi settings. Always run the line test first.',
          },
        ],
      },
      {
        category: 'resolution',
        prompt: 'Line test result: fault detected between the street cabinet and the premises. An engineer visit is required.',
        options: [
          {
            text: "The test shows a fault on the line outside your home, so nothing you do indoors will fix it. I can get an engineer to you tomorrow between 8 and 12. For today, I can add unlimited data to your Halden mobile right now so you can hotspot your laptop for the presentation. Shall I do both?",
            q: 2, mood: 14,
            reply: "Yes, please, both. I didn't know I could hotspot. That saves my afternoon.",
            note: 'Solves the fault and the deadline. The data boost is what turns a bad day into a good call.',
          },
          {
            text: "There's a fault outside your property. The earliest engineer is tomorrow between 8 and 12, shall I book it?",
            q: 1, mood: -8,
            reply: "Tomorrow? And what am I supposed to do about two o'clock today? …Book it, I suppose.",
            note: 'Correct diagnosis and booking, but you left her deadline unsolved when the policy gives you an instant workaround.',
          },
          {
            text: "I'll get an engineer out to you this afternoon, don't worry.",
            q: 0, mood: 4,
            reply: 'This afternoon? Brilliant. What time?',
            note: 'The earliest slot is tomorrow. A promise you cannot keep guarantees a second, angrier call and a missed-appointment complaint.',
            critical: true,
          },
        ],
      },
      {
        category: 'closing',
        options: [
          {
            text: "So: engineer tomorrow, 8 to 12, and they'll text when they're on the way. The data boost is live on your mobile now and stays until the line is fixed. If it isn't working by Thursday you'll automatically get €5.50 a day off your bill. Would you like me to stay on while you test the hotspot?",
            q: 2, mood: 8,
            reply: "It's connected. Perfect. Thank you, really.",
            note: 'Recaps the appointment, the workaround and compensation honestly, and checks the fix works before letting her go.',
          },
          {
            text: "That's all booked for you. You'll get a text with the details. Anything else?",
            q: 1, mood: 0,
            reply: "No, that's it. Thanks.",
            note: 'Adequate. A verbal recap of the slot would save her waiting for a text.',
          },
          {
            text: "You'll be compensated for the outage as well. Thanks for calling.",
            q: 0, mood: -6,
            reply: 'How much? When? …Hello?',
            note: 'Compensation only starts after two full days. A vague promise sets a wrong expectation and you ended the call on a question.',
          },
        ],
      },
    ],
    dispositions: [
      'Technical: fault, engineer booked',
      'Technical: resolved on call',
      'Billing: dispute, goodwill credit applied',
      'General enquiry',
    ],
    takeaway: 'Find out what the outage is costing the customer today. Fixing the line is tomorrow’s job; keeping her working is this call’s job.',
  },

  {
    id: 'sim-swap-fraud',
    title: 'Caller wants a SIM swap but cannot pass security',
    queue: 'Accounts',
    difficulty: 3,
    customer: { name: 'Caller claims to be Peter Hallam', account: 'HM-2210-7745', tenure: '6 years', product: 'Mobile Unlimited' },
    crm: [
      'Account holder: Peter Hallam. Account PIN is set',
      '2 failed PIN attempts on web chat earlier today',
      'Incoming number: withheld',
      'No lost or stolen report on file',
    ],
    policy: [
      'SIM swap requires the account PIN, or both security questions answered correctly',
      'Name, date of birth and address are not sufficient: they are easy to find',
      'Never give hints, and never read out or confirm any detail held on the account',
      'After a failed check: offer a store visit with photo ID. Any caller may ask for a SIM to be barred',
      'Add a fraud-watch note and report to the fraud desk',
    ],
    startMood: 45,
    targetAht: 360,
    csatExempt: true,
    opening:
      "Hi there. I've lost my phone and I've got a spare SIM here from an old pack. I just need you to move my number onto it. The name's Peter Hallam.",
    steps: [
      {
        category: 'verification',
        options: [
          {
            text: "I'm sorry you've lost your phone, Mr Hallam. I can help with that. Moving a number is a secured change, so I'll need your account PIN first.",
            q: 2, mood: 0,
            reply: "Ah. I can never remember that thing. Look, I can give you my date of birth and my address, I've got those. 4th of March 1979, 22 Calder Road.",
            note: 'Helpful tone, and straight to the right level of security for a SIM swap.',
          },
          {
            text: 'Sure. Can I take your date of birth and address?',
            q: 1, mood: 2,
            reply: "4th of March 1979, 22 Calder Road. There you go. So can you move the number now?",
            note: 'Those details identify the account but do not authorise a SIM swap. You still need the PIN and have now given the caller the impression he has passed.',
          },
          {
            text: "No problem at all. What's the number on the new SIM card?",
            q: 0, mood: 5,
            reply: "Great, it's 8944 1200 0031 7765. And just so you have it, my date of birth is 4th of March 1979.",
            note: 'You started the swap with no security at all. A SIM swap hands over every text message, including bank codes.',
            critical: true,
          },
        ],
      },
      {
        category: 'compliance',
        prompt: 'Name, date of birth and address match the account. The PIN has not been given.',
        options: [
          {
            text: "Thank you. Those match, but for a SIM swap I do need the PIN or the answers to both of your security questions. I can ask you those now if you'd like.",
            q: 2, mood: -4,
            reply: "Security questions… I set those years ago. Just tell me what email is on the account and I'll reset the PIN myself from there.",
            note: 'Holds the line and offers the legitimate alternative without revealing what the questions are.',
          },
          {
            text: "I'm afraid that isn't enough. Do you remember roughly what the PIN might be? It's four digits.",
            q: 1, mood: -2,
            reply: "Four digits, right. Not off the top of my head. Tell me what email is on the account and I'll reset it myself.",
            note: 'You held firm but confirmed the PIN length. Small hints add up for someone gathering details across several calls.',
          },
          {
            text: "That all matches what I have, so that's fine. I'll move the number across now.",
            q: 0, mood: 8,
            reply: "Lovely. While you're at it, what email have you got on there for me?",
            note: 'Date of birth and address are on social media, post and data leaks. Accepting them for a SIM swap is exactly how account takeover happens.',
            critical: true,
          },
        ],
      },
      {
        category: 'compliance',
        options: [
          {
            text: "I can't read out or confirm any details on the account until you've passed security. What I can do is tell you the two ways to sort this today: the PIN reset link in the Halden app if you're signed in on another device, or any Halden store with photo ID.",
            q: 2, mood: -6,
            reply: "A store? I haven't got time for a store. My mother's in hospital and they're trying to ring me on that number. You're really going to stop me talking to the hospital?",
            note: 'No disclosure, and the caller still has a real route forward. A genuine customer can use it; a fraudster cannot.',
          },
          {
            text: "No, I can't tell you that.",
            q: 1, mood: -8,
            reply: "Great help you are. My mother's in hospital and they're trying to ring me on that number. You're really going to stop me talking to the hospital?",
            note: 'Compliant, but a genuine customer would be stranded. Always pair a refusal with what they can do instead.',
          },
          {
            text: "I can't give you the full address, but it starts with p.hall and it's a Gmail account.",
            q: 0, mood: 6,
            reply: "p.hall, Gmail. Got it, thanks. Anyway, my mother's in hospital and they're trying to ring me on that number, so can we hurry this up?",
            note: 'A partial email is a disclosure of personal data to an unverified caller, and enough to target the mailbox for a password reset.',
            critical: true,
          },
        ],
      },
      {
        category: 'empathy',
        prompt: 'Urgency and guilt are classic pressure tactics, and they are also what a real customer in trouble sounds like. You cannot tell which this is.',
        options: [
          {
            text: "I'm sorry about your mother, and I do want you reachable. I can't move the number without security, because that check is the only thing stopping someone else taking it. What I can do right now is bar the lost SIM so nobody can use it, and a store can move the number in ten minutes with photo ID. Would you like me to bar it?",
            q: 2, mood: -4,
            reply: 'Forget it. I’ll sort it myself.',
            narrated: false,
            note: 'Kind and immovable. You treat the story as possibly true, explain what the check protects, and offer the protective action that is allowed.',
          },
          {
            text: "I understand, but the policy is the policy. There's nothing I can do.",
            q: 1, mood: -10,
            reply: 'Useless. Forget it.',
            note: 'You stayed compliant. But "nothing I can do" is untrue: you could bar the SIM and explain the store route.',
          },
          {
            text: "Oh no, I'm so sorry. Given the circumstances I'll make an exception this once and move the number.",
            q: 0, mood: 12,
            reply: 'Thank you, you’re a lifesaver. The SIM number is 8944 1200 0031 7765.',
            note: 'An emotional story is not verification. Exceptions under pressure are the single most common cause of SIM-swap fraud losses.',
            critical: true,
          },
        ],
      },
      {
        category: 'compliance',
        prompt: 'The caller has hung up. What do you do before you take the next call?',
        options: [
          {
            text: 'Add a fraud-watch note with the time, the withheld number and what was asked for, link it to the two failed chat attempts, and report it to the fraud desk.',
            q: 2, mood: 0, sec: 45,
            reply: 'The fraud desk places a 72-hour lock on SIM changes and texts the real Mr Hallam to check his account.',
            narrated: true,
            note: 'Three attempts in one day is a pattern. Your note is what stops the fourth attempt succeeding with a colleague.',
          },
          {
            text: 'Add a short account note: "Caller failed security, advised to visit store."',
            q: 1, mood: 0, sec: 15,
            reply: 'The note is saved. Nobody is alerted, but the next agent will at least see it.',
            narrated: true,
            note: 'Better than nothing. Without the fraud report nobody connects this to the earlier chat attempts or warns the customer.',
          },
          {
            text: "Nothing needed. No changes were made, so there's nothing to record.",
            q: 0, mood: 0,
            reply: 'The account shows no trace of the call. An hour later the same caller reaches a different agent.',
            narrated: true,
            note: 'A failed attempt is still an attempt. With no note, the next agent has no warning.',
          },
        ],
      },
    ],
    dispositions: [
      'Security: failed verification, fraud flag',
      'Account: SIM swap completed',
      'General enquiry',
      'Complaint: escalated to team leader',
    ],
    takeaway: 'You are not judging whether the caller is honest. You are applying the same check to everyone, so the outcome is the same whoever is on the line.',
  },

  {
    id: 'retention-competitor-offer',
    title: 'Customer wants to cancel for a cheaper offer',
    queue: 'Retention',
    difficulty: 2,
    customer: { name: 'Amara Nwosu', account: 'HB-6612-0943', tenure: '5 years', product: 'Fibre 500, €42 a month, out of contract' },
    crm: [
      'Out of contract since March. Price rose from €35 to €42 in April',
      'No faults logged in the last 12 months',
      'Household usage: heavy streaming, 14 connected devices',
    ],
    policy: [
      'Loyalty price: €32 a month on a new 12-month term (lowest available)',
      'Free upgrade to Fibre 900 with any re-contract',
      'Must state: contract length, monthly price, and the 14-day right to change their mind',
      'Cancellation: 30 days notice, no fee. Never obstruct a cancellation request',
    ],
    startMood: 50,
    targetAht: 450,
    opening:
      "Hello, I'd like to cancel my broadband, please. I've had an offer from Brightline for twenty-nine euros a month and I'm paying forty-two with you.",
    steps: [
      {
        category: 'verification',
        options: [
          {
            text: "Of course, I can help you with that. Can I take your name and postcode first? And if you're open to it, I'd like to check what we can do on price before you decide.",
            q: 2, mood: 5,
            reply: "Amara Nwosu, postcode ending 7RB. You can check, but I've more or less made up my mind.",
            note: 'Accepts the request, verifies, and asks permission to look at alternatives. No resistance, so no defensiveness.',
          },
          {
            text: 'Can I take your name and postcode, please?',
            q: 1, mood: 0,
            reply: "Amara Nwosu, postcode ending 7RB. I've more or less made up my mind, just so you know.",
            note: 'Correct, but you missed the chance to acknowledge the request and open the door.',
          },
          {
            text: "Cancel? After five years? Brightline's network is much less reliable than ours, you know.",
            q: 0, mood: -12,
            reply: "I didn't call for a sales pitch. Amara Nwosu, 7RB. I've more or less made up my mind.",
            note: 'Running down a competitor and questioning her decision before verifying. She is now arguing with you instead of listening.',
          },
        ],
      },
      {
        category: 'discovery',
        options: [
          {
            text: "Thanks, Amara. Five years with us and no faults this year, so I'm guessing the service itself has been fine. Is it purely the price, or is there anything else you'd change?",
            q: 2, mood: 6,
            reply: "The service is fine, honestly. It's the price. It went up in April and nobody said why, and then I saw their advert. It felt like I was being taken for granted.",
            note: 'One open question surfaces the real reason: not thirteen euros, but feeling taken for granted.',
          },
          {
            text: 'Is it just the price that is making you leave?',
            q: 1, mood: 0,
            reply: "Mostly. It went up in April and nobody said why. It felt like I was being taken for granted.",
            note: 'A closed question that happened to work. An open one would have found the feeling as well as the fact.',
          },
          {
            text: 'I can offer you €32 a month if you sign for another twelve months.',
            q: 0, mood: -6,
            reply: "So you could have charged me that all along? It went up in April and nobody said why. I feel taken for granted.",
            note: 'Leading with the discount before understanding why she is leaving makes the offer feel like proof she was overcharged.',
          },
        ],
      },
      {
        category: 'resolution',
        options: [
          {
            text: "That's fair, and you shouldn't have had to find out from an advert. I can't change April, but I can put it right from today: €32 a month for twelve months, and a free upgrade from Fibre 500 to Fibre 900, which should help with fourteen devices at home. That's ten euros a month less than now.",
            q: 2, mood: 10,
            reply: "That's closer. It's still three euros more than Brightline, though.",
            note: 'Acknowledges the grievance, then builds the offer around her household rather than reading a price list.',
          },
          {
            text: 'I can do €32 a month on a twelve-month contract. That is our best price.',
            q: 1, mood: 2,
            reply: "It's still three euros more than Brightline, though.",
            note: 'The right price, without the upgrade or any link to what she told you. She has no reason to prefer it.',
          },
          {
            text: "I'll match the €29 for you.",
            q: 0, mood: 8,
            reply: 'Oh! Well, that changes things. Although… is that definitely allowed? It’s three euros under what your website says.',
            note: 'The floor is €32. An offer you cannot key into the system becomes a billing dispute next month.',
            critical: true,
          },
        ],
      },
      {
        category: 'empathy',
        options: [
          {
            text: "You're right, it is three euros more, and I'd rather be honest about that than pretend otherwise. For that you'd keep a line that hasn't had a fault all year, get nearly double the speed, and skip the switch-over day. It's worth checking what Brightline's price becomes after month twelve too. It's your decision either way, and if you'd still like to cancel I'll do it now with no fuss.",
            q: 2, mood: 10,
            reply: "…I did see something about it going up to forty-five after a year. And I don't fancy a day without internet. All right. Let's do the thirty-two.",
            note: 'Concedes the true point, gives factual reasons, and leaves the decision with her. No pressure is what makes the offer credible.',
          },
          {
            text: "It's only three euros. Is it really worth the hassle of switching for that?",
            q: 1, mood: -4,
            reply: "It's thirty-six euros a year, actually. But… I don't fancy a day without internet. Fine, I'll take the thirty-two.",
            note: 'It worked, but minimising her money is risky. Give reasons rather than telling her what should matter to her.',
          },
          {
            text: "If you cancel you'll need to give thirty days notice and return the router or there's a €60 charge, and you may lose your landline number.",
            q: 0, mood: -14,
            reply: "Is that a threat? …Fine. I'll take the thirty-two for now. But I'm not happy about how that was put.",
            note: 'Using exit conditions as a deterrent is obstruction. It may save the account today and produce a complaint tomorrow.',
          },
        ],
      },
      {
        category: 'compliance',
        prompt: 'She has agreed to the offer. Before you place the order you must read out the key terms.',
        options: [
          {
            text: "Before I confirm: this is a new 12-month contract at €32 a month, with Fibre 900 active within 24 hours. You have 14 days to change your mind at no cost, and I'll email all of this to you now. Are you happy for me to go ahead?",
            q: 2, mood: 6,
            reply: 'Yes, go ahead. Thank you for not making that difficult.',
            note: 'Term, price and cooling-off period stated, with explicit consent captured. This is what makes the sale valid.',
          },
          {
            text: "Great, that's €32 a month from your next bill and the faster speed will kick in tomorrow. I'll email you the details.",
            q: 1, mood: 3,
            reply: 'Okay, thank you.',
            note: 'You left out the 12-month term and the 14-day right to cancel. On a real QA form that is a compliance fail, even though the customer is happy.',
          },
          {
            text: "Perfect, that's all done for you. Thanks for staying with Halden!",
            q: 0, mood: 2,
            reply: 'Oh. Okay. Bye.',
            note: 'A contract was placed with none of the required terms read out and no clear consent. The sale can be reversed and is reportable as mis-selling.',
            critical: true,
          },
        ],
      },
    ],
    dispositions: [
      'Retention: customer retained',
      'Retention: cancellation processed',
      'Billing: dispute, goodwill credit applied',
      'General enquiry',
    ],
    takeaway: 'People rarely leave over the price alone. Find the grievance, be honest about the comparison, and make it easy to say no.',
  },

  {
    id: 'bereavement',
    title: 'Closing a late husband’s account',
    queue: 'Accounts',
    difficulty: 3,
    customer: { name: 'Margaret Doyle (calling about Thomas Doyle)', account: 'HM-1180-3327', tenure: '11 years', product: 'Mobile and Fibre 100 broadband' },
    crm: [
      'Account holder: Thomas Doyle',
      'Two services: his mobile, and the home broadband',
      'Balance: €38.00 due on the 14th',
      'Mobile is 7 months into a 24-month contract',
    ],
    policy: [
      'Bereavement: do not ask for the account holder’s PIN or security answers',
      'Take the caller’s name, relationship, and the date of death. No certificate needed when the balance is under €200',
      'All early termination fees are waived. Outstanding balance under €50 is written off',
      'Broadband can move into the caller’s name with no new contract',
      'A number can be kept active free for 30 days so voicemail and messages can be saved',
      'Never offer products or upgrades on a bereavement call',
    ],
    startMood: 45,
    targetAht: 540,
    opening:
      "Hello. I'm… I'm ringing about my husband's phone. Thomas. He passed away three weeks ago and I keep getting his bills. I don't really know what I'm supposed to do.",
    steps: [
      {
        category: 'empathy',
        options: [
          {
            text: "I'm so sorry about Thomas, Mrs Doyle. You don't need to know what to do, that's what I'm here for. We'll take it one step at a time, and there's no rush.",
            q: 2, mood: 12,
            reply: "Thank you. That's kind. I've been dreading these calls.",
            note: 'Uses his name, removes the burden of knowing the process, and slows the pace. Handle time targets do not apply to bereavement calls.',
          },
          {
            text: "I'm sorry for your loss. I can help you close the account.",
            q: 1, mood: 2,
            reply: "Thank you. I've been dreading these calls, to be honest.",
            note: 'Polite, but a stock phrase followed straight by the task. A moment longer costs nothing here.',
          },
          {
            text: "Okay. Can I take the account PIN or the answers to the security questions, please?",
            q: 0, mood: -18,
            reply: "I… I don't know his PIN. He did all of that. I'm sorry, I don't know any of it.",
            note: 'No acknowledgement at all, and you asked for something she cannot possibly have. The bereavement process exists so that nobody has to hear this.',
          },
        ],
      },
      {
        category: 'verification',
        options: [
          {
            text: "You won't need any of Thomas's passwords. I just need three things from you: your full name, your relationship to Thomas, and the date he passed away.",
            q: 2, mood: 6,
            reply: "Margaret Doyle. I'm his wife. It was the 15th of September.",
            note: 'Exactly the bereavement verification, explained in advance so none of it comes as a shock.',
          },
          {
            text: 'Can you confirm the address on the account, and do you have a copy of the death certificate you could email us?',
            q: 1, mood: -8,
            reply: "It's 3 Orchard Close. A certificate… I've only the one copy and I don't have email. I'm Margaret, his wife. He died on the 15th of September.",
            note: 'A certificate is not required under €200. Asking for documents she does not need to send adds a task to someone who is already overwhelmed.',
          },
          {
            text: "I'm afraid I can only discuss the account with the account holder or someone with power of attorney.",
            q: 0, mood: -20,
            reply: "The account holder is dead. That's why I'm calling. I'm Margaret, his wife. He died on the 15th of September.",
            note: 'Applying the standard data protection script to a bereavement is one of the most complained-about failures in the industry.',
            critical: true,
          },
        ],
      },
      {
        category: 'discovery',
        prompt: 'The account has his mobile and the home broadband.',
        options: [
          {
            text: "Thank you, Margaret. There are two things on the account: Thomas's mobile, and the broadband at home. Do you use the broadband yourself? If you do, I can simply put it in your name, same price, nothing else changes.",
            q: 2, mood: 8,
            reply: "Oh, yes. I use it for the grandchildren's video calls. I thought I'd lose it. Yes, please keep that. It's just his phone I don't need.",
            note: 'Spots the thing she had not thought to ask and removes a worry before it forms.',
          },
          {
            text: 'Do you want to close everything, or only the mobile?',
            q: 1, mood: -2,
            reply: "Everything? Is the internet on there too? I need that for the grandchildren. Just his phone, please.",
            note: 'It gets the answer, but she had to work out that the broadband was at risk.',
          },
          {
            text: "While I have you, the broadband would need to go into your name, and we've got a very good offer on Fibre 500 with a SIM for you at the moment.",
            q: 0, mood: -18,
            reply: "I don't want an offer. I want to stop getting my husband's bills.",
            note: 'Selling on a bereavement call is prohibited and deeply inappropriate, however good the offer is.',
            critical: true,
          },
        ],
      },
      {
        category: 'resolution',
        options: [
          {
            text: "I'll close the mobile with nothing to pay: there's no cancellation charge and I've cleared the €38 on the account. One thing before I do: closing the number deletes his voicemail greeting and any saved messages. If you'd like time to save anything, I can keep it switched on for 30 days at no cost.",
            q: 2, mood: 12,
            reply: "…His voice is on the answerphone. I hadn't thought. Yes. Yes, please keep it on for a bit. Our daughter will know how to save it.",
            note: 'Waives everything the policy allows and thinks about what closing the number means to her. This is the part she will remember.',
          },
          {
            text: "I've closed the mobile and there's no cancellation fee. The last €38 has been cleared as well.",
            q: 1, mood: 2,
            reply: "Oh. Thank you. It's… it's gone already? His answerphone message was on there. Never mind.",
            note: 'Financially correct and efficient. On this call, speed was not the goal; the voicemail cannot be recovered.',
          },
          {
            text: "The mobile is in contract until 2027, so there's an early termination fee of €204, plus the €38 balance.",
            q: 0, mood: -20,
            reply: "Two hundred and… I can't… he's died. Surely that can't be right?",
            note: 'Termination fees are always waived on bereavement and a balance this size is written off. This becomes a formal complaint.',
            critical: true,
          },
        ],
      },
      {
        category: 'closing',
        options: [
          {
            text: "Here's what happens now, Margaret. The broadband is in your name from today. Thomas's number stays on until the 6th of November, then closes by itself. You'll get one letter confirming this, addressed to you, and nothing more in his name. My name is on that letter if you need anything. Please look after yourself.",
            q: 2, mood: 10,
            reply: 'Thank you. You’ve made this one much easier than the bank did. Goodbye, dear.',
            note: 'A clear recap with dates, one letter instead of many, and a human close in place of the standard script.',
          },
          {
            text: "That's all sorted. You'll get a confirmation letter in the post. Take care.",
            q: 1, mood: 2,
            reply: 'Thank you. Goodbye.',
            note: 'Fine, but she is likely to forget the details. Dates and what to expect in the post prevent a second difficult call.',
          },
          {
            text: 'Is there anything else I can help you with today? No? Then thanks for calling Halden, and have a great day!',
            q: 0, mood: -10,
            reply: '…Yes. Goodbye.',
            note: 'The standard cheerful close is jarring on a bereavement call. Listen to what kind of call you are on.',
          },
        ],
      },
    ],
    dispositions: [
      'Account: bereavement',
      'Retention: cancellation processed',
      'Billing: dispute, goodwill credit applied',
      'General enquiry',
    ],
    takeaway: 'On a bereavement call the process bends around the person. Take the admin off her, slow down, and think about what the account holds besides a balance.',
  },

  {
    id: 'irate-missed-engineer',
    title: 'Third call about a missed engineer visit',
    queue: 'Complaints',
    difficulty: 3,
    customer: { name: 'Rob Castellano', account: 'HB-3057-8821', tenure: '3 years', product: 'Fibre 500 broadband' },
    crm: [
      'Third contact in 9 days about intermittent drop-outs',
      'Engineer visits 28 Sep and 2 Oct both closed as "no access"',
      'Notes from 2 Oct call: customer says he was home all day both times',
      'Missed-appointment compensation (€30 per visit) has not been applied',
    ],
    policy: [
      'Missed appointment: €30 automatic credit per visit. Apply it if it has not been applied',
      'Do not dispute the customer’s account of a visit; raise it with field operations',
      'Priority engineer slots (48h, with a call 30 minutes ahead) are booked through the team leader desk',
      'A customer who asks for a manager is entitled to a team leader callback within 2 hours',
    ],
    startMood: 12,
    targetAht: 540,
    opening:
      "No. I'm not going through it all again. Twice I've taken a day off work and twice nobody turned up. Get me a manager. Now.",
    steps: [
      {
        category: 'empathy',
        options: [
          {
            text: "Two days off work and nobody came. You have every right to be angry, and I'm sorry. I can arrange a manager for you, and I will if you still want one. I've got your notes open, so you won't have to explain it all again. Can I have two minutes to try to fix it first?",
            q: 2, mood: 12,
            reply: "…Two minutes. Go on. But I've heard 'I'll fix it' twice already.",
            note: 'Names what happened to him, does not refuse the manager, and offers the one thing he asked for: not repeating himself.',
          },
          {
            text: "I understand you're frustrated. Let me transfer you to a team leader.",
            q: 1, mood: -4, sec: 60,
            reply: "…Hello? I've been passed around again, haven't I. Are you the manager? No? You're the same person. Right.",
            note: 'A cold transfer of an angry caller usually goes to a queue. The team leader is on another call, so he has come back to you angrier.',
          },
          {
            text: "Sir, I need you to calm down or I won't be able to help you.",
            q: 0, mood: -12,
            reply: "Calm down? I've lost two days' pay! Don't tell me to calm down!",
            note: '"Calm down" has never calmed anyone down. It tells the customer his anger is the problem rather than the missed visits.',
          },
        ],
      },
      {
        category: 'discovery',
        options: [
          {
            text: "Here's what I have, tell me if any of it is wrong: the connection has been dropping for nine days, engineers were booked for 28 September and 2 October, you were home both days, and nobody knocked. Is that right?",
            q: 2, mood: 10,
            reply: "That's right. Finally somebody has read it. The last one made me spell my street name three times.",
            note: 'Summarising from the notes proves you have read them and lets him correct anything in one word.',
          },
          {
            text: 'Can you tell me what the original fault was?',
            q: 1, mood: -8,
            reply: "It's dropping out! It's in the notes! Nine days! Engineers booked the 28th and the 2nd and nobody came!",
            note: 'He told you he would not go through it again and it is on your screen. Read before you ask.',
          },
          {
            text: "Before we go any further, I need to take you through security again and then run some checks on the router.",
            q: 0, mood: -14,
            reply: "The router isn't the problem, the engineer not turning up is the problem! Booked the 28th and the 2nd. Nobody came!",
            note: 'Restarting the script on a third contact shows him that nothing from his earlier calls counted.',
          },
        ],
      },
      {
        category: 'empathy',
        prompt: 'Both engineer jobs were closed with the note "no access, customer not home".',
        options: [
          {
            text: "I'll be open with you: both visits were closed on our side as 'no access'. I wasn't there, you were, and you took the days off to be in. I'm not going to argue it with you. I'm reporting both to our field team so they look into what actually happened.",
            q: 2, mood: 10,
            reply: "No access? I was sat in the front room! …Fine. At least you've told me. So what happens now?",
            note: 'Tells him what the record says without taking its side. He gets the truth and an ally at once.',
          },
          {
            text: "I can see the visits didn't go ahead. Let's focus on getting a new one booked.",
            q: 1, mood: 0,
            reply: "Didn't go ahead. That's one way of putting it. So what happens now?",
            note: 'Avoids the argument, but hides what the notes say. If he hears "no access" from someone else later, trust is gone.',
          },
          {
            text: "The engineer has recorded that nobody was home on both occasions, so technically these weren't missed by us.",
            q: 0, mood: -18,
            reply: "Are you calling me a liar? I was in my front room both days!",
            note: 'You sided with a two-word job note against a customer on his third call, and the policy says not to dispute it.',
          },
        ],
      },
      {
        category: 'resolution',
        options: [
          {
            text: "Three things, and I'm doing them now. One: €60 credit, €30 for each missed visit, which should have been automatic. Two: I'm getting a priority slot from my team leader's desk, within 48 hours, and the engineer will ring you 30 minutes before so there's no doubt. Three: my name is on the job. Can you hold for one minute while I confirm the slot?",
            q: 2, mood: 14, sec: 60,
            reply: "…Thursday morning with a phone call first. Okay. That's the first proper answer I've had. I still want a manager to know about this.",
            note: 'Applies the owed credit unprompted, uses the priority route and explains the hold. Ownership is what de-escalates.',
          },
          {
            text: 'The next available engineer appointment is Monday, between 8 and 6. Shall I book that?',
            q: 1, mood: -8,
            reply: "Monday. Five more days, and all day again. Book it. And I still want a manager to know about this.",
            note: 'A standard slot for a third failure, when priority slots exist for exactly this. You also left €60 of compensation unpaid.',
          },
          {
            text: "I'll make sure an engineer is with you first thing tomorrow morning, guaranteed.",
            q: 0, mood: 6,
            reply: 'Guaranteed? I’ll hold you to that. And I still want a manager to know about this.',
            note: 'You cannot guarantee a slot you have not booked. A third broken promise on this account is a regulator complaint.',
            critical: true,
          },
        ],
      },
      {
        category: 'closing',
        options: [
          {
            text: "You'll get one. I'm asking my team leader to call you within two hours, with everything we've covered in the notes so you won't repeat any of it. Your reference is HC-58214 and my name is on it. Thursday morning, call 30 minutes ahead, €60 credit on your next bill. Have I missed anything?",
            q: 2, mood: 10,
            reply: "No. That's it. Look, I know it wasn't you. Thanks.",
            note: 'Honours the request for a manager even though the issue is handled. A promised, timed callback is a real escalation.',
          },
          {
            text: "I can put a note for a manager to review the case. You've got your appointment and your credit, so that should be everything.",
            q: 1, mood: -4,
            reply: "A note. Right. We'll see on Thursday, then.",
            note: 'A note is not a callback. He asked twice and is entitled to one within two hours.',
          },
          {
            text: "There's no need for a manager now, they'd only tell you the same thing I have.",
            q: 0, mood: -14,
            reply: "That's not your call to make. I'll be putting this in writing.",
            note: 'Refusing an escalation is a policy breach and turns a recovered call into a formal complaint.',
            critical: true,
          },
        ],
      },
    ],
    dispositions: [
      'Complaint: escalated to team leader',
      'Technical: fault, engineer booked',
      'Technical: resolved on call',
      'General enquiry',
    ],
    takeaway: 'Angry repeat callers want proof that this call is different. Read the notes aloud, own the fix, and never refuse the manager.',
  },

  {
    id: 'double-direct-debit',
    title: 'Payment taken twice',
    queue: 'Billing',
    difficulty: 1,
    customer: { name: 'Hye-jin Park', account: 'HM-7745-1093', tenure: '1 year', product: 'Mobile 50GB and Fibre 100' },
    crm: [
      'Two Direct Debits of €67.20 collected on 1 Oct',
      'Known issue KI-2291: duplicate collections during billing migration',
      'Refund for the duplicate has not yet been raised',
    ],
    policy: [
      'Refunds reach the customer’s bank in 3–5 working days. Agents cannot speed this up',
      'Customers can ask their own bank for an immediate refund under the Direct Debit Guarantee',
      'Bank charges caused by our error are reimbursed on sight of a statement',
      'Send a text confirmation with the refund reference',
    ],
    startMood: 30,
    targetAht: 360,
    opening:
      "You've taken my payment twice. Sixty-seven twenty, two times, same day. My rent goes out on Friday and now there isn't enough in there.",
    steps: [
      {
        category: 'verification',
        options: [
          {
            text: "That shouldn't have happened, and with rent due Friday I understand it's urgent. Let me get into the account. Can I take your full name and date of birth?",
            q: 2, mood: 8,
            reply: 'Hye-jin Park, 9th of June 1994.',
            note: 'Acknowledges the consequence she named, then verifies.',
          },
          {
            text: 'Can I take your full name and date of birth, please?',
            q: 1, mood: -2,
            reply: 'Hye-jin Park, 9th of June 1994. Can you see it?',
            note: 'Correct but cold. She has told you her rent is at risk.',
          },
          {
            text: 'Are you sure it was us both times? Sometimes banks show a pending payment twice.',
            q: 0, mood: -12,
            reply: "I'm looking at my banking app. Two payments, both Halden, both gone. Hye-jin Park, 9th of June 1994.",
            note: 'Check the account before you question the customer. The duplicate is on your screen.',
          },
        ],
      },
      {
        category: 'discovery',
        options: [
          {
            text: "Thank you. I can see both payments, and the second one is our mistake: we had a billing fault on the 1st that collected some payments twice. I'm sorry. You don't owe us anything extra.",
            q: 2, mood: 10,
            reply: 'Okay. At least you can see it. So when do I get it back?',
            note: 'Confirms the facts, takes responsibility in plain words and reassures her about the balance.',
          },
          {
            text: 'Yes, I can see two payments. It looks like a system error.',
            q: 1, mood: 0,
            reply: 'A system error. Right. So when do I get it back?',
            note: 'True, but "a system error" sounds like nobody is responsible. Say "our mistake".',
          },
          {
            text: 'It looks like your bank has processed our request twice. You may need to take it up with them.',
            q: 0, mood: -14,
            reply: "My bank says it's you. Your own website has a notice about it! When do I get my money back?",
            note: 'Blaming a third party for a known internal fault. The issue is logged; check known issues before answering.',
          },
        ],
      },
      {
        category: 'resolution',
        options: [
          {
            text: "I've raised the refund now. I have to be honest: it takes 3 to 5 working days to reach your account and I can't make it faster from here. Because of Friday, there's a quicker route: under the Direct Debit Guarantee your own bank can refund it straight away if you call them, often the same day.",
            q: 2, mood: 10,
            reply: "I didn't know I could do that. I'll ring them after this. Thank you for telling me. There's another thing, though: my bank charged me €25 because the second payment took me overdrawn.",
            note: 'Honest timescale plus the faster route. Telling her about the guarantee serves her rather than the company’s convenience.',
          },
          {
            text: "I've raised the refund. It will be back in your account within 3 to 5 working days.",
            q: 1, mood: -8,
            reply: "Five days? Rent is Friday! …And my bank charged me €25 for going overdrawn because of this.",
            note: 'Accurate, but her deadline is Friday and you knew a same-day route existed.',
          },
          {
            text: "I've marked it urgent, so it should be back with you by tomorrow.",
            q: 0, mood: 6,
            reply: 'Tomorrow, good. I’m relying on that. Also, my bank charged me €25 for going overdrawn because of this.',
            note: 'There is no urgent flag. She will plan her rent around a date you invented.',
            critical: true,
          },
        ],
      },
      {
        category: 'resolution',
        options: [
          {
            text: "We'll cover that, it's a direct result of our error. Send a photo of the statement line showing the €25 to the address in the text I'm about to send, and it will be credited to your Halden account within 48 hours.",
            q: 2, mood: 8,
            reply: "Okay, I can do that tonight. That's fair.",
            note: 'Knows the policy, says yes immediately and makes the evidence step easy.',
          },
          {
            text: "You'd have to raise that as a separate complaint, but you can ask.",
            q: 1, mood: -6,
            reply: 'Another call? Fine. Tell me how.',
            note: 'Reimbursement is standard policy and needs no complaint. You created a second contact.',
          },
          {
            text: "I'm afraid bank charges are between you and your bank. We can only refund what we took.",
            q: 0, mood: -14,
            reply: "You caused it! That's not good enough.",
            note: 'Wrong. Charges caused by our error are reimbursed on evidence.',
          },
        ],
      },
      {
        category: 'closing',
        options: [
          {
            text: "To recap: refund of €67.20 raised today, reference RF-30917, arriving in 3 to 5 working days, or sooner through your bank. Send the statement photo for the €25. Your next Direct Debit will be the normal amount, once. I've sent all of that by text. Anything else I can do?",
            q: 2, mood: 6,
            reply: "No, that's everything. Thanks for sorting it.",
            note: 'Reference number, dates, both routes and reassurance about next month, with written confirmation.',
          },
          {
            text: "That's all raised for you. You'll get a text. Anything else?",
            q: 1, mood: 0,
            reply: 'No. Thanks.',
            note: 'Acceptable. A reference number said out loud saves a call if the text does not arrive.',
          },
          {
            text: "Okay, that's done. Bye now.",
            q: 0, mood: -5,
            reply: 'Wait, is there a reference or… hello?',
            note: 'No reference and no recap. She has nothing to quote if the refund is late.',
          },
        ],
      },
    ],
    dispositions: [
      'Billing: duplicate payment, refund raised',
      'Billing: dispute, goodwill credit applied',
      'Collections: payment plan agreed',
      'Complaint: escalated to team leader',
    ],
    takeaway: 'When the error is ours, say so, give the real timescale, and tell the customer about any faster route even when it is not ours.',
  },

  {
    id: 'payment-difficulty',
    title: 'Customer cannot pay an overdue bill',
    queue: 'Collections',
    difficulty: 2,
    customer: { name: 'Tomasz Wiśniewski', account: 'HM-5528-6410', tenure: '4 years', product: 'Mobile Unlimited, €38 a month' },
    crm: [
      'Overdue balance €146.80 (two bills and late fees of €10)',
      'Service restriction scheduled for 9 Oct',
      'No missed payments before August',
      '2 years left on handset plan; the Unlimited tariff itself is out of contract',
    ],
    policy: [
      'Payment plans: up to 6 months, based on what the customer says they can afford',
      'Agreeing a plan puts the restriction on hold. Late fees are removed when a plan is set up',
      'Out-of-contract tariffs can move to Essentials (€15 a month) with no penalty',
      'A support note about circumstances needs the customer’s consent',
      'Offer details of free, independent debt advice. Never threaten disconnection as leverage',
    ],
    startMood: 35,
    targetAht: 480,
    opening:
      "Hi. I, um. I got a letter saying you're going to cut my phone off on the ninth. I can't pay all of it. I don't really know what to say.",
    steps: [
      {
        category: 'empathy',
        options: [
          {
            text: "I'm glad you called. That's the right thing to do, and it means we can sort something out before the ninth. Nothing is being cut off today. Can I take your name and date of birth, and then we'll look at it together?",
            q: 2, mood: 12,
            reply: 'Tomasz Wiśniewski, 21st of February 1988. Thank you. I thought you’d just tell me to pay.',
            note: 'Calling about debt takes courage. Thanking him and removing the immediate threat lets him talk openly.',
          },
          {
            text: 'I can help with that. Can I take your name and date of birth?',
            q: 1, mood: 0,
            reply: 'Tomasz Wiśniewski, 21st of February 1988.',
            note: 'Neutral. He is embarrassed and braced for a demand; a sentence of reassurance changes the whole call.',
          },
          {
            text: "The balance is €146.80 and it needs to be paid by the ninth to avoid restriction. How would you like to pay today?",
            q: 0, mood: -16,
            reply: "I just said I can't pay it all. …Tomasz Wiśniewski, 21st of February 1988.",
            note: 'He opened by saying he cannot pay in full. Demanding it anyway ends the conversation before it starts.',
          },
        ],
      },
      {
        category: 'discovery',
        options: [
          {
            text: "Thanks, Tomasz. You'd never missed a payment before August, so something has changed. You don't have to give me details, but anything you're comfortable sharing helps me find the right option.",
            q: 2, mood: 8,
            reply: "I lost my job in August. Warehouse closed. I've got some agency shifts but it's up and down. I could maybe do twenty-five a month. I need the phone for the agency, they ring with shifts.",
            note: 'Notices the payment history, invites without prying, and learns the two facts that matter: affordability and why the phone is essential.',
          },
          {
            text: 'How much can you pay today?',
            q: 1, mood: -4,
            reply: "Today… maybe twenty-five. I lost my job in August. I need the phone, the agency rings me with shifts.",
            note: 'It gets a number, but asks about today rather than about what he can sustain.',
          },
          {
            text: 'Can you tell me your monthly income and what you spend on rent, food and other debts?',
            q: 0, mood: -12,
            reply: "That's… a lot to ask. I lost my job in August. I can do twenty-five a month, maybe. I need the phone for work.",
            note: 'A full income and expenditure review belongs to a specialist team. From a front-line agent it feels like an interrogation.',
          },
        ],
      },
      {
        category: 'resolution',
        options: [
          {
            text: "Then let's build it around twenty-five. I'm removing the €10 late fees, which leaves €136.80. Spread over six months that's €22.80 a month. Your tariff is out of contract, so I can also move you to Essentials at €15 instead of €38, which still has unlimited calls for the agency. Together that's under €38 a month, and the restriction is cancelled as soon as the plan is set up.",
            q: 2, mood: 14,
            reply: "So… less than I pay now, and I keep the phone? Yes. Yes, please do that.",
            note: 'Starts from his number, removes fees, cuts the ongoing cost so the plan can actually be kept, and protects the service he needs to earn.',
          },
          {
            text: 'I can set up a plan of €25 a month on top of your normal bill until the balance is cleared.',
            q: 1, mood: 0,
            reply: "That's sixty-three a month all together. I'll try. I'm not sure I can keep it up.",
            note: 'A plan he has told you he may not afford will fail in a month or two. The tariff change is what makes it sustainable.',
          },
          {
            text: "The minimum we can accept is half now, €73.40, and the rest next month.",
            q: 0, mood: -16,
            reply: "I haven't got seventy-three euros. That's why I'm ringing.",
            note: 'There is no such minimum. Plans are based on what the customer can afford.',
          },
        ],
      },
      {
        category: 'compliance',
        prompt: 'A support note would stop him having to explain his situation on every call. It needs his consent.',
        options: [
          {
            text: "One more thing, and it's up to you. I can add a short note to your account saying you're between jobs and on a payment plan, so that if you call again nobody asks you to explain. Only our support staff see it. Would you like me to?",
            q: 2, mood: 6,
            reply: 'Yes, that would help. I don’t want to go through it every time.',
            note: 'Explains what will be recorded, why, and who sees it, then asks. That is valid consent.',
          },
          {
            text: "I'll put a note on your account about your situation.",
            q: 1, mood: -2,
            reply: 'Oh. Okay. Who sees that?',
            note: 'Well meant, but circumstances like job loss are sensitive. Ask first and say who can see it.',
          },
          {
            text: "I've flagged you as a vulnerable customer on the system.",
            q: 0, mood: -10,
            reply: "Vulnerable? I'm not… I just lost my job. I didn't ask for that.",
            note: 'Recorded without consent and with a label he finds demeaning. Describe the support, not the category.',
            critical: true,
          },
        ],
      },
      {
        category: 'closing',
        options: [
          {
            text: "So: first plan payment of €22.80 on the 1st of November, Essentials tariff from your next bill, and the restriction is cancelled. If a month looks tight, call us before the payment date and we'll adjust it. I'll also text you the number for a free, independent debt advice service. Lots of people find it useful and it's confidential. Good luck with the shifts, Tomasz.",
            q: 2, mood: 8,
            reply: 'Thank you. Honestly. I was dreading this.',
            note: 'Dates, a safety valve if things change, and debt advice offered without judgement.',
          },
          {
            text: "That's all set up. You'll get a text with the plan dates. Anything else?",
            q: 1, mood: 0,
            reply: "No. Thanks for your help.",
            note: 'Fine, but no signposting to free debt advice, which policy asks you to offer on every payment-difficulty call.',
          },
          {
            text: "That's set up. Just make sure you don't miss a payment, because the plan gets cancelled and we'd have to cut the phone off.",
            q: 0, mood: -12,
            reply: '…Right. Okay.',
            note: 'Ending on a threat undoes the call. Tell him what to do if he struggles, not what will be done to him.',
          },
        ],
      },
    ],
    dispositions: [
      'Collections: payment plan agreed',
      'Billing: dispute, goodwill credit applied',
      'Retention: cancellation processed',
      'General enquiry',
    ],
    takeaway: 'A plan the customer can keep is worth more than a bigger one he cannot. Start from his number, cut the ongoing cost, and make it safe to call back.',
  },
]
