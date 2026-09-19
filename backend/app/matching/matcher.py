import re


def normalize_skill(skill: str) -> str:
    """
    Normalize a skill so that comparisons are case-insensitive
    and formatting differences are reduced.
    """

    skill = skill.strip().lower()

    # Replace common separators with spaces
    skill = re.sub(r"[-_/]+", " ", skill)

    # Remove extra whitespace
    skill = re.sub(r"\s+", " ", skill)

    return skill


def parse_skills(skills_text: str) -> list[str]:
    """
    Convert a comma-separated skills string into
    a normalized list of unique skills.
    """

    if not skills_text:
        return []

    skills = []

    for skill in skills_text.split(","):
        normalized = normalize_skill(skill)

        if normalized and normalized not in skills:
            skills.append(normalized)

    return skills


def calculate_skill_match(
    resume_skills: str,
    required_skills: str,
) -> dict:
    """
    Compare resume skills against required job skills.

    Returns:
        matched_skills
        missing_skills
        match_score
        matched_count
        required_count
    """

    resume_skill_list = parse_skills(resume_skills)
    required_skill_list = parse_skills(required_skills)

    resume_skill_set = set(resume_skill_list)
    required_skill_set = set(required_skill_list)

    matched_skills = sorted(
        resume_skill_set.intersection(required_skill_set)
    )

    missing_skills = sorted(
        required_skill_set - resume_skill_set
    )

    required_count = len(required_skill_set)
    matched_count = len(matched_skills)

    if required_count == 0:
        match_score = 0.0
    else:
        match_score = round(
            (matched_count / required_count) * 100,
            2,
        )

    return {
        "match_score": match_score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "matched_count": matched_count,
        "required_count": required_count,
    }