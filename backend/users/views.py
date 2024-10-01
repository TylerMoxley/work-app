from django.shortcuts import render
from django.http import JsonResponse
from django.views import View
from django.contrib.auth import authenticate
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib import admin  # Import admin for the admin site URL
from django.urls import path  # Import path for URL routing
import json

class LoginView(View):
    def post(self, request):
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        print(f"Attempting to authenticate user: {username}")  # Debugging statement
        
        user = authenticate(username=username, password=password)
        
        if user is not None:
            print("Authentication successful")  # Debugging statement
            return JsonResponse({"message": "Login successful", "token": "example_token"}, status=200)
        else:
            print("Authentication failed")  # Debugging statement
            return JsonResponse({"message": "Invalid credentials"}, status=400)

        



urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

