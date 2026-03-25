from fastapi import APIRouter
from app.api.v1.endpoints import (
    login, tenants, students, courses, staff, 
    finance_erp, analytics, vault, academics, developer,
    hms, tms, lms, ims,
    research_rms, student_affairs_api, compliance_api, admissions_api, placements,
    parent_portal_api, department_api, saas, rbac, exam_cell, alumni, learning_analytics, finance_strategic, proctoring, compliance_strategic, knowledge_hub,
    knowledge_hub, ai_automation, extra_features
)

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(tenants.router, prefix="/tenants", tags=["tenants"])
api_router.include_router(students.router, prefix="/students", tags=["students"])
api_router.include_router(courses.router, prefix="/courses", tags=["courses"])
api_router.include_router(staff.router, prefix="/staff", tags=["staff"])
api_router.include_router(finance_erp.router, prefix="/finance-erp", tags=["finance"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(vault.router, prefix="/vault", tags=["vault"])
api_router.include_router(academics.router, prefix="/academics", tags=["academics"])
api_router.include_router(developer.router, prefix="/developer", tags=["developer"])

api_router.include_router(hms.router, prefix="/hms", tags=["hms"])
api_router.include_router(tms.router, prefix="/tms", tags=["tms"])
api_router.include_router(lms.router, prefix="/lms", tags=["lms"])
api_router.include_router(ims.router, prefix="/ims", tags=["ims"])

api_router.include_router(placements.router, prefix="/placements", tags=["placements"])
api_router.include_router(research_rms.router, prefix="/research", tags=["research"])
api_router.include_router(student_affairs_api.router, prefix="/student-affairs", tags=["student-affairs"])
api_router.include_router(compliance_api.router, prefix="/compliance", tags=["compliance"])
api_router.include_router(admissions_api.router, prefix="/admissions", tags=["admissions"])
api_router.include_router(parent_portal_api.router, prefix="/parent", tags=["parent-portal"])
api_router.include_router(compliance_api.router, prefix="/no-due", tags=["no-due-workflow"])
api_router.include_router(department_api.router, prefix="/department", tags=["department-hod"])
api_router.include_router(saas.router, prefix="/saas", tags=["saas-admin"])
from app.api.v1.endpoints import onboarding, faculty_portal, communication
api_router.include_router(onboarding.router, prefix="/onboarding", tags=["onboarding"])
api_router.include_router(faculty_portal.router, prefix="/faculty-portal", tags=["faculty-portal"])
api_router.include_router(communication.router, prefix="/broadcasts", tags=["communication"])
api_router.include_router(exam_cell.router, prefix="/exams", tags=["exam-cell"])
api_router.include_router(alumni.router, prefix="/alumni", tags=["alumni"])
api_router.include_router(learning_analytics.router, prefix="/analytics/strategic", tags=["learning-analytics"])
api_router.include_router(finance_strategic.router, prefix="/finance/strategic", tags=["finance-management"])
api_router.include_router(proctoring.router, prefix="/exams/integrity", tags=["exam-proctoring"])
api_router.include_router(compliance_strategic.router, prefix="/compliance/strategic", tags=["compliance-audit"])
api_router.include_router(rbac.router, prefix="/rbac", tags=["rbac"])
api_router.include_router(knowledge_hub.router, prefix="/knowledge-hub", tags=["knowledge-hub"])
api_router.include_router(ai_automation.router, prefix="/ai-automation", tags=["ai-automation"])
api_router.include_router(extra_features.router, prefix="/extra", tags=["extra-features"])
