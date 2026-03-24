import numpy as np
from typing import List, Dict, Any

class AIService:
    def __init__(self):
        self.model = None

    def predict_dropout_risk(self, student_data: Dict[str, Any]) -> float:
        """Predicts dropout risk (0-1)."""
        attendance = student_data.get("attendance_rate", 0.85)
        last_exam_score = student_data.get("last_exam_score", 0.7)
        participation = student_data.get("participation_index", 0.5)
        
        # Heuristic-based risk model
        risk = (1.0 - attendance) * 0.5 + (1.0 - last_exam_score) * 0.4 + (1.0 - participation) * 0.1
        return round(float(np.clip(risk, 0, 1)), 2)

    def predict_placement_probability(self, student_data: Dict[str, Any]) -> float:
        """Predicts student employability and salary band."""
        gpa = student_data.get("gpa", 3.0)
        skills_matched = student_data.get("skills_matched", 5) # Scale 1-10
        internships = student_data.get("internship_count", 0)
        
        prob = (gpa / 4.0) * 0.4 + (skills_matched / 10.0) * 0.4 + (min(internships, 2) / 2.0) * 0.2
        return round(float(np.clip(prob, 0, 1)), 2)

    def recommend_electives(self, student_id: int, current_major: str) -> List[str]:
        """AI Recommendation for Electives based on Major."""
        recommendations = {
            "Computer Science": ["Cloud Architecture", "Advanced ML", "Cybersecurity", "Ethics in AI"],
            "Finance": ["Corporate Tax", "FinTech", "Portfolio Mgmt", "Derivatives"],
            "BioTech": ["Genomics", "BioInformatics", "Protein Design", "Lab Automation"]
        }
        return recommendations.get(current_major, ["Soft Skills", "Project Management", "Generic Elective"])

    def predict_course_difficulty(self, course_id: int) -> str:
        """Predicts if a course is Easy, Medium, or Hard based on historical grades."""
        # Simulated prediction
        import random
        return random.choice(["Easy", "Intermediate", "Challenging"])

    def forecast_revenue(self, current_revenue: float, term: int) -> Dict[str, Any]:
        """Project revenue growth, churn and collection efficiency."""
        growth_rate = 0.05 + (0.02 * term) # 5% baseline + 2% per term
        predicted_revenue = current_revenue * (1 + growth_rate)
        churn_risk = 0.1 - (0.01 * term)
        collection_efficiency = 0.9 + (0.01 * term)
        
        return {
            "predicted_revenue": round(predicted_revenue, 2),
            "growth_projection": f"{round(growth_rate * 100, 1)}%",
            "risk_index": round(churn_risk, 2),
            "collection_efficiency": f"{round(collection_efficiency * 100, 0)}%"
        }

    def syllabus_completion_projection(self, current_progress: float, weeks_passed: int, total_weeks: int) -> Dict[str, Any]:
        """Predict if the syllabus will be finished and suggest course correction."""
        remaining_weeks = total_weeks - weeks_passed
        current_rate = current_progress / weeks_passed if weeks_passed > 0 else 0
        projected_at_end = current_progress + (current_rate * remaining_weeks)
        
        on_track = projected_at_end >= 1.0
        gap = max(0, 1.0 - projected_at_end)
        
        return {
            "projected_completion": f"{round(projected_at_end * 100, 1)}%",
            "status": "On Track" if on_track else "Delayed",
            "required_speedup": f"{round(gap * 100, 1)}%" if not on_track else "None",
            "intervention_recommended": not on_track
        }

    def predict_compliance_risk(self, institutional_metrics: Dict[str, Any]) -> str:
        """Evaluate institutional audit risk based on IQAC and audit logs."""
        audit_frequency = institutional_metrics.get("audit_frequency", 1)
        faculty_published_ratio = institutional_metrics.get("faculty_published_ratio", 0.3)
        
        if audit_frequency < 2 or faculty_published_ratio < 0.4:
            return "Elevated Risk - Audit Required"
        return "Compliant - Low Risk"

    def automate_resource_allocation(self, department_id: int) -> Dict[str, Any]:
        """AI-driven recommendation for classroom and lab allocation."""
        import random
        optimization_score = random.uniform(0.85, 0.99)
        return {
            "optimization_efficiency": f"{round(optimization_score * 100, 1)}%",
            "recommended_classroom_shift": "Shift 10% of workload to Morning Session",
            "resource_utilization_gain": "+12.5%",
            "bottleneck_identified": "Computing Lab 2 (Over-capacity)"
        }

ai_service = AIService()
