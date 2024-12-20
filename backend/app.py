from http.client import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from models import Supplier, Stock, Product, get_db
from schemas import CreateSupplier, CreateProduct, CreateStock

app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins = ['*'], allow_methods = ['*'])

@app.get("/")
def root():
    return {"message": "FastAPI is working!"}

# interaction with the suppliers table

@app.get("/suppliers")
def get_suppliers(session: Session = Depends(get_db)):
    suppliers = session.query(Supplier).all()
    return suppliers

@app.get('/suppliers/{supplier_id}')
def get_supplier(supplier_id: int, session: Session = Depends(get_db)):
    supplier = session.query(Supplier).filter(Supplier.id == supplier_id).one_or_none()
    return supplier

@app.post("/suppliers")
def create_supplier(supplier: CreateSupplier, session: Session = Depends(get_db)):
    try:
        new_supplier = Supplier(**supplier.dict())
        session.add(new_supplier)
        session.commit()
        session.refresh(new_supplier)
        return {"message": "Supplier created successfully", "supplier": new_supplier}
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@app.patch('/suppliers/{supplier_id}')
def update_supplier(supplier_id: int, supplier: CreateSupplier, session: Session = Depends(get_db)):
    existing_supplier = session.query(Supplier).filter(Supplier.id == supplier_id).one_or_none()
    for key, value in supplier.dict(exclude_unset=True).items():
        setattr(existing_supplier, key, value)
    
    session.commit()
    session.refresh(existing_supplier)
    return{"message": f"Supplier {supplier_id} updated successfully", "supplier": existing_supplier}

@app.delete('/suppliers/{supplier_id}')
def delete_supplier(supplier_id: int, session: Session = Depends(get_db)):
    supplier = session.query(Supplier).filter(Supplier.id == supplier_id).one_or_none()
    session.delete(supplier)
    session.commit()
    return {"message": f"Supplier {supplier_id} deleted successfully"}

# interaction with the products table

@app.get("/products")
def get_products(session: Session = Depends(get_db)):
    products = session.query(Product).all()
    return products


@app.get('/products/{product_id}')
def get_product(product_id: int, session: Session = Depends(get_db)):
    product = session.query(Product).filter(Product.id == product_id).one_or_none()
    return product

from sqlalchemy.exc import IntegrityError

@app.post("/products")
def create_product(product: CreateProduct, session: Session = Depends(get_db)):
    try:
        # Validate supplier ID
        supplier = session.query(Supplier).filter(Supplier.id == product.supplier_id).first()
        if not supplier:
            raise HTTPException(status_code=422, detail="Supplier ID does not exist.")

        # Create and save the product
        new_product = Product(**product.dict())
        session.add(new_product)
        session.commit()
        session.refresh(new_product)
        return {"message": "Product created successfully", "product": new_product}

    except IntegrityError as e:
        session.rollback()
        raise HTTPException(status_code=400, detail="Database integrity error: " + str(e.orig))

    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail="An unexpected error occurred.")


@app.patch('/products/{product_id}')
def update_product(product_id: int, product: CreateProduct, session: Session = Depends(get_db)):
    existing_product = session.query(Product).filter(Product.id == product_id).one_or_none()

    for key, value in product.dict(exclude_unset = True).items():
        setattr(existing_product, key, value)

    session.commit()
    session.refresh(existing_product)
    return{"message": f"product {product_id} updated successfully", "product": existing_product}

@app.delete('/products/{product_id}')
def delete_product(product_id: int, session: Session = Depends(get_db)):
    product = session.query(Product).filter(Product.id == product_id).one_or_none()
    session.delete(product)
    session.commit()
    return{"message": f"product {product_id} deleted successfully"}

# interaction with the stocks table

@app.get("/stocks")
def get_stocks(session: Session = Depends(get_db)):
    stocks = session.query(Stock).all()
    return stocks


@app.get('/stocks/{stock_id}')
def get_stock(stock_id: int, session: Session = Depends(get_db)):
    stock = session.query(Stock).filter(Stock.id == stock_id).one_or_none()
    return stock

@app.post("/stocks")
def create_stock(stock: CreateStock, session: Session = Depends(get_db)):
    try:
        new_stock = Stock(**stock.dict())
        session.add(new_stock)
        session.commit()
        session.refresh(new_stock)
        return {"message": "Stock created successfully", "stock": new_stock}
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@app.patch('/stocks/{stock_id}')
def update_stock(stock_id: int, stock: CreateStock, session: Session = Depends(get_db)):
    existing_stock = session.query(Stock).filter(Stock.id == stock_id).one_or_none()
    for key, value in stock.dict(exclude_unset = True).items():
        setattr(existing_stock, key, value)

    session.commit()
    session.refresh(existing_stock)
    return{"message": f"stock {stock_id} updated successfully", "stock": existing_stock}

@app.delete('/stocks/{stock_id}')
def delete_stock(stock_id: int, session: Session = Depends(get_db)):
    stock = session.query(Stock).filter(Stock.id == stock_id).one_or_none()
    session.delete(stock)
    session.commit()
    return{"message": f"stock {stock_id} deleted successfully"}

