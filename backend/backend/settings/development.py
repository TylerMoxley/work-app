from .base import *

DEBUG = True

ALLOWED_HOSTS = ['127.0.0.1', 'localhost', '.ngrok-free.app',]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:4200",  # Allow the local Angular frontend to access the API
]

CORS_ALLOW_CREDENTIALS = True  # If you are using cookies or session-based authentication

# Local SQLite Database Example
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
