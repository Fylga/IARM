from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from core.database import get_db
from models.users import User
from schemas.users import UserCreate, UserCreated, UserLogin, Token, UserPromoted, UserOut
from core.security import hash_password, verify_password, create_access_token, get_current_user
from typing import List
import re

router = APIRouter()

def validate_password(password: str):
    if len(password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long"
        )
    if not re.search(r"[A-Z]", password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain at least one uppercase letter"
        )
    if not re.search(r"\d", password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain at least one number"
        )
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain at least one special character"
        )
    return True


@router.post("/login/", response_model=Token)
async def login(user: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.email == user.email))
    user_in_db = result.scalar_one_or_none()
    
    if user_in_db is None:
        raise HTTPException(    
            status_code=400,
            detail="Invalid credentials"
        )

    if not verify_password(user.password, user_in_db.password):
        raise HTTPException(
            status_code=400,
            detail="Invalid credentials"
        )

    user_in_db.is_active = True
    db.add(user_in_db)
    await db.commit()
    await db.refresh(user_in_db)
    access_token = create_access_token(data={"sub": user_in_db.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/logout")
async def logout(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    current_user.is_active = False
    await db.commit()
    await db.refresh(current_user)
    return {"message": "Déconnexion réussie"}

@router.post("/users/", status_code=201, response_model=UserCreated)
async def create_user(user: UserCreate, db: AsyncSession = Depends(get_db)):

    result = await db.execute(select(User).filter(User.email == user.email))
    existing_user = result.scalar_one_or_none()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    validate_password(user.password)
    hashed_password = hash_password(user.password)

    new_user = User(
        name=user.name, 
        email=user.email, 
        password=hashed_password
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return {
        "id": new_user.id,
        "name": new_user.name,
        "email": new_user.email,
        "is_active": new_user.is_active,
        "created_at": new_user.created_at,
    }

@router.delete("/users/{user_id}")
async def delete_user(user_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You need to have administrator privileges to perform this action"
        )
    result = await db.execute(select(User).filter(User.id == user_id))
    user_to_delete = result.scalar_one_or_none()

    if user_to_delete is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    await db.delete(user_to_delete)
    await db.commit()
    return {"message": f"User with ID {user_id} has been successfully deleted"}


@router.patch("/users_to_admin/{user_id}", response_model=UserPromoted)
async def promote_admin(user_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
        result = await db.execute(select(User).filter(User.id == user_id))
        user_to_promote = result.scalar_one_or_none()
        if user_to_promote is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        user_to_promote.role = "admin"
        db.add(user_to_promote)
        await db.commit()
        await db.refresh(user_to_promote)
        return {
            "id": user_to_promote.id,
            "name": user_to_promote.name,
            "email": user_to_promote.email,
            "role": user_to_promote.role
}

@router.patch("/admin_to_users/{user_id}", response_model=UserPromoted)
async def promote_admin(user_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
        result = await db.execute(select(User).filter(User.id == user_id))
        user_to_promote = result.scalar_one_or_none()
        if user_to_promote is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        user_to_promote.role = "user"
        db.add(user_to_promote)
        await db.commit()
        await db.refresh(user_to_promote)
        return {
            "id": user_to_promote.id,
            "name": user_to_promote.name,
            "email": user_to_promote.email,
            "role": user_to_promote.role
}

@router.get("/users/active", response_model=List[UserOut])
async def get_active_users(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.is_active == True))
    users = result.scalars().all()
    return users

@router.get("/user/",  response_model=UserOut)
async def read_users(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return current_user

@router.get("/users/", response_model=List[UserOut])
async def read_users(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User))
    users = result.scalars().all()
    return users
