import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings.production')  # Use production settings by default

application = get_wsgi_application()
