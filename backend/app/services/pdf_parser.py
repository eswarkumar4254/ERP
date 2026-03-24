import re
from pypdf import PdfReader
from io import BytesIO

def extract_academic_structure(pdf_bytes):
    """
    Parses academic structure from PDF text.
    Expected structure patterns:
    'Program: <Name> (<Code>)'
    'Department: <Name> (<Code>)'
    """
    reader = PdfReader(BytesIO(pdf_bytes))
    full_text = ""
    for page in reader.pages:
        full_text += page.extract_text() + "\n"
    
    # DEBUG: Log the extracted text (useful for diagnosing "synthesis failed" on different PDF formats)
    with open("knowledge_hub_last_upload.txt", "w", encoding="utf-8") as f:
        f.write(full_text)

    # Extraction Logic
    # We look for "Program: ..." or "Course: ..."
    # And then "Department: ..." under it.
    
    programs = []
    current_program = None
    current_semester = 1
    lines = [l.strip() for l in full_text.split("\n") if l.strip()]
    
    # 1. First Pass: Strict Pattern Matching
    for line in lines:
        # Program Match: Multiple variants (Program, Programme, Course, Degree, etc.)
        prog_match = re.search(r"(Program|Programme|Degree|Course|Course of Study|Name of Course):\s*(.*?)(?:\((.*?)\))?$", line, re.IGNORECASE)
        if prog_match:
            current_program = {
                "name": prog_match.group(2).strip(),
                "code": (prog_match.group(3) or prog_match.group(2)[:5]).strip().upper(),
                "departments": []
            }
            programs.append(current_program)
            current_semester = 1
            continue
            
        # Department Match: Multiple variants (Department, Branch, Specialization, Stream, etc.)
        dept_match = re.search(r"(Department|Branch|Specialization|Stream|Discipline):\s*(.*?)(?:\((.*?)\))?$", line, re.IGNORECASE)
        if dept_match:
            if not current_program:
                current_program = {"name": "General Program", "code": "GP01", "departments": []}
                programs.append(current_program)
            
            current_dept = {
                "name": dept_match.group(2).strip(),
                "code": (dept_match.group(3) or dept_match.group(2)[:3]).strip().upper(),
                "subjects": []
            }
            current_program["departments"].append(current_dept)
            current_semester = 1
            continue

        # Subject/Course Match (Variant 1: Single line 'Subject: ...')
        sub_match = re.search(r"(Subject|Paper|Unit|Course Module):\s*(.*?)(?:\((.*?)\))?(?:\s*-\s*(\d+))?$", line, re.IGNORECASE)
        if sub_match and 'current_dept' in locals() and current_dept:
            subject = {
                "name": sub_match.group(2).strip(),
                "code": (sub_match.group(3) or sub_match.group(2)[:5]).strip().upper(),
                "credits": int(sub_match.group(4) or 4),
                "semester": current_semester,
                "year": (current_semester + 1) // 2
            }
            current_dept["subjects"].append(subject)
            continue

        # Subject/Course Match (Variant 2: Semester list 'Sem 1: Sub1, Sub2, ...')
        list_match = re.search(r"(Sem|Semester|Year|Phase|Term)\s*(\d+)?:\s*(.*)$", line, re.IGNORECASE)
        if list_match and 'current_dept' in locals() and current_dept:
            if list_match.group(2):
                current_semester = int(list_match.group(2))
            
            sub_names = [s.strip() for s in list_match.group(3).split(",") if s.strip()]
            for name in sub_names:
                current_dept["subjects"].append({
                    "name": name,
                    "code": re.sub(r'[^A-Z0-9]', '', name.upper())[:6],
                    "credits": 4,
                    "semester": current_semester,
                    "year": (current_semester + 1) // 2
                })
            
    # 2. Second Pass: Heuristic Detection if no programs found
    if not programs:
        common_degrees = ["B.Tech", "M.Tech", "B.A", "M.A", "B.Sc", "M.Sc", "B.Com", "M.Com", "MBA", "MCA", "Ph.D", "Bachelor", "Master", "Engineering", "Arts", "Science"]
        common_depts = ["Computer Science", "CSE", "IT", "Information Technology", "Mechanical", "Civil", "ECE", "Electrical", "Electronics", "Physics", "Chemistry", "Mathematics", "Biology", "Management", "Commerce", "Arts", "Applied", "Robotics", "AI", "English", "Economics"]
        
        for line in lines:
            # Check for degrees - relaxed length limit (up to 120 chars for long titles)
            if any(deg.lower() in line.lower() for deg in common_degrees) and len(line) < 120:
                # Extract code if present in brackets
                code_match = re.search(r"\((.*?)\)", line)
                name = re.sub(r"\(.*?\)", "", line).strip()
                current_program = {
                    "name": name,
                    "code": (code_match.group(1) if code_match else name[:5]).strip().upper(),
                    "departments": []
                }
                programs.append(current_program)
            
            # Check for departments if we have a program
            elif current_program and any(dept.lower() in line.lower() for dept in common_depts) and len(line) < 120:
                code_match = re.search(r"\((.*?)\)", line)
                name = re.sub(r"\(.*?\)", "", line).strip()
                dept = {
                    "name": name,
                    "code": (code_match.group(1) if code_match else name[:3]).strip().upper()
                }
                current_program["departments"].append(dept)

    # 3. Last Resort: Treat the whole document as a list of departments under one program if still nothing.
    if not programs and len(lines) >= 1:
        prog_name = lines[0] if len(lines[0]) < 100 else "Global Academic Program"
        programs.append({
            "name": prog_name,
            "code": prog_name[:5].upper(),
            "departments": [{"name": l, "code": l[:3].upper()} for l in lines[1:10] if len(l) < 100]
        })

    return programs
