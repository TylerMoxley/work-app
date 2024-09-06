from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RepairBillViewSet

# Set up the router for the API endpoints
router = DefaultRouter()
router.register(r'repair-bills', RepairBillViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
