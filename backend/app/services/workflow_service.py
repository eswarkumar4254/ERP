from sqlalchemy.orm import Session
from app.models.workflow import Workflow, WorkflowInstance
from typing import Dict, Any, List

class WorkflowService:
    def create_instance(self, db: Session, workflow_name: str, entity_id: int, tenant_id: int) -> WorkflowInstance:
        workflow = db.query(Workflow).filter(Workflow.name == workflow_name, Workflow.tenant_id == tenant_id).first()
        if not workflow:
            # Create default workflow if not exists
            workflow = Workflow(
                name=workflow_name,
                definition={
                    "steps": ["Draft", "Review", "Approval", "Finalized"],
                    "roles": ["staff", "dean", "institution_admin"]
                },
                tenant_id=tenant_id
            )
            db.add(workflow)
            db.commit()
            db.refresh(workflow)
        
        instance = WorkflowInstance(
            workflow_id=workflow.id,
            entity_type=workflow_name.split("_")[0],
            entity_id=entity_id,
            current_status="Draft",
            history=[{"status": "Draft", "user_id": None, "timestamp": "now"}],
            tenant_id=tenant_id
        )
        db.add(instance)
        db.commit()
        db.refresh(instance)
        return instance

    def advance_status(self, db: Session, instance_id: int, user_id: int, new_status: str):
        instance = db.query(WorkflowInstance).filter(WorkflowInstance.id == instance_id).first()
        if not instance:
            return None
        
        instance.current_status = new_status
        history = list(instance.history)
        history.append({"status": new_status, "user_id": user_id, "timestamp": "now"})
        instance.history = history
        db.commit()
        return instance

workflow_service = WorkflowService()
