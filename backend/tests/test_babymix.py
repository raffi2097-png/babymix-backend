"""Backend tests for BabyMix API - /api/ and /api/generate-baby"""
import base64
import os
import pytest
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

BASE_URL = os.environ["EXPO_PUBLIC_BACKEND_URL"].rstrip("/") if os.environ.get("EXPO_PUBLIC_BACKEND_URL") else None
if not BASE_URL:
    # fallback: read frontend .env
    fe_env = Path("/app/frontend/.env").read_text()
    for line in fe_env.splitlines():
        if line.startswith("EXPO_PUBLIC_BACKEND_URL="):
            BASE_URL = line.split("=", 1)[1].strip().strip('"').rstrip("/")


@pytest.fixture(scope="module")
def sample_images():
    """Load two real portrait images as base64."""
    urls = [
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    ]
    imgs = []
    for u in urls:
        r = requests.get(u, timeout=30)
        r.raise_for_status()
        imgs.append(base64.b64encode(r.content).decode())
    return imgs


class TestHealth:
    def test_root(self):
        r = requests.get(f"{BASE_URL}/api/", timeout=15)
        assert r.status_code == 200
        assert "message" in r.json()


class TestValidation:
    def test_missing_father(self):
        r = requests.post(
            f"{BASE_URL}/api/generate-baby",
            json={"father_image_base64": "", "mother_image_base64": "abc", "gender": "random"},
            timeout=30,
        )
        assert r.status_code == 400

    def test_missing_mother(self):
        r = requests.post(
            f"{BASE_URL}/api/generate-baby",
            json={"father_image_base64": "abc", "mother_image_base64": "", "gender": "random"},
            timeout=30,
        )
        assert r.status_code == 400

    def test_invalid_base64(self):
        r = requests.post(
            f"{BASE_URL}/api/generate-baby",
            json={
                "father_image_base64": "!!!not-base64!!!",
                "mother_image_base64": "!!!not-base64!!!",
                "gender": "random",
            },
            timeout=30,
        )
        assert r.status_code == 400


class TestGenerate:
    def test_random(self, sample_images):
        r = requests.post(
            f"{BASE_URL}/api/generate-baby",
            json={
                "father_image_base64": sample_images[0],
                "mother_image_base64": sample_images[1],
                "gender": "random",
            },
            timeout=180,
        )
        assert r.status_code == 200, r.text
        data = r.json()
        assert "image_base64" in data and len(data["image_base64"]) > 100
        assert "mime_type" in data and data["mime_type"].startswith("image/")

    def test_male(self, sample_images):
        r = requests.post(
            f"{BASE_URL}/api/generate-baby",
            json={
                "father_image_base64": sample_images[0],
                "mother_image_base64": sample_images[1],
                "gender": "male",
            },
            timeout=180,
        )
        assert r.status_code == 200, r.text
        assert "image_base64" in r.json()

    def test_female(self, sample_images):
        r = requests.post(
            f"{BASE_URL}/api/generate-baby",
            json={
                "father_image_base64": sample_images[0],
                "mother_image_base64": sample_images[1],
                "gender": "female",
            },
            timeout=180,
        )
        assert r.status_code == 200, r.text
        assert "image_base64" in r.json()
