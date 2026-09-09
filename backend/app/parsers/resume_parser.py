import re
try:
    import spacy  # type: ignore
except ImportError:
    raise ImportError("spacy package is required. Install it using: pip install spacy")

# Load spaCy English model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    raise OSError("spaCy model 'en_core_web_sm' not found. Install it using: python -m spacy download en_core_web_sm")

# Skills list
SKILLS_DB = [
    "python",
    "java",
    "javascript",
    "react",
    "next.js",
    "fastapi",
    "sql",
    "mongodb",
    "postgresql",
    "html",
    "css",
    "tailwind",
    "machine learning",
    "ai",
    "docker",
    "aws",
    "git"
]

def extract_email(text):
    email_pattern = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
    matches = re.findall(email_pattern, text)

    return matches[0] if matches else None


def extract_phone(text):

    phone_pattern = r"(?:\+91[\-\s]?)?[6-9]\d{9}"

    matches = re.findall(phone_pattern, text)

    if matches:
        return matches[0]

    return None
def extract_name(text):
    """
    Extract the most likely candidate name from a resume.

    Strategy:
    1. Check the first few lines.
    2. Look around email/phone contact information.
    3. Use spaCy PERSON entities as a fallback.
    """

    lines = [
        line.strip()
        for line in text.splitlines()
        if line.strip()
    ]

    excluded_phrases = {
        "resume",
        "curriculum vitae",
        "cv",
        "profile",
        "summary",
        "objective",
        "career objective",
        "experience",
        "work experience",
        "education",
        "skills",
        "technical skills",
        "projects",
        "certifications",
        "contact",
        "developer",
        "software developer",
        "software engineer",
        "engineer",
        "student",
        "github",
        "linkedin",
        "portfolio",
        "participations",
        "soft skills",
    }

    skill_words = {
        skill.lower()
        for skill in SKILLS_DB
    }

    def looks_like_name(value):
        value = value.strip()

        if not value:
            return False

        # Reject email addresses
        if "@" in value:
            return False

        # Reject URLs
        if "http://" in value.lower():
            return False

        if "https://" in value.lower():
            return False

        if "www." in value.lower():
            return False

        # Reject anything containing numbers
        if re.search(r"\d", value):
            return False

        # Remove separators
        cleaned = re.sub(
            r"[|•,:;()\[\]{}]",
            " ",
            value
        )

        cleaned = re.sub(
            r"\s+",
            " ",
            cleaned
        ).strip()

        words = cleaned.split()

        # Most candidate names contain 2-4 words
        if len(words) < 2 or len(words) > 4:
            return False

        lower_value = cleaned.lower()

        # Reject known resume headings
        if lower_value in excluded_phrases:
            return False

        # Reject known skill phrases
        if lower_value in skill_words:
            return False

        # Reject if any word is a skill
        for word in words:
            if word.lower() in skill_words:
                return False

        # Reject common resume/role words
        for word in words:
            if word.lower() in excluded_phrases:
                return False

        # Every word should look like a name
        for word in words:
            if not re.fullmatch(
                r"[A-Za-z][A-Za-z'-]*",
                word
            ):
                return False

        return True

    # ==========================================================
    # 1. CHECK FIRST FEW LINES
    # ==========================================================

    for line in lines[:5]:

        if looks_like_name(line):
            return line

    # ==========================================================
    # 2. LOOK AROUND EMAIL / PHONE
    # ==========================================================

    # This handles resumes where PDF extraction puts the
    # header/contact section somewhere in the middle.

    contact_indices = []

    for index, line in enumerate(lines):

        if "@" in line:
            contact_indices.append(index)

        elif re.search(
            r"(?:\+91[\s-]?)?[6-9]\d{9}",
            line
        ):
            contact_indices.append(index)

    for contact_index in contact_indices:

        # Look up to 5 lines before the contact information
        start = max(0, contact_index - 5)

        for index in range(contact_index - 1, start - 1, -1):

            candidate = lines[index]

            if looks_like_name(candidate):
                return candidate

    # ==========================================================
    # 3. USE SPACY PERSON AS FALLBACK
    # ==========================================================

    doc = nlp(text)

    for ent in doc.ents:

        if ent.label_ == "PERSON":

            candidate = ent.text.strip()

            if looks_like_name(candidate):
                return candidate

    # ==========================================================
    # 4. FINAL FALLBACK
    # ==========================================================

    for line in lines[:15]:

        if looks_like_name(line):
            return line

    return None
def extract_skills(text):

    text = text.lower()

    found_skills = []

    for skill in SKILLS_DB:
        if skill in text:
            found_skills.append(skill)

    return list(set(found_skills))


def parse_resume(text):

    return {
        "name": extract_name(text),
        "email": extract_email(text),
        "phone": extract_phone(text),
        "skills": extract_skills(text)
    }