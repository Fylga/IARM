# 📘 User Manual – IARM Emergency System

## 🏁 Introduction

**IARM Emergency System** is an intelligent triage interface designed for **ARM (Assistants de Régulation Médicale)** working in emergency services.  
It leverages AI to extract, classify, and prioritize incoming calls based on severity and waiting time.  
This manual explains how to use the system effectively and securely.

---

## 🔐 Access and Authentication

- ✅ To use the IARM system, **you must be logged in** with a valid account.
- 👤 If you don’t have an account yet, please contact the **administrator** to request access.
- 🧠 The system uses role-based access: Administrators can manage users, while ARMs can access and process emergency calls.
- 💾 All interactions are securely **logged and stored**, in compliance with GDPR regulations.
- 🔒 Only authorized personnel have access to sensitive data.

---

## 🖥️ Dashboard Overview – Call Listing

Once logged in, you will land on the **Emergency Calls Dashboard**.

### For each call, the following elements are displayed:

| Element                   | Description                                             |
|---------------------------|---------------------------------------------------------|
| ⏱️ Time elapsed            | How long since the call started                        |
| 🕒 Timestamp               | The exact hour the call was received                   |
| 🆔 Call ID                | Unique reference number                                 |
| 🏷️ Medical priority       | P0 (critical) to P3 (minor), assigned by the AI        |
| 📊 Internal rank           | R1 to R4 urgency level                                  |
| 📄 Summary                | Short description extracted from the caller’s speech    |

---

## 🎨 Priority Colors

| Color       | Medical Priority | Code | Meaning                                              |
|-------------|------------------|------|------------------------------------------------------|
| 🔴 Red      | Critical          | P0   | Life-threatening: unconsciousness, cardiac arrest    |
| ⚫ Black     | Severe            | P1   | Urgent cases: chest pain, intense bleeding           |
| 🟡 Yellow   | Moderate          | P2   | Mobility issues, non-vital fractures                 |
| 🟢 Green    | Low priority      | P3   | Fever, fatigue, mild symptoms                        |

Calls are **automatically sorted**: most urgent and oldest calls are displayed **at the top**.

---

## 🖱️ Viewing and Managing a Call

Clicking on a call tile opens a **detailed view**, where you will find:

- 🧭 **Location** of the caller (if provided)
- 📜 **Full transcript** of the conversation processed by the AI
- 💬 **Structured data**: age, symptoms, consciousness, pain level, etc.
- 📍 **“Take over” button**: to assume responsibility for the case and manage it manually

Once you take over a call, it is assigned to you and will be **removed from the public queue**.

---

## 💡 Example Cases

| Example Case                                               | Priority | Description                                                        |
|------------------------------------------------------------|----------|--------------------------------------------------------------------|
| “Patient unconscious after motorcycle accident”            | P0       | Immediate risk of death – R1                                       |
| “Child ingested dishwashing product, strong cough”         | P0       | Pediatric ingestion with respiratory symptoms – R1                |
| “Severe chest pain, cardiac history, started 20 mins ago”  | P1       | Risk of heart attack – R2                                          |
| “Fever 38.5°C, tired but active”                           | P3       | Non-urgent flu-like symptoms – R4                                  |
| “Fall in bathroom, hip pain, can’t stand up”               | P2       | Risk of fracture, immobility – R3                                  |

---

## 📌 Best Practices

- Always check **P0 and P1 cases** first, especially if waiting time > 3 minutes
- Use the **filters** (by severity or time) to adapt your triage strategy
- Review the **AI summary** and verify key facts before taking over
- Use clear annotations if manual input is needed post-intervention

---

## 📂 Data Security & Privacy

- All data is **stored securely** in compliance with GDPR and medical standards
- Transcripts and summaries are temporarily stored in memory and anonymized after processing
- Only core authorized users can access or export call histories
- Do **not input any personal comments** about the caller outside the dedicated fields

---

## 👥 User Management

- User accounts are created manually by the **administrator**
- If you need to update your access or reset your credentials, contact the admin
- Admins have access to a **user management interface** to:
  - Add/Remove users
  - View system usage logs
  - Configure severity thresholds or filters

---

## 🆘 Support

For technical help or bugs:
- Contact the IARM team internally
- Or send a support request to: `support@iarm-system.org`

---

> With IARM, every minute saved is a life saved.
