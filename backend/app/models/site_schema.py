from pydantic import BaseModel
from typing import Optional

class Site(BaseModel):
    id: str
    name: str
    location: Optional[str] = None
    organization: Optional[str] = None
    contact_email: Optional[str] = None
    notes: Optional[str] = None
