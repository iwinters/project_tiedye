from django import forms
from users.models import student

class PointsForm(forms.ModelForm):
    class Meta:
        model = student
        fields = ['points']