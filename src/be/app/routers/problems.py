from fastapi import APIRouter, HTTPException
import json
import os

router = APIRouter()

@router.get("/problems/{language}")
async def get_problem_sets(language: str):
    problem_sets = []
    path = f"problems/{language}"
    
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Language not found")
    
    for problem_set in os.listdir(path):
        setting_path = f"{path}/{problem_set}/setting.json"
        if os.path.exists(setting_path):
            with open(setting_path, "r") as f:
                setting = json.load(f)
            problem_sets.append({
                "name": problem_set,
                "type": setting["type"],
                "voice": setting["voice"],
                "explain": setting["explain"]
            })
    
    return problem_sets

@router.get("/problems/{language}/{problem_set}")
async def get_problems(language: str, problem_set: str):
    path = f"problems/{language}/{problem_set}/problems.json"
    
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Problem set not found")
    
    with open(path, "r") as f:
        problems = json.load(f)
    
    return problems