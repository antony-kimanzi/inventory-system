from pydantic import BaseModel

class CreateSupplier(BaseModel):
    name: str
    email: str
    contact: str
    
class CreateStock(BaseModel):
    product_id: int
    quantity: int

class CreateProduct(BaseModel):
    name: str
    description: str
    price: int
    supplier_id: int