from fastapi import FastAPI
from auth.routes import router as auth_router
from fastapi.middleware.cors import CORSMiddleware
from product_analysis.router import router as product_router

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router) 
app.include_router(product_router, prefix="/api/v1") 