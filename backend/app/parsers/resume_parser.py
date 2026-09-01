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
    doc = nlp(text)

    for ent in doc.ents:
        if ent.label_ == "PERSON":
            return ent.text

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