from django.urls import path, include
from .views import SignUp


urlpatterns = [
    path('register/', SignUp, name='register')
    

]