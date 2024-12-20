from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from sqlalchemy import Column, Integer, Text, VARCHAR, DECIMAL, DateTime, ForeignKey, create_engine
from datetime import datetime

engine = create_engine("postgresql://inventory:t08rJ8v5pmVgsNykmt8SQ9XxLAvi7TQM@dpg-ctig4udds78s73eevu3g-a.oregon-postgres.render.com/inventory_kgcd", echo = True)

Session = sessionmaker(bind=engine)
def get_db():
    db = Session()
    try:
        yield db
    finally:
        db.close()

Base = declarative_base()

class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key = True, autoincrement = True)
    name = Column(Text, nullable = False, unique = True)
    email = Column(VARCHAR, nullable = False, unique = True)
    contact = Column(VARCHAR, nullable = False, unique = True)

    products = relationship("Product", back_populates="suppliers")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key = True, autoincrement = True)
    name = Column(Text, nullable = False, unique = True)
    description = Column(Text, nullable = False, unique = True)
    price = Column(DECIMAL, nullable = False, unique = True)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"))

    suppliers = relationship("Supplier", back_populates="products")
    stocks = relationship("Stocks", back_populates="products")

class Stock(Base):
    __tablename__ = "stocks"

    id = Column(Integer, primary_key = True, autoincrement = True)
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer, nullable = False)
    last_updated = Column(DateTime, default = datetime.now(), onupdate = datetime.now())
    date_supplied = Column(DateTime, default = datetime.now())

    products = relationship("Product", back_populates="stocks")
    

