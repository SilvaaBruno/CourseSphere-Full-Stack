from fastapi import FastAPI, Depends, HTTPException
from datetime import datetime
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


# Rota para cadastrar um novo usuario no sistema
@app.post("/users/")
def create_user(dados: dict, db: Session = Depends(get_db)):
    # Monta o objeto do usuario com nome, email e senha
    new_user = bancodedados.User(
        name=dados.get("name"),
        email=dados.get("email"),
        password=dados.get("password")
    )

    # Adiciona o novo usuario para ser salvo no banco
    db.add(new_user)
    # Confirma a gravacao dos dados
    db.commit()
    # Atualiza o objeto para retornar o ID gerado
    db.refresh(new_user)

    # Retorna o ID do usuario e mensagem de confirmacao
    return {"id": new_user.id, "status": "criado"}

# Rota para cadastrar um novo curso no sistema


@app.post("/courses/")
def create_course(dados: dict, db: Session = Depends(get_db)):
    # Converte o texto da data recebida em um formato que o banco de dados entende
    try:
        start_dt = datetime.strptime(
            dados.get("start_date"), "%Y-%m-%d").date()
        end_dt = datetime.strptime(dados.get("end_date"), "%Y-%m-%d").date()
    except Exception:
        # Retorna erro se a data nao estiver no formato Ano-Mes-Dia
        raise HTTPException(
            status_code=400, detail="Formato de data inválido. Use AAAA-MM-DD")

    # Monta o objeto do curso com as informacoes recebidas
    new_course = bancodedados.Course(
        name=dados.get("name"),
        description=dados.get("description"),
        start_date=start_dt,
        end_date=end_dt,
        creator_id=dados.get("creator_id")
    )

    # Salva o curso no banco de dados
    db.add(new_course)
    db.commit()
    db.refresh(new_course)

    # Retorna o ID do curso criado e a confirmacao
    return {"id": new_course.id, "status": "curso cadastrado"}

# Rota para adicionar uma nova aula a um curso existente


@app.post("/lessons/")
def create_lesson(dados: dict, db: Session = Depends(get_db)):
    # Monta o objeto da aula com o titulo, link do video e o ID do curso
    new_lesson = bancodedados.Lesson(
        title=dados.get("title"),
        video_url=dados.get("video_url"),
        course_id=dados.get("course_id"),
        status="published"  # Define a aula como publicada por padrao
    )

    # Adiciona a aula na fila do banco de dados
    db.add(new_lesson)
    # Salva as alteracoes de forma definitiva
    db.commit()
    # Atualiza o objeto para pegar o ID gerado automaticamente
    db.refresh(new_lesson)

    # Retorna o ID da nova aula e o status de sucesso
    return {"id": new_lesson.id, "status": "aula adicionada"}
