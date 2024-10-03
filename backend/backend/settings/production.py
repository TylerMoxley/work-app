import os
from .base import *

DEBUG = False

ALLOWED_HOSTS = ['www.moxxai.com', 'moxxai.com']

CORS_ALLOWED_ORIGINS = [
    "https://www.moxxai.com",
    "https://moxxai.com",
    "http://localhost:4200",  # TEMPORARY: Only if you want to allow local development to interact with the production API
]


CORS_ALLOW_CREDENTIALS = True

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

# LOGGING = {
#     'version': 1,
#     'disable_existing_loggers': False,
#     'handlers': {
#         'file': {
#             'level': 'ERROR',
#             'class': 'logging.FileHandler',
#             'filename': '/opt/work-app/backend/django_errors.log',  # Absolute path
#         },
#     },
#     'loggers': {
#         'django': {
#             'handlers': ['file'],
#             'level': 'ERROR',
#             'propagate': True,
#         },
#     },
# }

# ... rest of your settings ...
