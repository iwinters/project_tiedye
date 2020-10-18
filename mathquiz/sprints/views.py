from django.shortcuts import render, get_object_or_404
from .models import category,level
from users.models import student
import django.http.request
from django.shortcuts import redirect
from django.urls import reverse_lazy
from django.contrib.auth.models import User
from users.forms import PointsForm



def sprint(request, student_id, level_id):
    unit = get_object_or_404(level, pk=level_id)
    student_object = get_object_or_404(student, pk=student_id)
    form=PointsForm(request.POST, instance = student_object)

    if request.method == 'POST':
        if form.is_valid():
            form.save()
            return redirect ('tree', student_id = student_object.id)


    return render(request,'sprints/sprint.html', {'unit':unit, 'student':student_object, 'form': form}) 

def tree(request, student_id):
    categories = category.objects.all()
    # GOTTA INCLUDE sTUDENT ID IN THE URL LIKE VIDYARD DOES - THIS NEEDS TO BE DONE FOR TREE & SPRINT
    arithmetic_units = level.objects.filter(category = 1)
    student_object = get_object_or_404(student, pk=student_id)
    student_level = student_object.arithmetic_level
    points = student_object.points
    if student_level < (arithmetic_units.count() - 1):
        arithmetic_next_unit = arithmetic_units[student_level]
    else:
        arithmetic_next_unit = arithmetic_units[1]
    students = student.objects.filter(user = request.user)
    context={'student': student_object, 'categories':categories, 'arithmetic_next_unit': arithmetic_next_unit, 'student_level': student_level, 'students':students, 'points':points}

    if request.user.id == student_object.user.id:
        return render(request,'sprints/tree.html', context)        
    else:
        return redirect('some_tree')

def some_tree(request):
    if request.user.is_authenticated:
        students = student.objects.filter(user = request.user)
        one_student = students[0]
        response = redirect(reverse_lazy('tree', kwargs={"student_id": one_student.id}))
        return response
    else:
        context = {}
        return render(request, 'sprints/index.html', context)