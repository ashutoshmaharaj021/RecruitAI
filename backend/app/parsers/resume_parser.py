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
    1. Prefer lines immediately before email/phone.
    2. Reject common resume headings, education institutions,
       job titles, and other non-name phrases.
    3. Prefer short name-like lines near the top.
    4. Use spaCy PERSON as a fallback.
    """

    lines = [line.strip() for line in text.splitlines() if line.strip()]

    if not lines:
        return None

    # ---------------------------------------------------------
    # Words/phrases that should never be treated as a name
    # ---------------------------------------------------------

    excluded_words = {
        "resume",
        "curriculum",
        "vitae",
        "profile",
        "summary",
        "objective",
        "education",
        "experience",
        "projects",
        "project",
        "skills",
        "technical",
        "certifications",
        "certificate",
        "certificates",
        "contact",
        "contact information",
        "achievements",
        "achievement",
        "internship",
        "internships",
        "work",
        "employment",
        "professional",
        "developer",
        "engineer",
        "student",
        "candidate",
        "university",
        "college",
        "school",
        "institute",
        "academy",
        "department",
        "technology",
        "technologies",
        "computer",
        "science",
        "engineering",
        "bachelor",
        "master",
        "degree",
        "education",
        "experience",
        "linkedin",
        "github",
        "portfolio",
        "objective",
        "summary",
    }

    # ---------------------------------------------------------
    # Basic validation
    # ---------------------------------------------------------

    def looks_like_name(value):
        value = value.strip()

        if not value:
            return False

        # Email / URL
        if "@" in value:
            return False

        lower_value = value.lower()

        if ("http://" in lower_value or "https://" in lower_value
                or "www." in lower_value):
            return False

        # Numbers usually indicate phone, dates, GPA, etc.
        if re.search(r"\d", value):
            return False

        # Remove common separators
        cleaned = re.sub(
            r"[|•,:;()\[\]{}]",
            " ",
            value,
        )

        cleaned = re.sub(
            r"\s+",
            " ",
            cleaned,
        ).strip()

        words = cleaned.split()

        # Candidate names normally contain 2-4 words
        if len(words) < 2 or len(words) > 4:
            return False

        # Reject if the complete phrase is clearly not a name
        if cleaned.lower() in excluded_words:
            return False

        # Reject if ANY word strongly indicates education/resume content
        for word in words:
            if word.lower() in excluded_words:
                return False

        # Every word should contain alphabetic characters only
        for word in words:
            if not re.fullmatch(
                    r"[A-Za-z][A-Za-z'-]*",
                    word,
            ):
                return False

        return True

    # ---------------------------------------------------------
    # Find contact information
    # ---------------------------------------------------------

    email_pattern = (r"[A-Za-z0-9._%+-]+"
                     r"@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")

    phone_pattern = r"(?:\+91[\s-]?)?[6-9]\d{9}"

    contact_indices = []

    for index, line in enumerate(lines):
        if re.search(email_pattern, line):
            contact_indices.append(index)
        elif re.search(phone_pattern, line):
            contact_indices.append(index)

    # ---------------------------------------------------------
    # Strongest signal:
    # Look immediately BEFORE contact information
    # ---------------------------------------------------------

    candidates = []

    for contact_index in contact_indices:

        start = max(0, contact_index - 5)

        for index in range(contact_index - 1, start - 1, -1):

            candidate = lines[index]

            if not looks_like_name(candidate):
                continue

            score = 0

            distance = contact_index - index

            # Very strong signal
            if distance == 1:
                score += 15
            elif distance == 2:
                score += 10
            elif distance == 3:
                score += 6
            else:
                score += 2

            # Prefer candidates near beginning of resume
            if index < 5:
                score += 6
            elif index < 10:
                score += 3

            # ALL CAPS is common for names
            if candidate.isupper():
                score += 4

            # Title Case
            words = candidate.split()

            if all(word[0].isupper() for word in words if word):
                score += 3

            # Prefer 2-3 word names
            if len(words) == 2:
                score += 3
            elif len(words) == 3:
                score += 2

            # spaCy PERSON signal
            candidate_doc = nlp(candidate)

            if any(ent.label_ == "PERSON" for ent in candidate_doc.ents):
                score += 6

            candidates.append((score, candidate))

    if candidates:
        candidates.sort(
            key=lambda item: item[0],
            reverse=True,
        )

        return candidates[0][1]

    # ---------------------------------------------------------
    # Second strategy:
    # Look at the first 10 lines
    # ---------------------------------------------------------

    beginning_candidates = []

    for index, line in enumerate(lines[:10]):

        if not looks_like_name(line):
            continue

        score = 0

        # Earlier lines are more likely to contain the name
        score += max(0, 12 - index)

        if line.isupper():
            score += 5

        words = line.split()

        if all(word[0].isupper() for word in words if word):
            score += 3

        if len(words) == 2:
            score += 3
        elif len(words) == 3:
            score += 2

        # spaCy PERSON signal
        line_doc = nlp(line)

        if any(ent.label_ == "PERSON" for ent in line_doc.ents):
            score += 6

        beginning_candidates.append((score, line))

    if beginning_candidates:
        beginning_candidates.sort(
            key=lambda item: item[0],
            reverse=True,
        )

        return beginning_candidates[0][1]

    # ---------------------------------------------------------
    # Final fallback:
    # spaCy PERSON entities
    # ---------------------------------------------------------

    doc = nlp(text)

    for ent in doc.ents:

        if ent.label_ != "PERSON":
            continue

        candidate = ent.text.strip()

        if looks_like_name(candidate):
            return candidate

    return None


def extract_skills(text):
    """
    Extract skills from resume text using word-boundary matching.

    This prevents short skills from accidentally matching
    inside unrelated words.
    """

    text = text.lower()
    found_skills = []

    for skill in SKILLS_DB:
        skill_lower = skill.lower()

        # Escape the skill so characters such as +, #, . etc.
        # are treated literally by regex.
        escaped_skill = re.escape(skill_lower)

        # Match the complete skill rather than a substring.
        pattern = rf"(?<!\w){escaped_skill}(?!\w)"

        if re.search(pattern, text):
            found_skills.append(skill)

    return sorted(set(found_skills))


def parse_resume(text):

    return {
        "name": extract_name(text),
        "email": extract_email(text),
        "phone": extract_phone(text),
        "skills": extract_skills(text)
    }
