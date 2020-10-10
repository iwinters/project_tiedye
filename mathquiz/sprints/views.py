from django.shortcuts import render, get_object_or_404
from .models import category,level
from users.models import student
import django.http.request
from django.shortcuts import redirect
from django.urls import reverse_lazy



def sprint(request, level_id):
    unit = get_object_or_404(level, pk=level_id)
    return render(request,'sprints/sprint.html', {'unit':unit}) 

def tree(request, student_id):
    categories = category.objects.all()
    # GOTTA INCLUDE sTUDENT ID IN THE URL LIKE VIDYARD DOES - THIS NEEDS TO BE DONE FOR TREE & SPRINT
    arithmetic_units = level.objects.filter(category = 1)
    student_object = get_object_or_404(student, pk=student_id)
    student_level = student_object.arithmetic_level
    if student_level < (arithmetic_units.count() - 1):
        arithmetic_next_unit = arithmetic_units[student_level]
    else:
        arithmetic_next_unit = arithmetic_units[1]
    students = student.objects.filter(user = request.user)
    context={'student': student_object, 'categories':categories, 'arithmetic_next_unit': arithmetic_next_unit, 'student_level': student_level, 'students':students}

    if request.user.id == student_object.user.id:
        return render(request,'sprints/tree.html', context)        
    else:
        return redirect('some_tree')

def some_tree(request):
    students = student.objects.filter(user = request.user)
    one_student = students[0]
    response = redirect(reverse_lazy('tree', kwargs={"student_id": one_student.id}))
    return response