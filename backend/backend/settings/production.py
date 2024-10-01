from .base import *
import os

DEBUG = False

ALLOWED_HOSTS = ['www.moxxai.com', 'moxxai.com']

CORS_ALLOWED_ORIGINS = [
    "https://www.moxxai.com",
    "https://moxxai.com",
]

# PostgreSQL Database Example
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'yourdb',
        'USER': 'youruser',
        'PASSWORD': 'Donger10!',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': os.path.join(BASE_DIR, 'django_errors.log'),
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'ERROR',
            'propagate': True,
        },
    },
}
