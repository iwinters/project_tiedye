from django import forms
from users.models import student
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

class PointsForm(forms.ModelForm):
    class Meta:
        model = student
        fields = ['points']

class PlacementForm(forms.ModelForm):
    class Meta:
        model = student
        fields = ['arithmetic_level']

class StudentsForm(forms.ModelForm):
    class Meta:
        model = student
        fields = ['student_name']
class RegisterForm(UserCreationForm):
    email = forms.EmailField()
    class Meta:
	    model = User
	    fields = ['username', "email", "password1", "password2"]