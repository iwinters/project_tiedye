from django.db import models

class category (models.Model):
    category_name = models.CharField(max_length=50)
    cover_image = models.ImageField(null=True, blank=True, upload_to="images/")
    
    def __str__(self):                           
        return self.category_name

class level (models.Model):
    category = models.ForeignKey(category, default=1, on_delete=models.SET_DEFAULT, null=True)
    question_framework = models.CharField(max_length=500)
    equation = models.CharField(max_length=500)
    rules = models.CharField(max_length=500, null=True, blank=True)
    sprint_type = models.CharField(max_length=500, null=True, blank=True)

    def __str__(self):                           
        return self.question_framework


# Create your models here.
