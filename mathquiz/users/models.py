from django.db import models
from django.contrib.auth.models import User


class Student (models.Model):
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    student_name = models.CharField(max_length=25, default = 'Student')
    arithmetic_level = models.IntegerField(default=0)

    def __str__(self):
        return str(self.student_name)

# Create your models here.
