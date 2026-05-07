from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import bancodedados

app = FastAPI()

# Criar tabelas se nao existirem
bancodedados.Base.metadata.create_all(bind=bancodedados.engine)

def get_db():
    db = bancodedados.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def home():
    return {"message": "CourseSphere rodando"}

@app.post("/users/")
def create_user(dados: dict, db: Session = Depends(get_db)):
    # Verificacao de email duplicado
    user_exists = db.query(bancodedados.User).filter(bancodedados.User.email == dados.get("email")).first()
    if user_exists:
        raise HTTPException(status_code=400, detail="Esse email já foi cadastrado")

    new_user = bancodedados.User(
        name=dados.get("name"),
        email=dados.get("email"),
        password=dados.get("password")
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"id": new_user.id, "status": "criado"}